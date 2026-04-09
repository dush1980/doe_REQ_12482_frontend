# REQ12482 Frontend

Vue 3 + Vite frontend with 2 views:
1. `Map`: OpenStreetMap (Leaflet), click to capture coordinates and reverse-geocoded address, then submit location.
2. `List`: Show saved locations, view selected location on map, and delete location.

## Tech Stack

- Vue 3
- Vue Router
- Axios
- Leaflet (OpenStreetMap)
- Bootstrap 5

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm
- Backend API running and reachable from this frontend

## Environment Variables

Create `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Notes:
1. If backend is same-origin through a dev proxy, this can be left empty.
2. Restart Vite after changing env files.

## Run Frontend

Install dependencies:

```sh
npm install
```

Run in development:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Lint:

```sh
npm run lint
```

## Backend API Contract

Base URL: `VITE_API_BASE_URL`

### POST `/location`
Request body:

```json
{
  "name": "HQ",
  "address": "123 Main St",
  "longitude": 151.2093,
  "latitude": -33.8688
}
```

Success response: `201`

```json
{
  "id": 1,
  "name": "HQ",
  "address": "123 Main St",
  "longitude": 151.2093,
  "latitude": -33.8688
}
```

### GET `/locations`
Request body: none

Success response: `200`

```json
[
  {
    "id": 1,
    "name": "HQ",
    "address": "123 Main St",
    "longitude": 151.2093,
    "latitude": -33.8688
  }
]
```

### DELETE `/location`
Request body:

```json
{
  "id": 1
}
```

Success response: `204` (no response body)

### Common error response

```json
{
  "error": "message"
}
```

## Database Structure (Backend Reference)

The frontend expects the backend to persist locations with this structure.

### Table: `locations`

| Column      | Type                | Constraints                  |
|-------------|---------------------|------------------------------|
| `id`        | integer / bigint    | primary key, auto-increment  |
| `name`      | varchar(255)        | not null                     |
| `address`   | text                | not null                     |
| `longitude` | decimal(10, 7)      | not null                     |
| `latitude`  | decimal(10, 7)      | not null                     |

Example SQL:

```sql
CREATE TABLE locations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL
);
```

## Backend Run Notes

This repository contains the frontend only. To run end-to-end:
1. Start your backend server on `http://localhost:3000` (or update `VITE_API_BASE_URL`).
2. Ensure backend CORS allows `http://localhost:5173` during local development.
3. Start frontend with `npm run dev`.
