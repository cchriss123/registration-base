# Authentication Service with Email Verification

This project implements a basic authentication system with login, registration, and email verification using SendGrid. It is built with Express.js and TypeScript.

## Endpoints

### POST /login
Log in a user and return authentication tokens.
- **Body**: `{ "username": "string", "password": "string" }`

### POST /refresh-token
Refresh the access token using the refresh token.
- **Headers**: `Authorization: Bearer <refreshToken>`

### POST /logout
Log out a user.
- **Headers**: `Authorization: Bearer <accessToken>`

### POST /insert-user
Register a new user.
- **Body**: `{ "username": "string", "password": "string", "email": "string" }`

### GET /verify/:token
Verify a user's email address via a token sent to their email.
- **Params**: `token`

## Setup and Installation

1. **Clone the repository.**
2. **Create a `.env` file:** Populate it with necessary environment variables such as database credentials and SendGrid API key.
3. **Option A: Run locally**
   - Install dependencies: `npm install`
   - Compile TypeScript to JavaScript: `npx tsc`
   - Ensure MySQL database is running. Use Docker Compose if preferred: `docker-compose up -d`
   - Start the server: `npm start`
4. **Option B: Run using Docker**
   - Ensure Docker is installed on your system.
   - Run: `docker-compose up` to start both the application and the MySQL database.

## Technologies Used
- Node.js
- Express.js
- TypeScript
- MySQL
- SendGrid API for email services
- Bcrypt for password hashing
- JSON Web Token (JWT) for access token management
- Dotenv for environment variable management
- CORS for cross-origin request handling
- Google APIs (if used for additional functionalities)
- TS-Node for running TypeScript in development
