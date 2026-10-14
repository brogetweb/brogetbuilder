
import { useState } from "react";
import "./VastuChatbot.css";

const quickQuestions = [
  "Which direction is best for the main entrance?",
  "Where should the kitchen be located?",
  "Which direction is ideal for the master bedroom?",
  "Where should the Pooja room be placed?",
  "What should I check before buying a flat?",
  "What about balconies and windows?"
];

const vastuAnswers = [
  {
    keywords: [
      "entrance",
      "main door",
      "main entrance",
      "front door"
    ],
    answer:
      "According to traditional Vastu Shastra, north, east and northeast entrances are often considered favourable. The recommendation may vary depending on the home's layout and entrance position. Check the actual direction using a compass."
  },
  {
    keywords: ["kitchen", "cooking", "stove"],
    answer:
      "Traditional Vastu guidance commonly recommends the southeast for the kitchen, with northwest sometimes suggested as an alternative. Practical ventilation, fire safety and convenient access should also guide your decision."
  },
  {
    keywords: [
      "master bedroom",
      "bedroom",
      "sleeping",
      "bed"
    ],
    answer:
      "In traditional Vastu, the southwest is often recommended for the master bedroom. Consider room dimensions, ventilation, privacy and furniture placement as well."
  },
  {
    keywords: [
      "pooja",
      "puja",
      "prayer",
      "mandir",
      "worship"
    ],
    answer:
      "The northeast is commonly preferred for a Pooja room in traditional Vastu Shastra. A clean, peaceful and well-ventilated space is also important."
  },
  {
    keywords: [
      "buy",
      "buying",
      "purchase",
      "flat",
      "apartment",
      "check before"
    ],
    answer:
      "For a Vastu-oriented property inspection, you can check the main entrance direction, room layout, kitchen and bedroom positions, natural light and ventilation. Also verify the property's legal documents, structural condition, water supply and overall suitability. Vastu is a traditional belief, not a scientific guarantee."
  },
  {
    keywords: [
      "balcony",
      "balconies",
      "window",
      "windows",
      "sunlight"
    ],
    answer:
      "Traditional Vastu guidance often favours open, light-filled spaces in the north and east. In practice, good daylight, cross-ventilation, balcony safety, weather protection and privacy are important considerations."
  },
  {
    keywords: [
      "toilet",
      "bathroom",
      "washroom",
      "toilets"
    ],
    answer:
      "Traditional Vastu recommendations often discuss the northwest or west for bathrooms and toilets. Actual suitability depends on plumbing, waterproofing, ventilation and the existing floor plan."
  },
  {
    keywords: [
      "water",
      "tank",
      "borewell",
      "well"
    ],
    answer:
      "Traditional Vastu has recommendations for water sources and storage locations, but these vary by the type of water installation. Prioritise safe drinking water, plumbing quality, drainage and compliance with local building requirements."
  },
  {
    keywords: [
      "direction",
      "north",
      "south",
      "east",
      "west",
      "compass"
    ],
    answer:
      "Start by identifying true room and entrance directions with a compass. Vastu interpretations depend on the direction and the layout being discussed. If you share the specific area, such as the entrance, kitchen or bedroom, I can explain the commonly followed traditional guidance."
  }
];

function getVastuAnswer(question) {
  const text = question.toLowerCase();

  const matchedAnswer = vastuAnswers.find((item) =>
    item.keywords.some((keyword) =>
      text.includes(keyword)
    )
  );

  if (matchedAnswer) {
    return matchedAnswer.answer;
  }

  return "I can help with traditional Vastu topics such as entrance directions, kitchens, bedrooms, Pooja rooms, bathrooms, balconies and property inspections. Please ask about one of these areas, and I'll explain the commonly followed guidance. Vastu beliefs are not scientifically established guarantees of a property's quality or outcomes.";
}

function VastuChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");

  // Controls visibility of suggested questions
  const [showSuggestions, setShowSuggestions] =
    useState(true);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! 🙏 Welcome to the HomeEstate Vastu Assistant. Ask me about traditional Vastu guidance for different areas of a home."
    }
  ]);

  const sendMessage = (text) => {
    const userQuestion = text.trim();

    if (!userQuestion) return;

    // Hide suggestions after a question is selected or sent
    setShowSuggestions(false);

    const answer = getVastuAnswer(userQuestion);

    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: userQuestion
      },
      {
        sender: "bot",
        text: answer
      }
    ]);

    setQuestion("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(question);
  };

  // Reset suggestions when the chatbot is opened again
  const toggleChat = () => {
    if (!isOpen) {
      setShowSuggestions(true);
      setQuestion("");
    }

    setIsOpen((previous) => !previous);
  };

  return (
    <div className="vastu-chatbot">
      {isOpen && (
        <section
          className="vastu-chat-window"
          aria-label="HomeEstate Vastu Assistant"
        >
          <header className="vastu-chat-header">
            <div className="vastu-header-icon">
              🏠
            </div>

            <div className="vastu-header-info">
              <h3>Vastu Assistant</h3>
              <p>Traditional Vastu guidance</p>
            </div>

            <button
              type="button"
              className="vastu-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Vastu chat"
            >
              ×
            </button>
          </header>

          <div
            className="vastu-chat-messages"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`vastu-message ${
                  message.sender === "user"
                    ? "vastu-user-message"
                    : "vastu-bot-message"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Suggested questions appear conditionally */}
          {showSuggestions && (
            <div className="vastu-quick-questions">
              <p>Suggested questions</p>

              {quickQuestions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className="vastu-quick-btn"
                  onClick={() => sendMessage(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <form
            className="vastu-chat-input"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={question}
              onChange={(event) => {
                const value = event.target.value;

                setQuestion(value);

                // Hide suggestions as soon as the user types
                if (value.trim()) {
                  setShowSuggestions(false);
                }
              }}
              placeholder="Ask a Vastu question..."
              aria-label="Your Vastu question"
            />

            <button
              type="submit"
              aria-label="Send question"
            >
              ➤
            </button>
          </form>

          <p className="vastu-disclaimer">
            Based on traditional beliefs, not scientific guarantees.
          </p>
        </section>
      )}

      <button
        type="button"
        className={`vastu-floating-btn ${
          isOpen ? "vastu-floating-active" : ""
        }`}
        onClick={toggleChat}
        aria-label={
          isOpen
            ? "Close Vastu Assistant"
            : "Open Vastu Assistant"
        }
      >
        {isOpen ? "×" : "🏠"}

        {!isOpen && (
          <span>Ask Vastu</span>
        )}
      </button>
    </div>
  );
}

export default VastuChatbot;
