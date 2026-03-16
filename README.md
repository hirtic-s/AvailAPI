# AvailAPI

AvailAPI is a comprehensive, multi-tenant SaaS platform designed to monitor API health, track latency, and validate SSL certificates in real-time. It provides developers with an intuitive React dashboard and customizable public status pages to transparently communicate system uptime.

## Key Features
- **Real-Time Uptime Monitoring**: Automated Quartz scheduled jobs to track endpoint availability and latency.
- **SSL Certificate Validation**: Proactive background checks for SSL expiration and certificate validity.
- **Custom Status Pages**: Shareable public status pages (`/status/:slug`) for incident communication and transparency.
- **Multi-Tenancy Support**: Built-in tenant architecture enabling isolated environments for different users or organizations.
- **Secure Authentication**: JWT-based user registration, authentication, and security configurations.
- **Interactive Analytics**: Visualized latency charts and dynamic uptime badges for quick health insights.

## Tech Stack
- **Backend**: Java, Spring Boot, Spring Security (JWT), Quartz Scheduler
- **Frontend**: React.js, React Router, Axios
- **Database**: PostgreSQL (managed via Flyway SQL migrations)
- **Infrastructure**: Docker, Docker Compose, Nginx Reverse Proxy
