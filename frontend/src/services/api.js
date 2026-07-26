import axios from "axios";

// =========================
// Axios Instance
// =========================

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eligify_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// Authentication
// =========================

export const authService = {
  async login(credentials) {
    const response = await api.post("/auth/login/json", credentials);

    const token = response.data.access_token;

    localStorage.setItem("eligify_token", token);

    const profile = await api.get("/profile");

    return {
      token,
      user: profile.data,
    };
  },

  async register(userData) {
    await api.post("/auth/register", userData);

    return this.login({
      email: userData.email,
      password: userData.password,
    });
  },

  async logout() {
    localStorage.removeItem("eligify_token");
  },

  async getCurrentUser() {
    const response = await api.get("/profile");
    return response.data;
  },
};

// =========================
// Profile
// =========================

export const profileService = {
  async getProfile() {
    const response = await api.get("/profile");
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put("/profile", profileData);
    return response.data;
  },
};

// =========================
// AI Eligibility
// =========================

export const schemeService = {
  async checkEligibility() {
    const response = await api.post("/eligibility");
    return response.data;
  },

  // Temporary until schemes API is added
  async getSchemes() {
  const response = await api.get("/schemes");
  return response.data;
},

  async getSchemeById(id) {
  const response = await api.get(`/schemes/${id}`);
  return response.data;
},
};

// =========================
// OCR / Documents
// =========================

export const ocrService = {
  async uploadDocument(file, documentType = "Aadhaar") {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("document_type", documentType);

    const response = await api.post("/upload-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async getDocuments() {
    const response = await api.get("/documents");
    return response.data;
  },
};

// =========================
// Dashboard Activity
// =========================

export const activityService = {
  async getRecentActivities() {
    return [];
  },
};

export default api;