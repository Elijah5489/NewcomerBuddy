import { 
  type User, type InsertUser,
  type Translation, type InsertTranslation,
  type DictionaryEntry, type InsertDictionaryEntry,
  type HistoricalEvent, type InsertHistoricalEvent,
  type LearningModule, type InsertLearningModule,
  type CommunityResource, type InsertCommunityResource,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProgress(userId: string, progress: number, completedLessons: string[]): Promise<void>;

  // Translation methods
  saveTranslation(translation: InsertTranslation): Promise<Translation>;
  getUserTranslations(userId?: string): Promise<Translation[]>;
  toggleFavoriteTranslation(id: string): Promise<void>;

  // Dictionary methods
  searchDictionary(query: string): Promise<DictionaryEntry[]>;
  getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined>;
  getAllDictionaryEntries(): Promise<DictionaryEntry[]>;

  // Historical events methods
  getHistoricalEvents(): Promise<HistoricalEvent[]>;
  getHistoricalEventsByYear(year: number): Promise<HistoricalEvent[]>;

  // Learning modules methods
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: string): Promise<LearningModule | undefined>;

  // Community resources methods
  getCommunityResources(type?: string): Promise<CommunityResource[]>;
  getUpcomingEvents(): Promise<CommunityResource[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private translations: Map<string, Translation>;
  private dictionaryEntries: Map<string, DictionaryEntry>;
  private historicalEvents: Map<string, HistoricalEvent>;
  private learningModules: Map<string, LearningModule>;
  private communityResources: Map<string, CommunityResource>;

  constructor() {
    this.users = new Map();
    this.translations = new Map();
    this.dictionaryEntries = new Map();
    this.historicalEvents = new Map();
    this.learningModules = new Map();
    this.communityResources = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed historical events with verified data from web search
    const historicalEventsData = [
      {
        year: 1891,
        title: "First Ukrainian Family",
        description: "The first Ukrainian family arrived in Manitoba in 1891, settling on a farm near Gretna, where many Mennonites who spoke Ukrainian already lived.",
        category: "Pioneer Settlement",
        importance: 5
      },
      {
        year: 1892,
        title: "Nebyliv Families Settle",
        description: "The nucleus of Winnipeg's Ukrainian community consisted of ten families from the village of Nebyliv, Kalush county, Galicia, who arrived in 1892–3.",
        category: "Pioneer Settlement", 
        importance: 4
      },
      {
        year: 1896,
        title: "Cyril Genik Arrives",
        description: "Cyril Genik, leading a group of families, arrived in Winnipeg in fall 1896. This group was the spearhead of mass Ukrainian immigration to Canada. Genik became the first Ukrainian-Canadian in federal civil service.",
        category: "Mass Immigration",
        importance: 5
      },
      {
        year: 1897,
        title: "First Orthodox Church",
        description: "A group of settlers from Bukovyna established homes in Gardenton, Manitoba. St. Michael's Ukrainian Orthodox Church, Canada's first permanent Ukrainian Orthodox Church, was consecrated there in 1899.",
        category: "Religious",
        importance: 4
      },
      {
        year: 1914,
        title: "Internment Operations Begin",
        description: "About 5,000 Ukrainian men, women and children were interned at government camps, including Fort Osborne Barracks in Winnipeg and the Brandon internment camp.",
        category: "Dark Chapter",
        importance: 5
      },
      {
        year: 1915,
        title: "Taras Ferley - First MLA",
        description: "Taras Ferley became the first Ukrainian-Canadian Member of Legislative Assembly in the Gimli electoral district (Independent, 1915).",
        category: "Political Representation",
        importance: 4
      },
      {
        year: 1950,
        title: "Nicholas Bachynsky as Speaker",
        description: "In 1950 Nicholas Bachynsky became the speaker of the assembly.",
        category: "Political Representation",
        importance: 3
      },
      {
        year: 1955,
        title: "First Cabinet Minister",
        description: "In 1955 Michael Hryhorczuk was appointed the first Manitoba cabinet minister of Ukrainian origin.",
        category: "Political Representation",
        importance: 4
      }
    ];

    historicalEventsData.forEach(event => {
      const id = randomUUID();
      this.historicalEvents.set(id, { id, ...event });
    });

    // Seed learning modules
    const learningModulesData = [
      {
        title: "Daily Conversations",
        description: "Shopping, asking for directions, basic interactions",
        difficulty: "Beginner",
        estimatedTime: 15,
        hasAudio: true,
        hasVoicePractice: true,
        hasCertificate: false,
        content: {
          lessons: [
            { id: 1, title: "Greetings", completed: true },
            { id: 2, title: "Shopping", completed: true },
            { id: 3, title: "Directions", completed: false }
          ]
        },
        orderIndex: 1
      },
      {
        title: "Workplace English",
        description: "Professional communication, job interviews, email writing",
        difficulty: "Intermediate",
        estimatedTime: 20,
        hasAudio: true,
        hasVoicePractice: false,
        hasCertificate: true,
        content: {
          lessons: [
            { id: 1, title: "Job Interviews", completed: true },
            { id: 2, title: "Email Writing", completed: false },
            { id: 3, title: "Meeting Language", completed: false }
          ]
        },
        orderIndex: 2
      },
      {
        title: "Canadian Culture & Customs",
        description: "Understanding Canadian social norms, holidays, expressions",
        difficulty: "Intermediate",
        estimatedTime: 25,
        hasAudio: true,
        hasVoicePractice: false,
        hasCertificate: false,
        content: {
          lessons: [
            { id: 1, title: "Canadian Holidays", completed: false },
            { id: 2, title: "Social Customs", completed: false },
            { id: 3, title: "Expressions", completed: false }
          ]
        },
        orderIndex: 3
      }
    ];

    learningModulesData.forEach(module => {
      const id = randomUUID();
      this.learningModules.set(id, { id, ...module });
    });

    // Seed community resources with verified data
    const communityResourcesData = [
      {
        name: "Oseredok Ukrainian Cultural Centre",
        type: "cultural_center",
        address: "184 Alexander Avenue East, Winnipeg",
        phone: "(204) 942-0218",
        website: "https://oseredok.ca",
        description: "Museum • Archives • Library • Gallery - largest Ukrainian cultural institution of its kind in Canada",
        isActive: true
      },
      {
        name: "Ukrainian Museum of Canada - Manitoba Branch",
        type: "cultural_center", 
        address: "Holy Trinity Ukrainian Orthodox Metropolitan Cathedral (ground floor)",
        phone: "(204) 942-0176",
        website: "https://umcmb.ca",
        description: "Ukrainian folk arts collection, traditional dress from various regions, library, gift shop",
        isActive: true
      },
      {
        name: "Canada's National Ukrainian Festival",
        type: "event",
        address: "Selo Ukraina, 10 km south of Dauphin, MB",
        description: "60th Anniversary celebration with grandstand performances, Ukrainian talent from around the world, cultural displays, food, dance, music, arts & crafts",
        eventDate: new Date("2025-08-01"),
        isActive: true
      },
      {
        name: "Ukrainian Independence Day Celebration",
        type: "event",
        address: "ACCESS Centre, West St. Paul, MB",
        description: "Community celebration with free admission, family event",
        eventDate: new Date("2025-08-24"),
        isActive: true
      },
      {
        name: "Ukrainian Canadian Congress - Manitoba",
        type: "service",
        address: "203-952 Main Street, Winnipeg, MB R2W 3P4",
        phone: "(204) 943-1515",
        website: "https://uccmanitoba.ca",
        description: "Coordinates Ukrainian-Canadian community activities, immigration assistance, cultural events",
        isActive: true
      }
    ];

    communityResourcesData.forEach(resource => {
      const id = randomUUID();
      this.communityResources.set(id, { 
        id, 
        ...resource,
        eventDate: resource.eventDate || null
      });
    });

    // Seed dictionary with common Ukrainian-English translations
    const dictionaryData = [
      {
        ukrainianWord: "Привіт",
        englishTranslation: "Hello",
        pronunciation: "pry-VEET",
        partOfSpeech: "interjection",
        examples: [
          { ukrainian: "Привіт! Як справи?", english: "Hello! How are you?" }
        ],
        category: "greetings"
      },
      {
        ukrainianWord: "Дякую",
        englishTranslation: "Thank you",
        pronunciation: "DYA-ku-yu",
        partOfSpeech: "interjection", 
        examples: [
          { ukrainian: "Дякую за допомогу.", english: "Thank you for the help." }
        ],
        category: "greetings"
      },
      {
        ukrainianWord: "Будь ласка",
        englishTranslation: "Please",
        pronunciation: "bood LAS-ka",
        partOfSpeech: "interjection",
        examples: [
          { ukrainian: "Можете допомогти, будь ласка?", english: "Can you help, please?" }
        ],
        category: "greetings"
      },
      {
        ukrainianWord: "Вибачте",
        englishTranslation: "Excuse me / Sorry",
        pronunciation: "vy-BACH-te",
        partOfSpeech: "interjection",
        examples: [
          { ukrainian: "Вибачте, де магазин?", english: "Excuse me, where is the store?" }
        ],
        category: "greetings"
      },
      {
        ukrainianWord: "Робота",
        englishTranslation: "Work / Job",
        pronunciation: "ro-BO-ta",
        partOfSpeech: "noun",
        examples: [
          { ukrainian: "Я шукаю роботу.", english: "I am looking for work." }
        ],
        category: "employment"
      }
    ];

    dictionaryData.forEach(entry => {
      const id = randomUUID();
      this.dictionaryEntries.set(id, { id, ...entry });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      learningProgress: 0,
      completedLessons: [],
      favoriteTranslations: [],
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProgress(userId: string, progress: number, completedLessons: string[]): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.learningProgress = progress;
      user.completedLessons = completedLessons;
      this.users.set(userId, user);
    }
  }

  async saveTranslation(translation: InsertTranslation): Promise<Translation> {
    const id = randomUUID();
    const newTranslation: Translation = {
      ...translation,
      id,
      userId: translation.userId || null,
      isFavorite: translation.isFavorite || false,
      createdAt: new Date()
    };
    this.translations.set(id, newTranslation);
    return newTranslation;
  }

  async getUserTranslations(userId?: string): Promise<Translation[]> {
    if (!userId) {
      return Array.from(this.translations.values()).slice(0, 10);
    }
    return Array.from(this.translations.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async toggleFavoriteTranslation(id: string): Promise<void> {
    const translation = this.translations.get(id);
    if (translation) {
      translation.isFavorite = !translation.isFavorite;
      this.translations.set(id, translation);
    }
  }

  async searchDictionary(query: string): Promise<DictionaryEntry[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.dictionaryEntries.values())
      .filter(entry => 
        entry.ukrainianWord.toLowerCase().includes(lowercaseQuery) ||
        entry.englishTranslation.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 50);
  }

  async getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined> {
    return this.dictionaryEntries.get(id);
  }

  async getAllDictionaryEntries(): Promise<DictionaryEntry[]> {
    return Array.from(this.dictionaryEntries.values());
  }

  async getHistoricalEvents(): Promise<HistoricalEvent[]> {
    return Array.from(this.historicalEvents.values())
      .sort((a, b) => a.year - b.year);
  }

  async getHistoricalEventsByYear(year: number): Promise<HistoricalEvent[]> {
    return Array.from(this.historicalEvents.values())
      .filter(event => event.year === year);
  }

  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values())
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }

  async getLearningModule(id: string): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }

  async getCommunityResources(type?: string): Promise<CommunityResource[]> {
    let resources = Array.from(this.communityResources.values())
      .filter(resource => resource.isActive);
    
    if (type) {
      resources = resources.filter(resource => resource.type === type);
    }
    
    return resources;
  }

  async getUpcomingEvents(): Promise<CommunityResource[]> {
    const now = new Date();
    return Array.from(this.communityResources.values())
      .filter(resource => 
        resource.type === 'event' && 
        resource.isActive &&
        resource.eventDate &&
        resource.eventDate > now
      )
      .sort((a, b) => {
        if (!a.eventDate || !b.eventDate) return 0;
        return a.eventDate.getTime() - b.eventDate.getTime();
      });
  }
}

export const storage = new MemStorage();
