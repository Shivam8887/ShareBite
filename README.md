# ShareBite

ShareBite is a food donation platform built to connect donors, NGOs, and volunteers for real-time food delivery.

## 📁 Project Structure
- **/frontend**: React + Vite application (UI/UX, Dashboards, Maps)
- **/backend**: Express + Node.js server (API, Socket.io, MongoDB)

## 🎯 Quick Start
1. **Server**: `cd backend && npm install && npm run dev`
2. **Client**: `cd frontend && npm install && npm run dev`

## 📖 Documentation
For a detailed explanation of how everything works, from the database schema to real-time volunteer tracking, check out:
- [**HOW_IT_WORKS.md**](./HOW_IT_WORKS.md) - Full project architecture and workflow documentation.

## 🚀 Status
- **Authentication**: JWT & Role-based Access Control (RBAC)
- **Donation Management**: Donor-driven donation posts
- **NGO Matching**: Location-based matching with pending donations
- **Volunteer Flow**: Nearby pickup discovery & delivery tracking
- **Real-time**: Live location updates via Socket.io
