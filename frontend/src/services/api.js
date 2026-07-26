// Mock API Service Layer for Eligify Frontend

import {
  MOCK_USER_PROFILE,
  MOCK_SCHEMES,
  MOCK_OCR_RESULT,
  MOCK_RECENT_ACTIVITIES,
} from "../mock/mockData";

// Helper to simulate asynchronous network latency
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(credentials) {
    await delay(400);
    if (!credentials.email || !credentials.password) {
      throw new Error("Please provide email and password.");
    }
    return {
      token: "mock_jwt_token_eligify_12345",
      user: MOCK_USER_PROFILE,
    };
  },

  async register(userData) {
    await delay(500);
    return {
      token: "mock_jwt_token_eligify_67890",
      user: { ...MOCK_USER_PROFILE, ...userData },
    };
  },

  async getCurrentUser() {
    await delay(200);
    return MOCK_USER_PROFILE;
  },
};

export const profileService = {
  async getProfile() {
    await delay(300);
    const stored = localStorage.getItem("eligify_user_profile");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback to mock profile
      }
    }
    return MOCK_USER_PROFILE;
  },

  async updateProfile(profileData) {
    await delay(400);
    const current = await this.getProfile();
    const updated = { ...current, ...profileData };
    localStorage.setItem("eligify_user_profile", JSON.stringify(updated));
    return updated;
  },
};

export const schemeService = {
  async getSchemes(filters = {}) {
    await delay(350);
    let result = [...MOCK_SCHEMES];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.scheme_name.toLowerCase().includes(q) ||
          s.ministry.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    if (filters.state && filters.state !== "All") {
      result = result.filter(
        (s) => s.state === filters.state || s.state === "All"
      );
    }

    if (filters.category && filters.category !== "All") {
      result = result.filter(
        (s) => s.category === filters.category || s.category === "All"
      );
    }

    if (filters.occupation && filters.occupation !== "All") {
      result = result.filter(
        (s) => s.occupation === filters.occupation || s.occupation === "All"
      );
    }

    return result;
  },

  async getSchemeById(id) {
    await delay(250);
    const scheme = MOCK_SCHEMES.find((s) => s.scheme_id === id);
    if (!scheme) {
      throw new Error(`Scheme with ID '${id}' not found.`);
    }
    return scheme;
  },

  async checkEligibility(profileData = null) {
    await delay(600);
    const profile = profileData || (await profileService.getProfile());
    
    // Filter eligible schemes based on profile logic
    const eligibleSchemes = MOCK_SCHEMES.filter((s) => s.eligible);

    return {
      overall_score: 92,
      total_matched: eligibleSchemes.length,
      recommendations: eligibleSchemes,
      evaluated_profile: profile,
    };
  },
};

export const ocrService = {
  async uploadDocument(file, documentType = "Aadhaar Card") {
    await delay(800); // Simulate OCR model processing time
    if (!file) {
      throw new Error("No file uploaded.");
    }
    return {
      ...MOCK_OCR_RESULT,
      document_type: documentType,
      file_name: file.name,
      uploaded_at: new Date().toISOString(),
    };
  },
};

export const activityService = {
  async getRecentActivities() {
    await delay(200);
    return MOCK_RECENT_ACTIVITIES;
  },
};
