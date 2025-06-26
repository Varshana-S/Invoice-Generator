# Invoice Generator Backend

A robust Node.js/Express backend for the Invoice Generator application with MongoDB integration.

## 🚀 Features

- **MongoDB Integration**: Full CRUD operations for invoices
- **User Authentication**: JWT-based authentication system
- **RESTful API**: Clean, well-documented API endpoints
- **Data Validation**: Comprehensive input validation
- **Security**: Helmet, CORS, and other security measures
- **Error Handling**: Global error handling with detailed responses
- **Logging**: Request logging with Morgan
- **Statistics**: Built-in analytics and reporting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the Backend directory with the following variables:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/invoices
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ MongoDB Connection

### Local MongoDB
If you're using a local MongoDB instance:
```env
MONGODB_URI=mongodb://localhost:27017/invoices
```

### MongoDB Atlas
If you're using MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoices?retryWrites=true&w=majority
```

### MongoDB Compass Connection
1. Open MongoDB Compass
2. Click "New Connection"
3. Enter your connection string:
   - **Local**: `mongodb://localhost:27017`
   - **Atlas**: `mongodb+srv://username:password@cluster.mongodb.net`
4. Click "Connect"
5. Navigate to the `invoices` database
6. You'll see the `forms` and `users` collections

## 📊 Database Schema

### Forms Collection
```javascript
{
  // Company Information
  companyName: String (required),
  companyAddress: String (required),
  companyEmail: String (required),
  companyPhone: String,
  
  // Client Information
  clientName: String (required),
  clientAddress: String (required),
  clientEmail: String,
  clientPhone: String,
  
  // Invoice Details
  invoiceNumber: String (required),
  invoiceDate: Date (required),
  dueDate: Date (required),
  
  // Items Array
  items: [{
    description: String (required),
    quantity: Number (required),
    rate: Number (required),
    amount: Number (required)
  }],
  
  // Financial Details
  subtotal: Number (required),
  taxRate: Number (default: 0),
  taxAmount: Number (default: 0),
  discount: Number (default: 0),
  shipping: Number (default: 0),
  total: Number (required),
  
  // Additional Fields
  currency: String (default: 'USD'),
  notes: String,
  terms: String,
  status: String (enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  company: {
    name: String,
    address: String,
    phone: String,
    website: String
  },
  role: String (enum: ['user', 'admin']),
  isActive: Boolean (default: true),
  lastLogin: Date,
  emailVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/stats` - Get authentication statistics

### Forms Routes
- `GET /api/forms` - Get all forms (with pagination and filtering)
- `GET /api/forms/:id` - Get single form by ID
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `GET /api/forms/stats/overview` - Get form statistics

### Health Check
- `GET /health` - API health status
- `GET /` - API information

## 📝 API Examples

### Create a New Invoice
```bash
curl -X POST http://localhost:5000/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "My Company",
    "companyAddress": "123 Business St, City, State",
    "companyEmail": "contact@mycompany.com",
    "clientName": "Client Name",
    "clientAddress": "456 Client Ave, City, State",
    "invoiceNumber": "INV-001",
    "invoiceDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "items": [
      {
        "description": "Web Development",
        "quantity": 1,
        "rate": 1000,
        "amount": 1000
      }
    ],
    "subtotal": 1000,
    "taxRate": 8.5,
    "taxAmount": 85,
    "total": 1085,
    "currency": "USD"
  }'
```

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "company": {
      "name": "John's Business",
      "address": "123 Main St",
      "phone": "+1234567890"
    }
  }'
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/invoices` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret_key_here` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## 🚨 Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Express-validator
- **Password Hashing**: bcryptjs
- **JWT**: Secure token-based authentication
- **Rate Limiting**: (Can be added with express-rate-limit)

## 📈 Monitoring

The server includes:
- Request logging with Morgan
- Database connection monitoring
- Error tracking
- Health check endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please check:
1. MongoDB connection status
2. Environment variables configuration
3. API documentation
4. Server logs for error details 