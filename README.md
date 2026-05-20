# 📋 Task Management Platform

A highly performant, full-stack Task Management application built using the MERN stack (MongoDB, Express, React, Node.js), powered by real-time updates via **Socket.io**, automated task notifications via **Cron Jobs**, and email-based secure OTP verification via **Nodemailer**.

This guide explains how to configure the backend and frontend environment so that anyone can log in, create tasks, receive real-time syncs, and run the project flawlessly.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)

---

## 🛠️ Step-by-Step Environment Configuration

To allow users to log in, register, and receive OTP codes, you must configure the environment variables correctly. Both `client` and `server` folders contain a `.env.example` file that you can copy to create your own active `.env` files.

### A. Backend Setup (`/server`)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Copy `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Open the newly created `.env` and configure the following variables:

#### 1. MongoDB Database Setup (`MONGO_URI`)
To allow the database to connect successfully for everybody:
* **Create a Cluster**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
* **Database User**: Go to **Database Access** under Security. Create a user with **Read and Write** permissions. Make sure to note down the password!
* **IP Whitelist (CRITICAL FOR COLLABORATION)**: Go to **Network Access** under Security. Click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`). This ensures that other developers or deployed servers can connect to the database.
* **Get Connection String**: Go to **Database** -> Click **Connect** -> Choose **Drivers** (Node.js). Copy the connection string, replace `<password>` with your database user's password, and set it as `MONGO_URI`.

#### 2. Email Service Setup (`EMAIL_USER` & `EMAIL_PASS`)
The system uses Nodemailer with Gmail to send email reminders and One-Time Passwords (OTPs) during signup. Since standard passwords are blocked by Google for SMTP:
* Go to your **Google Account Settings**.
* Navigate to **Security** and ensure **2-Step Verification** is turned **ON**.
* In the search bar at the top, search for **App Passwords** (or navigate to Security -> App Passwords).
* Under app selection, choose **Other (Custom Name)** and type `Task Manager`. Click **Generate**.
* Google will generate a unique 16-character App Password (e.g., `abcd efgh ijkl mnop`).
* Set `EMAIL_USER` to your Gmail address and `EMAIL_PASS` to this 16-character code (remove spaces if any).

#### 3. JWT & Port Settings (`JWT_SECRET` & `PORT`)
* **`PORT`**: The backend server port (defaults to `5000`).
* **`JWT_SECRET`**: Any strong random text string. This is used to sign secure session tokens.
* **`CLIENT_URL`**: Set this to the frontend URL (e.g., `http://localhost:3000` for development, or your custom Vercel/Netlify URL in production) so CORS allows communication.

---

### B. Frontend Setup (`/client`)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Copy `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and check the following parameters:
   * **`VITE_API_URL`**: Point this to your backend server API endpoint. For local development, set it to `http://localhost:5000/api`.
   * **`VITE_SOCKET_URL`**: Point this to your backend server Socket.io endpoint. For local development, set it to `http://localhost:5000`.

---

## 🏃 Running the Application Locally

Once you have set up your `.env` files, run both the backend and frontend servers:

### Start the Backend Server
```bash
cd server
npm install
npm start
```
*The server will start on port `5000` (or your configured `PORT`) and connect to MongoDB.*

### Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*The client will start a Vite development server on port `3000` (`http://localhost:3000`).*

---

## 📦 Production Deployment Guide

When deploying the app to the cloud (e.g., Vercel, Render, Heroku):

1. **Frontend Deployment (Vercel/Netlify)**:
   * Build command: `npm run build`
   * Output directory: `dist`
   * Environment variables:
     * `VITE_API_URL` -> Set to your production backend API URL (e.g., `https://your-backend.onrender.com/api`)
     * `VITE_SOCKET_URL` -> Set to your production backend socket URL (e.g., `https://your-backend.onrender.com`)

2. **Backend Deployment (Render/Heroku/Railway)**:
   * Add all backend `.env` variables (`MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`) into the service's Environment Dashboard.
   * Add `CLIENT_URL` to point to the live frontend domain (e.g. `https://your-frontend.vercel.app`) to ensure Socket.io and CORS function securely.
