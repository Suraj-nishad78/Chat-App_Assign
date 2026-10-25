
import { useState, useRef, useEffect } from "react";
import "./App.css";

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const colors = [
  "#e87979",
  "#6599ed",
  "#9b87e8",
  "#55b89a",
  "#e6ad54",
];

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const getRandomUser = () =>
    user_list[Math.floor(Math.random() * user_list.length)];

  const sendMessage = (e) => {
    e.preventDefault();

    const text = message.trim();
    if (!text) return;

    const username = getRandomUser();

    const newMessage = {
      id: crypto.randomUUID(),
      username,
      text,
      likes: 0,
      liked: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    inputRef.current?.focus();
  };

  const toggleLike = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              likes: msg.liked ? msg.likes - 1 : msg.likes + 1,
              liked: !msg.liked,
            }
          : msg
      )
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="chat-app">
      <header className="chat-header">
        <div>
          <h1>Team Chat</h1>
          <p>Connect and share with your team</p>
        </div>

        <div className="online-status">
          <span className="status-dot"></span>
          Online
        </div>
      </header>

      <section
        className="message-thread"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a conversation</h2>
            <p>Write a message below to get the conversation going.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const userIndex = user_list.indexOf(msg.username);
            const color = colors[userIndex];

            return (
              <article className="message-row" key={msg.id}>
                <div
                  className="avatar"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                >
                  {msg.username.charAt(0)}
                </div>

                <div className="message-content">
                  <div className="message-meta">
                    <span className="username">{msg.username}</span>
                    <time className="message-time">{msg.time}</time>
                  </div>

                  <div className="message-line">
                    <div className="message-bubble">{msg.text}</div>

                    <button
                      type="button"
                      className={`like-button ${msg.liked ? "liked" : ""}`}
                      onClick={() => toggleLike(msg.id)}
                      aria-label={`${msg.liked ? "Unlike" : "Like"} message by ${msg.username}. ${msg.likes} likes`}
                      aria-pressed={msg.liked}
                      title="Like message"
                    >
                      <span className="heart">
                        {msg.liked ? "♥" : "♡"}
                      </span>
                      <span className="like-count">{msg.likes}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}

        <div ref={bottomRef} />
      </section>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            aria-label="Type your message"
            maxLength={2000}
          />

          {message.length > 0 && (
            <button
              type="button"
              className="clear-button"
              onClick={() => setMessage("")}
              aria-label="Clear message"
            >
              ×
            </button>
          )}
        </div>

        <button
          className="send-button"
          type="submit"
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <span>Send</span>
          <span className="send-icon">➤</span>
        </button>
      </form>

      <footer className="chat-footer">
        Press <kbd>Enter</kbd> to send your message
      </footer>
    </main>
  );
}

export default App;
