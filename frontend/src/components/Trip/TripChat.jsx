import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import Picker from "emoji-picker-react"; // ✅ unchanged

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

  /* ───────── AUTO SCROLL ───────── */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ───────── LOAD CHAT HISTORY ───────── */
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

  /* ───────── SOCKET SETUP ───────── */
  useEffect(() => {
    if (!tripId) return;

    loadHistory();

    const s = io(apiBase, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = s;

    s.on("connect", () => {
      s.emit("join-trip", tripId);
      setConnecting(false);
    });

    s.on("trip-message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => s.disconnect();
  }, [tripId, apiBase, token]);

  /* ───────── SEND MESSAGE (FIXED, NO UI CHANGE) ───────── */
  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socketRef.current) return;

    const tempId = `temp-${Date.now()}`;

    // Optimistic message (UI unchanged)
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

    socketRef.current.emit(
      "trip-message",
      { tripId, message: text },
      (ack) => {
        if (!ack?.delivered) return;

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

  /* ───────── DATE HELPERS (UNCHANGED) ───────── */
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

  /* ───────── CLOSE EMOJI PICKER (UNCHANGED) ───────── */
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

  /* ───────── UI (100% UNCHANGED) ───────── */
  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl relative">
      {connecting && (
        <span className="text-xs text-gray-400 px-3 py-1">Connecting…</span>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet.</p>
        ) : (
          sortedDates.map((dateKey) => {
            const msgs = groupedMessages[dateKey];
            return (
              <div key={dateKey}>
                <div className="sticky top-0 z-0 flex justify-center">
                  <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm my-2">
                    {formatDateHeader(dateKey)}
                  </span>
                </div>

                {msgs.map((m) => {
                  const isMine =
                    m.user?._id === currentUserId ||
                    m.user === currentUserId;

                  const authorName = m.user?.fullName || "Unknown";

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
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {!isMine && (
                          <div className="text-xs font-semibold text-gray-700 mb-0.5">
                            {authorName}
                          </div>
                        )}
                        <div>{m.message}</div>
                        <div className="text-[10px] text-gray-400 mt-1 text-right">
                          {time} {m.pending && "⏳"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-2 flex items-center gap-2 border-t border-gray-200 bg-white sticky bottom-0 z-20">
        <button
          className="text-gray-500 hover:text-gray-700 relative"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          😊
        </button>

        {showEmojiPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-[80vw] max-w-md"
          >
            <Picker
              onEmojiClick={(emoji) =>
                setInput((prev) => prev + emoji.emoji)
              }
            />
          </div>
        )}

        <textarea
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm resize-none focus:outline-none"
          placeholder="Type a message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <button
          className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
