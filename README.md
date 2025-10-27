# ⚡ QuickComm

**QuickComm** is a quick-commerce web application designed to deliver a fast, intuitive, and complete shopping experience.  
The platform is divided into two main modules:

1. **User Interface (UI)** – For customers to browse products, view details, and manage their cart.  
2. **Admin Panel** – For administrators to manage categories, subcategories, brands, products, offers, and banners.

QuickComm provides seamless interaction between both modules through real-time data updates and secure backend integration.

---

## 🛍️ User Interface Overview

### 1. 🏠 Home Page with Dynamic Content
- The homepage showcases **banners**, **trending products**, and **popular offers** to attract users.  
- Prominent category sections (like Groceries, Electronics, etc.) make navigation easy and engaging.

![Home Page Preview](https://github.com/Chanchal-Doijod/Quick-commerce/blob/a0859467404a5ee659da0c0e22149083418e512a/Screenshot%202024-12-04%20155353.png)
![Home Page Preview 1](https://github.com/Chanchal-Doijod/Quick-commerce/blob/051ca4d453997f34c746be5855f4a9ca99be746c/Screenshot%202024-12-04%20155728.png)

---

### 2. 🧭 Product Browsing and Navigation
- **Category Navigation**: Users can browse items by category via the navigation bar.  
- **Product Details Page**:
  - Displays product information such as price, description, and available offers.  
  - Clean, responsive design optimized for readability.

![Product Page](https://github.com/Chanchal-Doijod/Quick-commerce/blob/b6fafa63f3bc8e9d0297af6bcb5a0350783534ea/Screenshot%202024-12-04%20155837.png)
![Product Details](https://github.com/Chanchal-Doijod/Quick-commerce/blob/051ca4d453997f34c746be5855f4a9ca99be746c/Screenshot%202024-12-04%20155759.png)

---

### 3. 🛒 Cart Management
- **Add to Cart**: Users can easily add products to their cart directly from product pages.  
- **View Cart**:  
  - Displays a summary of selected products with quantity, name, and total price.  
  - Allows users to modify cart contents or proceed to checkout.

![Cart Preview](https://github.com/Chanchal-Doijod/Quick-commerce/blob/051ca4d453997f34c746be5855f4a9ca99be746c/Screenshot%202024-12-04%20155905.png)

---

### 4. 📱 Responsive and User-Friendly Interface
- Built using **React.js** and **Material-UI** for a modern and responsive design.  
- Fully optimized for both desktop and mobile devices.

---

## 🧩 Admin Panel Overview

### 1. 🧭 Admin Dashboard
The **Admin Panel** empowers administrators to manage the platform efficiently.  
Core functionalities include:
- Add and update **categories, subcategories, brands, products, and offers**.  
- Upload **banners and product images** securely using **Multer**.  
- Add detailed product information such as:
  - Product title and description  
  - Offer price and bank offers  
  - Brand and category mapping  
- Manage **discounts, special deals, and bank offers**.  
- Real-time updates automatically reflect in the user interface.

![Admin Dashboard](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20234620.png)

---

### 2. 🗂️ Category, Subcategory, Brand & Product Management
Admins can manage all product-related data through structured, easy-to-use interfaces:

- **Add Subcategory**  
  ![Subcategory Add](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20234656.png)

- **Add Brand**  
  ![Brand Add](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20234714.png)

- **Register New Product**  
  ![Product Register Add](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20234724.png)

---

### 3. 💸 Offers and Promotions Management
Admins can create and manage promotional campaigns with ease:  

- **Add Bank and Other Offers**  
  ![Bank Offers Add](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20235948.png)

- **Add Product/Seasonal Offers**  
  ![Add Offers](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20235939.png)

---

### 4. 🖼️ Product Media Management
- Upload and manage **product images and banners** via **Multer**.  
- Images are securely stored on the backend for stable and scalable performance.

![Product Pictures Add](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-28%20000010.png)

---

### 5. 📊 Data Display and Overview Pages
All added data (categories, subcategories, brands, offers, etc.) is neatly listed in structured display tables for easy management:

- **Subcategory Display**  
  ![Subcategory Display](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20235847.png)

- **Brand Display List**  
  ![Brand Display List](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20235858.png)

- **Product List**  
  ![Product List](https://github.com/Chanchal-Doijod/Quick-commerce/blob/main/Screenshot%202025-10-27%20235910.png)

---

> 💡 **The Admin Panel ensures complete backend control with real-time updates, secure data handling, and smooth synchronization with the user interface.**

---

## 🧠 Tech Stack

### Frontend
- **React.js** – Component-based UI architecture  
- **Redux** – Centralized state management  
- **Material-UI** – Modern and responsive design system  

### Backend
- **Node.js** + **Express.js** – RESTful API handling and server-side logic  

### Database
- **MongoDB** or **MySQL** – For storing products, users, and order data  

---

## ⚙️ Installation Guide

### Prerequisites
Make sure you have:
- **Node.js** (v14 or above)  
- **npm** (v6 or above)

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chanchal-Doijod/quickcommerce.git
