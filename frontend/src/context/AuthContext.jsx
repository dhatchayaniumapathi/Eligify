import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, profileService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("eligify_token");
        if (storedToken) {
          const profile = await profileService.getProfile();
          setUser(profile);
        } else {
          // Default guest demo user loaded for smooth hackathon testing
          const profile = await profileService.getProfile();
          setUser(profile);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("eligify_token", data.token);
      setUser(data.user);
      showToast("Successfully logged in!", "success");
      return data;
    } catch (err) {
      showToast(err.message || "Login failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      localStorage.setItem("eligify_token", data.token);
      setUser(data.user);
      showToast("Account created successfully!", "success");
      return data;
    } catch (err) {
      showToast(err.message || "Registration failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("eligify_token");
    setUser(null);
    showToast("Logged out successfully.", "info");
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updated = await profileService.updateProfile(profileData);
      setUser(updated);
      showToast("Profile updated successfully!", "success");
      return updated;
    } catch (err) {
      showToast(err.message || "Profile update failed", "error");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
