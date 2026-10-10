# Gateway

A Node.js and TypeScript API Gateway designed to manage and route requests to multiple microservices. This project includes scripts to install and uninstall dependencies across all services.

## Features

- **API Gateway** — Central entry point for routing requests to microservices.
- **Microservice Pipeline** — Create and manage microservices using `create-microservice-pipeline`.
- **Install All Services** — Install dependencies across all configured services.
- **Uninstall All Services** — Uninstall dependencies across all configured services.
- **TypeScript Support** — Develop and compile TypeScript code.
- **Reverse Proxy** — Forward requests to backend services using `http-proxy-middleware`.

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

## Installation

Clone the repository and navigate to the gateway project directory.

```bash
npm install
```

## Create a Microservice

Use `npx cmp` to create a microservice pipeline and set up the required service structure and configuration.

```bash
npx cmp
```

Follow the prompts provided by the CLI.

## Install Dependencies Across All Services

After configuring your services, run the following command from the gateway project root:

```bash
npm run install-all
```

This executes the `src/install-all.ts` script to install dependencies across all configured services.

## Uninstall Dependencies Across All Services

To uninstall dependencies across all configured services, run:

```bash
npm run uninstall-all
```

This executes the `src/uninstall-all.ts` script.

## Development

Start the gateway in development mode:

```bash
npm run dev
```

## Build

Compile the TypeScript source code:

```bash
npm run build
```

The compiled JavaScript files are generated in the configured TypeScript output directory, typically `dist/`.

## Production

Run the compiled gateway application:

```bash
npm start
```

## Available Scripts

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm install`           | Install gateway dependencies               |
| `npx cmp`               | Run the microservice pipeline CLI          |
| `npm run install-all`   | Install dependencies across all services   |
| `npm run uninstall-all` | Uninstall dependencies across all services |
| `npm run dev`           | Start the gateway in development mode      |
| `npm run build`         | Compile TypeScript                         |
| `npm start`             | Run the compiled application               |

## Environment Variables

Create a `.env` file in the project root and configure the environment variables required by your gateway and services.

Keep secrets and credentials out of version control. Use a `.env.example` file to document required variables.

## Tech Stack

- Node.js
- TypeScript
- Express
- HTTP Proxy Middleware
- Mongoose
- Morgan
- CORS
- Create Microservice Pipeline

## License

ISC
