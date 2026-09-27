const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  const message = (req.body.message || "").trim();

  try {
    const url =
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(message);

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      return res.json({
        reply: data.extract || "I couldn't find information."
      });
    }

    res.json({
      reply: "I couldn't find information on the internet."
    });
  } catch (err) {
    res.json({
      reply: "Internet search failed."
    });
  }
});

app.listen(PORT, () => {
  console.log(`LumixAI running on ${PORT}`);
});
