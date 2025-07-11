# Timely Backend API Documentation

This document outlines the API endpoints, methods, status codes, request/response formats for the Timely backend.

---

## Table of Contents

* [Authentication](#authentication)
* [Users](#users)
* [Categories](#categories)
* [Activities](#activities)
* [Reports](#reports)
* [Trends](#trends)
* [Notes](#notes)

---

## Authentication

### Login / Obtain JWT Tokens

**POST** `/api/users/token/`  
Sets both access and refresh tokens as HttpOnly cookies.

**Status Codes:**
- `200 OK`: Tokens set in cookies
- `401 Unauthorized`: Invalid credentials

**Request:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```
**Response (200):**
```json
{
  "detail": "Login successful"
}
```

**Cookies Set:**

- ```access_token```: Short-lived token for authentication


- ```refresh_token```: Long-lived token for renewing access

---
### Refresh Access Token
**POST** `/api/users/token/refresh/`

Retrieves refresh token from HttpOnly cookie and sets a new access token.

**Status Codes:**
- `200 OK`: New access token set in cookie
- `401 Unauthorized`: Expired or missing refresh token

**Request:**

No body required (token retrieved from cookie)

**Response (200):**
```json
{
  "detail": "Token refreshed"
}
```
---
### Logout
**POST** `/api/users/logout/`

Clears both access and refresh HttpOnly cookies.

Permissions: Requires authentication.

**Status Codes:**
- `200 OK`: Cookies cleared
**Response (200):**
```json
{
  "message": "Logged out successfully"
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
        "start_time": "2025-06-02T09:00:00Z",
        "end_time": "2025-06-02T10:00:00Z",
        "category": {
            "id": 11,
            "name": "Work",
            "is_default": true,
            "color": "#6d6859",
            "description": "",
            "user": 2
        },
        "author": 8,
        "notes": "Worked on project",
        "energy_level": 4,
        "mood": "happy"
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
        "start_time": "2025-06-02T09:00:00Z",
        "end_time": "2025-06-02T10:00:00Z",
        "category": {
            "id": 11,
            "name": "Senior Factors Developer",
            "is_default": false,
            "color": "#6d6859",
            "description": "",
            "user": 2
        },
        "author": 8,
        "notes": "Worked on project",
        "energy_level": 4,
        "mood": "happy"
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


### Get Available Mood Options

**GET** `/api/activities/moods/`

Returns all available mood choices used in activities, for display in forms or filters.

**Status Codes:**
- `200 OK`: Mood choices returned successfully.

**Response (200):**
```json
[
  { "value": "happy", "label": "Happy" },
  { "value": "sad", "label": "Sad" },
  { "value": "excited", "label": "Excited" },
  ...
]
```

**Notes:**
- This endpoint is public (`IsAuthenticatedOrReadOnly`) and does not require a token for read-only access.
- The list is static and defined in the `Activity` model's `MOOD_CHOICES`.
- Useful for populating dropdowns or tag selectors in the frontend.

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
            "name": "Gaming",
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

## Trends

### Category Trend Report

**GET** `/api/reports/trends/categories/`

This endpoint returns a time series breakdown of hours spent per category, grouped by day/week/month, for a specified time window.

**Query Parameters:**
- `type` (optional): `daily` (default), `weekly`, or `monthly`
- `date` (optional): end date for trend data (default: today); format: `YYYY-MM-DD`
- `categories` (optional): comma-separated list of category IDs to filter by (e.g., `1,2,3`)

**Status Codes:**
- `200 OK`: Trend data retrieved successfully.
- `400 Bad Request`: Invalid date format, category ID list, or missing required parameters.
- `401 Unauthorized`: Missing or invalid token.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "type": "weekly",
  "start": "2025-05-05",
  "end": "2025-06-30",
  "data": [
    {
      "category_id": 1,
      "category_name": "Study",
      "trend": [
        { "label": "2025-W21", "hours": 2.0 },
        { "label": "2025-W22", "hours": 3.5 },
        ...
      ]
    },
    {
      "category_id": 2,
      "category_name": "Exercise",
      "trend": [
        { "label": "2025-W21", "hours": 0.0 },
        { "label": "2025-W22", "hours": 1.0 },
        ...
      ]
    }
  ]
}
```

**Possible Errors:**
- `400 Bad Request` if:
  - `date` is not in `YYYY-MM-DD` format
  - `categories` contains invalid (non-numeric) values
- `401 Unauthorized` if the JWT access token is missing or invalid

**Notes:**
- The API ensures all selected categories are returned, even if no activity exists for some.
- Each trend item always includes a full series with 0.0 hours where data is missing.
- Labels (`label`) will be formatted as:
  - `YYYY-MM-DD` for daily
  - `YYYY-W##` for weekly
  - `YYYY-MM` for monthly


---

## Notes

* All endpoints (except `/api/token/` and `/api/users/`) require an Authorization header:

  ```
  Authorization: Bearer <access_token>
  ```
* Use ISO 8601 format for datetime fields (e.g., `"2025-06-10T14:00:00Z"`).
* Default categories are global and immutable by individual users.
