import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// AXIOS INTERCEPTOR
// Automatically adds JWT token to every request
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ============================================================
// TRIP APIs
// ============================================================

export const tripAPI = {

  create: (data) =>
    api.post("/api/trips", data),

  getAll: () =>
    api.get("/api/trips"),

  getById: (id) =>
    api.get(`/api/trips/${id}`),

  update: (id, data) =>
    api.put(`/api/trips/${id}`, data),

  delete: (id) =>
    api.delete(`/api/trips/${id}`),

  updateStatus: (id, status) =>
    api.patch(
      `/api/trips/${id}/status?status=${status}`
    ),
};


// ============================================================
// ITINERARY APIs
// ============================================================

export const itineraryAPI = {

  generate: (tripId) =>
    api.post(
      `/api/trips/${tripId}/itineraries/generate`
    ),

  getByTrip: (tripId) =>
    api.get(
      `/api/trips/${tripId}/itineraries`
    ),

  update: (id, data) =>
    api.put(
      `/api/itineraries/${id}`,
      data
    ),

  delete: (id) =>
    api.delete(
      `/api/itineraries/${id}`
    ),
};


// ============================================================
// ACTIVITY APIs
// ============================================================

export const activityAPI = {

  create: (itineraryId, data) =>
    api.post(
      `/api/itineraries/${itineraryId}/activities`,
      data
    ),

  getByItinerary: (itineraryId) =>
    api.get(
      `/api/itineraries/${itineraryId}/activities`
    ),

  update: (id, data) =>
    api.put(
      `/api/activities/${id}`,
      data
    ),

  delete: (id) =>
    api.delete(
      `/api/activities/${id}`
    ),
};


// ============================================================
// DESTINATION APIs
// ============================================================

export const destinationAPI = {

  getAll: () =>
    api.get("/api/destinations"),

  getById: (id) =>
    api.get(`/api/destinations/${id}`),

  getPopular: () =>
    api.get("/api/destinations/popular"),

  search: (query) =>
    api.get(
      `/api/destinations/search?query=${query}`
    ),
};


// ============================================================
// MILESTONE 3 - BUDGET APIs
// ============================================================

export const budgetAPI = {

  get: (tripId) =>
    api.get(
      `/api/trips/${tripId}/budget`
    ),

  create: (tripId, data) =>
    api.post(
      `/api/trips/${tripId}/budget`,
      data
    ),

  update: (tripId, data) =>
    api.put(
      `/api/trips/${tripId}/budget`,
      data
    ),

  summary: (tripId) =>
    api.get(
      `/api/trips/${tripId}/budget/summary`
    ),

  delete: (tripId) =>
    api.delete(
      `/api/trips/${tripId}/budget`
    ),
};


// ============================================================
// MILESTONE 3 - EXPENSE APIs
// ============================================================

export const expenseAPI = {

  getAll: (tripId) =>
    api.get(
      `/api/trips/${tripId}/expenses`
    ),

  getSummary: (tripId) =>
    api.get(
      `/api/trips/${tripId}/expenses/summary`
    ),

  getByCategory: (tripId, category) =>
    api.get(
      `/api/trips/${tripId}/expenses/category`,
      {
        params: {
          cat: category,
        },
      }
    ),

  getSettlement: (tripId) =>
    api.get(
      `/api/trips/${tripId}/settlement`
    ),

  create: (tripId, data) =>
    api.post(
      `/api/trips/${tripId}/expenses`,
      data
    ),

  update: (id, data) =>
    api.put(
      `/api/expenses/${id}`,
      data
    ),

  delete: (id) =>
    api.delete(
      `/api/expenses/${id}`
    ),
};


// ============================================================
// GROUP APIs
// ============================================================

export const groupAPI = {

  getAll: () =>
    api.get("/api/groups"),

  getByTrip: (tripId) =>
    api.get(
      `/api/groups/trip/${tripId}`
    ),

  getById: (id) =>
    api.get(
      `/api/groups/${id}`
    ),

  create: (data) =>
    api.post(
      "/api/groups",
      data
    ),

  invite: (id, email) =>
    api.post(
      `/api/groups/${id}/invite`,
      {
        email,
      }
    ),

  accept: (id) =>
    api.patch(
      `/api/groups/${id}/accept`
    ),

  decline: (id) =>
    api.patch(
      `/api/groups/${id}/decline`
    ),

  removeMember: (groupId, memberId) =>
    api.delete(
      `/api/groups/${groupId}/members/${memberId}`
    ),

  delete: (id) =>
    api.delete(
      `/api/groups/${id}`
    ),
};


// ============================================================
// NOTIFICATION APIs
// ============================================================

export const notificationAPI = {

  getAll: () =>
    api.get(
      "/api/notifications"
    ),

  getUnread: () =>
    api.get(
      "/api/notifications/unread"
    ),

  getCount: () =>
    api.get(
      "/api/notifications/count"
    ),

  markRead: (id) =>
    api.patch(
      `/api/notifications/${id}/read`
    ),

  markAllRead: () =>
    api.patch(
      "/api/notifications/read-all"
    ),

  delete: (id) =>
    api.delete(
      `/api/notifications/${id}`
    ),
};


// ============================================================
// ITINERARY FILE / DOCUMENT APIs
// ============================================================

export const itineraryFileAPI = {

  // ----------------------------------------------------------
  // Upload a file
  // POST /api/itinerary-files/upload/{itineraryId}
  // ----------------------------------------------------------

  upload: (itineraryId, formData) =>
    api.post(
      `/api/itinerary-files/upload/${itineraryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),


  // ----------------------------------------------------------
  // Get all documents for one itinerary
  // GET /api/itinerary-files/itinerary/{itineraryId}
  // ----------------------------------------------------------

  getByItinerary: (itineraryId) =>
    api.get(
      `/api/itinerary-files/itinerary/${itineraryId}`
    ),


  // ----------------------------------------------------------
  // Get document by ID
  // GET /api/itinerary-files/{id}
  // ----------------------------------------------------------

  getById: (id) =>
    api.get(
      `/api/itinerary-files/${id}`
    ),


  // ----------------------------------------------------------
  // Get all uploaded documents
  // GET /api/itinerary-files
  // ----------------------------------------------------------

  getAll: () =>
    api.get(
      "/api/itinerary-files"
    ),


  // ----------------------------------------------------------
  // Delete document
  // DELETE /api/itinerary-files/{id}
  // ----------------------------------------------------------

  delete: (id) =>
    api.delete(
      `/api/itinerary-files/${id}`
    ),
};


// ============================================================
// EXPORT DEFAULT AXIOS INSTANCE
// ============================================================

export default api;