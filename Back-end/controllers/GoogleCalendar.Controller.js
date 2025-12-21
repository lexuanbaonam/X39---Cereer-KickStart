import {
    createCalendarEvent,
    createGoogleMeetEvent
  } from '../google/calendar.service.js';
  
  import GoogleCalendarEvent from '../models/GoogleCalendar.Models.js';
  
  export const createEvent = async (req, res) => {
    try {
      const { summary, description, startTime, endTime } = req.body;
  
      const event = await createCalendarEvent({ summary, description, startTime, endTime });
  
    
      await GoogleCalendarEvent.create({ summary, description, startTime, endTime });
  
      res.status(200).json({ message: 'Event created', event });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const createEventWithMeet = async (req, res) => {
    try {
      const { summary, description, startTime, endTime, attendees } = req.body;
  
      const event = await createGoogleMeetEvent({
        summary,
        description,
        startTime,
        endTime,
        attendees,
      });
  
      // Lưu vào DB nếu cần
      await GoogleCalendarEvent.create({
        summary,
        description,
        startTime,
        endTime,
        meetLink: event?.hangoutLink || '',
      });
  
      res.status(200).json({ message: 'Meet event created', event });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  