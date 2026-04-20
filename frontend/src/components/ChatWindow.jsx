import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const API = "http://localhost:4000";

function ChatWindow() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const otherUserId = params.get("userId");
  const otherUsername = params.get("username");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatUsername, setActiveChatUsername] = useState(otherUsername || "");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [unreadChats, setUnreadChats] = useState(new Set());
  const bottomRef = useRef(null);
  const knownMsgIds = useRef(new Set());
  const activeChatIdRef = useRef(null);

  const authHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
  };

  const loadChats = async () => {
    try {
      const res = await fetch(API + "/api/chat", { headers: authHeaders });
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;
      // deduplicate by _id in case of any stale DB duplicates
      const seen = new Set();
      const unique = data.filter(c => { if (seen.has(c._id)) return false; seen.add(c._id); return true; });
      setChats(unique);
    } catch (e) {}
  };

  const loadMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await fetch(API + "/api/messages/" + chatId, { headers: authHeaders });
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      // Track new messages from the other person for the unread dot
      const myId = storedUser ? (storedUser.id || storedUser._id || "").toString() : "";
      const isInitialLoad = knownMsgIds.current.size === 0;
      let hasNewFromOther = false;
      data.forEach(msg => {
        const msgId = msg._id || "";
        if (!knownMsgIds.current.has(msgId)) {
          knownMsgIds.current.add(msgId);
          if (!isInitialLoad) {
            const senderId = msg.sender && typeof msg.sender === "object"
              ? (msg.sender._id || msg.sender.id || "").toString()
              : (msg.sender || "").toString();
            if (senderId && senderId !== myId) hasNewFromOther = true;
          }
        }
      });
      if (hasNewFromOther && chatId !== activeChatIdRef.current) {
        setUnreadChats(prev => new Set([...prev, chatId]));
      }

      setMessages(data);
      setTimeout(() => bottomRef.current && bottomRef.current.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {}
  };

  const openChat = (chatId, username) => {
    setActiveChatId(chatId);
    activeChatIdRef.current = chatId;
    setActiveChatUsername(username || "User");
    setUnreadChats(prev => { const next = new Set(prev); next.delete(chatId); return next; });
    knownMsgIds.current = new Set();
    loadMessages(chatId);
  };

  useEffect(() => {
    if (!storedUser) { setStatus("Not logged in."); return; }
    const init = async () => {
      if (otherUserId) {
        // Create or find the chat first, then load all chats once
        try {
          const r = await fetch(API + "/api/chat", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ userId: otherUserId }),
          });
          const data = await r.json();
          if (data && data._id) {
            await loadChats(); // fetch fresh list — no duplicates
            openChat(data._id, otherUsername);
          } else {
            setStatus("Could not open chat: " + (data.error || "unknown"));
          }
        } catch {
          setStatus("Error opening chat.");
        }
      } else {
        await loadChats();
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    const timer = setInterval(() => loadMessages(activeChatId), 4000);
    return () => clearInterval(timer);
  }, [activeChatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChatId) return;
    try {
      const res = await fetch(API + "/api/messages", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ chatId: activeChatId, text: input.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus("Send failed: " + (err.error || res.status));
        return;
      }
      setInput("");
      setStatus("");
      await loadMessages(activeChatId);
    } catch (e) {
      setStatus("Send error: " + e.message);
    }
  };

  const isMyMessage = (msg) => {
    if (!storedUser || !msg.sender) return false;
    const myId = (storedUser.id || storedUser._id || "").toString();
    const senderId =
      typeof msg.sender === "object"
        ? (msg.sender._id || msg.sender.id || "").toString()
        : msg.sender.toString();
    return myId !== "" && myId === senderId;
  };

  const getOtherName = (chat) => {
    if (!storedUser || !Array.isArray(chat.people)) return null;
    const myId = (storedUser.id || storedUser._id || "").toString();
    const other = chat.people.find((p) => (p._id || p.id || "").toString() !== myId);
    return other && other.username ? other.username : null;
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#edf1f7" }}>
      <div style={{ width: 240, background: "#f1f5f9", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 18px", fontWeight: 700, fontSize: 18, borderBottom: "1px solid #e5e7eb", color: "#1e293b" }}>My Chats</div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {chats.length === 0 && <div style={{ padding: 18, color: "#64748b", fontSize: 14 }}>No chats yet.</div>}
          {chats.map((chat) => {
            const name = getOtherName(chat);
            if (!name) return null;
            return (
              <div key={chat._id} onClick={() => openChat(chat._id, name)} style={{ padding: "14px 18px", cursor: "pointer", borderBottom: "1px solid #e5e7eb", background: activeChatId === chat._id ? "#e0e7ff" : "transparent", fontWeight: activeChatId === chat._id ? 700 : 500, color: "#3730a3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{name}</span>
                {unreadChats.has(chat._id) && (
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2563eb", display: "inline-block", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 700, margin: "0 auto", width: "100%" }}>
        <div style={{ padding: "18px 22px", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>{activeChatUsername ? "Chatting with " + activeChatUsername : "Select a chat"}</h2>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 18, background: "#f8fafc" }}>
          {status && <p style={{ color: "#dc2626", textAlign: "center" }}>{status}</p>}
          {!activeChatId && !status && <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>Open a chat from the Students page or select one from the sidebar.</p>}
          {messages.length === 0 && activeChatId && <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>No messages yet. Say hello!</p>}
          {messages.map((msg, i) => {
            const mine = isMyMessage(msg);
            const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
            return (
              <div key={msg._id || i} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: 16, background: mine ? "#2563eb" : "#e5e7eb", color: mine ? "#fff" : "#111827", borderBottomRightRadius: mine ? 4 : 16, borderBottomLeftRadius: mine ? 16 : 4 }}>
                  <p style={{ margin: 0, fontSize: 14, wordBreak: "break-word" }}>{msg.text}</p>
                  {time && <span style={{ fontSize: 11, opacity: 0.7, display: "block", textAlign: "right", marginTop: 4 }}>{time}</span>}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: 10, padding: "14px 18px", background: "#fff", borderTop: "1px solid #e5e7eb" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={activeChatId ? "Type a message..." : "Select a chat first"} disabled={!activeChatId} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }} />
          <button type="submit" disabled={!activeChatId || !input.trim()} style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
