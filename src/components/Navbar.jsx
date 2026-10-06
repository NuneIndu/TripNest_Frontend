import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef(null);

  /* =========================================================
     GET CURRENT USER
  ========================================================= */
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Unable to read stored user:", error);
      }
    }
  }, []);

  /* =========================================================
     GET TOKEN
  ========================================================= */
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt")
    );
  };

  /* =========================================================
     LOAD NOTIFICATIONS
  ========================================================= */
  const loadNotifications = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setLoadingNotifications(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (Array.isArray(data?.notifications)) {
        setNotifications(data.notifications);
      } else if (Array.isArray(data?.content)) {
        setNotifications(data.content);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      /*
       * Do not break the navbar if notification API
       * is temporarily unavailable.
       */
      console.error(
        "Failed to load notifications:",
        error.response?.data || error.message
      );
    } finally {
      setLoadingNotifications(false);
    }
  };

  /* =========================================================
     INITIAL LOAD + AUTO REFRESH
  ========================================================= */
  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     CLOSE POPUP WHEN CLICKING OUTSIDE
  ========================================================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================================================
     UNREAD COUNT
  ========================================================= */
  const unreadCount = notifications.filter(
    (notification) =>
      notification.read === false ||
      notification.isRead === false
  ).length;

  /* =========================================================
     MARK ONE NOTIFICATION AS READ
  ========================================================= */
  const markAsRead = async (notification) => {
    const token = getToken();

    if (!token || !notification?.id) {
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/notifications/${notification.id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
              ...item,
              read: true,
              isRead: true,
            }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data || error.message
      );

      /*
       * Even if the endpoint is unavailable,
       * update the popup locally.
       */
      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
              ...item,
              read: true,
              isRead: true,
            }
            : item
        )
      );
    }
  };

  /* =========================================================
     MARK ALL AS READ
  ========================================================= */
  const markAllAsRead = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(
        "Mark all as read API error:",
        error.response?.data || error.message
      );
    }

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
        isRead: true,
      }))
    );
  };

  /* =========================================================
     LOGOUT
  ========================================================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");

    navigate("/login");
  };

  /* =========================================================
     USER DISPLAY DATA
  ========================================================= */
  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.firstName ||
    "Traveler";

  const userEmail =
    user?.email ||
    user?.username ||
    "traveler@example.com";

  const userRole =
    user?.role ||
    user?.roles?.[0] ||
    "TRAVELER";

  const firstLetter = userName.charAt(0).toUpperCase();

  /* =========================================================
     FORMAT DATE
  ========================================================= */
  const formatNotificationDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     NOTIFICATION ICON
  ========================================================= */
  const getNotificationIcon = (type) => {
    switch (type) {
      case "TRIP_REMINDER":
        return "✈️";

      case "ACTIVITY_REMINDER":
        return "📅";

      case "BUDGET_ALERT":
        return "💰";

      case "GROUP_INVITATION":
        return "👥";

      case "TRAVEL_UPDATE":
        return "🌍";

      case "SYSTEM":
        return "⚙️";

      default:
        return "🔔";
    }
  };

  /* =========================================================
     NAV LINK STYLE
  ========================================================= */
  const navLinkClass = ({ isActive }) =>
    `tn-nav-link ${isActive ? "tn-nav-link-active" : ""}`;

  return (
    <>
      <style>{`
        .tn-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          height: 76px;
          background: #ffffff;
          border-bottom: 1px solid #e9edf5;
          box-shadow: 0 2px 10px rgba(20, 30, 60, 0.04);
        }

        .tn-navbar-inner {
          max-width: 1320px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .tn-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          min-width: 220px;
        }

        .tn-logo {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          box-shadow: 0 5px 14px rgba(37, 99, 235, 0.25);
        }

        .tn-brand-name {
          font-size: 22px;
          font-weight: 800;
          color: #172554;
          line-height: 1;
        }

        .tn-brand-subtitle {
          display: block;
          margin-top: 5px;
          font-size: 9px;
          letter-spacing: 2px;
          color: #94a3b8;
          font-weight: 600;
        }

        .tn-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px;
          border-radius: 18px;
          background: #f8fafc;
        }

        .tn-nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 16px;
          border-radius: 13px;
          color: #475569;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .tn-nav-link:hover {
          color: #2563eb;
          background: #eff6ff;
        }

        .tn-nav-link-active {
          color: #2563eb;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .tn-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .tn-notification-wrapper {
          position: relative;
        }

        .tn-notification-button {
          position: relative;
          width: 46px;
          height: 46px;
          border: none;
          background: transparent;
          border-radius: 14px;
          cursor: pointer;
          font-size: 24px;
          transition: 0.2s ease;
        }

        .tn-notification-button:hover {
          background: #f1f5f9;
        }

        .tn-notification-badge {
          position: absolute;
          top: 3px;
          right: 2px;
          min-width: 19px;
          height: 19px;
          padding: 0 5px;
          border-radius: 20px;
          background: #ef4444;
          color: white;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
        }

        .tn-notification-popup {
          position: absolute;
          top: 56px;
          right: -90px;
          width: 390px;
          max-height: 520px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
          overflow: hidden;
          animation: tnPopup 0.18s ease-out;
        }

        @keyframes tnPopup {
          from {
            opacity: 0;
            transform: translateY(-7px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tn-popup-header {
          padding: 17px 18px;
          border-bottom: 1px solid #eef2f7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tn-popup-title {
          font-size: 17px;
          font-weight: 800;
          color: #172033;
        }

        .tn-mark-all {
          border: none;
          background: transparent;
          color: #4f46e5;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .tn-mark-all:hover {
          text-decoration: underline;
        }

        .tn-notification-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .tn-notification-item {
          display: flex;
          gap: 12px;
          padding: 15px 17px;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .tn-notification-item:hover {
          background: #f8fafc;
        }

        .tn-notification-unread {
          background: #eff6ff;
        }

        .tn-notification-icon {
          width: 39px;
          height: 39px;
          min-width: 39px;
          border-radius: 12px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .tn-notification-content {
          flex: 1;
          min-width: 0;
        }

        .tn-notification-title {
          font-size: 13px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .tn-notification-message {
          font-size: 12px;
          line-height: 1.45;
          color: #64748b;
        }

        .tn-notification-date {
          margin-top: 5px;
          font-size: 10px;
          color: #94a3b8;
        }

        .tn-unread-dot {
          width: 8px;
          height: 8px;
          min-width: 8px;
          margin-top: 7px;
          border-radius: 50%;
          background: #2563eb;
        }

        .tn-empty-notifications {
          padding: 45px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .tn-empty-icon {
          font-size: 38px;
          margin-bottom: 10px;
        }

        .tn-empty-title {
          color: #334155;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .tn-popup-footer {
          border-top: 1px solid #eef2f7;
          padding: 12px;
          text-align: center;
        }

        .tn-view-all {
          color: #4f46e5;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .tn-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 5px;
        }

        .tn-avatar {
          width: 43px;
          height: 43px;
          border-radius: 13px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 17px;
        }

        .tn-user-info {
          min-width: 105px;
        }

        .tn-user-name {
          color: #172033;
          font-size: 13px;
          font-weight: 800;
        }

        .tn-user-email {
          color: #94a3b8;
          font-size: 11px;
          margin-top: 3px;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tn-role {
          padding: 6px 10px;
          border-radius: 20px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .tn-logout {
          border: 1px solid #e2e8f0;
          background: white;
          color: #334155;
          padding: 11px 16px;
          border-radius: 13px;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .tn-logout:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        @media (max-width: 1050px) {
          .tn-brand {
            min-width: auto;
          }

          .tn-user-info,
          .tn-role {
            display: none;
          }

          .tn-nav-link {
            padding: 10px 11px;
          }
        }

        @media (max-width: 800px) {
          .tn-brand-subtitle {
            display: none;
          }

          .tn-brand-name {
            display: none;
          }

          .tn-brand {
            min-width: auto;
          }

          .tn-nav-link span.nav-text {
            display: none;
          }

          .tn-notification-popup {
            right: -100px;
            width: min(390px, calc(100vw - 30px));
          }

          .tn-logout {
            font-size: 0;
            width: 44px;
            padding: 11px;
          }

          .tn-logout::before {
            content: "↪";
            font-size: 17px;
          }
        }

        @media (max-width: 550px) {
          .tn-navbar-inner {
            padding: 0 12px;
            gap: 8px;
          }

          .tn-nav {
            gap: 1px;
          }

          .tn-nav-link {
            padding: 9px;
          }

          .tn-right {
            gap: 4px;
          }
        }
      `}</style>

      <header className="tn-navbar">
        <div className="tn-navbar-inner">

          {/* =================================================
              LOGO
          ================================================= */}
          <Link to="/dashboard" className="tn-brand">
            <div className="tn-logo">✈️</div>

            <div>
              <div className="tn-brand-name">
                TripNest
              </div>

              <span className="tn-brand-subtitle">
                TRAVEL SMARTER
              </span>
            </div>
          </Link>

          {/* =================================================
              NAVIGATION
          ================================================= */}
          <nav className="tn-nav">

            <NavLink
              to="/dashboard"
              className={navLinkClass}
            >
              <span>⌂</span>
              <span className="nav-text">Dashboard</span>
            </NavLink>

            <NavLink
              to="/trips"
              className={navLinkClass}
            >
              <span>✈️</span>
              <span className="nav-text">Trips</span>
            </NavLink>

            <NavLink
              to="/bookings"
              className={navLinkClass}
            >
              <span>🎟️</span>
              <span className="nav-text">Bookings</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={navLinkClass}
            >
              <span>👤</span>
              <span className="nav-text">Profile</span>
            </NavLink>

          </nav>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}
          <div className="tn-right">

            {/* ===============================================
                NOTIFICATION BELL
            =============================================== */}
            <div
              className="tn-notification-wrapper"
              ref={notificationRef}
            >

              <button
                type="button"
                className="tn-notification-button"
                onClick={() =>
                  setShowNotifications((previous) => !previous)
                }
                aria-label="Notifications"
              >
                🔔

                {unreadCount > 0 && (
                  <span className="tn-notification-badge">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* =============================================
                  NOTIFICATION POPUP
              ============================================= */}
              {showNotifications && (
                <div className="tn-notification-popup">

                  <div className="tn-popup-header">

                    <div className="tn-popup-title">
                      Notifications
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="tn-mark-all"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}

                  </div>

                  <div className="tn-notification-list">

                    {loadingNotifications &&
                      notifications.length === 0 ? (
                      <div className="tn-empty-notifications">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (

                      <div className="tn-empty-notifications">
                        <div className="tn-empty-icon">
                          🔔
                        </div>

                        <div className="tn-empty-title">
                          No notifications
                        </div>

                        <div>
                          You're all caught up!
                        </div>
                      </div>

                    ) : (

                      notifications
                        .slice(0, 20)
                        .map((notification) => {

                          const isUnread =
                            notification.read === false ||
                            notification.isRead === false;

                          return (
                            <div
                              key={notification.id}
                              className={`tn-notification-item ${isUnread
                                  ? "tn-notification-unread"
                                  : ""
                                }`}
                              onClick={() =>
                                markAsRead(notification)
                              }
                            >

                              <div className="tn-notification-icon">
                                {getNotificationIcon(
                                  notification.type
                                )}
                              </div>

                              <div className="tn-notification-content">

                                <div className="tn-notification-title">
                                  {notification.title ||
                                    notification.type ||
                                    "Notification"}
                                </div>

                                <div className="tn-notification-message">
                                  {notification.message ||
                                    "You have a new notification."}
                                </div>

                                <div className="tn-notification-date">
                                  {formatNotificationDate(
                                    notification.createdAt ||
                                    notification.created_at
                                  )}
                                </div>

                              </div>

                              {isUnread && (
                                <div className="tn-unread-dot" />
                              )}

                            </div>
                          );
                        })

                    )}

                  </div>

                  <div className="tn-popup-footer">
                    <Link
                      to="/notifications"
                      className="tn-view-all"
                      onClick={() =>
                        setShowNotifications(false)
                      }
                    >
                      View all notifications →
                    </Link>
                  </div>

                </div>
              )}
            </div>

            {/* ===============================================
                USER
            =============================================== */}
            <div className="tn-user">

              <div className="tn-avatar">
                {firstLetter}
              </div>

              <div className="tn-user-info">
                <div className="tn-user-name">
                  {userName}
                </div>

                <div className="tn-user-email">
                  {userEmail}
                </div>
              </div>

              <div className="tn-role">
                {String(userRole).replace(
                  "ROLE_",
                  ""
                )}
              </div>

            </div>

            {/* ===============================================
                LOGOUT
            =============================================== */}
            <button
              type="button"
              className="tn-logout"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>

          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;