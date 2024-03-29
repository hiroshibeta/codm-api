const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const app = express();

const port = 3000;

app.get("/", async function (req, res) {
res.sendFile(path.join(__dirname, 'cod/codm.html'));
});

app.get("/codm/link", async function (req, res) {
res.sendFile(path.join(__dirname, "codm.json"));
});

app.get("/info/vids", async function (req, res) {
res.sendFile(path.join(__dirname, "cod/vids.html"));
});

app.get("/codm/add/html", async function (req, res) {
  try {
    res.sendFile(path.join(__dirname, 'cod/add.html'));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/codm/request/f", async function (req, res) {
  try {
    const file = await fs.readFile(path.join(__dirname, 'codm.json'), 'utf-8');
    const links = JSON.parse(file);
    const link = links[Math.floor(Math.random() * links.length)];
    const dl = await axios.get(`https://www.tikwm.com/api/?url=${link}`);
    const username = dl.data.data.author.unique_id;
const nickname = dl.data.data.author.nickname;
const title = dl.data.data.title;
var url = dl.data.data.play;
    res.json({ username: username, nickname: nickname, title: title, eurixmp4: url  });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/add/link", async function (req, res) {
  try {
    const { link } = req.query;
    if (!link || !link.startsWith("https://vt.tiktok.com/")) {
      return res.status(400).json({ success: false, message: "Invalid or missing link parameter" });
    }
    const filePath = path.join(__dirname, "codm.json");
    const existingLinks = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    existingLinks.push(link);
    await fs.writeFile(filePath, JSON.stringify(existingLinks, null, 2));
    res.json({success: true, message: "Link added successfully", link: link});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/total/vids", async function (req, res) {
  try {
    const file = await fs.readFile(path.join(__dirname, 'codm.json'), 'utf-8');
    const links = JSON.parse(file);
    res.json({ totalVideos: links.length });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
