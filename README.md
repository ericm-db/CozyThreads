# Cozy Threads E-Commerce Application

A modern e-commerce application for Cozy Threads, an ethical apparel brand, featuring Stripe payment integration.

## Features

- Responsive product catalog
- Shopping cart functionality
- Secure checkout with Stripe Payment Element
- Order confirmation flow
- Mobile-friendly design

## Tech Stack

- **Frontend**:
  - React 18
  - React Router 6
  - Stripe React Elements
  - CSS3 with responsive design

- **Backend**:
  - Node.js
  - Express
  - Stripe API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Stripe account (for API keys)

### Installation

1. **Clone the repository**:

```bash
cd cozy-threads
```

2. **Install frontend dependencies**:

```bash
npm install
```

3. **Install backend dependencies**:

```bash
cd server
npm install
cd ..
```

4. **Environment Setup**:

Create a `.env` file in the `server` directory with the following content:

```
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

Replace the placeholder values with your actual Stripe API keys.

5. **Start the backend server**:

```bash
cd server
npm run dev
```

6. **Start the frontend development server** (in a new terminal):

```bash
npm start
```

7. The application should now be running:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Application Structure

```
cozy-threads/
├── public/               # Static files
├── src/                  # React application source
│   ├── components/       # React components
│   ├── App.js            # Main application component
│   └── index.js          # Entry point
├── server/               # Express server
│   ├── server.js         # Server implementation
│   └── .env              # Environment variables (create this)
└── README.md             # This file
```

## Usage Guide

### Browsing Products

- The homepage displays all available products
- Click on a product to view more details
- Add products to your cart directly from the catalog or detail page

### Shopping Cart

- View your cart by clicking the Cart link in the navigation
- Adjust quantities or remove items
- Proceed to checkout when ready

### Checkout

- Fill in your shipping information
- Enter payment details using Stripe's secure Payment Element
- Complete your purchase to receive an order confirmation

### Testing Stripe Payments

For testing purposes, you can use the following Stripe test card numbers:

- **Success**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Payment Fails**: 4000 0000 0000 9995

Use any future expiration date, any 3-digit CVC, and any postal code.

## Development Notes

### Stripe Integration

The application uses Stripe's Payment Element to securely collect payment information. The integration follows these steps:

1. The frontend requests a payment intent from the backend
2. The backend creates a payment intent with Stripe and returns the client secret
3. The frontend uses the client secret to render the Payment Element
4. The user submits payment details which are sent directly to Stripe
5. Stripe processes the payment and returns the result

### API Endpoints

The backend provides the following API endpoints:

- `GET /api/config` - Returns the Stripe publishable key
- `POST /api/create-payment-intent` - Creates a payment intent based on cart contents
- `POST /webhook` - Handles Stripe webhook events (for production use)

## Deployment

### Frontend Deployment

Build the React application for production:

```bash
npm run build
```

The built files in the `build` directory can be deployed to static hosting services like Netlify, Vercel, or AWS S3.

### Backend Deployment

The Express server can be deployed to services like Heroku, Render, or AWS Elastic Beanstalk. Make sure to set the environment variables in your deployment environment.
