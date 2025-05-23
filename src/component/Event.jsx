import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventsPage = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    organizedBy: "",
    date: "",
    time: "",
    venue: "",
    image: null,
    googleFormLink: "",
  });
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    deleteExpiredEvents();
  }, [events]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const deleteExpiredEvents = async () => {
    const today = new Date().toISOString().split("T")[0];
    const validEvents = events.filter(event => event.date >= today);

    if (validEvents.length !== events.length) {
      try {
        await axios.post("http://localhost:5005/api/events/deleteExpired", {
          expiredEvents: events.filter(event => event.date < today),
        });
        setEvents(validEvents);
      } catch (error) {
        console.error("Error deleting expired events:", error);
      }
    }
  };

  const handleFileUpload = (e) => {
    setNewEvent({ ...newEvent, image: e.target.files[0] });
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.venue) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("organizedBy", newEvent.organizedBy);
    formData.append("date", newEvent.date);
    formData.append("time", newEvent.time);
    formData.append("venue", newEvent.venue);
    if (newEvent.image) {
      formData.append("file", newEvent.image);
    }
    formData.append("googleFormLink", newEvent.googleFormLink);

    try {
      await axios.post("http://localhost:5005/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchEvents();
      setShowEventForm(false);
      setNewEvent({
        title: "",
        organizedBy: "",
        date: "",
        time: "",
        venue: "",
        image: null,
        googleFormLink: "",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event.");
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl md:text-4xl font-bold text-purple-400 mb-12">Upcoming Events</h1>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 m-5 rounded-lg transition"
            onClick={() => setShowEventForm(true)}
          >
            + Add Event
          </button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-lg text-gray-400">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className="bg-gray-800 hover:bg-gray-700 transition p-4 rounded-lg w-86 shadow-md cursor-pointer"
              onClick={() => navigate(`/event/${event.id}`)}
              style={{ minHeight: "440px", maxHeight: "540px" }}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-72 w-full object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-2xl text-purple-300">{event.title}</h3>
              <p className="text-gray-300 mt-1">Organized by: {event.organizedBy}</p>
              <p className="text-gray-400 mt-1">{event.date} | {event.time}</p>
              <p className="text-gray-300 mt-1">Venue: {event.venue}</p>
              {event.googleFormLink && (
                <a
                  href={event.googleFormLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 mt-2 inline-block underline"
                >
                  Register Here
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Event Form Popup */}
      {showEventForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 border border-purple-500 p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl text-purple-300 mb-4">Add New Event</h2>
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />
            <input
              type="text"
              placeholder="Organized By"
              value={newEvent.organizedBy}
              onChange={(e) => setNewEvent({ ...newEvent, organizedBy: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />
            <input
              type="text"
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />
            <input
              type="url"
              placeholder="Registration Form Link"
              value={newEvent.googleFormLink}
              onChange={(e) => setNewEvent({ ...newEvent, googleFormLink: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <button
              onClick={addEvent}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Add Event
            </button>
            <button
              onClick={() => setShowEventForm(false)}
              className="w-full py-2 mt-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

