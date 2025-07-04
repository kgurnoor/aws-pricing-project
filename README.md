# AWS Pricing Visualizer
A full-stack application to visualize AWS pricing data using a Node.js backend and a modern React (Vite) frontend.

**Live App:**  
[https://aws-pricing-project-frontend.vercel.app](https://aws-pricing-project-frontend.vercel.app/)

---

- **GitHub Repository:** [github.com/kgurnoor/aws-pricing-project](https://github.com/kgurnoor/aws-pricing-project)
- **Live Frontend:** [https://aws-pricing-project-frontend.vercel.app](https://aws-pricing-project-frontend.vercel.app/)
- **Live Backend:** [https://aws-pricelist-visualizer-backend.vercel.app](https://aws-pricelist-visualizer-backend.vercel.app/)

---



## Project Structure

- [`backend/`](https://github.com/kgurnoor/aws-pricing-project/tree/main/backend): Node.js backend serving AWS pricing data
- [`frontend/`](https://github.com/kgurnoor/aws-pricing-project/tree/main/frontend): Vite-based React frontend for data visualization

## Features

- Fetches and serves real AWS pricing data
- Interactive frontend for exploring AWS services and pricing
- Modular, easy-to-deploy architecture

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Setup

1. **Clone the repository:**
git clone https://github.com/kgurnoor/aws-pricing-project.git
cd aws-pricing-project

2. **Install dependencies:**

cd backend
npm install
cd ../frontend
npm install

3. **Run the backend:**

cd backend
node server.js

4. **Run the frontend:**
cd frontend
npm run dev

5. **Open the frontend in your browser:**
- Usually at [http://localhost:5173](http://localhost:5173)

## Deployment

- Both backend and frontend can be deployed separately on Vercel.
- Set environment variables (e.g., `VITE_API_URL` for the frontend) as needed.

## License

This project is licensed under the MIT License.
