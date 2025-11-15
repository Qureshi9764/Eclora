# 🕯️ Eclora - Handcrafted Candles & Gifting eCommerce

A premium, full-stack eCommerce website for Eclora, featuring elegant design, modern animations, and complete shopping functionality.

![Eclora Banner](https://images.unsplash.com/photo-1602874801006-48497bec1edd?w=1200&h=400&fit=crop)

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** - Elegant design with soft pink, beige, and navy color palette
- **Responsive Design** - Mobile-first approach, works on all devices
- **Smooth Animations** - Framer Motion for delightful interactions
- **State Management** - Redux Toolkit for predictable state
- **Form Validation** - React Hook Form + Yup for robust forms
- **Payment Integration** - Stripe checkout for secure payments

### 🔧 Backend
- **RESTful API** - Clean, well-structured endpoints
- **Authentication** - JWT-based user authentication
- **Database** - MongoDB with Mongoose ODM
- **File Upload** - Cloudinary integration for images
- **Payment Processing** - Stripe integration
- **Email Service** - Nodemailer for contact forms
- **Security** - Helmet, CORS, bcrypt password hashing

## 🚀 Tech Stack

### Frontend
- React.js 19
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Framer Motion
- Axios
- React Hook Form + Yup
- Stripe.js

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT
- Stripe
- Cloudinary
- Nodemailer
- Helmet
- Bcryptjs

## 📦 Project Structure

```
Eclora/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── store/      # Redux store
│   │   └── App.jsx
│   └── package.json
│
├── backend/            # Node.js + Express backend
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── index.js
│   └── package.json
│
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Stripe account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eclora
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

4. Start development server:
```bash
npm run dev
```

App runs on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Product Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Order Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | Public |
| GET | `/api/orders/:userId` | Get user orders | Private |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id` | Update order status | Admin |

### Payment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/create-checkout-session` | Create Stripe session | Public |
| POST | `/api/webhook` | Stripe webhook | Public |

### Contact Endpoint

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Send contact email | Public |

## 🎨 Design System

### Color Palette
- **Primary:** `#FADADD` - Soft blush pink
- **Secondary:** `#1C1C1C` - Deep charcoal
- **Accent:** `#B37BA4` - Lavender blush
- **Background:** `#FFF9F8` - Off-white
- **Text:** `#2E2E2E` - Dark text

### Typography
- **Headings:** Playfair Display (serif, elegant)
- **Body:** Poppins (clean sans-serif)

## 📱 Pages

1. **Home** - Hero section, featured products, categories, testimonials
2. **Shop** - Product grid with filters (category, brand, price) and search
3. **Product Details** - Image carousel, description, add to cart, related products
4. **Cart** - View items, update quantities, remove items
5. **Checkout** - Billing/shipping form, Stripe payment
6. **Login/Register** - User authentication
7. **About** - Brand story and values
8. **Contact** - Contact form with email integration

## 🔒 Security Features

- JWT authentication
- Password hashing with bcryptjs
- Helmet.js security headers
- CORS configuration
- Input validation
- Protected routes
- Admin role authorization

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Set environment variables:
   - `VITE_API_URL`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=your_backend_url
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=your_frontend_url
NODE_ENV=production
```

## 🧪 Testing

### Using Postman
1. Import API collection
2. Set environment variables
3. Test each endpoint
4. Verify response format

### Manual Testing
1. Test user registration/login
2. Browse products with filters
3. Add items to cart
4. Complete checkout with test card
5. Submit contact form

### Test Cards (Stripe)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for Eclora

## 🙏 Acknowledgments

- Design inspiration from modern eCommerce websites
- Images from Unsplash
- Icons from React Icons
- Fonts from Google Fonts

## 📞 Support

For support, email support@eclora.com or create an issue in the repository.

---

**Happy Shopping! 🛍️🕯️**

