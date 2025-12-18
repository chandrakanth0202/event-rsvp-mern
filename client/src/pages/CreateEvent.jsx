import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: ""
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);

      await api.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Event created successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="datetime-local"
          name="date"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <br /><br />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
