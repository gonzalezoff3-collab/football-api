const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const BASE_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apisports-key": API_KEY
  }
});

// recherche équipe
app.get("/team/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const response = await api.get(`/teams?search=${name}`);

    const team = response.data?.response?.[0]?.team || null;

    if (!team) {
      return res.json({ success: false });
    }

    res.json({ success: true, team });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// matchs
app.get("/fixtures/:teamId", async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const response = await api.get(`/fixtures?team=${teamId}&last=5`);

    res.json({
      success: true,
      matches: response.data?.response || []
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
