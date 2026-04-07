import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { register, login, getMe } from "./src/routes/auth.js";
import { getFavorites, createFavorite, deleteFavorite } from "./src/routes/favorites.js";
import { getPosts, createPost, deletePost } from "./src/routes/posts.js";
import { authenticateToken } from "./src/middleware/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Authentication routes
  app.post("/api/register", register);
  app.post("/api/login", login);
  app.get("/api/me", authenticateToken, getMe);

  // Favorites routes
  app.get("/api/favorites", authenticateToken, getFavorites);
  app.post("/api/favorites", authenticateToken, createFavorite);
  app.delete("/api/favorites/:id", authenticateToken, deleteFavorite);

  // Posts routes
  app.get("/api/posts", authenticateToken, getPosts);
  app.post("/api/posts", authenticateToken, createPost);
  app.delete("/api/posts/:id", authenticateToken, deletePost);

  // Generic API Proxy for Football Data
  app.get("/api/football/*", async (req, res) => {
    const apiKey = process.env.FOOTBALL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "FOOTBALL_API_KEY is not set" });
    }

    const endpoint = req.params[0];
    const url = `https://api.football-data.org/v4/${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "X-Auth-Token": apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      res.status(500).json({ error: "Failed to fetch data from football API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
