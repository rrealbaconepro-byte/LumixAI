const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Memory
let knowledge = 0;

// Open website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const message = (req.body.message || "").trim();
  const text = message.toLowerCase();

  // Greetings
  if (["hi", "hello", "hey"].includes(text)) {
    return res.json({
      reply: "Hello! 👋 I'm LumixAI. How can I help you?"
    });
  }

  // Identity
  if (text.includes("who are you")) {
    return res.json({
      reply: "I'm LumixAI, an AI assistant built with JavaScript."
    });
  }

  // ChatGPT
  if (text === "chatgpt") {
    return res.json({
      reply: "ChatGPT is an AI assistant created by OpenAI. I'm LumixAI."
    });
  }

  // Learn command
  if (text.startsWith("learn ")) {
    const amount = parseInt(text.split(" ")[1]) || 0;
    knowledge += amount;

    return res.json({
      reply: `📚 Learned ${amount} knowledge pages. Total: ${knowledge}.`
    });
  }

  // Knowledge count
  if (text === "knowledge") {
    return res.json({
      reply: `I currently have ${knowledge} learned knowledge pages.`
    });
  }

  // Internet lookup (Wikipedia)
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
  } catch (err) {
    console.log(err);
  }

  // Default reply
  return res.json({
    reply: "Sorry, I couldn't find information about that."
  });
});

app.listen(PORT, () => {
  console.log(`LumixAI is running on port ${PORT}`);
});
