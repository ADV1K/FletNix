# FletNix - Netflix Title Explorer

A full-stack web application for searching, filtering, and exploring Netflix titles from a CSV dataset. Built with Angular 19 (SSR), Node.js (Express + TypeScript), MongoDB, and Docker.

## 🚀 Features

- **User Authentication**: Secure registration and login with age-based content filtering
- **Show Search**: Search by title or cast members
- **Advanced Filtering**: Filter by type (Movie/TV Show) and genre
- **Pagination**: Browse shows 15 per page
- **Show Details**: View detailed information about each show
- **Recommendations**: Get genre-based recommendations for each show
- **Age Restrictions**: Users under 18 cannot see R-rated content
- **Server-Side Rendering**: Angular Universal SSR for SEO and performance

## 🛠️ Tech Stack

- **Frontend**: Angular 19 with SSR (Angular Universal), Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication with secure password hashing
- **Testing**: Playwright for E2E and API testing
- **Containerization**: Docker with multi-stage builds

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- MongoDB (if running locally without Docker)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FletNix
   ```

2. **Add the CSV file**
   - Place your `netflix_titles.csv` file in the root directory
   - The file should have columns: `show_id`, `type`, `title`, `director`, `cast`, `country`, `date_added`, `release_year`, `rating`, `duration`, `listed_in`, `description`

3. **Create `.env` file** (optional, defaults are provided)
   ```env
   MONGO_URI=mongodb://mongo:27017/fletnix
   JWT_SECRET=change_this_secret_key
   PORT=3000
   ```

4. **Start the application**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api (internal)
   - MongoDB: localhost:27017

The database will be automatically seeded on first startup if it's empty.

### Local Development

#### Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:3000`

#### Frontend

```bash
cd frontend
npm install
npm run serve
```

The frontend will run on `http://localhost:4200`

## 📁 Project Structure

```
fletnix/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app setup
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── scripts/            # Seed script
│   │   └── utils/              # Utilities (auth, etc.)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Angular components
│   │   │   ├── services/       # API services
│   │   │   ├── guards/         # Route guards
│   │   │   └── interceptors/   # HTTP interceptors
│   │   └── environments/       # Environment configs
│   ├── server.ts               # SSR server
│   ├── Dockerfile
│   └── package.json
├── tests/                      # Playwright tests
├── docker-compose.yml
├── netflix_titles.csv          # Dataset (add your own)
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "age": 25
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Shows

- `GET /api/shows` - Get shows with pagination and filters
  - Query parameters:
    - `page` (number): Page number (default: 1)
    - `q` (string): Search query (title or cast)
    - `type` (string): Filter by type ("Movie" or "TV Show")
    - `genre` (string): Filter by genre
  - Requires authentication

- `GET /api/shows/:id` - Get show details by ID
  - Requires authentication

- `GET /api/shows/:id/recommendations` - Get recommendations based on show genres
  - Requires authentication

### User

- `GET /api/user/me` - Get current user information
  - Requires authentication

## 🧪 Testing

### Run All Tests

```bash
npm install -g @playwright/test
npx playwright install
npx playwright test
```

### Run Specific Test Suites

```bash
# Authentication tests
npx playwright test tests/auth.spec.ts

# Show functionality tests
npx playwright test tests/shows.spec.ts

# Age restriction tests
npx playwright test tests/age-restriction.spec.ts

# API tests
npx playwright test tests/api.spec.ts
```

### View Test Results

```bash
npx playwright show-report
```

## 🔒 Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- HTTP-only cookies for token storage
- Age-based content filtering
- CORS protection
- Input validation

## 📝 Environment Variables

### Backend

- `MONGO_URI`: MongoDB connection string (default: `mongodb://localhost:27017/fletnix`)
- `JWT_SECRET`: Secret key for JWT tokens (default: `change_this_secret_key`)
- `PORT`: Backend server port (default: `3000`)
- `FRONTEND_URL`: Frontend URL for CORS (default: `http://localhost:8080`)

### Frontend

- `API_URL`: Backend API URL (default: `http://localhost:3000`)
- `PORT`: Frontend SSR server port (default: `4200`)

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Remove volumes (clears database)
docker-compose down -v
```

## 🔧 Development

### Backend Scripts

```bash
cd backend
npm run dev        # Development server with hot reload
npm run build      # Build TypeScript
npm run start      # Start production server
npm run seed       # Manually run seed script
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Frontend Scripts

```bash
cd frontend
npm run serve      # Development server
npm run build      # Build for production
npm run build:ssr  # Build with SSR
npm run serve:ssr  # Serve SSR build
npm run lint       # Run ESLint
```

## 📊 Data Schema

### Show Model

```typescript
{
  show_id: string;
  type: "Movie" | "TV Show";
  title: string;
  director?: string;
  cast?: string[];
  country?: string;
  date_added?: string;
  release_year: number;
  rating?: string;
  duration?: string;
  listed_in?: string[];
  description?: string;
}
```

### User Model

```typescript
{
  email: string;
  password: string; // Hashed
  age: number;
}
```

## 🎨 UI Features

- Responsive design with Tailwind CSS
- Dark mode support (optional)
- Clean, modern interface
- Loading states and error handling
- Smooth pagination
- Search with debouncing

## 🐛 Troubleshooting

### Database not seeding

- Ensure `netflix_titles.csv` is in the root directory
- Check Docker volume mounts
- Verify MongoDB is running and accessible
- Check backend logs: `docker-compose logs backend`

### CORS errors

- Verify `FRONTEND_URL` environment variable matches your frontend URL
- Check that backend CORS configuration allows your origin

### Authentication issues

- Clear browser cookies
- Verify JWT_SECRET is set correctly
- Check token expiration (default: 7 days)

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This application requires a `netflix_titles.csv` file to be placed in the root directory. The CSV should follow the standard Netflix titles dataset format.

