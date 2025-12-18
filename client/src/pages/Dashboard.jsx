import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* =========================
   Helper: Get userId from JWT
   ========================= */
const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
};

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = getUserId();

  const loadEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const rsvpEvent = async (id) => {
    try {
      await api.post(`/events/${id}/rsvp`);
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || "RSVP failed");
    }
  };

  const leaveEvent = async (id) => {
    try {
      await api.post(`/events/${id}/leave`);
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave event");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading events...</h3>;
  }

  return (
    <div className="container">
      {/* Top Navigation */}
      <div className="nav">
        <h2>Upcoming Events</h2>
        <div>
          <button onClick={() => navigate("/create")}>Create Event</button>
          <button
            onClick={logout}
            style={{ marginLeft: "10px", background: "#dc2626" }}
          >
            Logout
          </button>
        </div>
      </div>

      {events.length === 0 && <p>No events available</p>}

      {events.map((evt) => {
        const attendees = evt.attendees || [];
        const capacity = evt.capacity || 0;

        const isJoined = attendees.some(
          (id) => id.toString() === userId
        );
        const isFull = attendees.length >= capacity;

        const formattedDate = evt.date
          ? new Date(evt.date).toLocaleString()
          : "N/A";

        return (
          <div key={evt._id} className="card">
            {evt.image && (
              <img
                src={evt.image}
                alt={evt.title}
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            )}

            <h3>{evt.title}</h3>
            <p>{evt.description}</p>

            <p>
              <strong>Date:</strong> {formattedDate}
            </p>

            <p>
              <strong>Location:</strong> {evt.location || "N/A"}
            </p>

            <p>
              <strong>Capacity:</strong>{" "}
              {attendees.length}/{capacity}
            </p>

            {/* ACTION BUTTONS */}
            <div style={{ marginTop: "10px" }}>
              {!isJoined && !isFull && (
                <button onClick={() => rsvpEvent(evt._id)}>
                  RSVP
                </button>
              )}

              {isJoined && (
                <button
                  onClick={() => leaveEvent(evt._id)}
                  style={{ marginLeft: "10px", background: "#6b7280" }}
                >
                  Leave
                </button>
              )}

              {!isJoined && isFull && (
                <p style={{ color: "red", marginTop: "8px" }}>
                  Event is full
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;
