import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { tripAPI, itineraryAPI, activityAPI } from "../utils/api";

const activityTypes = [
  "SIGHTSEEING",
  "TRANSPORTATION",
  "ACCOMMODATION",
  "DINING",
  "ADVENTURE",
  "SHOPPING",
  "OTHER",
];

const typeEmoji = {
  SIGHTSEEING: "🏛️",
  TRANSPORTATION: "🚗",
  ACCOMMODATION: "🏨",
  DINING: "🍽️",
  ADVENTURE: "🏄",
  SHOPPING: "🛍️",
  OTHER: "📌",
};

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const [activityForm, setActivityForm] = useState({
    title: "",
    activityType: "SIGHTSEEING",
    startTime: "",
    endTime: "",
    location: "",
    notes: "",
    estimatedCost: "",
  });

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const [tripRes, itiRes] = await Promise.all([
        tripAPI.getById(id),
        itineraryAPI.getByTrip(id),
      ]);

      setTrip(tripRes.data);
      setItineraries(itiRes.data);

      if (itiRes.data.length > 0) {
        setActiveDay(itiRes.data[0].id);
        fetchActivities(itiRes.data[0].id);
      }
    } catch (error) {
      console.error("Failed to load trip details:", error);
      navigate("/trips");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (itineraryId) => {
    try {
      const res = await activityAPI.getByItinerary(itineraryId);

      setActivities((prev) => ({
        ...prev,
        [itineraryId]: res.data,
      }));
    } catch (error) {
      console.error("Failed to load activities:", error);

      setActivities((prev) => ({
        ...prev,
        [itineraryId]: [],
      }));
    }
  };

  const handleDayClick = (itineraryId) => {
    setActiveDay(itineraryId);
    setShowAddActivity(false);

    if (!activities[itineraryId]) {
      fetchActivities(itineraryId);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();

    if (!activeDay) {
      alert("Please select a day first.");
      return;
    }

    try {
      await activityAPI.create(activeDay, {
        ...activityForm,

        estimatedCost: activityForm.estimatedCost
          ? Number(activityForm.estimatedCost)
          : null,

        startTime: activityForm.startTime || null,
        endTime: activityForm.endTime || null,
      });

      setShowAddActivity(false);

      setActivityForm({
        title: "",
        activityType: "SIGHTSEEING",
        startTime: "",
        endTime: "",
        location: "",
        notes: "",
        estimatedCost: "",
      });

      fetchActivities(activeDay);
    } catch (error) {
      console.error("Activity add failed:", error);
      alert("Activity add nahi hui!");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Delete this activity?")) {
      return;
    }

    try {
      await activityAPI.delete(activityId);

      fetchActivities(activeDay);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400">
            Loading trip...
          </p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-gray-500">
            Trip not found.
          </p>

          <button
            onClick={() => navigate("/trips")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  const currentActivities = activities[activeDay] || [];

  const activeItinerary = itineraries.find(
    (i) => i.id === activeDay
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-8">

        {/* =====================================================
            BACK BUTTON
        ====================================================== */}

        <button
          onClick={() => navigate("/trips")}
          className="
            text-gray-400
            text-sm
            hover:text-gray-600
            flex
            items-center
            gap-1
            mb-6
          "
        >
          ← Back to trips
        </button>

        {/* =====================================================
            TRIP HEADER
        ====================================================== */}

        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-xl
            p-6
            mb-6
          "
        >

          <div className="flex justify-between items-start">

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {trip?.title}
              </h1>

              <p className="text-gray-500 mt-1">
                📍 {trip?.destination}
              </p>

            </div>

            <span
              className="
                text-xs
                bg-blue-100
                text-blue-700
                px-3
                py-1
                rounded-full
                font-medium
              "
            >
              {trip?.status}
            </span>

          </div>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              mt-5
              border-t
              border-gray-50
              pt-5
            "
          >

            <div>
              <p className="text-xs text-gray-400">
                Start Date
              </p>

              <p className="text-sm font-medium">
                {trip?.startDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                End Date
              </p>

              <p className="text-sm font-medium">
                {trip?.endDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Duration
              </p>

              <p className="text-sm font-medium">
                {trip?.totalDays} days
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Budget
              </p>

              <p className="text-sm font-medium text-green-600">
                {trip?.totalBudget
                  ? `₹${trip.totalBudget.toLocaleString()}`
                  : "Not set"}
              </p>
            </div>

          </div>

          {trip?.description && (
            <p
              className="
                text-sm
                text-gray-500
                mt-4
                border-t
                border-gray-50
                pt-4
              "
            >
              {trip.description}
            </p>
          )}

        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-5
            gap-3
            mt-6
            mb-6
          "
        >

          {/* BUDGET */}

          <button
            onClick={() =>
              navigate(`/trips/${trip.id}/budget`)
            }
            className="
              bg-white
              border
              border-emerald-200
              rounded-2xl
              p-4
              text-left
              hover:bg-emerald-50
              transition
            "
          >

            <div className="text-2xl">
              💰
            </div>

            <p className="font-bold text-slate-900 mt-2">
              Budget
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Manage trip budget
            </p>

          </button>

          {/* EXPENSES */}

          <button
            onClick={() =>
              navigate(`/trips/${trip.id}/expenses`)
            }
            className="
              bg-white
              border
              border-blue-200
              rounded-2xl
              p-4
              text-left
              hover:bg-blue-50
              transition
            "
          >

            <div className="text-2xl">
              💳
            </div>

            <p className="font-bold text-slate-900 mt-2">
              Expenses
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Track spending
            </p>

          </button>

          {/* DOCUMENTS */}

          <button
            onClick={() =>
              navigate(`/trips/${trip.id}/documents`)
            }
            className="
              bg-white
              border
              border-purple-200
              rounded-2xl
              p-4
              text-left
              hover:bg-purple-50
              transition
            "
          >

            <div className="text-2xl">
              📄
            </div>

            <p className="font-bold text-slate-900 mt-2">
              Documents
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Upload travel files
            </p>

          </button>

          {/* GROUPS */}

          <button
            onClick={() =>
              navigate("/groups")
            }
            className="
              bg-white
              border
              border-violet-200
              rounded-2xl
              p-4
              text-left
              hover:bg-violet-50
              transition
            "
          >

            <div className="text-2xl">
              👥
            </div>

            <p className="font-bold text-slate-900 mt-2">
              Groups
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Travel companions
            </p>

          </button>

          {/* NOTIFICATIONS */}

          <button
            onClick={() =>
              navigate("/notifications")
            }
            className="
              bg-white
              border
              border-amber-200
              rounded-2xl
              p-4
              text-left
              hover:bg-amber-50
              transition
            "
          >

            <div className="text-2xl">
              🔔
            </div>

            <p className="font-bold text-slate-900 mt-2">
              Notifications
            </p>

            <p className="text-xs text-slate-500 mt-1">
              View updates
            </p>

          </button>

        </div>

        {/* =====================================================
            ITINERARY SECTION
        ====================================================== */}

        <div className="flex gap-6">

          {/* ===================================================
              DAYS SIDEBAR
          ==================================================== */}

          <div className="w-48 shrink-0">

            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Days
            </h2>

            <div className="space-y-2">

              {itineraries.map((day) => (

                <button
                  key={day.id}
                  onClick={() =>
                    handleDayClick(day.id)
                  }
                  className={`
                    w-full
                    text-left
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    transition
                    border

                    ${activeDay === day.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-100 hover:border-blue-200"
                    }
                  `}
                >

                  <div className="font-medium">
                    Day {day.dayNumber}
                  </div>

                  <div
                    className={`
                      text-xs
                      mt-0.5

                      ${activeDay === day.id
                        ? "text-blue-200"
                        : "text-gray-400"
                      }
                    `}
                  >
                    {day.date}
                  </div>

                </button>

              ))}

            </div>

          </div>

          {/* ===================================================
              ACTIVITIES PANEL
          ==================================================== */}

          <div className="flex-1">

            <div
              className="
                flex
                justify-between
                items-center
                mb-4
              "
            >

              <div>

                <h2 className="text-sm font-semibold text-gray-700">
                  Day {activeItinerary?.dayNumber} Activities
                </h2>

                <p className="text-xs text-gray-400 mt-0.5">
                  {activeItinerary?.date}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowAddActivity(
                    !showAddActivity
                  )
                }
                disabled={!activeDay}
                className="
                  bg-blue-600
                  text-white
                  text-sm
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-blue-700
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                + Add Activity
              </button>

            </div>

            {/* =================================================
                ADD ACTIVITY FORM
            ================================================== */}

            {showAddActivity && (

              <form
                onSubmit={handleAddActivity}
                className="
                  bg-white
                  border
                  border-blue-100
                  rounded-xl
                  p-5
                  mb-4
                  space-y-3
                "
              >

                <h3 className="font-medium text-gray-800 text-sm">
                  New Activity
                </h3>

                {/* TITLE */}

                <input
                  type="text"
                  placeholder="Activity title *"
                  value={activityForm.title}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      title: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  required
                />

                {/* TYPE */}

                <select
                  value={activityForm.activityType}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      activityType: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                >

                  {activityTypes.map((t) => (

                    <option
                      key={t}
                      value={t}
                    >
                      {typeEmoji[t]} {t}
                    </option>

                  ))}

                </select>

                {/* TIME */}

                <div className="grid grid-cols-2 gap-3">

                  <input
                    type="time"
                    value={activityForm.startTime}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        startTime: e.target.value,
                      })
                    }
                    className="
                      border
                      border-gray-200
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <input
                    type="time"
                    value={activityForm.endTime}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        endTime: e.target.value,
                      })
                    }
                    className="
                      border
                      border-gray-200
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                {/* LOCATION */}

                <input
                  type="text"
                  placeholder="Location"
                  value={activityForm.location}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      location: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

                {/* COST */}

                <input
                  type="number"
                  placeholder="Estimated cost (₹)"
                  value={activityForm.estimatedCost}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      estimatedCost: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

                {/* NOTES */}

                <textarea
                  placeholder="Notes"
                  value={activityForm.notes}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      notes: e.target.value,
                    })
                  }
                  rows={2}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    resize-none
                  "
                />

                {/* FORM BUTTONS */}

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddActivity(false)
                    }
                    className="
                      flex-1
                      py-2
                      border
                      border-gray-200
                      rounded-lg
                      text-sm
                      text-gray-600
                      hover:bg-gray-50
                      transition
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      flex-1
                      py-2
                      bg-blue-600
                      text-white
                      rounded-lg
                      text-sm
                      font-medium
                      hover:bg-blue-700
                      transition
                    "
                  >
                    Add Activity
                  </button>

                </div>

              </form>

            )}

            {/* =================================================
                ACTIVITIES LIST
            ================================================== */}

            {currentActivities.length === 0 ? (

              <div
                className="
                  bg-white
                  border
                  border-gray-100
                  rounded-xl
                  p-10
                  text-center
                "
              >

                <div className="text-3xl mb-2">
                  📋
                </div>

                <p className="text-gray-400 text-sm">
                  Koi activity nahi — upar se add karo!
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {currentActivities.map((activity) => (

                  <div
                    key={activity.id}
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-xl
                      p-4
                      hover:border-blue-100
                      transition
                    "
                  >

                    {/* ACTIVITY HEADER */}

                    <div
                      className="
                        flex
                        justify-between
                        items-start
                      "
                    >

                      <div className="flex gap-3">

                        <span className="text-2xl">
                          {typeEmoji[
                            activity.activityType
                          ]}
                        </span>

                        <div>

                          <h4
                            className="
                              font-medium
                              text-gray-800
                              text-sm
                            "
                          >
                            {activity.title}
                          </h4>

                          <span
                            className="
                              text-xs
                              bg-gray-100
                              text-gray-500
                              px-2
                              py-0.5
                              rounded-full
                              mt-1
                              inline-block
                            "
                          >
                            {activity.activityType}
                          </span>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          handleDeleteActivity(
                            activity.id
                          )
                        }
                        className="
                          text-red-400
                          hover:text-red-600
                          text-xs
                          transition
                        "
                      >
                        Delete
                      </button>

                    </div>

                    {/* ACTIVITY DETAILS */}

                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        gap-3
                        text-xs
                        text-gray-500
                      "
                    >

                      {activity.startTime && (

                        <span>
                          🕐 {activity.startTime}

                          {activity.endTime &&
                            ` — ${activity.endTime}`}
                        </span>

                      )}

                      {activity.location && (
                        <span>
                          📍 {activity.location}
                        </span>
                      )}

                      {activity.estimatedCost && (

                        <span
                          className="
                            text-green-600
                            font-medium
                          "
                        >
                          ₹
                          {activity.estimatedCost.toLocaleString()}
                        </span>

                      )}

                    </div>

                    {/* NOTES */}

                    {activity.notes && (

                      <p
                        className="
                          text-xs
                          text-gray-400
                          mt-2
                        "
                      >
                        {activity.notes}
                      </p>

                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default TripDetail;