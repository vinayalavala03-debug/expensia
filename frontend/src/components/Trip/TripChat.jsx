import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { postMessage } from "../../services/tripService";
import Picker from "emoji-picker-react"; // ✅ Added

export default function TripChat({ tripId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connecting, setConnecting] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const socketRef = useRef(null);
  const endRef = useRef(null);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const apiBase = useMemo(() => BASE_URL || "http://localhost:4000", []);

  const currentUserId = useMemo(() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload._id;
    } catch {
      return null;
    }
  }, [token]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history
  const loadHistory = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.TRIP.GET_CHAT(tripId));
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load chat:", e);
    }
  };

  // Setup socket
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

    return () => {
      s.disconnect();
    };
  }, [tripId, apiBase, token]);

  // Send message
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    try {
      await postMessage(tripId, text);
      setInput("");
    } catch (e) {
      console.error("Failed to send message:", e.response?.data || e.message);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format date headers
  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const d = msg.createdAt ? new Date(msg.createdAt).toDateString() : "unknown";
    if (!groups[d]) groups[d] = [];
    groups[d].push(msg);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // ✅ Close picker when clicking outside
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
                {/* Date header */}
                <div className="sticky top-0 z-0 flex justify-center">
                  <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm my-2">
                    {formatDateHeader(dateKey)}
                  </span>
                </div>

                {/* Messages for that date */}
                {msgs.map((m) => {
                  const isMine =
                    m.user?._id === currentUserId || m.user === currentUserId;
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
                          {time}
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
        {/* Emoji Button */}
        <button
          className="text-gray-500 hover:text-gray-700 relative"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10Zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8Zm-4 7h1.5a1.5 1.5 0 0 0 0-3H8a1.5 1.5 0 0 0 0 3Zm6.5 0H16a1.5 1.5 0 0 0 0-3h-1.5a1.5 1.5 0 0 0 0 3ZM12 17.5c-2.019 0-3.827-1.153-4.707-2.928a1 1 0 1 1 1.788-.894C9.57 15.254 10.708 16 12 16s2.43-.746 2.919-2.322a1 1 0 0 1 1.788.894C15.827 16.347 14.019 17.5 12 17.5Z" />
          </svg>
        </button>

        {/* ✅ Emoji Picker (Centered) */}
        {showEmojiPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-[80vw] h-90 max-w-xs sm:max-w-sm md:max-w-md"
          >
            <Picker
              onEmojiClick={(emoji) => {
                setInput((prev) => prev + emoji.emoji);
              }}
              width="100%"
              height="110%"
            />
          </div>
        )}

        {/* Text Area */}
        <textarea
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-400"
          placeholder="Type a message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />

        {/* ✅ Permanent Send Button */}
        <button
          className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 flex items-center justify-center"
          onClick={sendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path d="M3.4 20.4 20.7 13c1.3-.5 1.3-2.3 0-2.8L3.4 2.6c-1.2-.5-2.4.7-1.9 1.9l2.5 6.4c.2.5.6.9 1.2 1l7.4.6-7.4.6c-.6.1-1 .5-1.2 1l-2.5 6.4c-.5 1.2.7 2.4 1.9 1.9Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
