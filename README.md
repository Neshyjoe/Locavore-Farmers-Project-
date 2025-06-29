# Locavore 🥕 Farmers Market & Food Vendor Finder

## Project Description
A tool to discover, review, and bookmark local food vendors.

## Goals
- ✔ User authentication
- ✔ CRUD for vendors
- ✔ CRUD for reviews

## ERD
User ───< Vendor ───< Review

- User can add vendors
- Vendors have many reviews

## API Endpoints

| Endpoint       | Method | Auth | Description          |
| -------------- | ------ | ---- | -------------------- |
| /register      | POST   | ❌   | Create user          |
| /login         | POST   | ❌   | Login user           |
| /vendors       | GET    | ✅   | List vendors         |
| /vendors       | POST   | ✅   | Add vendor           |
| /vendors/:id   | GET    | ✅   | Vendor detail        |
| /vendors/:id   | PUT    | ✅   | Update vendor        |
| /vendors/:id   | DELETE | ✅   | Delete vendor        |
| /reviews       | POST   | ✅   | Add review           |
| /reviews/:id   | PUT    | ✅   | Update review        |
| /reviews/:id   | DELETE | ✅   | Delete review        |

## Frontend Requirements
- ✔ Login / Register
- ✔ Vendor list + detail
- ✔ Form to add/edit vendor
- ✔ Form to add/edit reviews

## Tech Stack
- Flask + SQLAlchemy + JWT + PostgreSQL
- React

## Deliverables
- GitHub repo
- Working app
- README

## Stretch Goals
- 🚀 Map view of vendors
- 🚀 Rating stars for reviews

## Setup and Run Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The app will be available at `http://localhost:3000`.

4. Make sure your backend API is running and accessible to the frontend.

## Notes
- The frontend uses JWT for authentication and stores the token in localStorage.
- API requests include the token in the Authorization header.
- Adjust API base URLs in the code if your backend is hosted elsewhere.
