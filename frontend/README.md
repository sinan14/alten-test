# 🎨 Frontend - Angular 15+ + Bootstrap

An Angular-based dashboard to upload vehicle diagnostic logs, filter them, and view structured data in a table.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- Angular CLI

### Install & Serve

```bash
cd frontend
npm install
ng serve
```

- App will run on: `http://localhost:4200`
- Backend must run at `http://localhost:3000`

---

## 🔍 Features

- File upload using `<input type="file">`
- Reactive form filtering:
  - Vehicle ID
  - Error Code
  - Timestamp range (`from`, `to`)
- Table view styled with Bootstrap

---

## 📐 Design Decisions

- Scaffolded using Angular CLI
- Form state handled with Reactive Forms
- API handled with `HttpClient`
- Bootstrap loaded via CDN link

---
