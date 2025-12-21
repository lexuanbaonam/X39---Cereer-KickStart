import { google } from 'googleapis';
import path from 'path';
import { readFile } from 'fs/promises';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const calendarId = 'primary'; // hoặc ID lịch cụ thể

// Hàm xác thực
export async function getAuthClient() {
  const keyPath = path.join(process.cwd(), 'credentials/online-meet-key.json');
  const keyFile = JSON.parse(await readFile(keyPath, 'utf8'));

  const auth = new google.auth.JWT(
    keyFile.client_email,
    null,
    keyFile.private_key,
    SCOPES
  );

  await auth.authorize(); // Xác thực

  return google.calendar({ version: 'v3', auth });
}

// Hàm tạo sự kiện không có Meet
export async function createCalendarEvent(eventData) {
  const calendar = await getAuthClient();

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: eventData.startTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
    },
  });

  return response.data;
}

// Hàm tạo sự kiện có Google Meet
export async function createGoogleMeetEvent(eventData) {
  const calendar = await getAuthClient();

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1, // cần để tạo Google Meet link
    requestBody: {
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: eventData.startTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      attendees: eventData.attendees || [], // danh sách email mời
      conferenceData: {
        createRequest: {
          requestId: 'meet_' + new Date().getTime(), // ID ngẫu nhiên
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  });

  return response.data;
}
