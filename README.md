## 🚀 **MERN Blog Application**
A full-stack blog application built using the MERN (MongoDB, Express, React, Node.js) stack, featuring robust user authentication, post authorization, and a modern, responsive user interface.

### ✨ **Key Features Implemented**
This project focuses on building a secure, professional, and fully functional blogging platform, including the following features:

* **User Authentication:** Full Register and Login functionality using **JSON Web Tokens (JWT)** for secure session management.
* **Context API for Auth:** Implemented `AuthContext` on the client side to manage global authentication state (user data and token).
* **Post Creation & Management:** Authenticated users can create, view, edit, and delete their own posts.
* **Authorization Checks (CRITICAL):**
    * **Server-Side:** Implemented middleware to protect post creation, update, and delete routes, ensuring actions are only performed by logged-in users with valid tokens.
    * **Client-Side:** Logic ensures the **Edit** and **Delete** buttons are only visible to the user who originally authored the post.
* **Professional UI/UX:**
    * Modern, centralized **Login/Register** card design.
    * **Responsive Design:** Implemented a CSS **Hamburger Menu** that adapts the navigation bar for optimal viewing on mobile devices.

---

### 🛠️ **Project Setup and Installation**
Follow these steps to get the MERN Blog up and running on your local machine.

#### Prerequisites
* **Node.js** (v18.x or later recommended)
* **MongoDB** instance (local or remote/Atlas)
* **Git**

#### 1. Backend Setup (`/server`)
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a **`.env`** file in the `/server` directory and add your configuration variables:
    ```env
    PORT=5000
    MONGO_URI="mongodb+srv://olawoore589_db_user:Olajoedii18@cluster01.5btmonn.mongodb.net"
    
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5000`.

#### 2. Frontend Setup (`/client`)
1.  Open a new terminal window and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React application:
    ```bash
    npm run dev
    ```
    The client application will typically run on `http://localhost:5173` (Vite default).

---

### 🧭 **Usage**
* **Register:** Navigate to `/register` and create a new account.
* **Login:** Log in with your new credentials.
* **Create Post:** Navigate to `/create` to write a new blog entry.
* **Manage Posts:** View a post. If you are the author, the **Edit** and **Delete** buttons will be visible. If you are not the author, the buttons will be correctly hidden.