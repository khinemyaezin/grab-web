# Current System Architecture

## 1. Application Overview
The application is the **Seller Frontend Platform**. It is a comprehensive ecosystem designed to allow sellers to manage their operations. The application is built using a modern **Micro-Frontend (MFE)** architecture to enable independent development, deployment, and scalability of different business domains.

## 2. Architecture & Overall Structure
The architecture is based on **Vite** and **Module Federation** (`@module-federation/vite`). It divides the application into a central Host (Shell) and multiple Remote modules (MFEs), supported by a monorepo of shared libraries.

### Core Components:
| Component | Type | Description / Responsibilities | Exposed Submodules / Services |
| :--- | :--- | :--- | :--- |
| seller | Shell / Host | The main entry point. It orchestrates the remote MFEs, handles global routing, injects minimal global context, and manages the layout. | None (Consumer) |
| seller-auth | Remote | Manages seller authentication flows (login, registration, etc.). | ./Routes, Services |
| seller-account | Remote | Manages the seller's accounts. | ./Routes, Services |
| seller-shared-ui | Shared Monorepo | A Turborepo-powered monorepo containing reusable packages. | ui-components <br> api-client <br> contracts |



## 3. Module Relationships
The dependency flow enforces that the Shell consumes the Remotes, and both Shell and Remotes consume the Shared Libraries.

```mermaid
flowchart TD
    %% Define Styles
    classDef shell fill:#4a90e2,color:#fff,stroke:#333,stroke-width:2px;
    classDef remote fill:#50e3c2,color:#000,stroke:#333,stroke-width:2px;
    classDef shared fill:#f5a623,color:#000,stroke:#333,stroke-width:2px;
    %% Nodes
    Shell["Shell"]:::shell
    Remote["Remote"]:::remote
    SharedPackages["Shared Packages"]:::shared
    %% Relationships
    Shell -->|"Consumes (Module Federation)"| Remote
    Remote --> SharedPackages
    Shell --> SharedPackages
```


## 4. Domain Boundary Rules

Each Remote module represents an isolated **domain boundary**. The rules below define what must stay inside a remote, what must live in shared packages, and how modules may (or may not) communicate.

### 4.1 Boundary Overview

```mermaid
flowchart TB
    classDef shell fill:#2563eb,color:#fff,stroke:#1d4ed8,stroke-width:2px;
    classDef remote fill:#10b981,color:#fff,stroke:#047857,stroke-width:2px,stroke-dasharray: 4;
    classDef shared fill:#f59e0b,color:#000,stroke:#d97706,stroke-width:2px;
    classDef backend fill:#7c3aed,color:#fff,stroke:#5b21b6,stroke-width:2px;
    classDef internal fill:#0f766e,color:#fff,stroke:#115e59,stroke-width:1px;

    Shell["Shell (Host MFE)"]:::shell

    subgraph RemoteBoundary["Remote Module Boundary"]
        direction TB
        RE["Exposed Context"]:::internal
        DS["Domain API Service"]:::internal
        RE -->|"Triggers Actions"| DS
    end

    subgraph SharedLayer["Shared Packages"]
        direction TB
        Client["api-client"]:::shared
        UI["ui-components / contracts"]:::shared
    end

    Backend["Backend API"]:::backend

    %% Connections
    Shell ==>|"Consumes Functions & Components"| RE
    DS -->|"Imports HTTP client"| Client
    RE -.->|"Uses theme/primitives"| UI
    Client ===>|"Performs API requests"| Backend
```

