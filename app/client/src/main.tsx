import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import { Toaster } from "react-hot-toast";

// Add global axios interceptor to normalize API responses
axios.interceptors.response.use(
  (response) => {
    // For endpoints that should return arrays, normalize to empty array if response is invalid
    const url = response.config.url || "";

    // Handle events endpoints
    if (
      url.includes("/api/events") &&
      !url.includes("/api/events/") &&
      !Array.isArray(response.data)
    ) {
      console.warn(
        "Expected array response from events endpoint but got:",
        response.data
      );
      return { ...response, data: [] };
    }

    // Handle single event endpoint
    if (url.includes("/api/events/") && typeof response.data !== "object") {
      console.warn(
        "Expected object response from event detail endpoint but got:",
        response.data
      );
      return { ...response, data: { attendees: [] } };
    }

    return response;
  },
  (error) => {
    // Handle error responses, ensuring we don't crash when trying to use data
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
