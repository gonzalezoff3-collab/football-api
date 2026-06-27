const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// API FOOTBALL
const BASE_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_KEY;

// Axios config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apisports-key": API_KEY
  }
});


// 🏠 ROUTE ACCUEIL (corrige ton "Not found")
app.get("/", (req, res) => {
  res.send("⚽ API Football est en ligne et fonctionne !");
});


// 🔎 RECHERCHE ÉQUIPE
app.get("/team/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const response = await api.get(`/teams?search=${name}`);

    const team = response.data?.response?.[0]?.team;

    if (!team) {
      return res.json({
        success: false,
        message: "Aucune équipe trouvée"
      });
    }

    res.json({
      success: true,
      team
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});


// ⚽ DERNIERS MATCHS
app.get("/fixtures/:teamId", async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const response = await api.get(`/fixtures?team=${teamId}&last=5`);

    res.json({
      success: true,
      matches: response.data?.response || []
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});


// 🚀 LANCEMENT SERVEUR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
