# WebTruyen - Manga Reading Platform

## Description
WebTruyen is a comprehensive manga reading ecosystem that provides a seamless reading experience across web and mobile platforms. The project consists of a full-featured web application, a native mobile app (iOS/Android via Expo), and a robust backend server. It supports user libraries, subscription plans for premium content, and a detailed admin dashboard for content management.

Payment integrations include Stripe and VNPAY for flexible subscription options.

## Project Structure & Tech Stack

The project is divided into three main components:

### 1. Back-end Server (`back-end`)
The core API server handling business logic, database interactions, and authentication.
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2`)
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Payment Integration**: Stripe, VNPAY (Built-in routes)

### 2. Front-end Web App (`front-end`)
The user-facing web interface and admin dashboard.
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Admin**: Chart.js, React Quill

### 3. Mobile App (`manga-app`)
A native mobile application for reading on the go.
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **Payment**: Stripe React Native

---

## Setup & Installation

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v18+ recommended)
- **MySQL Database** installed and running
- **Expo Go** app on your phone (for mobile testing) or Android/iOS Emulator

### 1. Database Setup
1. Create a MySQL database (e.g., `webtruyen_db`).
2. Import the `db-script.sql` file located in the root directory into your database to create the necessary tables.

### 2. Back-end Setup
Navigate to the back-end directory and install dependencies:
```bash
cd back-end
npm install
```

**Configuration via `.env`**:
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and configure the following values:

| Variable | Description |
|----------|-------------|
| **DB_HOST**, **DB_USER**, **DB_PASSWORD**, **DB_NAME** | Your MySQL database connection details. |
| **JWT_ACCESS_TOKEN_SECRET** | Secret key for signing access tokens (random string). |
| **JWT_REFRESH_TOKEN_SECRET** | Secret key for signing refresh tokens (random string). |
| **EMAIL_USER**, **EMAIL_PASSWORD** | SMTP credentials for sending emails (e.g., Gmail App Password). |
| **STRIPE_SECRET_KEY** | Your Stripe Secret Key. |
| **VNP_TMNCODE**, **VNP_SECRET** | VNPAY Merchant credentials. |
| **VNP_RETURN_URL** | URL for VNPAY callback (e.g., `http://localhost:3000/account/payment`). |
| **ALLOWED_ORIGINS** | CORS allowed origins (Comma separated, e.g. `http://localhost:3000`). |

3. Start the server:
```bash
npm start
```
*Server runs on port 5000 by default.*

### 3. Front-end Setup
Navigate to the front-end directory and install dependencies:
```bash
cd front-end
npm install
```

**Configuration via `.env`**:
1. Create a `.env` file (or copy from example if available):
   ```bash
   cp .env.example .env
   ```
2. Configure the API URL:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

3. Start the web app:
```bash
npm start
```
*Access at `http://localhost:3000`*

### 4. Mobile App Setup
Navigate to the mobile app directory and install dependencies:
```bash
cd manga-app
npm install
```

**Configuration**:
1. Open `manga-app/utils/const.js`.
2. Update `BASE_URL` with your computer's local IP address (NOT localhost) so the phone can connect to the backend.
   ```javascript
   // Example:
   export const BASE_URL = "http://192.168.1.10:5000"; 
   export const STRIPE_RETURN_URL = "exp://192.168.1.10:8081";
   ```
   *To find your IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux).*

3. Start the Expo server:
```bash
npx expo start
```
4. Scan the QR code with the **Expo Go** app on your phone.

---

## Features

### 🌟 User Features
- **Account**: Sign Up, Log In, Password Recovery.
- **Library**: Follow manga, history tracking, liked manga.
- **Reading**: Optimized viewer, chapter navigation.
- **Payments**: Subscription plans via Stripe or VNPAY.

### 🛡️ Admin Dashboard
- **Analytics**: User growth, revenue charts.
- **CMS**: Manage Mangas, Chapters, Authors, Genres.
- **Users**: Manage accounts and plans.
