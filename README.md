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

Vite only exposes variables prefixed with `VITE_` to frontend code.  
This project uses:

- `VITE_API_BASE_URL`: backend base URL used by axios (example: `http://localhost:3000`)

### 1. Create env file

Create `.env` in the project root (`REQ12482/.env`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Optional mode-specific files

Use these files when values differ by environment:

- `.env.development`
- `.env.production`
- `.env.local` (machine-specific, do not commit)

Example:

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000
```

```env
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 3. Precedence (highest to lowest)

1. `.env.[mode].local`
2. `.env.local`
3. `.env.[mode]`
4. `.env`

### 4. Restart required

After editing any `.env*` file, stop and restart:

```sh
npm run dev
```

### 5. Quick verification

In browser devtools console:

```js
console.log(import.meta.env.VITE_API_BASE_URL)
```

If this prints `undefined`, the variable name is wrong (must start with `VITE_`) or the dev server was not restarted.

### 6. Common local setups

Direct API URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Same-origin proxy setup:

```env
VITE_API_BASE_URL=
```

If using proxy, frontend requests go to Vite origin and Vite forwards to backend, which helps avoid CORS issues during local development.

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
