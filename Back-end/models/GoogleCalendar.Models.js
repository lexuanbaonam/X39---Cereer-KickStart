import mongoose from 'mongoose';

const GoogleCalendarEventSchema = new mongoose.Schema({
  summary: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  meetLink: { type: String }, // chỉ có nếu là Google Meet
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('GoogleCalendarEvents', GoogleCalendarEventSchema);
