# Timely Backend API Documentation

This document outlines the API endpoints, methods, status codes, request/response formats for the Timely backend.

---

## Table of Contents

* [Authentication](#authentication)
* [Users](#users)
* [Categories](#categories)
* [Activities](#activities)
* [Reports](#reports)
* [Notes](#notes)

---

## Authentication

### Obtain JWT Token

**POST** `/api/token/`

**Status Codes:**

* `200 OK`: Successful token retrieval.
* `401 Unauthorized`: Invalid credentials.

**Request:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```

---

### Refresh Access Token

**POST** `/api/token/refresh/`

**Status Codes:**

* `200 OK`: Token refreshed successfully.
* `401 Unauthorized`: Invalid refresh token.

**Request:**

```json
{
  "refresh": "jwt_refresh_token"
}
```

**Response (200):**

```json
{
  "access": "new_jwt_access_token"
}
```

---

## Users

### Register a New User

**POST** `/api/users/register/`

**Status Codes:**

* `201 Created`: User registered successfully.
* `400 Bad Request`: Validation error (e.g. duplicate username).

**Request:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**

```json
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

---

### Retrieve Current User Info

**GET** `/api/users/me/`

**Status Codes:**

* `200 OK`: Successfully retrieved user data.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

---

## Categories

### List Categories

**GET** `/api/categories/`

**Status Codes:**

* `200 OK`: Categories listed successfully.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
    "id": 24,
    "name": "Hangout at court",
    "is_default": false,
    "color": "#5b2626",
    "description": "",
    "user": 8
}
```

---

### Create a New Category

**POST** `/api/categories/`

**Status Codes:**

* `201 Created`: Category created successfully.
* `400 Bad Request`: Validation error.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
    "name": "Hangout at the Bar",
    "is_default": true,
    "color": "#fffff",
    "description": ""
}
```

**Response (201):**

```json
{
    "id": 24,
    "name": "Hangout at the Bar",
    "is_default": false,
    "color": "#5b2626",
    "description": "",
    "user": 8
}
```

---

### Update an Existing Category

**PUT** `/api/categories/{id}/`

**Status Codes:**

* `200 OK`: Category updated successfully.
* `400 Bad Request`: Validation error.
* `404 Not Found`: Category not found.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "name": "string",
  "color": "#RRGGBB",
  "is_default": false
}
```

**Response (200):**

```json
{
  "id": 1,
  "name": "string",
  "color": "#RRGGBB",
  "is_default": false
}
```

---

### Delete a Category

**DELETE** `/api/categories/{id}/`

**Status Codes:**

* `204 No Content`: Category deleted successfully.
* `404 Not Found`: Category not found.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (204):**

```
No Content
```

---

## Activities

### List User's Activities

**GET** `/api/activities/`

**Status Codes:**

* `200 OK`: Activities listed successfully.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "string",
    "category": {
      "id": 1,
      "name": "string"
    },
    "notes": "string",
    "start_time": "YYYY-MM-DDTHH:MM:SSZ",
    "end_time": "YYYY-MM-DDTHH:MM:SSZ",
    "energy_level": 5,
    "mood": "HAPPY"
  }
]
```

---

### Create a New Activity

**POST** `/api/activities/`

**Status Codes:**

* `201 Created`: Activity created successfully.
* `400 Bad Request`: Validation error.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
    "category": 11,
    "notes": "Worked on project",
    "start_time": "2025-06-02T09:00:00Z",
    "end_time": "2025-06-02T10:00:00Z",
    "energy_level": 7,
    "mood": "happy"
}
```

**Response (201):**

```json
{
    "id": 7,
    "author": 8,
    "notes": "Worked on project",
    "start_time": "2025-06-02T09:00:00Z",
    "end_time": "2025-06-02T10:00:00Z",
    "energy_level": 7,
    "mood": "happy",
    "category": 11
}
```

---

### Update an Activity

**PUT** `/api/activities/{id}/`

**Status Codes:**

* `200 OK`: Activity updated successfully.
* `400 Bad Request`: Validation error.
* `404 Not Found`: Activity not found.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
    "category": 11,
    "notes": "Worked on project",
    "start_time": "2025-06-02T09:00:00Z",
    "end_time": "2025-06-02T10:00:00Z",
    "energy_level": 7,
    "mood": "happy"
}
```

**Response (200):**

```json
{
    "id": 7,
    "author": 8,
    "notes": "Worked on project",
    "start_time": "2025-06-02T09:00:00Z",
    "end_time": "2025-06-02T10:00:00Z",
    "energy_level": 7,
    "mood": "happy",
    "category": 11
}
```

---

### Delete an Activity

**DELETE** `/api/activities/{id}/`

**Status Codes:**

* `204 No Content`: Activity deleted successfully.
* `404 Not Found`: Activity not found.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (204):**

```
No Content
```

---

## Reports

### Daily Report

**GET** `/api/reports/daily/`

**Status Codes:**

* `200 OK`: Daily report generated successfully.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
    "period": "2025-06-01",
    "activities": [
        {
            "name": "Senior Factors Developer",
            "hours": 1.0,
            "percentage": 0.14
        },
        {
            "name": "undefined",
            "hours": 719.0,
            "percentage": 99.86
        }
    ]
}
```

---

## Weekly Report

### GET `/api/reports/weekly/`

**Status Codes:**

* `200 OK`: Weekly report generated successfully.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
    "period": "2025-06-01 to 2025-06-30",
    "activities": [
        {
            "name": "Senior Factors Developer",
            "hours": 1.0,
            "percentage": 0.14
        },
        {
            "name": "undefined",
            "hours": 719.0,
            "percentage": 99.86
        }
    ]
}
```

---

## Monthly Report

### GET `/api/reports/monthly/`

**Status Codes:**

* `200 OK`: Monthly report generated successfully.
* `401 Unauthorized`: Missing or invalid token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
    "period": "2025-06-01 to 2025-06-30",
    "activities": [
        {
            "name": "Senior Factors Developer",
            "hours": 1.0,
            "percentage": 0.14
        },
        {
            "name": "undefined",
            "hours": 719.0,
            "percentage": 99.86
        }
    ]
}
```

---

---

## Notes

* All endpoints (except `/api/token/` and `/api/users/`) require an Authorization header:

  ```
  Authorization: Bearer <access_token>
  ```
* Use ISO 8601 format for datetime fields (e.g., `"2025-06-10T14:00:00Z"`).
* Default categories are global and immutable by individual users.
