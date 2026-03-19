# ShareBite: Backend

The backend API server for the ShareBite food donation platform. Built with Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based auth with role-based access control (RBAC).
- **Geospatial Logic**: Uses MongoDB `$nearSphere` for location-based matching.
- **Real-time Engine**: Socket.io for live volunteer location updates and status changes.
- **REST API**: Comprehensive endpoints for users, donations, requests, and deliveries.

## Folder Structure
- `/controllers`: Core business logic for each resource.
- `/models`: Mongoose schemas (User, Donation, Request, Delivery).
- `/routes`: Express route definitions.
- `/middleware`: Authentication guards and request validation.
- `/socket`: Socket.io initialization and event handlers.

## Setup & Running
1. `npm install`
2. Configure `.env` (use `.env.example` as a template).
3. `npm run dev`
