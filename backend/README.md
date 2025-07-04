# AWS Pricing Visualizer Backend

This is the Node.js backend for the AWS Pricing Visualizer project. It serves AWS pricing data via a RESTful API.

## Features

- Serves AWS pricing data from local files or external sources
- Provides endpoints for services, durations, and more
- Designed for easy integration with a React frontend

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Setup

1. **Install dependencies:**
- npm install

2. **Start the server:**
- node server.js

3. **API Endpoints:**
- `/api/services` — List available AWS services
- `/api/durations` — List available durations
- Additional endpoints as defined in the code

4. **Environment Variables:**
- Configure as needed for your deployment (e.g., port, data paths)

## Deployment

- Can be deployed on Vercel using the included `vercel.json`.
- Exposes API endpoints for use by the frontend.

## License

MIT License
