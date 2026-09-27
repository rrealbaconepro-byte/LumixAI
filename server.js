const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let chats = [];
let knowledge = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  const message = (req.body.message || "").trim();

  chats.push({ role: "user", content: message });

  if (message.toLowerCase() === "new chat") {
    chats = [];
    return res.json({ reply: "New chat created." });
  }

  if (message.toLowerCase().startsWith("learn ")) {
    const amount = parseInt(message.split(" ")[1]) || 0;

    for (let i = 0; i < amount; i++) {
      knowledge.push(`Knowledge page ${knowledge.length + 1}`);
    }

    return res.json({
      reply: `LumixAI learned ${amount} knowledge items. Total: ${knowledge.length}.`
    });
  }

  if (message.toLowerCase() === "knowledge") {
    return res.json({
      reply: `Stored knowledge: ${knowledge.length} items.`
    });
  }

  if (message.toLowerCase().startsWith("image ")) {
    return res.json({
      reply: "Image generation requires an image model. This server cannot generate real images by itself."
    });
  }

  if (message.toLowerCase().startsWith("file ")) {
    return res.json({
      reply: "File generation requires document creation code. This is the command router."
    });
  }

  const reply = `I received: "${message}"`;

  chats.push({ role: "assistant", content: reply });

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`LumixAI running on port ${PORT}`);
});
