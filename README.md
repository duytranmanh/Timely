# Timely – Time Tracking & Visualization Web App

Timely is a personal time management web app that helps users log their daily activities, track energy and mood levels, and visualize how they spend time using intuitive reports and charts.

## Features

- Category management with full CRUD APIs
- Each category includes: name, color, default status, and user reference
- Custom hex color validation
- Basic API testing with Django test framework and Postman
- JWT authentication planned
- Activity tracking & reporting features planned

## Tech Stack

- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite (for dev), PostgreSQL (planned for production)
- **Testing:** Django `APITestCase`, Postman
- **Frontend:** React + chart library (planned)
- **Deployment:** Docker Compose (planned)

## Setup Instructions

### Local Development

1. Clone the repository:
```
git clone <your-repo-url>
cd timely
```

2. Create and activate a virtual environment:
```
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run database migrations:
```
python manage.py makemigrations
python manage.py migrate
```

5. Start the development server:
```
python manage.py runserver
```

## API Endpoints – Categories

Base path: `/api/categories/`

| Method | Endpoint        | Description                    |
|--------|------------------|--------------------------------|
| GET    | `/`              | List all categories            |
| POST   | `/`              | Create a new category          |
| GET    | `/<id>/`         | Retrieve a category by ID      |
| PUT    | `/<id>/`         | Fully update a category        |
| PATCH  | `/<id>/`         | Partially update a category    |
| DELETE | `/<id>/`         | Delete a category              |

> Requires: `name`, `color` (hex), `is_default`, and `user` (can be auto-assigned via `request.user`)

## Running Tests

To run all tests:
```

python manage.py test

```

Includes:
- Serializer validation tests
- API endpoint tests (create, list, etc.)
- Test user setup in isolated test DB

## Postman Testing Tips

- Use an environment variable: `baseUrl = http://127.0.0.1:8000`
- Build a collection for `GET`, `POST`, etc. under `/api/categories/`
- Add tests to assert:
  - Status code = 201/200
  - Response contains expected fields
  - Chaining with `createdCatId`

## Roadmap

- [ ] Add Activities app with mood, energy, timestamps
- [ ] Daily, weekly, and monthly report generation
- [ ] JWT authentication and user isolation
- [ ] Containerized setup with Docker
- [ ] React frontend for data visualization

## Author

Duy Tran – Computer Science @ UW-Madison  
Currently building Timely to explore backend architecture and API-first design.