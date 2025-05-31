# 🏠 HomeHaven - Building Management System

**HomeHaven** is a full-featured Building Management System (BMS) that simplifies apartment rental and resident management for users, tenants, and administrators.

## 🌐 Live URLs

- **Client**: [https://home-haven-8d2d8.web.app](https://home-haven-8d2d8.web.app)
- **Server**: [https://bms-server-amber.vercel.app](https://bms-server-drab.vercel.app)

---

## 🎯 Purpose

HomeHaven was developed to help manage apartment rentals, automate user roles, and streamline tenant interactions through a secure and responsive dashboard system. It provides role-based functionality for renters, members, and admins, with an intuitive UI and powerful backend capabilities.

---

## 🚀 Key Features

### 👥 Authentication & Roles
- Firebase Authentication (Email/Password and Google)
- JWT-based route protection
- Role-based access: User, Member, Admin

### 🏢 Apartment Listings
- View available apartments with pagination
- Search by rent range
- Book apartments (one per user)
- View apartment location details

### 📋 Agreement Management
- Users can request rental agreements
- Admins can approve/reject and assign roles

### 🧑‍💼 Admin Dashboard
- View stats: users, members, availability
- Manage members and their roles
- Create and manage announcements
- Manage discount coupons

### 📢 Announcements
- Admins can post public announcements for users

### 🎟️ Coupons
- Admins can create/edit/delete coupons
- Users can apply coupons during booking

---

## 📦 NPM Packages Used

### Client-side
- **React** - Frontend framework
- **React Router DOM** - Routing
- **Firebase** - Authentication
- **Axios** - HTTP requests
- **SweetAlert2** - Alerts and confirmations
- **React Icons** - Icon library
- **Lucide React** - Icon set
- **DaisyUI** - Tailwind UI components
- **Tailwind CSS** - Styling

### Server-side
- **Express** - Web framework
- **MongoDB** with **Mongoose** - Database and schema
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **jsonwebtoken** - JWT auth
- **cookie-parser** - Cookie management
- **express-rate-limit** - Rate limiting

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

Made with 💙 by [Mst. Sanjida Akter]

Feel free to contribute or raise issues to help improve the platform.






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
