# Maison frontend

Run `npm install`, then `npm run dev` from this folder. Copy `.env.example` to `.env` to connect the API. Without `VITE_API_URL`, the app uses realistic local product data; cart and wishlist persist in local storage.

The server API should run at `http://localhost:5000`. Admin pages require a JWT user whose `userRole` is `admin`.
