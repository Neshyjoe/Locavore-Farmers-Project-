# 🥕 Locavore — Farmers Market & Food Vendor Finder

Locavore is a full-stack web application that helps users discover, review, and bookmark local food vendors. This project focuses on a Flask-based backend using PostgreSQL, JWT authentication, and RESTful API design.

---

## 🚀 Features
- 🔐 User Authentication with JWT
- 📋 CRUD operations for Vendors
- 📝 CRUD operations for Reviews
- 🔄 React frontend integration
- 🐘 PostgreSQL database
- ☁️ Render deployment ready

---

## 📁 Project Structure
```
locavore/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── extensions.py
│   └── routes/
│       ├── auth_routes.py
│       ├── vendor_routes.py
│       └── review_routes.py
├── config.py
├── run.py
├── requirements.txt
├── render.yaml
└── README.md
```

---

## 🗂️ API Endpoints

### Auth
| Method | Endpoint     | Description         |
|--------|--------------|---------------------|
| POST   | /register    | Register a user     |
| POST   | /login       | Login and get token |

### Vendors *(Auth required)*
| Method | Endpoint           | Description             |
|--------|--------------------|-------------------------|
| GET    | /vendors           | List all vendors        |
| POST   | /vendors           | Add a new vendor        |
| GET    | /vendors/:id       | View vendor detail      |
| PUT    | /vendors/:id       | Update vendor           |
| DELETE | /vendors/:id       | Delete vendor           |

### Reviews *(Auth required)*
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| POST   | /reviews           | Add a new review         |
| PUT    | /reviews/:id       | Update review            |
| DELETE | /reviews/:id       | Delete review            |

---

## ⚙️ Environment Variables
Create a `.env` file based on this template:

```bash
FLASK_APP=run.py
FLASK_ENV=development
JWT_SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://username:password@host:port/dbname
```

---

## 📦 Installation
```bash
git clone https://github.com/your-username/locavore.git
cd locavore
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run
```

---

## ☁️ Deployment (Render)
1. Create a PostgreSQL database on Render
2. Set environment variables (`JWT_SECRET_KEY`, `DATABASE_URL`)
3. Use this `start` command: `gunicorn run:app`
4. Optionally, use `render.yaml` for configuration

---

## 📬 Postman Collection
Use the provided Postman collection to test all endpoints.
- Make sure to set the `Authorization` header: `Bearer <access_token>`

---

## 🔗 Frontend Integration
Use `fetch` or `axios` to connect your React frontend to endpoints like:
```js
fetch("https://your-backend.onrender.com/vendors", {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## ✅ Tech Stack
- Python + Flask
- Flask-JWT-Extended
- PostgreSQL + SQLAlchemy
- React + CORS
- Gunicorn (for production)

---

## 🧪 Testing
Use Postman or curl to test all endpoints locally and in production.

---

## 📌 Stretch Goals
- 🗺️ Map view of vendors
- ⭐ Star ratings on reviews

---

## 👨‍💻 Author
**Group 4** — Locavore Project

---

Feel free to contribute, fork, or deploy!
