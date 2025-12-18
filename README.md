## Event RSVP Management System (MERN Stack)

A full-stack web application that allows users to create, view, and RSVP to events with strict capacity enforcement and concurrency handling.
Built as part of a Full Stack Intern recruitment assignment using the MERN stack.


# Live Demo  
 netlify : https://event-rsvp-mern3.netlify.app/login

 ## Tech Stack

# Frontend

React.js
Axios
React Router
CSS (Responsive Design)

# Backend

Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Multer (Image Upload)

# Deployment

Netlify
Database: MongoDB Atlas

## Features Implemented
# User Authentication

User Registration (Sign Up)
User Login
JWT-based stateless authentication
Protected routes for authenticated users

# Event Management (CRUD)

Authenticated users can:
Create events with:
  1.Title
  2.Description
  3.Date & Time
  4.Location
  5.Capacity
  6.Image upload
View all upcoming events
Edit & delete only the events they created
View event images on the dashboard

## RSVP System (Core Business Logic)

Users can RSVP to events
Users can leave events
No duplicate RSVPs allowed
Event capacity is strictly enforced
Backend prevents overbooking under concurrency

 # Responsive UI

Fully responsive design
Works seamlessly on Desktop, Tablet, and Mobile
Clean and simple UI for usability

## RSVP Capacity & Concurrency Handling (Technical Explanation)

To prevent overbooking when multiple users attempt to RSVP at the same time, the backend uses an atomic MongoDB update.

# Strategy Used

findOneAndUpdate() with conditional checks
Ensures:
The user is not already an attendee
The number of attendees is less than the event capacity


# Atomic RSVP Logic (Backend)

const event = await Event.findOneAndUpdate(
  {
    _id: req.params.id,
    attendees: { $ne: req.user.id },
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }
  },
  { $push: { attendees: req.user.id } },
  { new: true }
);

if (!event) {
  return res.status(400).json({ message: "Event full or already joined" });
}

## Why This Works

MongoDB executes this as a single atomic operation
Prevents race conditions
Guarantees that capacity is never exceeded
Safe even under high concurrent requests

##  Running the Application Locally
# Clone the Repository
git clone https://github.com/chandrakanth0202/event-rsvp-mern.git
cd event-rsvp-mern

#  Backend Setup
cd server
npm install


# Create a .env file inside server/:

MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key


# Run backend:

npm run dev


# Backend runs on:

http://localhost:5000

#  Frontend Setup
cd ../client
npm install
npm start


# Frontend runs on:

http://localhost:3000


##  Project Structure
event-rsvp-mern/
 ├── client/
 │   ├── public/
 │   └── src/
 ├── server/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middleware/
 │   └── server.js
 

## Future Enhancements 

AI-generated event descriptions
Event search & filtering
User dashboard for created/attending events
Dark mode
Improved form validations


