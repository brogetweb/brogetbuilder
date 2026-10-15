
import { useState } from "react";
import "./WhatsAppChatbot.css";

const WHATSAPP_NUMBER = "919503303333";
// Replace with your WhatsApp number:
// India country code + 10-digit mobile number.
// Do not include +, spaces, or dashes.

const quickQuestions = [
  {
    icon: "🏠",
    title: "Buy a Property",
    message:
      "Hello BuilderBroget! I'm interested in buying a property. Can you help me find suitable options?"
  },
  {
    icon: "🔑",
    title: "Rent a Property",
    message:
      "Hello BuilderBroget! I'm looking for a property to rent. Please share available options."
  },
  {
    icon: "📅",
    title: "Schedule a Visit",
    message:
      "Hello BuilderBroget! I'd like to schedule a property visit. Please let me know the available options."
  },
  {
    icon: "💬",
    title: "Talk to an Agent",
    message:
      "Hello BuilderBroget! I'd like to speak with a property consultant."
  }
];

function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openWhatsApp = (text) => {
    const cleanMessage = text.trim();

    if (!cleanMessage) return;

    if (
      WHATSAPP_NUMBER === "919876543210" ||
      !/^\d{10,15}$/.test(WHATSAPP_NUMBER)
    ) {
      alert(
        "Please add your real WhatsApp number in WhatsAppChatbot.jsx first."
      );
      return;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      cleanMessage
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    openWhatsApp(message);
  };

  return (
    <div className="he-whatsapp-widget">
      {isOpen && (
        <section
          className="he-whatsapp-panel"
          aria-label="HomeEstate WhatsApp enquiries"
        >
          <header className="he-whatsapp-header">
            <div className="he-whatsapp-avatar">🏠</div>

            <div className="he-whatsapp-header-info">
              <h3>BuilderBroget Assistant</h3>

              <p>
                <span className="he-online-dot" />
                Here to help with your property search
              </p>
            </div>

            <button
              type="button"
              className="he-whatsapp-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp chat"
            >
              ×
            </button>
          </header>

          <div className="he-whatsapp-body">
            <div className="he-whatsapp-welcome">
              <span className="he-welcome-label">
                WELCOME TO BuilderBroget
              </span>

              <h4>Let's find your happy place! 🏡</h4>

              <p>
                Looking to buy, rent, or visit a property?
                Choose an option below and connect with us
                on WhatsApp.
              </p>
            </div>

            <p className="he-whatsapp-question-title">
              HOW CAN WE HELP YOU?
            </p>

            <div className="he-whatsapp-options">
              {quickQuestions.map((item) => (
                <button
                  type="button"
                  className="he-whatsapp-option"
                  key={item.title}
                  onClick={() => openWhatsApp(item.message)}
                >
                  <span className="he-option-icon">
                    {item.icon}
                  </span>

                  <span className="he-option-title">
                    {item.title}
                  </span>

                  <span className="he-option-arrow">
                    ↗
                  </span>
                </button>
              ))}
            </div>

            <form
              className="he-whatsapp-custom-form"
              onSubmit={handleSubmit}
            >
              <label htmlFor="he-whatsapp-message">
                Or type your own enquiry
              </label>

              <div className="he-whatsapp-input-row">
                <input
                  id="he-whatsapp-message"
                  type="text"
                  placeholder="Write a message..."
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  maxLength={1000}
                />

                <button
                  type="submit"
                  aria-label="Send message on WhatsApp"
                  disabled={!message.trim()}
                >
                  ➤
                </button>
              </div>
            </form>

            <p className="he-whatsapp-note">
              <span>🔒</span>
              Your enquiry continues in WhatsApp.
            </p>
          </div>

          <div className="he-whatsapp-footer">
            <span>Powered by WhatsApp</span>
            <span>BuilderBroget 🏡</span>
          </div>
        </section>
      )}

      <button
        type="button"
        className={`he-whatsapp-float ${
          isOpen ? "he-whatsapp-float-open" : ""
        }`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={
          isOpen
            ? "Close WhatsApp assistant"
            : "Chat with BuilderBroget on WhatsApp"
        }
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className="he-whatsapp-float-close">×</span>
        ) : (
          <>
            <svg
              viewBox="0 0 32 32"
              width="30"
              height="30"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16.02 3C8.85 3 3.02 8.77 3.02 15.88c0 2.27.6 4.49 1.74 6.45L3 29l6.87-1.79a13.1 13.1 0 0 0 6.15 1.53h.01c7.17 0 13-5.78 13-12.88 0-3.45-1.36-6.69-3.82-9.13A12.9 12.9 0 0 0 16.02 3Zm0 23.56c-1.9 0-3.77-.51-5.4-1.49l-.39-.23-4.08 1.07 1.09-3.96-.26-.41a10.58 10.58 0 0 1-1.62-5.66c0-5.83 4.78-10.57 10.66-10.57 2.84 0 5.52 1.1 7.53 3.1a10.46 10.46 0 0 1 3.13 7.47c0 5.84-4.78 10.58-10.66 10.58Zm5.85-7.92c-.32-.16-1.9-.93-2.2-1.03-.3-.11-.51-.16-.72.16-.22.32-.83 1.03-1.02 1.24-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.57-.95-.83-1.59-1.85-1.78-2.17-.18-.32-.02-.49.14-.65.15-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.72-.99-2.36-.26-.62-.52-.53-.72-.54h-.61c-.21 0-.56.08-.86.4-.3.32-1.13 1.09-1.13 2.65s1.16 3.07 1.32 3.28c.16.21 2.28 3.46 5.52 4.85.77.33 1.37.52 1.84.67.77.24 1.47.21 2.02.13.62-.09 1.9-.77 2.17-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
            </svg>

           
          </>
        )}
      </button>
    </div>
  );
}

export default WhatsAppChatbot;