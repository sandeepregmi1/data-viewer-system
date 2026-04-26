# Data Viewer System

A modern, high-performance web application designed to view and manage registration data from MongoDB Atlas. This system features a sleek, integrated dashboard with real-time searching, filtering, and data export capabilities.

## 🚀 Key Features

- **Dynamic Dashboard**: View all registration records in a clean, responsive table.
- **Inline Detail View**: Select any record to see full details directly below the table with smooth scrolling and row highlighting.
- **Real-time Search**: Instant filtering by name, email, team name, or institution.
- **CSV Export**: Download the entire dataset (or filtered results) into a well-formatted CSV file.
- **Pagination**: Efficiently browse through large datasets with configurable rows per page.
- **Modern UI/UX**: Built with a focus on "Master-Detail" flow, using smooth animations and a premium color palette.

## 🛠️ Tech Stack

- **Frontend**:
  - React (v19)
  - TypeScript
  - Axios (for API communication)
  - Vanilla CSS (for custom, premium styling)
- **Backend**:
  - Node.js
  - Express.js
  - Mongoose (MongoDB Modeling)
- **Database**:
  - MongoDB Atlas

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a cluster.

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd data-viewer-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory (refer to `.env.example`).
- Add your `MONGO_URI` and `PORT`.

Run the backend server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Run the frontend development server:
```bash
npm start
```

## 🔐 Environment Variables

The backend requires the following variables in a `.env` file:

| Variable | Description |
| :--- | :--- |
| `PORT` | The port for the backend server (default: 5000) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for token generation |

## 📁 Project Structure

```text
data-viewer-system/
├── backend/            # Express server and database logic
│   ├── config/         # DB connection setup
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
├── frontend/           # React TypeScript application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views (Dashboard)
│   │   ├── services/   # API abstraction layer
│   │   └── types/      # TypeScript interfaces
└── README.md           # Project documentation
```

## 📄 License

This project is licensed under the ISC License.
