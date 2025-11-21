const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.get("/run-cdp", async (req, res) => {
  console.log("Starting CDP PoC...");

  const browser = await puppeteer.launch({
    headless: false, // show browser
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const client = await page.target().createCDPSession();

  // Enable domains like Protocol Monitor
  await client.send("DOM.enable");
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  const events = [];

  // Log all CDP events
  client.on("*", (method, params) => {
    const entry = { method, params };
    events.push(entry);
    console.log(method, params);
  });

  // Visit ACE editor demo
  await page.goto("https://ace.c9.io/build/kitchen-sink.html");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Click editor
  await page.mouse.click(200, 200);

  // Type via CDP (not DOM!)
  await client.send("Input.insertText", {
    text: "console.log('Hello from CDP via Node backend!');",
  });

  res.json({
    message: "CDP actions completed",
    eventsCount: events.length,
    exampleEvents: events.slice(0, 10),
  });

  // DO NOT close browser — leave it open for debugging
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
