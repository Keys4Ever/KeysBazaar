# KeysBazaar

**KeysBazaar** is a non-functional e-commerce website prototype designed to showcase the user interface and architecture of a modern online store.

## Project Overview

KeysBazaar simulates the core functionalities of a typical e-commerce platform, including product browsing, wishlisting, and cart management. While it is currently non-operational (lacking a backend connection or full database integration), it demonstrates how a real-world e-commerce solution can be structured using modern web development tools.

## Features

- **Product Listing**: Browse a catalog of products by category.
- **Wishlist**: Save items for future reference.
- **Shopping Cart**: Add and manage products in the cart.
- **User Profiles**: Different user roles are planned (Admin, Registered User, Guest).
- **Local Storage for Guests**: Non-registered users (guests) can save their cart and wishlist in local storage.

## Technology Stack

- **Frontend**: Vite + React.js for fast development and a reactive user interface.
  - **HTML, CSS, JavaScript**: For crafting the structure, design, and interactivity of the platform.
- **Backend**: Node.js + Express.js for server-side logic (future implementation).
  - Currently designed to handle API requests, user management, and product data once integrated.
  
## Database Structure (Conceptual)

While the current version lacks database integration, below is a conceptual layout of the intended database design:

1. **Users**
   - Admin
   - Registered Users
   - Guest (Not stored in DB, information handled via local storage)

2. **Products**
   - Includes details such as name, price, description, category, and stock availability.
  
3. **Wishlist**
   - Products saved by users for future purchases.
   
4. **Category**
   - Classifies products by type or use case.

5. **Cart**
   - Stores items added to the cart by the user, either in the database for registered users or in local storage for guests.