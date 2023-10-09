import express from "express";
import dotenv from "dotenv";
dotenv.config({});
import axios from "axios";
import { google } from "googleapis";
import dayjs from "dayjs";

const app = express();

const PORT = process.env.NODE_ENV || 8000;

const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

app.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
  try {
    const code = req.query.code;
    // console.log(code);

    if (!code) {
      throw new Error("Authorization code is missing.");
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // console.log(tokens)
    res.send({
      message: "Successfully logged in",
    });
  } catch (error) {
    console.error("Error in /google/redirect:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/schedule_event", async (req, res) => {
  await calendar.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    requestBody: {
      summary: "This is test event",
      description: "some event boring one",
      start: {
        dateTime: dayjs(new Date()).add(1, "day").toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: dayjs(new Date()).add(1, "day").add(1, "hour").toISOString(),
        timeZone: "Asia/Kolkata",
      },
    },
  });
  res.send({
    message: "done",
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
