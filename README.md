# Currency Exchange

A modern currency exchange application built with [Next.js](https://nextjs.org) that provides real-time currency conversion and exchange rates.

![alt text](https://muhammad-bilawal.tinytake.com/media/17e5775?filename=1764928114806_TinyTake05-12-2025-02-47-13_639005249115810156.png&sub_type=thumbnail_preview&type=attachment&width=722&height=471)

## Project Overview

This project is a Next.js-based currency exchange application that allows users to:
- View current currency exchange rates
- Convert amounts between different currencies
- Access a clean and intuitive user interface for currency transactions

The application uses a combination of Next.js for the frontend and API routes for backend functionality, containerized with Docker for easy deployment and local development.

## Getting Started with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed on your system

### Running Locally with Docker

1. Clone the repository
2. Start the application using Docker Compose:

```bash
docker-compose up -d --build
```

This will:
- Build the Docker image
- Start the application container
- Make the app available at [http://localhost:3000](http://localhost:3000)

To stop the application:

```bash
docker-compose down
```

To view logs:

```bash
docker-compose logs -f
```

## Getting Started with Node.js (Local Development)

If you prefer to run the application without Docker:

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The `.env` file is committed to the repository as it's currently required for the project to run. This is a temporary solution and may be changed in the future for production deployments.

## Build for Production

```bash
npm run build
npm start
```
Feel free to reach me out in case of any question: bilawal.officials@gmail.com

