# Timely

---

## Table of Contents

---

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Overview](#api-overview)
- [Setup and Installation](#setup-and-installation)
- [Future Plans](#future-plans)


## Introduction

---
**Timely** is a time management web application that helps users track their daily activities, moods, and energy levels. It provides visual insights into how time is spent and how users feel throughout the day, week, and month.



## Features

---

- **User Authentication**  
  JWT-based login and registration, with secure token refresh to keep users logged in.


- **Activity Tracking**  
  Log daily activities with:
  - Category
  - Mood
  - Energy level
  - Time spent  


- **Category Management**  
  - Create and manage user-defined categories.
  - Assign colors for easy visual identification.


- **Reports & Visualizations**
  - **Daily Summary**
    - Time spent per category (for pie chart)
    - Average energy level
  - **Weekly Summary**
    - Time spent per category
    - Highest and lowest average energy categories
  - **Monthly Summary**
    - Time spent per category
    - Highest and lowest average energy categories


- **Secure and Scalable Backend**
  - Built with Django and Django REST Framework.
  - Supports PostgreSQL for production and SQLite for local development.

## Tech Stack

---

- **Backend**
  - Django
  - Django REST Framework
  - djangorestframework-simplejwt (JWT authentication)


- **Database**
  - SQLite (for local development)
  - PostgreSQL (for production)


- **Authentication**
  - JWT (JSON Web Token)


- **Frontend**
  - To be decided (planned: React or Angular)


- **Deployment**
  - Docker (optional, for containerization)
  - Deployment platform TBD

## API Overview

### Users
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/api/auth/register/`     | Register a new user       |
| POST   | `/api/auth/login/`        | Obtain JWT tokens         |
| POST   | `/api/auth/refresh/`      | Refresh JWT token         |
| GET    | `/api/auth/me/`           | Get current user info     |

### Activities
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/api/activities/`        | List all activities       |
| POST   | `/api/activities/`        | Create a new activity     |
| GET    | `/api/activities/{id}/`   | Retrieve an activity      |
| PUT    | `/api/activities/{id}/`   | Update an activity        |
| DELETE | `/api/activities/{id}/`   | Delete an activity        |

### Categories
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/api/categories/`        | List all categories       |
| POST   | `/api/categories/`        | Create a new category     |
| GET    | `/api/categories/{id}/`   | Retrieve a category       |
| PUT    | `/api/categories/{id}/`   | Update a category         |
| DELETE | `/api/categories/{id}/`   | Delete a category         |

### Reports
_(to be added)_




## Setup and Installation

---

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/timely.git
   cd timely


2. **Create a virtual environment and activate it**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Mac/Linux
   .venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations**

   ```bash
   python manage.py migrate
   ```

5. **Run the development server**

   ```bash
   python manage.py runserver
   ```

6. **Access the API**

   * Visit `http://127.0.0.1:8000/api/` in your browser or use a tool like Postman.

## Future Plans

---
