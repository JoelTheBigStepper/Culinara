Culinara — Recipe Sharing Platform
A full-stack recipe sharing web application where users can discover, create, and save recipes from cuisines around the world.
Tech Stack: MongoDB, Express.js, React, Node.js (MERN) · Cloudinary · JWT Authentication · Tailwind CSS · Render · Vercel
Key Features:

JWT-based authentication with access/refresh token rotation, httpOnly cookies, and per-device session revocation
Full recipe CRUD — create recipes with ingredients, step-by-step directions, cook time, difficulty, cuisine and category tagging
Image uploads processed server-side and streamed to Cloudinary — no cloud credentials exposed on the client
Favorites system persisted in MongoDB, synced in real time across the app
Browse recipes by cuisine, category, trending, newest, or fastest to cook
Full-text search across title, ingredients, cuisine and category
Responsive across mobile and desktop

Architecture highlights:

Decoupled frontend (Vercel) and backend (Render) with CORS-controlled communication
Access tokens stored in memory only — never localStorage — to mitigate XSS risk
Refresh tokens stored in MongoDB with TTL-based auto-expiry and rotation on every use
Centralized AuthContext for app-wide auth state with silent session restoration on load
Single upload endpoint on the backend handles both recipe images and avatars, with automatic format optimization via Cloudinary transformations
