# 🏗️ Smart Construction Material Management System

A full-stack, production-ready web application for managing construction materials, suppliers, purchases, usage tracking, expenses, and projects — built with React, Spring Boot, and MySQL.

![Dashboard](screenshots/dashboard.png)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://smart-construction.vercel.app |
| Backend API | https://smart-construction-api.onrender.com |

> **Login:** `admin` / `admin123`

---

## ✨ Features

### Core Modules
- ✅ **JWT Authentication** — Secure login with role-based access (Admin, Engineer, Store Manager)
- ✅ **Material Management** — Full CRUD with low-stock alerts and minimum stock threshold
- ✅ **Supplier Management** — Track all material suppliers
- ✅ **Purchase Tracking** — Record purchases, auto-updates stock levels
- ✅ **Daily Usage Recording** — Log material usage per project, auto-deducts stock
- ✅ **Expense Management** — Track costs by category (Material / Labour / Transport / Other)
- ✅ **Project Management** — Add projects, assign engineers, track progress (0–100%)

### Advanced Features
- ✅ **PDF Export** — Download reports for Materials, Purchases, Usage, Expenses, Suppliers
- ✅ **Real-Time Notifications** — Low stock alerts with bell icon, auto-polls every 15 seconds
- ✅ **Site Image Upload** — Upload delivery photos, damage reports, site progress images
- ✅ **Role-Based Access Control** — UI and API both enforce role permissions
- ✅ **AI Demand Prediction** — ML model predicts next month's material requirements
- ✅ **Dashboard Charts** — Live bar charts, pie charts, and trend lines using Recharts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Recharts, Axios, React Router v7 |
| Backend | Spring Boot 3.2, Spring Security (JWT), Spring Data JPA |
| Database | MySQL 8.0 |
| PDF Generation | iText PDF 5.5 |
| AI Service | Python 3.12, Flask, NumPy (Linear Regression) |
| Auth | JWT (jjwt 0.11.5), BCrypt |
| Deployment | Vercel (frontend), Render (backend), Railway (database) |

---

## 📁 Project Structure

```
Smart-Construction-Material-Management-System/
├── backend/                          # Spring Boot REST API
│   └── src/main/java/com/construction/management/
│       ├── controller/               # REST Controllers
│       │   ├── AuthController.java
│       │   ├── MaterialController.java
│       │   ├── PurchaseController.java
│       │   ├── SupplierController.java
│       │   ├── UsageController.java
│       │   ├── ExpenseController.java
│       │   ├── ProjectController.java
│       │   ├── DashboardController.java
│       │   ├── PdfController.java
│       │   ├── NotificationController.java
│       │   ├── ImageController.java
│       │   └── AiController.java
│       ├── entity/                   # JPA Entities
│       ├── repository/               # Spring Data Repositories
│       ├── service/                  # Business Logic
│       └── security/                 # JWT Filter, Config
├── frontend/                         # React + Vite SPA
│   └── src/
│       ├── pages/                    # Dashboard, Materials, Projects, etc.
│       ├── components/               # Sidebar, Layout, NotificationBell
│       ├── services/                 # Axios API client
│       └── context/                  # Auth Context
├── ai-service/                       # Python Flask ML microservice
│   ├── app.py
│   └── requirements.txt
├── database/
│   ├── schema.sql                    # Full database schema
│   └── sample_data.sql               # Sample data for testing
└── screenshots/                      # App screenshots
```

---

## 🚀 Installation & Setup

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8.0
- Python 3.10+ *(optional, for AI features)*

---

### 1. Database Setup

```sql
-- Open MySQL Workbench or CLI and run:
source database/schema.sql
```

---

### 2. Backend Setup

```bash
cd backend
```

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

```bash
mvn spring-boot:run
```

Backend runs on → `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → `http://localhost:5173`

---

### 4. AI Service Setup *(Optional)*

```bash
cd ai-service
pip install -r requirements.txt
py app.py
```

AI service runs on → `http://localhost:5000`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT token |
| POST | `/api/auth/register` | Register new user |

### Materials
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/materials` | List all materials |
| POST | `/api/materials` | Add material |
| PUT | `/api/materials/{id}` | Update material |
| DELETE | `/api/materials/{id}` | Delete material |
| GET | `/api/materials/low-stock` | Get low stock items |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |

### PDF Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/pdf/materials` | Download material stock PDF |
| GET | `/api/reports/pdf/purchases` | Download purchase report PDF |
| GET | `/api/reports/pdf/usage` | Download usage report PDF |
| GET | `/api/reports/pdf/expenses` | Download expense report PDF |
| GET | `/api/reports/pdf/suppliers` | Download supplier report PDF |

### Other Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/suppliers` | Suppliers |
| GET/POST | `/api/purchases` | Purchases |
| GET/POST | `/api/usage` | Usage records |
| GET/POST | `/api/expenses` | Expenses |
| GET | `/api/dashboard/summary` | Dashboard stats |
| GET | `/api/notifications/unread` | Unread notifications |
| POST | `/api/images/upload` | Upload site image |
| GET | `/api/ai/predict` | AI demand prediction |

---

## 🗄️ Database Schema

```sql
users          — id, username, password, role
materials      — material_id, material_name, category, quantity, price, supplier, min_stock
suppliers      — supplier_id, supplier_name, phone, address
purchases      — purchase_id, material_id, quantity, total_cost, purchase_date
usage_records  — usage_id, material_id, used_quantity, used_date, project_name
expenses       — expense_id, description, amount, expense_date, category, project_name
projects       — project_id, project_name, location, engineer, start_date, end_date, progress, status
notifications  — id, title, message, type, is_read, created_at, material_id
```

---

## 🔐 User Roles

| Role | Permissions |
|------|------------|
| `ADMIN` | Full access to all modules |
| `STORE_MANAGER` | Materials, Purchases, Expenses, Reports |
| `ENGINEER` | View stock, Add usage records, Projects, Site Images |

---

## 📸 Screenshots

| Dashboard | Materials |
|-----------|-----------|
| ![Dashboard](screenshots/dashboard.png) | ![Materials](screenshots/materials.png) |

| Projects | Expenses |
|----------|----------|
| ![Projects](screenshots/projects.png) | ![Expenses](screenshots/expenses.png) |

| Reports + PDF | AI Prediction |
|---------------|---------------|
| ![Reports](screenshots/reports.png) | ![AI](screenshots/ai-predict.png) |

---

## 🤖 AI Demand Prediction

The AI service analyzes the last 6 months of material usage and uses **linear regression** to predict next month's requirements.

```
Usage History → Group by Material + Month → Linear Regression → Predicted Quantity
```

Example output:
```
Cement   → 1,500 bags  📈 Increasing
Steel    → 4,800 kg    ➡️ Stable
Sand     → 42 tons     📉 Decreasing
```

---

## 🚀 Future Enhancements

- [ ] Email notifications for low stock alerts
- [ ] WhatsApp/SMS alerts via Twilio
- [ ] Barcode/QR code scanning for materials
- [ ] Mobile app (React Native)
- [ ] Advanced ML model (LSTM for time-series prediction)
- [ ] Multi-site / multi-project support
- [ ] Supplier portal with order management
- [ ] Budget vs actual cost comparison charts

---

## 👨‍💻 Author

**Vishnu** — Civil Engineering Student  
GitHub: [@Vishnu640](https://github.com/Vishnu640)

---

## 📄 License

MIT License — free to use for educational and personal projects.
