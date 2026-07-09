# Seller Frontend Platform

Welcome to the **Seller Frontend Platform**. It is a comprehensive ecosystem designed to allow sellers to manage their operations. This application is built using a modern Micro-Frontend (MFE) architecture to enable independent development, deployment, and scalability of different business domains.

For details on our system structure, boundaries, and how MFEs communicate, please refer to the [Current System Architecture](/docs/Current_System_Architecture.md) documentation.

---

## Running with Docker

The platform is designed to be easily run locally using Docker Compose.

### Prerequisites

1. **Docker & Docker Compose** installed.
2. **NPM Registry Authentication** (`~/.npmrc`) containing access tokens to private grab registries/scopes (used as a Docker build secret).
3. **External Docker Network**: The compose services depend on an external network named `grab-dev-network`.

### 1. Create the Docker Network
Before starting the containers for the first time, you must create the external developer network:
```bash
docker network create grab-dev-network
```

### 2. Start the Services
Run the following command to build and start the host shell and remote MFEs:
```bash
docker compose up --build
```

### 3. Ports Configuration
Once the containers are running, you can access the application via the following ports:

| Service | Port | Description |
| :--- | :--- | :--- |
| **`grab-seller`** | `3000` | Host / Shell Application |
| **`grab-seller-auth`** | `3003` | Authentication Remote MFE |
| **`grab-seller-account`** | `3004` | Onboarding / Account Remote MFE |
