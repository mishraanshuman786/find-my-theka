import axios from "axios";

// API Base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

console.log("========================================");
console.log("🚀 API CONFIG");
console.log("Base URL:", API_BASE_URL);
console.log("========================================");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  (config) => {
    const token = global.authToken;

    console.log("\n========================================");
    console.log("📤 API REQUEST");
    console.log("Method:", config.method?.toUpperCase());
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Params:", config.params || "None");
    console.log("Body:", config.data || "None");
    console.log("Has Auth Token:", !!token);
    console.log("========================================");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("\n❌ REQUEST INTERCEPTOR ERROR");
    console.error(error);

    return Promise.reject(error);
  },
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
  (response) => {
    console.log("\n========================================");
    console.log("📥 API SUCCESS");
    console.log("Status:", response.status);
    console.log("URL:", `${response.config.baseURL}${response.config.url}`);
    console.log("Response:", response.data);
    console.log("========================================\n");

    return response;
  },

  (error) => {
    console.error("\n========================================");
    console.error("❌ API ERROR");

    // Server responded with an error
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("URL:", `${error.config?.baseURL}${error.config?.url}`);
      console.error("Response:", error.response.data);
      console.error("Headers:", error.response.headers);

      if (error.response.status === 401) {
        console.error("🔐 401 Unauthorized - Clearing auth token");

        global.authToken = null;
      }
    }

    // Request was sent but server did not respond
    else if (error.request) {
      console.error("🌐 NO RESPONSE FROM SERVER");
      console.error("Request:", error.request);
      console.error(
        "Possible causes: server down, network issue, wrong IP/port, firewall, etc.",
      );
    }

    // Something went wrong while creating the request
    else {
      console.error("⚠️ REQUEST SETUP ERROR");
      console.error("Message:", error.message);
    }

    console.error("Full Error:", error);
    console.error("========================================\n");

    return Promise.reject(error);
  },
);

// ========================================
// AUTH API
// ========================================

export const authAPI = {
  register: async (data) => {
    console.log("\n");
    console.log("🟢 ================================");
    console.log("🟢 REGISTER STARTED");
    console.log("🟢 Data:", data);
    console.log("🟢 ================================");

    try {
      const response = await api.post("/auth/register", data);

      console.log("\n");
      console.log("✅ ================================");
      console.log("✅ REGISTER SUCCESS");
      console.log("✅ Status:", response.status);
      console.log("✅ Response:", response.data);
      console.log("✅ ================================\n");

      return response;
    } catch (error) {
      console.error("\n");
      console.error("🔴 ================================");
      console.error("🔴 REGISTER FAILED");

      if (error.response) {
        console.error("🔴 Status:", error.response.status);
        console.error("🔴 Server Response:", error.response.data);
      } else if (error.request) {
        console.error("🔴 Server did not respond");
      } else {
        console.error("🔴 Error:", error.message);
      }

      console.error("🔴 ================================\n");

      throw error;
    }
  },

  login: async (data) => {
    console.log("\n");
    console.log("🔵 ================================");
    console.log("🔵 LOGIN STARTED");
    console.log("🔵 Data:", data);
    console.log("🔵 ================================");

    try {
      const response = await api.post("/auth/login", data);

      console.log("\n");
      console.log("✅ ================================");
      console.log("✅ LOGIN SUCCESS");
      console.log("✅ Status:", response.status);
      console.log("✅ Response:", response.data);
      console.log("✅ ================================\n");

      return response;
    } catch (error) {
      console.error("\n");
      console.error("🔴 ================================");
      console.error("🔴 LOGIN FAILED");

      if (error.response) {
        console.error("🔴 Status:", error.response.status);
        console.error("🔴 Server Response:", error.response.data);
      } else if (error.request) {
        console.error("🔴 Server did not respond");
      } else {
        console.error("🔴 Error:", error.message);
      }

      console.error("🔴 ================================\n");

      throw error;
    }
  },

  // Firebase Google / Phone authentication
  firebaseLogin: async (idToken) => {
    console.log("\n");
    console.log("🔥 ================================");
    console.log("🔥 FIREBASE LOGIN STARTED");
    console.log("🔥 ================================");

    try {
      const response = await api.post("/auth/firebase", {
        idToken,
      });

      console.log("\n");
      console.log("✅ ================================");
      console.log("✅ FIREBASE LOGIN SUCCESS");
      console.log("✅ Status:", response.status);
      console.log("✅ User:", response.data?.data?.user);
      console.log("✅ ================================\n");

      return response;
    } catch (error) {
      console.error("\n");
      console.error("🔴 ================================");
      console.error("🔴 FIREBASE LOGIN FAILED");

      if (error.response) {
        console.error("🔴 Status:", error.response.status);
        console.error("🔴 Server Response:", error.response.data);
      } else if (error.request) {
        console.error("🔴 Server did not respond");
      } else {
        console.error("🔴 Error:", error.message);
      }

      console.error("🔴 ================================\n");

      throw error;
    }
  },

  getProfile: async () => {
    console.log("👤 GET PROFILE");

    return api.get("/auth/profile");
  },

  forgotPassword: async (email) => {
    console.log("forgot password:");
    console.log("Email:", email);

    return api.post("/auth/forgot-password", {
      email,
    });
  },
  resetPassword: async (data) => {
    console.log("🔑 RESET PASSWORD");
    console.log("Email:", data.email);
    console.log("OTP:", data.otp);
    console.log("New Password:", data.newPassword);

    return api.post("/auth/reset-password", {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    });
  },
};

// ========================================
// PLACES API
// ========================================

export const placesAPI = {
  getNearby: async (params = {}) => {
    console.log("GET NEARBY PLACES");
    console.log("Params:", params);

    return api.get("/places/nearby", { params });
  },

  search: async (data) => {
    console.log("SEARCH PLACES");
    console.log("Data:", data);

    return api.post("/places/search", data);
  },

  getHistory: async () => {
    console.log("📜 GET HISTORY");

    return api.get("/places/history");
  },
};

// ========================================
// THEKAS API
// ========================================


export const thekasAPI = {

  
  // Get combined nearby thekas from our database and Google Places
  getNearbyCombined: async (params = {}) => {
    console.log("GET COMBINED NEARBY THEKAS");
    console.log("Params:", params);

    return api.get("/thekas/nearby/combined", {
      params: {
        radius: 5000,
        limit: 20,
        ...params,
      },
    });
  },

  // Register a new Theka
  createTheka: async (data, config = {}) => {
    console.log("REGISTER THEKA");
    console.log("Data:", data);

    return api.post("/thekas/", data, config);
  },

  // Get all Thekas belonging to the logged-in user
  getMyThekas: async () => {
    console.log("🏪 GET MY THEKAS");

    return api.get("/thekas");
  },

  // Get details of a specific Theka
  getDetails: async (id) => {
    console.log("🏪 GET THEKA DETAILS");
    console.log("Theka ID:", id);

    return api.get(`/thekas/${id}`);
  },
};



// gst validation api
export const gstAPI = {
  verifyGstin: (gstin) =>
    api.post("/gst/verify", {
      gstin: gstin.trim().toUpperCase(),
    }),
};

// payment api
export const paymentAPI = {
  verifyCheckoutPayment: async (payload) => {
    return api.post("/payments/verify", payload);
  },
};



/**
 * ADMIN API
 * All requests use the existing Axios instance and JWT interceptor.
 *
 * Assumes the backend router is mounted at /api/v1/admin.
 */
export const adminAPI = {
  getStats: () => api.get("/admin/dashboard/stats"),

  getThekas: (params = {}) =>
    api.get("/admin/thekas", {
      params: {
        page: 1,
        limit: 20,
        ...params,
      },
    }),

  getThekaById: (id) =>
    api.get(`/admin/thekas/${id}`),

  approveTheka: (id) =>
    api.patch(`/admin/thekas/${id}/approve`),

  rejectTheka: (id, data = {}) =>
    api.patch(`/admin/thekas/${id}/reject`, data),

  deleteExpiredTheka: (id) =>
    api.delete(`/admin/thekas/${id}`),

  getUsers: (params = {}) =>
    api.get("/admin/users", {
      params: {
        page: 1,
        limit: 20,
        ...params,
      },
    }),

  getUserById: (id) =>
    api.get(`/admin/users/${id}`),
};


// ========================================
// HEALTH CHECK
// ========================================

export const healthCheck = async () => {
  console.log("HEALTH CHECK");

  try {
    const response = await api.get("/health");

    console.log("HEALTH CHECK SUCCESS");
    console.log("Response:", response.data);

    return response;
  } catch (error) {
    console.error("❌ HEALTH CHECK FAILED");

    throw error;
  }
};

export default api;
