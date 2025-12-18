const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const controller = require("../controllers/eventController");

router.post(
  "/",
  auth,
  upload.single("image"), // ✅ THIS WAS MISSING
  controller.createEvent
);

router.get("/", controller.getEvents);

router.post("/:id/rsvp", auth, controller.rsvp);
router.post("/:id/leave", auth, controller.leaveEvent);

router.put("/:id", auth, controller.updateEvent);
router.delete("/:id", auth, controller.deleteEvent);

module.exports = router;
