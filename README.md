# WebTruyen - Manga Reading Platform

## Description
WebTruyen is a comprehensive manga reading ecosystem that provides a seamless reading experience across web and mobile platforms. The project consists of a full-featured web application, a native mobile app (iOS/Android via Expo), and a robust backend server. It supports user libraries, subscription plans for premium content, and a detailed admin dashboard for content management. 

Payment integrations include Stripe and VNPAY for flexible subscription options.

## Project Structure & Tech Stack

The project is divided into four main components:

### 1. Back-end Server (`back-end`)
The core API server handling business logic, database interactions, and authentication.
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2`)
- **Authentication**: JWT (JSON Web Tokens), bcrypt for hashing, Firebase Admin
- **Payment Integration**: Stripe, VNPAY
- **Utilities**: Nodemailer (Email services), Multer (File uploads), Dotenv

### 2. Front-end Web App (`front-end`)
The user-facing web interface and admin dashboard.
- **Framework**: React.js (Create React App)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Chart.js, React Chartjs 2 (for Admin Dashboard)
- **Rich Text Editor**: React Quill
- **Notifications**: React Toastify

### 3. Mobile App (`manga-app`)
A native mobile application for reading on the go.
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **Payment**: @stripe/stripe-react-native
- **Storage**: Expo Secure Store, Async Storage
- **UI/UX**: Expo Image Picker, React Native Webview, HTMLView

### 4. VNPAY Service (`vnpay_nodejs`)
A dedicated Node.js service for handling VNPAY payment gateway implementation and transaction processing.
- **Framework**: Express.js
- **Template Engine**: Jade
- **Features**: VNPAY transaction hashing, URL generation, and IPN handling.

---

## Features

### 🌟 User Features
- **Account Management**: Secure Sign Up, Sign In, and Password Recovery.
- **Library**: Follow favorite manga, track reading history, and view liked content.
- **Discovery**: Search and filter manga by Genre, Author, or popularity.
- **Reading Experience**: Optimized chapter viewer for web and mobile.
- **Subscription Plans**: Purchase premium plans to access exclusive content.
- **Cross-Platform**: Synchronized experience between Web and Mobile apps.

### 🛡️ Admin Dashboard (Web)
- **Statistics**: Visualized data for User growth, Revenue, and Content engagement.
- **Content Management**:
  - **Manga**: Create, update, and delete manga series.
  - **Chapters**: Upload and manage chapter content.
  - **Authors & Genres**: Manage metadata.
- **User Management**: View user list and manage accounts.
- **Plan Management**: Configure subscription tiers and pricing.
- **Document Management**: centralized file/document handling.

---

## Getting Started

### Prerequisites
- Node.js installed
- MySQL Database running

### 1. Run the Back-end
```bash
cd back-end
npm install
# Configure .env file with your DB and API keys
npm start
```

### 2. Run the Front-end
```bash
cd front-end
npm install
npm start
```
Access at `http://localhost:3000`

### 3. Run the Mobile App
```bash
cd manga-app
npm install
npx expo start
```
Scan the QR code with Expo Go (Android/iOS) to run.

### 4. Run VNPAY Service (Optional)
```bash
cd vnpay_nodejs
npm install
npm start
```
Access at `http://localhost:8888`
