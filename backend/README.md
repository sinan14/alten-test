# 🛠️ Backend - Express.js + SQLite

This backend parses uploaded vehicle diagnostic logs and exposes a REST API using Express.js with a SQLite database.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- npm

### Install & Run

```bash
cd backend
npm install
npm start
```

### API Endpoints

- `POST /upload` — Accepts `.txt` log file
- `GET /logs` — Query logs by:
  - `vehicle`, `code`, `from`, `to`

### SQLite DB

- File created: `logs.db`
- Table: `logs(timestamp TEXT, vehicleId TEXT, type TEXT, code TEXT, message TEXT)`

---

## 📐 Design Decisions

- Uses `express-generator` for base structure
- Database: `better-sqlite3` for simplicity & performance
- Log parsing strictly requires the format:
  ```
  [2025-07-24 14:21:08] [VEHICLE_ID:1234] [ERROR] [CODE:U0420] [Steering angle sensor malfunction]
  ```

```
- Entries appended without overwriting existing data

---
```
