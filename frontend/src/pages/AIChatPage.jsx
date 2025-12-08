import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";

const AIChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("aiChatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Welcome message
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm here to support you with any mental health or emotional wellbeing concerns. Whether you're feeling stressed, anxious, overwhelmed, or just need someone to talk to, I'm here to listen and help. How are you feeling today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("aiChatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      // Send message to backend with conversation history
      const response = await axios.post("/ai-chat", {
        message: userMessage.content,
        conversationHistory: messages,
      });

      // Add AI response to chat
      const aiMessage = {
        role: "assistant",
        content: response.data.reply,
        timestamp: response.data.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Failed to get AI response:", err);
      setError(
        err.response?.data?.message ||
          "Failed to get response. Please try again."
      );

      // Remove user message if request failed
      setMessages((prev) => prev.slice(0, -1));
      setInputMessage(userMessage.content); // Restore the message
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      localStorage.removeItem("aiChatMessages");
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm here to support you with any mental health or emotional wellbeing concerns. Whether you're feeling stressed, anxious, overwhelmed, or just need someone to talk to, I'm here to listen and help. How are you feeling today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  if (!user) {
    return (
      <div className="page-container-full">
        <div className="ai-chat-page">
          <div className="ai-chat-background"></div>
           <div className="ai-chat-wrapper" style={{justifyContent: 'center', alignItems: 'center'}}>
            <div className="card" style={{zIndex: 2, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)'}}>
              <h2>Please Log In</h2>
              <p>You need to be logged in to access AI Chat Support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-full">
      <div className="ai-chat-page">
        <div className="ai-chat-background"></div>
        <div className="ai-chat-wrapper">
          <div className="ai-chat-header">
            <div className="header-content">
              <h1>🤖 AI Mental Health Support</h1>
              <p className="subtitle">
                Chat with our AI assistant about mental health, stress, anxiety, and
                emotional wellbeing
              </p>
            </div>
            <button
              onClick={handleClearChat}
              className="btn btn-secondary btn-small"
            >
              Clear Chat
            </button>
          </div>

          <div className="ai-chat-container">
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.role === "user" ? "user-message" : "ai-message"
                  }`}
                >
                  <div className="message-avatar">
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{msg.content}</div>
                    <div className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message ai-message">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="chat-error" style={{padding: '0 20px', color: 'var(--danger)'}}>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="message-input-form">
              <div className="input-wrapper">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  rows="1"
                  disabled={isLoading}
                  className="message-input"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="send-button"
                >
                  {isLoading ? "⏳" : "📤"}
                </button>
              </div>
              <div className="input-hint">
                💡 Ask me about stress management, coping strategies, anxiety,
                study-life balance, or any mental health concerns
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
