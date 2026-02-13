# Mahakaal Backend Deployment Guide

This backend is ready for deployment on platforms like Render, Railway, or Heroku.

## Prerequisites

1.  **Cloud Database**: Get a managed MySQL database URI (e.g., from Railway, PlanetScale, or Aiven).
2.  **Git Repository**: Push this code to GitHub/GitLab.

## Environment Variables

Configure these variables in your hosting provider's dashboard:

| Variable      | Description                           | Example                  |
| :------------ | :------------------------------------ | :----------------------- |
| `PORT`        | Server Port                           | `10000` (Render default) |
| `DB_HOST`     | Database Hostname                     | `mysql.railway.internal` |
| `DB_USER`     | Database Username                     | `root`                   |
| `DB_PASSWORD` | Database Password                     | `securepassword`         |
| `DB_NAME`     | Database Name                         | `mahakaal_db`            |
| `DB_PORT`     | Database Port                         | `3306`                   |
| `DB_SSL`      | Enable SSL (Required for some clouds) | `true`                   |
| `JWT_SECRET`  | Secret for Auth Tokens                | `random_secure_string`   |

## Deploying to Render.com

1.  Connect your GitHub repo.
2.  Create a **Web Service**.
3.  Set **Build Command** to `npm install`.
4.  Set **Start Command** to `node server.js`.
5.  Add the Environment Variables listed above.

## Accessing from Mobile App

Update your Frontend's API URL to the deployed backend URL:

```javascript
// frontend/src/utils/api.js (or wherever your API config is)
const BASE_URL = "https://your-app-name.onrender.com/api";
```
