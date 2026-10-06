# 🌍 TripNest – Smart Travel Planning & Management Platform

> **Plan. Organize. Explore. Travel Smarter.**

TripNest is a **full-stack travel planning and management web application** designed to provide travelers with a centralized platform to plan trips, manage itineraries, track budgets and expenses, collaborate with travel groups, and receive notifications.

The project is built using **React.js, Spring Boot, and PostgreSQL**, following a client-server architecture with RESTful APIs.

---

## 📌 Project Overview

Planning a trip often requires using multiple applications for creating itineraries, tracking expenses, managing budgets, sharing plans with friends, and storing travel documents.

**TripNest** brings these functionalities together into a single platform.

Users can create personalized trips, organize day-wise itineraries, manage their travel budgets, record expenses, split expenses with group members, and manage trip-related documents.

### 🎯 Main Objectives

- Simplify travel planning and organization.
- Provide a centralized platform for trip management.
- Help users monitor their travel budgets.
- Track and split expenses among travelers.
- Support collaborative group travel.
- Provide notifications for important trip activities.
- Maintain user-specific and secure travel data.

---

## ✨ Features

### 🔐 1. User Authentication

- User registration and login.
- Secure authentication using Spring Security.
- Google OAuth2 authentication.
- User-specific trip and expense data.
- JWT-based authentication for API requests.

---

### 🗺️ 2. Trip Management

Users can:

- Create new trips.
- Add destination details.
- Set trip start and end dates.
- View their planned trips.
- Update trip information.
- Delete trips.
- View detailed information about individual trips.

Each user's trips are associated with their account.

---

### 📅 3. Itinerary Management

TripNest allows users to organize their travel plans into structured itineraries.

Users can:

- Add itinerary items.
- Organize activities by date.
- Add destinations and activities.
- Manage travel schedules.
- Update or delete itinerary items.

This makes it easier to maintain a day-wise travel plan.

---

### 💰 4. Budget Management

Users can define and monitor their trip budgets.

Budget categories include:

- 🚗 Transportation
- 🏨 Accommodation
- 🍔 Food
- 🛍️ Shopping
- 🎭 Entertainment
- 📦 Miscellaneous

The system helps users compare their expenses against the planned budget.

---

### 💳 5. Expense Tracking

Users can record expenses related to their trips.

Expense information can include:

- Expense title
- Amount
- Category
- Date
- Description
- Person who paid

The application helps users keep track of their overall spending during a trip.

---

### 🤝 6. Shared Expenses & Settlement

TripNest supports expense sharing for group trips.

Users can:

- Mark an expense as shared.
- Select members involved in the expense.
- Split expenses equally.
- Define custom shares.
- Record who paid the expense.
- Calculate the amount owed by each member.
- Calculate net balances.
- Simplify settlements between group members.
- Handle rounding differences during calculations.

---

### 👥 7. Group Travel

Users can organize trips involving multiple travelers.

Group functionality allows travelers to:

- Add members to trips.
- Share trip information.
- Manage shared expenses.
- Collaborate on travel plans.

---

### 🔔 8. Notifications

TripNest provides notifications for important activities.

The notification system can be used for events such as:

- Trip-related updates.
- Group activities.
- Shared expense updates.
- Other important travel-related events.

---

### 📎 9. Media & Documents

Users can manage files related to their trips.

Examples include:

- Tickets
- Hotel confirmations
- Travel documents
- Booking information
- Other trip-related files

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Vite | Development & build tool |
| JavaScript | Application logic |
| CSS | Styling |
| Axios | API communication |

### Backend

| Technology | Purpose |
|---|---|
| Java | Backend programming |
| Spring Boot | Backend framework |
| Spring Security | Authentication & security |
| Spring Data JPA | Database interaction |
| Hibernate | ORM |
| REST APIs | Frontend-backend communication |
| OAuth2 | Google authentication |
| JWT | API authentication |

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| Supabase | PostgreSQL database hosting |

### Development Tools

- Git
- GitHub
- Maven
- VS Code / IntelliJ IDEA
- Postman
- npm

---

## 🏗️ System Architecture

```text
                   ┌──────────────────────┐
                   │       User           │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   React Frontend     │
                   │      + Vite          │
                   └──────────┬───────────┘
                              │
                         REST APIs
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Spring Boot        │
                   │      Backend         │
                   └──────────┬───────────┘
                              │
                    Spring Data JPA
                              │
                              ▼
                   ┌──────────────────────┐
                   │     PostgreSQL       │
                   │      Database        │
                   │      (Supabase)      │
                   └──────────────────────┘
```

---

## 📂 Project Structure

The project is divided into separate frontend and backend applications.

```text
TripNest/
│
├── tripnest-frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateTrip.jsx
│   │   │   ├── Trips.jsx
│   │   │   ├── TripDetail.jsx
│   │   │   ├── Itinerary.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Groups.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── Destinations.jsx
│   │   │
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── tripnest-backend/
    │
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/
    │       │       └── tripnest/
    │       │           └── backend/
    │       │               ├── controller/
    │       │               ├── service/
    │       │               ├── repository/
    │       │               ├── entity/
    │       │               ├── dto/
    │       │               ├── security/
    │       │               └── config/
    │       │
    │       └── resources/
    │           └── application.properties
    │
    └── pom.xml
```

---

# 🚀 Getting Started

Follow the steps below to run TripNest locally.

## 📋 Prerequisites

Make sure the following are installed:

- Java JDK 17 or later
- Node.js
- npm
- Maven
- PostgreSQL / Supabase account
- Git

Check the installed versions:

```bash
java -version
node -v
npm -v
mvn -version
git --version
```

---

# 📥 Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd TripNest
```

---

# ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd tripnest-backend
```

### Configure Database

Create a PostgreSQL database or use a Supabase PostgreSQL database.

Configure the required environment variables.

Example:

```env
DB_URL=jdbc:postgresql://<HOST>:<PORT>/<DATABASE>
DB_USERNAME=<USERNAME>
DB_PASSWORD=<PASSWORD>
```

Configure these values in your Spring Boot configuration.

Example:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> ⚠️ Do not commit database passwords, JWT secrets, OAuth credentials, or other sensitive information to GitHub.

---

## ▶️ Run the Backend

Using Maven:

```bash
mvn clean install
```

Then run:

```bash
mvn spring-boot:run
```

The backend will normally run on:

```text
http://localhost:8080
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd tripnest-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔗 Frontend–Backend Connection

The frontend communicates with the Spring Boot backend using REST APIs.

Example Axios configuration:

```javascript
const API = axios.create({
    baseURL: "http://localhost:8080"
});
```

Authentication tokens can be attached to requests using an Axios interceptor.

```javascript
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
```

---

# 🔐 Authentication Flow

TripNest supports authenticated API access.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Spring Security
 │
 ├── JWT Authentication
 │
 └── Google OAuth2
 │
 ▼
Authenticated User
 │
 ▼
Protected REST APIs
```

---

# 🔄 Application Flow

```text
User Registration/Login
          │
          ▼
       Dashboard
          │
          ▼
     Create Trip
          │
          ▼
   Trip Details Page
          │
     ┌────┼─────────────┐
     ▼    ▼             ▼
Itinerary Budget      Expenses
     │    │             │
     │    │             ▼
     │    │       Shared Expenses
     │    │             │
     │    │             ▼
     │    │         Settlement
     │    │
     └────┴──────► Notifications
```

---

# 📡 API Overview

The backend exposes RESTful endpoints for different modules.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Trips

```text
GET    /api/trips
POST   /api/trips
GET    /api/trips/{id}
PUT    /api/trips/{id}
DELETE /api/trips/{id}
```

### Itineraries

```text
GET    /api/itineraries/{tripId}
POST   /api/itineraries
PUT    /api/itineraries/{id}
DELETE /api/itineraries/{id}
```

### Expenses

```text
GET    /api/expenses/{tripId}
POST   /api/expenses
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}
```

### Budget

```text
GET    /api/budget/{tripId}
POST   /api/budget
PUT    /api/budget/{tripId}
```

### Notifications

```text
GET    /api/notifications
PUT    /api/notifications/{id}
```

> **Note:** Endpoint paths may vary depending on the current backend implementation.

---

# 🗄️ Database Design

The application uses PostgreSQL for persistent data storage.

Major entities include:

```text
User
 │
 ├── Trip
 │    │
 │    ├── Itinerary
 │    ├── Expense
 │    ├── Budget
 │    ├── Group
 │    ├── Notification
 │    └── ItineraryFile
 │
 └── Authentication Data
```

The database relationships ensure that users can access and manage only the travel information associated with their accounts.

---

# 🧪 Testing

Backend APIs can be tested using tools such as **Postman**.

Example request:

```http
POST http://localhost:8080/api/trips
```

Example JSON:

```json
{
    "title": "Goa Trip",
    "destination": "Goa",
    "startDate": "2026-12-10",
    "endDate": "2026-12-15"
}
```

---

# 🖥️ Screenshots

Add screenshots of your application here.

### 🏠 Landing Page

```text
Add screenshot here
```

### 🔐 Login Page

```text
Add screenshot here
```

### 📊 Dashboard

```text
Add screenshot here
```

### 🗺️ Trip Details

```text
Add screenshot here
```

### 📅 Itinerary

```text
Add screenshot here
```

### 💰 Budget & Expenses

```text
Add screenshot here
```

### 🔔 Notifications

```text
Add screenshot here
```

---

# 🔒 Security

TripNest follows basic security practices including:

- Authentication using Spring Security.
- JWT-based authorization.
- OAuth2 authentication.
- Protected backend APIs.
- User-specific data access.
- Environment variables for sensitive credentials.
- Database-level relationships and constraints.

---

# 🌱 Future Enhancements

The following features can be added in future versions:

- ✈️ Flight and hotel booking integration.
- 🗺️ Interactive maps and route planning.
- 🌦️ Weather information for destinations.
- 🤖 AI-powered itinerary generation.
- 💬 Real-time group chat.
- 📱 Mobile application using Flutter.
- 🔔 Real-time push notifications.
- 💳 Online payment integration.
- 📊 Advanced travel expense analytics.
- 🌐 Multi-language support.
- ☁️ Cloud deployment and scalable infrastructure.

---

# 👨‍💻 Development Highlights

Through this project, we worked with:

- Full-stack web application development.
- React component-based architecture.
- Spring Boot REST API development.
- PostgreSQL database management.
- Spring Data JPA and Hibernate.
- Authentication and authorization.
- OAuth2 integration.
- JWT-based security.
- Frontend-backend integration.
- Expense splitting algorithms.
- Budget tracking.
- Git and GitHub collaboration.
- Debugging and deployment.

---

# 📚 Learning Outcomes

TripNest provided practical experience in building a complete full-stack application from frontend to database.

### Technical Skills

- Java
- Spring Boot
- React.js
- REST APIs
- PostgreSQL
- JPA/Hibernate
- Spring Security
- OAuth2
- JWT
- Git/GitHub
- API integration

### Software Development Skills

- Requirement analysis
- Database design
- API design
- Frontend development
- Backend development
- Debugging
- Version control
- Team collaboration
- Deployment and troubleshooting

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

```bash
# Fork the repository

# Clone your fork
git clone <YOUR_FORK_URL>

# Create a new branch
git checkout -b feature/new-feature

# Make your changes

# Commit your changes
git add .
git commit -m "Add new feature"

# Push the branch
git push origin feature/new-feature
```

Then create a Pull Request.

---

# 📄 License

This project is currently developed for **educational and academic purposes**.

If you plan to distribute the project publicly, add an appropriate open-source license such as MIT.

---

# 👥 Team

**TripNest** was developed as a collaborative full-stack project.

### Technologies Used

`Java` • `Spring Boot` • `React` • `Vite` • `PostgreSQL` • `Supabase` • `Hibernate` • `Spring Security` • `JWT` • `OAuth2` • `Git` • `GitHub`

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 🌍 TripNest

**A smarter way to plan, organize, and manage your journeys.**

> **Plan your trip. Manage your budget. Share your journey. Travel smarter.**
