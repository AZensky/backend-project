import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { editEvent } from "../../store/events";
import "./EditEventForm.css";

function EditEventForm() {
  let { eventId } = useParams();
  const [event, setEvent] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const [type, setType] = useState("Online");
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venues, setVenues] = useState([]);
  const [venue, setVenue] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const getEvent = async () => {
      let response = await fetch(`/api/events/${eventId}`);
      let data = await response.json();
      setEvent(data);
      setName(data.name);
      setCapacity(data.capacity);
      setPrice(data.price);
      setDescription(data.description);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setVenue(data.venueId);
      setGroupId(data.groupId);
      return data;
    };

    const getVenues = async () => {
      let response = await fetch("/api/venues");
      let data = await response.json();
      let groupVenues = data.filter((venue) => venue.groupId === groupId);
      setVenues(groupVenues);
      return data;
    };

    getEvent().catch(console.error);
    getVenues();
  }, [eventId, groupId]);

  useEffect(() => {
    const errors = [];
    if (name.length < 5) errors.push("Name must be at least 5 characters");
    if (capacity < 0) errors.push("Capacity must be 0 or greater");
    if (price < 0) errors.push("Price must be 0 or greater");
    if (new Date(startDate) < new Date())
      errors.push("Start date must be in the future");
    if (startDate >= endDate) errors.push("End date must be after start date");

    setValidationErrors(errors);
  }, [name, capacity, price, startDate, endDate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setHasSubmitted(true);

    if (validationErrors.length > 0) {
      return;
    }

    const info = {
      venueId: venue,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    };

    let editedEvent = await dispatch(editEvent(eventId, info)).catch((e) =>
      console.log(e)
    );

    history.push(`/events/${editedEvent.id}`);
  }

  return (
    <div className="create-group-form-page-container">
      <div className="create-group-form-container">
        <form className="create-group-form" onSubmit={handleSubmit}>
          <ul>
            {hasSubmitted &&
              validationErrors.length > 0 &&
              validationErrors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <h1 className="create-group-form__title">
            Edit {event && event.name}
          </h1>
          <label>
            Event Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="create-group-form__email__label">
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Online">Online</option>
              <option value="In person">In Person</option>
            </select>
          </label>

          <label className="create-group-form__email__label">
            Venue
            <select value={venue} onChange={(e) => setVenue(e.target.value)}>
              {venues.length > 0 &&
                venues.map((venue) => (
                  <option value={venue.id} key={venue.id}>
                    {venue.address}, {venue.city}, {venue.state}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Capacity
            <input
              type="text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </label>
          <label>
            Price
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Start Date
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label>
            End Date
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <button type="submit">Edit Group</button>
        </form>
      </div>
    </div>
  );
}

export default EditEventForm;
