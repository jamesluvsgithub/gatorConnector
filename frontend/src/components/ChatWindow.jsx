import { useEffect, useRef, useState } from "react";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef(null);

  const scrollDown = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTimestamp = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch(process.env.API_URL);

      if (!response.ok) {
        throw new Error("Could not load messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setLoadError("Could not load chat history.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollDown();
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();

    if (messageInput.trim() === "") {
      setSendError("Message cannot be empty.");
      return;
    }

    setIsSending(true);
    setSendError("");

    const newMessage = {
      text: messageInput,
      sender: "me",
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();

      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setMessageInput("");
    } catch (error) {
      setSendError("Message failed to send.");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatBox}>
        <div style={styles.topBar}>
          <h2 style={styles.title}>Messages</h2>
          <p style={styles.subtext}>Chat with mentors and mentees</p>
        </div>

        <div style={styles.messagesArea}>
          {isLoading && <p style={styles.infoText}>Loading messages...</p>}
          {loadError && <p style={styles.errorText}>{loadError}</p>}

          {!isLoading && !loadError && messages.length === 0 && (
            <p style={styles.infoText}>No messages yet.</p>
          )}

          {!isLoading &&
            !loadError &&
            messages.map((msg, index) => {
              const mine = msg.sender === "me";

              return (
                <div
                  key={msg.id || index}
                  style={{
                    ...styles.messageRow,
                    justifyContent: mine ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...styles.bubble,
                      ...(mine ? styles.myBubble : styles.otherBubble),
                    }}
                  >
                    <p style={styles.messageText}>{msg.text}</p>
                    <span style={styles.timeText}>
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}

          <div ref={bottomRef}></div>
        </div>

        <form onSubmit={handleSend} style={styles.inputSection}>
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              setSendError("");
            }}
            style={styles.input}
          />

          <button type="submit" style={styles.sendButton} disabled={isSending}>
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>

        {sendError && <p style={styles.errorText}>{sendError}</p>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#edf1f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  chatBox: {
    width: "100%",
    maxWidth: "700px",
    height: "80vh",
    backgroundColor: "white",
    borderRadius: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topBar: {
    padding: "18px 22px",
    borderBottom: "1px solid #e5e7eb",
  },
  title: {
    margin: 0,
    fontSize: "26px",
  },
  subtext: {
    margin: "4px 0 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "18px",
    backgroundColor: "#f8fafc",
  },
  messageRow: {
    display: "flex",
    marginBottom: "12px",
  },
  bubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
  },
  myBubble: {
    backgroundColor: "#3b82f6",
    color: "white",
    borderBottomRightRadius: "6px",
  },
  otherBubble: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    borderBottomLeftRadius: "6px",
  },
  messageText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },
  timeText: {
    marginTop: "6px",
    fontSize: "11px",
    opacity: 0.75,
    alignSelf: "flex-end",
  },
  inputSection: {
    display: "flex",
    gap: "10px",
    padding: "16px 18px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  sendButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "14px",
    margin: "8px 18px 12px 18px",
  },
  infoText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: "20px",
    fontSize: "14px",
  },
};

export default ChatWindow;
