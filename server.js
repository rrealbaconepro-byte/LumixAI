const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

let memory = [];
let knowledge = 0;

// Open website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Chat
app.post("/chat", upload.single("image"), async (req, res) => {
  const message = (req.body.message || "").trim();
  const text = message.toLowerCase();

  // Save memory
  if (message) memory.push(message);

  // Image received
  if (req.file) {
    return res.json({
      reply:
        "I received your image. Image understanding requires a vision AI model, but the upload worked successfully."
    });
  }

  // Greetings
  if (["hi", "hello", "hey"].includes(text)) {
    return res.json({
      reply: "Hello! I'm LumixAI. How can I help you today?"
    });
  }

  // Identity
  if (text.includes("who are you")) {
    return res.json({
      reply: "I'm LumixAI, your JavaScript AI assistant."
    });
  }

  // Learn command
  if (text.startsWith("learn ")) {
    const amount = parseInt(text.split(" ")[1]) || 0;
    knowledge += amount;

    return res.json({
      reply: `📚 Learning complete. Total knowledge: ${knowledge} pages.`
    });
  }

  // Memory count
  if (text === "knowledge") {
    return res.json({
      reply: `I currently remember ${knowledge} learned pages.`
    });
  }

  // Internet search using Wikipedia
  if (message.length > 0) {
    try {
      const url =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(message);

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        if (data.extract) {
          return res.json({
            reply: data.extract
          });
        }
      }
    } catch (e) {}
  }

  // Default
  return res.json({
    reply:
      "I couldn't find information on that. Try asking in a different way."
  });
});

// New chat
app.post("/newchat", (req, res) => {
  memory = [];
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🤖 LumixAI running on port ${PORT}`);
});
