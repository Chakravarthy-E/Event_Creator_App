import express from "express";
import { google } from "googleapis";

const app = express();

const PORT = process.env.NODE_ENV || 8000;

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

app.get("/google/redirect", (req, res) => {
  res.send("its working");
});

app.listen(PORT, () => {
  console.log(`server running on port${PORT}`);
});
