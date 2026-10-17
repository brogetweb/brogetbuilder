
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please log in as Super Admin.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("Fetch contact messages error:", err);

      setError(
        err.response?.status === 403
          ? "You do not have permission to view these enquiries."
          : err.response?.status === 401
            ? "Your session may have expired. Please log in again."
            : "Unable to load contact enquiries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id) => {
    try {
      setUpdatingId(id);

      const token = getToken();

      await axios.patch(
        `${API_URL}/contact/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((previous) =>
        previous.map((message) =>
          message._id === id
            ? { ...message, status: "read" }
            : message
        )
      );
    } catch (err) {
      console.error("Mark enquiry as read error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update this enquiry."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const unreadCount = messages.filter(
    (message) => message.status !== "read"
  ).length;

  if (loading) {
    return (
      <div className="admin-contact-messages">
        <p>Loading contact enquiries...</p>
      </div>
    );
  }

  return (
    <section className="admin-contact-messages">
      <div className="admin-contact-heading">
        <div>
          <h2>Contact Us Enquiries</h2>
          <p>
            Messages submitted through the BuilderBroget
            contact form.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          className="admin-contact-refresh"
        >
          Refresh ↻
        </button>
      </div>

      <div className="admin-contact-stats">
        <div>
          <span>Total enquiries</span>
          <strong>{messages.length}</strong>
        </div>

        <div>
          <span>Unread enquiries</span>
          <strong>{unreadCount}</strong>
        </div>

        <div>
          <span>Read enquiries</span>
          <strong>{messages.length - unreadCount}</strong>
        </div>
      </div>

      {error && (
        <div className="admin-contact-error">
          {error}
        </div>
      )}

      {!error && messages.length === 0 ? (
        <div className="admin-contact-empty">
          <span>📨</span>
          <h3>No enquiries yet</h3>
          <p>
            Contact form submissions will appear here
            once someone contacts BuilderBroget.
          </p>
        </div>
      ) : (
        <div className="admin-contact-list">
          {messages.map((message) => (
            <article
              className={`admin-contact-card ${
                message.status !== "read"
                  ? "is-unread"
                  : ""
              }`}
              key={message._id}
            >
              <div className="admin-contact-card-header">
                <div>
                  <h3>{message.name}</h3>

                  <span
                    className={`admin-contact-status ${
                      message.status === "read"
                        ? "status-read"
                        : "status-unread"
                    }`}
                  >
                    {message.status === "read"
                      ? "Read"
                      : "Unread"}
                  </span>
                </div>

                <time>
                  {message.createdAt
                    ? new Date(
                        message.createdAt
                      ).toLocaleString()
                    : "Date unavailable"}
                </time>
              </div>

              <div className="admin-contact-details">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${message.email}`}>
                    {message.email}
                  </a>
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${message.phone}`}>
                    {message.phone}
                  </a>
                </p>
              </div>

              <div className="admin-contact-message">
                <strong>Message</strong>
                <p>{message.message}</p>
              </div>

              {message.status !== "read" && (
                <button
                  type="button"
                  className="admin-contact-read-btn"
                  disabled={updatingId === message._id}
                  onClick={() => markAsRead(message._id)}
                >
                  {updatingId === message._id
                    ? "Updating..."
                    : "Mark as read ✓"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminContactMessages;
