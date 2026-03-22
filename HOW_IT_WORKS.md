# ShareBite: Food Donation Management Platform

ShareBite is a real-time MERN (MongoDB, Express, React, Node.js) stack application designed to bridge the gap between food donors (individuals/restaurants), NGOs, and volunteers. It streamlines the donation process, from creation to pickup and delivery, using location-based matching and live tracking.

## 🚀 Key Features
- **Role-Based Dashboards**: Tailored experiences for Donors, NGOs, Volunteers, and Admins.
- **Geospatial Matching**: Automatically finds nearby donors for NGOs and nearby pickups for Volunteers using MongoDB's `$nearSphere` geospatial indexing.
- **Live Delivery Tracking**: Real-time location updates for volunteers during pickup and delivery using **Socket.io**.
- **Self-Service Matching**: NGOs can "match" with nearby available donations directly without waiting for manual intervention.
- **Volunteer Pickup flow**: Volunteers can view pending donations in their vicinity and claim them for delivery.
---
## 🏗️ System Architecture

### 1. Backend (Express & Node.js)
The backend acts as a robust REST API with a WebSocket layer for real-time features.
- **Controllers**: Handle business logic such as donation creation, auto-matching, and delivery status transitions.
- **Models (Mongoose)**:
  - `User`: Handles authentication, roles, and profile info.
  - `Donation`: Tracks food items, quantity, expiry, donor location, and status.
  - `Request`: Tracks NGO needs and links them with matched donations.
  - `Delivery`: Manages the lifecycle of a pickup task from assignment to completion.
- **Real-time (Socket.io)**: Managed in `backend/socket/socket.js`. Use for broadcasting live locations of volunteers.

### 2. Frontend (React & Vite)
A modern, responsive SPA (Single Page Application) built with React and styled with Tailwind CSS.
- **Routing**: Role-protected routes ensure users only access their relevant dashboards.
- **Context API**: `AuthContext` manages user sessions and global authentication state.
- **Interactive Maps**: Uses **Leaflet.js** for visualizing donations, requests, and volunteer movement (not shown in files but used in logic).
- **Communication**: Interacts with the backend via Axios/Fetch and maintains a persistent Socket connection for live updates.
---
## 🔁 The ShareBite Workflow
### Step 1: Donation Creation (Donor)
A **Donor** logs in and posts a donation. They provide details like item names, quantity, expiry time, and their current location (auto-detected or manually set).
- **Backend**: Saves a `Donation` document with `status: 'pending'`.
- **Real-time**: Emits a `newDonation` event to nearby NGOs/Volunteers via Socket.io.

### Step 2: Matching (NGO / Donation Logic)
**NGOs** can post a `Request` for food. The system automatically highlights nearby pending donations.
- When an NGO matches with a donation, the donation status updates to `accepted` (or similar logic).

### Step 3: Pickup & Delivery (Volunteer)
**Volunteers** see a "Pending Pickups" map/list showing nearby available donations that need delivery.
- A Volunteer "claims" a donation.
- A `Delivery` record is created, linking the Donor, the Donation, the Requesting NGO, and the Volunteer.
- **Status Flow**: `assigned` → `picked_up` → `delivered`.

### Step 4: Live Tracking
During delivery, the volunteer's app sends latitude/longitude updates to the server via Socket.io (`volunteerLocation`).
- The corresponding NGO and/or Donor can see the volunteer's movement in real-time on their dashboard.

---

## 🛠️ Technical Stack
- **Database**: MongoDB (Geospatial indexes, Atlas)
- **Backend Framework**: Node.js & Express
- **Frontend Library**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Real-time Updates**: Socket.io
- **Authentication**: JSON Web Tokens (JWT)
- **Mapping**: Leaflet / OpenStreetMap

---

## ⚙️ Setting Up Locally

1. **Clone & Install Dependencies**:
   ```bash
   # Root
   npm install

   # In both backend and frontend folders
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Variables**:
   Create `.env` in the `backend` folder:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```

3. **Run the Project**:
   ```bash
   # Backend
   npm run dev

   # Frontend
   npm run dev
   ```
