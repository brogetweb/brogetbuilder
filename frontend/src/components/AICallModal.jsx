
// import { useState } from "react";
// import "./AICallModal.css";

// function AICallModal({ property, onClose }) {
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [consent, setConsent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [success, setSuccess] = useState(false);

//   if (!property) return null;

//   const formatPrice = (price) => {
//     if (price === undefined || price === null || price === "") {
//       return "Price on request";
//     }

//     return `₹${Number(price).toLocaleString("en-IN")}`;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setMessage("");

//     const normalizedPhone = phone.replace(/[\s()-]/g, "");

//     if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
//       setMessage("Enter your phone number with country code, e.g. +919876543210.");
//       return;
//     }

//     if (!consent) {
//       setMessage("Please confirm that you agree to receive the requested AI call.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(
//         "http://localhost:5000/api/ai-calls/property-call",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             propertyId: property._id || property.id,
//             customerName: customerName.trim(),
//             phone: normalizedPhone,
//             consent
//           })
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Unable to request the AI call.");
//       }

//       setSuccess(true);
//       setMessage(
//         data.message ||
//           "Your AI call request has been submitted. Keep your phone nearby."
//       );
//     } catch (error) {
//       setMessage(error.message || "Unable to connect. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="ai-call-overlay"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget && !loading) {
//           onClose();
//         }
//       }}
//     >
//       <div
//         className="ai-call-modal"
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="ai-call-title"
//       >
//         <button
//           type="button"
//           className="ai-call-close"
//           onClick={onClose}
//           disabled={loading}
//           aria-label="Close popup"
//         >
//           ×
//         </button>

//         <div className="ai-call-icon">📞</div>

//         <span className="ai-call-eyebrow">HOMEESTATE AI ASSISTANT</span>

//         <h2 id="ai-call-title">Get a Call About This Property</h2>

//         <p className="ai-call-description">
//           Enter your details to request an AI call that explains the
//           available property information.
//         </p>

//         <div className="ai-call-property">
//           <div className="ai-call-property-icon">🏡</div>

//           <div className="ai-call-property-info">
//             <strong>{property.title || "Property Listing"}</strong>
//             <span>📍 {property.location || property.city || "Location not specified"}</span>
//             <strong className="ai-call-price">
//               {formatPrice(property.price)}
//             </strong>
//             <span>
//               {property.propertyType || "Property type not specified"}
//               {property.bedrooms != null
//                 ? ` • ${property.bedrooms} bedrooms`
//                 : ""}
//             </span>
//           </div>
//         </div>

//         {success ? (
//           <div className="ai-call-success">
//             <div className="ai-call-success-icon">✓</div>
//             <h3>Request Submitted!</h3>
//             <p>{message}</p>
//             <button
//               type="button"
//               className="ai-call-submit"
//               onClick={onClose}
//             >
//               Done
//             </button>
//           </div>
//         ) : (
//           <form className="ai-call-form" onSubmit={handleSubmit}>
//             <label htmlFor="ai-customer-name">Your Name</label>
//             <input
//               id="ai-customer-name"
//               type="text"
//               value={customerName}
//               onChange={(event) => setCustomerName(event.target.value)}
//               placeholder="Enter your name"
//               autoComplete="name"
//               maxLength={80}
//               required
//               disabled={loading}
//             />

//             <label htmlFor="ai-customer-phone">
//               Phone Number with Country Code
//             </label>
//             <input
//               id="ai-customer-phone"
//               type="tel"
//               value={phone}
//               onChange={(event) => setPhone(event.target.value)}
//               placeholder="+91 9876543210"
//               autoComplete="tel"
//               maxLength={20}
//               required
//               disabled={loading}
//             />

//             <label className="ai-call-consent">
//               <input
//                 type="checkbox"
//                 checked={consent}
//                 onChange={(event) => setConsent(event.target.checked)}
//                 disabled={loading}
//                 required
//               />
//               <span>
//                 I request an AI-generated phone call about this property
//                 and understand the caller is an AI assistant.
//               </span>
//             </label>

//             {message && (
//               <p className="ai-call-error" role="alert">
//                 {message}
//               </p>
//             )}

//             <button
//               type="submit"
//               className="ai-call-submit"
//               disabled={loading || !consent}
//             >
//               {loading ? "Requesting Call..." : "📞 Request AI Call"}
//             </button>
//           </form>
//         )}

//         <div className="ai-call-footer">
//           HomeEstate Property Assistance
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AICallModal;


import { useEffect, useRef, useState } from "react";
// import Vapi from "@vapi-ai/web";
import * as VapiModule from "@vapi-ai/web";
import "./AICallModal.css";

console.log("Vapi module:", VapiModule);
console.log("Default export:", VapiModule.default);
console.log("Named exports:", Object.keys(VapiModule));

function AICallModal({ property, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");

  const vapiRef = useRef(null);

  useEffect(() => {
    const publicKey = '22e49363-f12f-4650-8d30-43064fd0a407';

    if (!publicKey) {
      setMessage("Vapi Public API Key is missing. Check your frontend .env file.");
      return;
    }

    // const vapi = new Vapi(publicKey);
    const VapiConstructor =
  VapiModule.default?.default || VapiModule.default;

if (typeof VapiConstructor !== "function") {
  console.error("Vapi constructor not found:", VapiModule);
  return;
}

const vapi = new VapiConstructor(publicKey);
    vapiRef.current = vapi;

    const handleCallStart = () => {
      setCallStatus("connected");
      setLoading(false);
      setMessage("You are connected to the HomeEstate AI assistant.");
    };

    const handleCallEnd = () => {
      setCallStatus("idle");
      setLoading(false);
    };

    const handleError = (error) => {
      // console.error("Vapi error:", error);
      vapi.on("error", (error) => {
  console.error("Full Vapi error:", error);
  console.error(
    "Error details:",
    JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
  );
});
      setCallStatus("idle");
      setLoading(false);
      setMessage(
        error?.message || "Unable to connect to the AI assistant."
      );
    };

    vapi.on("audio", (player) => {
  console.log("🔊 Audio player attached:", player);
  console.log("Audio paused:", player.paused);
  console.log("Audio muted:", player.muted);
  console.log("Audio volume:", player.volume);

  // Set assistant playback volume to maximum
  vapi.setVolume(1);

  player.muted = false;
  player.volume = 1;

  player.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
});

vapi.on("error", (error) => {
  console.error("Vapi audio error:", error);

  if (error?.type === "audio-start-failed") {
    console.error("Browser blocked audio playback.");
  }
});


vapi.on("audio", (player) => {
  console.log("Audio player attached:", player);
  console.log("Paused:", player.paused);
  console.log("Muted:", player.muted);
  console.log("Volume:", player.volume);
  console.log("Ready state:", player.readyState);
  console.log("Current time:", player.currentTime);
  console.log("Audio source:", player.src || player.currentSrc);

  vapi.setVolume(1);

  player.muted = false;
  player.volume = 1;

  player.play()
    .then(() => {
      console.log("✅ Audio playback started");
    })
    .catch((error) => {
      console.error("❌ Audio playback failed:", error.name, error.message);
    });

  player.addEventListener("playing", () => {
    console.log("▶️ Audio element is playing");
  });

  player.addEventListener("stalled", () => {
    console.log("⚠️ Audio playback stalled");
  });

  player.addEventListener("error", () => {
    console.error("❌ Audio element error:", player.error);
  });
});



    vapi.on("call-start", () => {
  console.log("✅ Call connected");
});

vapi.on("speech-start", () => {
  console.log("🔊 Assistant started speaking");
});

vapi.on("speech-end", () => {
  console.log("🔇 Assistant finished speaking");
});

vapi.on("message", (message) => {
  console.log("Vapi message:", message);
});

vapi.on("error", (error) => {
  console.error("Vapi error:", error);
});
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);

    return () => {
      vapi.stop();
      vapi.off?.("call-start", handleCallStart);
      vapi.off?.("call-end", handleCallEnd);
      vapi.off?.("error", handleError);
      vapiRef.current = null;
    };
  }, []);

  if (!property) return null;

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!customerName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    const normalizedPhone = phone.replace(/[\s()-]/g, "");

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setMessage(
        "Enter your phone number with country code, e.g. +919876543210."
      );
      return;
    }

    if (!consent) {
      setMessage("Please confirm that you agree to start the AI voice call.");
      return;
    }

    const vapi = vapiRef.current;
    const assistantId = 'a68af9a6-0fd3-4cdc-b4b6-559eb96131ef';

    if (!vapi || !assistantId) {
      setMessage(
        "Vapi is not configured. Check your Public API Key and Assistant ID."
      );
      return;
    }

    try {
      setLoading(true);
      setCallStatus("connecting");

      const assistantOverrides = {
        variableValues: {
          customerName: customerName.trim(),
          customerPhone: normalizedPhone,
          propertyTitle: property.title || "Property Listing",
          propertyLocation:
            property.location || property.city || "Location not specified",
          propertyPrice: formatPrice(property.price),
          propertyType: property.propertyType || "Not specified",
          listingType: property.listingType || "Not specified",
          bedrooms:
            property.bedrooms != null
              ? String(property.bedrooms)
              : "Not specified",
          propertyDescription:
            property.description || "No description provided",
        },
      };

      await vapi.start(assistantId, assistantOverrides);

      setSuccess(true);
    } catch (error) {
      console.error("Unable to start Vapi call:", error);
      setCallStatus("idle");
      setLoading(false);
      setMessage(
        error?.message ||
          "Unable to start the AI call. Check microphone permissions and Vapi settings."
      );
    }
  };

  const handleEndCall = () => {
    vapiRef.current?.stop();
    setCallStatus("idle");
    setLoading(false);
  };

  return (
    <div
      className="ai-call-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading &&
          callStatus !== "connected"
        ) {
          onClose();
        }
      }}
    >
      <div
        className="ai-call-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-call-title"
      >
        <button
          type="button"
          className="ai-call-close"
          onClick={() => {
            if (callStatus === "connected") {
              handleEndCall();
            }
            onClose();
          }}
          disabled={loading}
          aria-label="Close popup"
        >
          ×
        </button>

        <div className="ai-call-icon">📞</div>

        <span className="ai-call-eyebrow">
          HOMEESTATE AI ASSISTANT
        </span>

        <h2 id="ai-call-title">Talk About This Property</h2>

        <p className="ai-call-description">
          Start a browser voice call with our AI assistant to discuss
          this property's available information.
        </p>

        <div className="ai-call-property">
          <div className="ai-call-property-icon">🏡</div>

          <div className="ai-call-property-info">
            <strong>{property.title || "Property Listing"}</strong>

            <span>
              📍 {property.location || property.city || "Location not specified"}
            </span>

            <strong className="ai-call-price">
              {formatPrice(property.price)}
            </strong>

            <span>
              {property.propertyType || "Property type not specified"}
              {property.bedrooms != null
                ? ` • ${property.bedrooms} bedrooms`
                : ""}
            </span>
          </div>
        </div>

        {success ? (
          <div className="ai-call-success">
            <div className="ai-call-success-icon">
              {callStatus === "connected" ? "✓" : "📞"}
            </div>

            <h3>
              {callStatus === "connected"
                ? "AI Call Connected"
                : callStatus === "connecting"
                ? "Connecting to AI..."
                : "Call Ended"}
            </h3>

            <p>{message}</p>

            {callStatus === "connected" ? (
              <button
                type="button"
                className="ai-call-submit"
                onClick={handleEndCall}
              >
                End AI Call
              </button>
            ) : (
              <button
                type="button"
                className="ai-call-submit"
                onClick={onClose}
                disabled={loading}
              >
                Done
              </button>
            )}
          </div>
        ) : (
          <form className="ai-call-form" onSubmit={handleSubmit}>
            <label htmlFor="ai-customer-name">Your Name</label>

            <input
              id="ai-customer-name"
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              maxLength={80}
              required
              disabled={loading}
            />

            <label htmlFor="ai-customer-phone">
              Phone Number with Country Code
            </label>

            <input
              id="ai-customer-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 9876543210"
              autoComplete="tel"
              maxLength={20}
              required
              disabled={loading}
            />

            <label className="ai-call-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                disabled={loading}
                required
              />

              <span>
                I agree to start a browser-based AI voice call and
                understand that I am speaking with an AI assistant.
              </span>
            </label>

            {message && (
              <p className="ai-call-error" role="alert">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="ai-call-submit"
              disabled={loading || !consent}
            >
              {loading
                ? "Connecting..."
                : "🎙 Start AI Voice Call"}
            </button>

            {callStatus === "connected" && (
              <button
                type="button"
                className="ai-call-submit"
                onClick={handleEndCall}
              >
                End AI Call
              </button>
            )}
          </form>
        )}

        <div className="ai-call-footer">
          HomeEstate Property Assistance
        </div>
      </div>
    </div>
  );
}

export default AICallModal;
