import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/verify-captcha", async (req, res) => {
  const token = req.body["g-recaptcha-response"];
  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/eighth-keyword-456923-f7/assessments?key=${process.env.API_KEY}`;
  console.log("Received token:", token);
  const googleRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: {
        token,
        siteKey: process.env.SITE_KEY
      }
    })
  });

  const result = await googleRes.json();
  console.log("Google response:", result);
  const valid = result.tokenProperties && result.tokenProperties.valid;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ success: !!valid });
});

app.listen(3000, () => console.log("Captcha proxy server running"));
