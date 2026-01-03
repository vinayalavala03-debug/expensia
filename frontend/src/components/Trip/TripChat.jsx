import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import Picker from "emoji-picker-react";

export default function TripChat({ tripId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connecting, setConnecting] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const pickerRef = useRef(null);
  const socketRef = useRef(null);
  const endRef = useRef(null);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const apiBase = useMemo(
    () => BASE_URL || "https://expensia-pi.vercel.app",
    []
  );

  const currentUserId = useMemo(() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload._id;
    } catch {
      return null;
    }
  }, [token]);

  /* ─────────── AUTO SCROLL ─────────── */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ─────────── LOAD CHAT HISTORY ─────────── */
  const loadHistory = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.TRIP.GET_CHAT(tripId)
      );
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load chat:", e);
    }
  };

  /* ─────────── SOCKET SETUP ─────────── */
  useEffect(() => {
    if (!tripId) return;

    loadHistory();

    const socket = io(apiBase, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-trip", tripId);
      setConnecting(false);
    });

    socket.on("trip-message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [tripId, apiBase, token]);

  /* ─────────── SEND MESSAGE (SOCKET) ─────────── */
  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socketRef.current) return;

    const tempId = `temp-${Date.now()}`;

    // 1️⃣ Optimistic UI
    const optimisticMsg = {
      _id: tempId,
      trip: tripId,
      message: text,
      user: { _id: currentUserId },
      createdAt: new Date(),
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    // 2️⃣ Emit via socket
    socketRef.current.emit(
      "trip-message",
      { tripId, message: text },
      (ack) => {
        if (!ack?.delivered) return;

        // Optional: mark message as delivered
        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempId ? { ...m, pending: false } : m
          )
        );
      }
    );
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ─────────── DATE FORMATTING ─────────── */
  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString())
      return "Yesterday";

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* ─────────── GROUP BY DATE ─────────── */
  const groupedMessages = messages.reduce((groups, msg) => {
    const d = msg.createdAt
      ? new Date(msg.createdAt).toDateString()
      : "unknown";
    if (!groups[d]) groups[d] = [];
    groups[d].push(msg);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  /* ─────────── CLOSE EMOJI PICKER ─────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showEmojiPicker]);

  /* ─────────── UI ─────────── */
  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl relative">
      {connecting && (
        <span className="text-xs text-gray-400 px-3 py-1">
          Connecting…
        </span>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-3 bg-gray-50">
        {sortedDates.map((dateKey) => (
          <div key={dateKey}>
            <div className="flex justify-center my-2">
              <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                {formatDateHeader(dateKey)}
              </span>
            </div>

            {groupedMessages[dateKey].map((m) => {
              const isMine =
                m.user?._id === currentUserId ||
                m.user === currentUserId;

              const time = m.createdAt
                ? new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={m._id}
                  className={`flex mb-2 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-lg text-sm shadow ${
                      isMine
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div>{m.message}</div>
                    <div className="text-[10px] text-gray-400 mt-1 text-right">
                      {time} {m.pending && "⏳"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-2 flex items-center gap-2 border-t bg-white sticky bottom-0">
        <button
          onClick={() => setShowEmojiPicker((p) => !p)}
          className="text-gray-500"
        >
          😊
        </button>

        {showEmojiPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30"
          >
            <Picker
              onEmojiClick={(emoji) =>
                setInput((prev) => prev + emoji.emoji)
              }
            />
          </div>
        )}

        <textarea
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm resize-none"
          placeholder="Type a message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <button
          onClick={sendMessage}
          className="bg-purple-500 text-white p-2 rounded-full"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
