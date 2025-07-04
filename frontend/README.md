# AWS Pricing Visualizer Frontend

This is the React (Vite) frontend for the AWS Pricing Visualizer project.

## Features

- Modern, responsive UI for exploring AWS pricing data
- Service selector, duration filtering, and more
- Connects to the backend via configurable API URL

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Setup

1. **Install dependencies:**
npm install

2. **Configure Environment Variables:**
- Create a `.env` file in this directory:
  ```
  VITE_API_URL=http://localhost:3000/api
  ```
- For production, set `VITE_API_URL` in your deployment environment (e.g., Vercel dashboard).

3. **Run the development server:**
npm run dev

4. **Open the app in your browser:**
- Usually at [http://localhost:5173](http://localhost:5173)

## Deployment

- Deploy on Vercel or any static hosting that supports Vite.
- Set the `VITE_API_URL` environment variable to point to your backend.

## License

MIT License
