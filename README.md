# Social
  
## About the Project
This is a fully-functional social media web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It is designed to allow users to connect with each other, share moments, and communicate in real-time. The application features a clean, responsive UI built with Material-UI and real-time chat capabilities powered by Socket.io.

Users can register, create text or media posts, interact with others through likes and comments, and follow other users to curate their personalized feed.

#### Note
> The live server is hosted on a free tier, so it may take up to a minute to wake up from sleep mode upon the first request. Once the server is live, the website is fully functional.

#### Demo Account Credentials
- **Email:** demo@p.com 
- **Password:** demo@123

[Live site](https://www.social.is-great.net/)

## Features
- **User Authentication:** Secure registration, login, and logout using JWT and bcrypt.
- **Post Creation:** Users can create posts containing text, images, or videos.
- **Interactions:** Like and comment on posts to engage with content.
- **Follow System:** Follow other users to see their posts in your feed.
- **Realtime Chat:** Instant messaging with other users in real-time.

## Technologies Used
- **MongoDB:** NoSQL database for storing user data, posts, and relationships.
- **Express.js:** Backend framework for handling HTTP requests and routing.
- **React.js:** Frontend library for building the user interface.
- **Node.js:** JavaScript runtime environment for running server-side code.
- **JWT (JSON Web Tokens):** For user security and stateless authentication.
- **Socket.io:** For real-time, bidirectional communication (Chat).
- **Nodemailer:** For sending verification emails (OTP).
- **Material-UI (MUI):** React UI framework for building responsive and attractive components.

## Setup Guide

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Setup the Backend (API):**
   ```bash
   cd api
   npm install
   ```
   - Create a `.env` file in the `api` directory and add the necessary environment variables (e.g., `MONGO_URL`, `JWT_SECRET`, Email Credentials, AWS S3 Credentials).
   - Start the API server:
   ```bash
   npm start
   ```

3. **Setup the Real-time Server (Socket):**
   ```bash
   cd socket
   npm install
   ```
   - Create a `.env` file in the `socket` directory if required.
   - Start the socket server:
   ```bash
   npm start
   ```

4. **Setup the Frontend (Client):**
   ```bash
   cd client
   npm install
   ```
   - Start the React development server:
   ```bash
   npm start
   ```

## Contact
If you have any questions or suggestions, feel free to contact me at [parthadeuri4@gmail.com](mailto:parthadeuri4@gmail.com) or visit my GitHub profile for more information.
