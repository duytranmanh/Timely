# Timely Backend

This is the backend service for the **Timely** time management application. It provides RESTful APIs for managing users, activities, categories, and reports.

---

## Technology Stack

* Python 3.12
* Django 4.x
* Django REST Framework
* SQLite (default for local development)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/timely.git
cd timely/timely-backend
```

---

### 2. Create a Virtual Environment and Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 3. Apply Migrations

```bash
python manage.py migrate
```

---

### 4. Run the Development Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000/`.

---

## Running Tests

```bash
python manage.py test
```

---

## Environment Variables

* `SECRET_KEY` — Django secret key for cryptographic signing (can be set in `.env` or in `settings.py`).
* `DEBUG` — Enable or disable debug mode (set to `True` by default in development).

---

## API Documentation

See the separate [API Documentation](../api-docs.md) for details about available endpoints.

---

## Notes

* By default, the backend uses **SQLite** for local development.
* For production, consider switching to PostgreSQL or another robust RDBMS.
* CORS settings may need adjustment depending on the frontend deployment.

