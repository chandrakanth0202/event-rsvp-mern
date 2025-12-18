const Event = require("../models/Event");

/* =========================
   CREATE EVENT
   ========================= */
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      location: req.body.location,
      capacity: Number(req.body.capacity),
      image: req.file ? `/uploads/${req.file.filename}` : "",
      creator: req.user.id,
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create event" });
  }
};

/* =========================
   GET ALL EVENTS (PUBLIC)
   ========================= */
exports.getEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};

/* =========================
   RSVP JOIN (ATOMIC, SAFE)
   ========================= */
exports.rsvp = async (req, res) => {
  const event = await Event.findOneAndUpdate(
    {
      _id: req.params.id,
      attendees: { $ne: req.user.id }, // no duplicates
      $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }, // capacity check
    },
    { $push: { attendees: req.user.id } },
    { new: true }
  );

  if (!event) {
    return res
      .status(400)
      .json({ message: "Event full or already joined" });
  }

  res.json(event);
};

/* =========================
   RSVP LEAVE (FIXES YOUR ERROR)
   ========================= */
exports.leaveEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  event.attendees = event.attendees.filter(
    (userId) => userId.toString() !== req.user.id
  );

  await event.save();

  res.json({ message: "Left event successfully" });
};

/* =========================
   UPDATE EVENT (CREATOR ONLY)
   ========================= */
exports.updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.creator.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  Object.assign(event, req.body);
  await event.save();

  res.json(event);
};

/* =========================
   DELETE EVENT (CREATOR ONLY)
   ========================= */
exports.deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.creator.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await event.deleteOne();
  res.json({ message: "Event deleted successfully" });
};
