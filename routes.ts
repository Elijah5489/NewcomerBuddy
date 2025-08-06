import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTranslationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Translation routes
  app.post("/api/translations", async (req, res) => {
    try {
      const translation = insertTranslationSchema.parse(req.body);
      const result = await storage.saveTranslation(translation);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid translation data" });
    }
  });

  app.get("/api/translations", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const translations = await storage.getUserTranslations(userId);
      res.json(translations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  app.patch("/api/translations/:id/favorite", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.toggleFavoriteTranslation(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle favorite" });
    }
  });

  // Dictionary routes
  app.get("/api/dictionary/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter required" });
      }
      const entries = await storage.searchDictionary(query);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Dictionary search failed" });
    }
  });

  app.get("/api/dictionary", async (req, res) => {
    try {
      const entries = await storage.getAllDictionaryEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dictionary entries" });
    }
  });

  app.get("/api/dictionary/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getDictionaryEntry(id);
      if (!entry) {
        return res.status(404).json({ error: "Dictionary entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dictionary entry" });
    }
  });

  // Historical events routes
  app.get("/api/history", async (req, res) => {
    try {
      const events = await storage.getHistoricalEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch historical events" });
    }
  });

  // Learning modules routes
  app.get("/api/learning/modules", async (req, res) => {
    try {
      const modules = await storage.getLearningModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning modules" });
    }
  });

  app.get("/api/learning/modules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const module = await storage.getLearningModule(id);
      if (!module) {
        return res.status(404).json({ error: "Learning module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning module" });
    }
  });

  // Community resources routes
  app.get("/api/community/resources", async (req, res) => {
    try {
      const type = req.query.type as string;
      const resources = await storage.getCommunityResources(type);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch community resources" });
    }
  });

  app.get("/api/community/events", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming events" });
    }
  });

  // Translation API using Google Translate (when API key is provided)
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, from, to } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      // Google Translate API integration
      const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.TRANSLATE_API_KEY;
      
      if (!apiKey) {
        // Fallback to basic translation mapping for demo
        const basicTranslations: Record<string, string> = {
          'hello': 'Привіт',
          'thank you': 'Дякую',
          'please': 'Будь ласка',
          'sorry': 'Вибачте',
          'yes': 'Так',
          'no': 'Ні',
          'goodbye': 'До побачення',
          'how are you': 'Як справи?',
          'good morning': 'Доброго ранку',
          'good evening': 'Доброго вечора'
        };

        const lowerText = text.toLowerCase();
        const translation = basicTranslations[lowerText] || text;
        
        return res.json({
          translatedText: translation,
          sourceLanguage: from || 'auto',
          targetLanguage: to || 'uk'
        });
      }

      // Use Google Translate API
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: from,
            target: to,
            format: 'text'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Translation API request failed');
      }

      const data = await response.json();
      
      res.json({
        translatedText: data.data.translations[0].translatedText,
        sourceLanguage: data.data.translations[0].detectedSourceLanguage || from,
        targetLanguage: to
      });

    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
