import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, profileService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({
      id: Date.now(),
      message,
      type,
    });

    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("eligify_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await profileService.getProfile();
        setUser(profile);
      } catch (err) {
        localStorage.removeItem("eligify_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);

    try {
      const response = await authService.login(credentials);

      setUser(response.user);

      showToast("Login successful!", "success");

      return response.user;
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
      const response = await authService.register(userData);

      setUser(response.user);

      showToast("Registration successful!", "success");

      return response.user;
    } catch (err) {
      showToast(err.message || "Registration failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
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
        loading,
        isAuthenticated: !!user,
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
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};