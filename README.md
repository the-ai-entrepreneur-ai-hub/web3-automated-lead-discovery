# Web3 Prospector

A comprehensive Web3 project discovery and lead generation platform that helps users identify, track, and analyze emerging Web3 projects and opportunities in the blockchain ecosystem.

## Overview

Web3 Prospector is a full-stack application that automates the discovery and analysis of Web3 projects across various sources. It provides users with detailed insights, competitor analysis, and lead generation capabilities to stay ahead in the rapidly evolving Web3 space.

### Key Features

- **🔍 Automated Project Discovery**: Scrapes and aggregates Web3 projects from multiple sources including ICO tracking sites
- **📊 Comprehensive Analytics**: Provides detailed lead summaries and competitor analysis
- **🎯 Lead Management**: Organized project tracking with status management and categorization
- **🔗 Social Intelligence**: Collects social media links (Twitter, LinkedIn, Telegram) for outreach
- **👤 User Authentication**: Secure login/signup with password reset functionality
- **💼 Tiered Access**: Free and paid tier system for different feature access levels
- **📧 Contact Discovery**: Automated email finding for business development

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Node.js** with Express
- **Airtable** as database
- **JWT** for authentication
- **BullMQ** for job queuing
- **bcrypt** for password hashing
- **Puppeteer** for web scraping

### External Services
- **Airtable** - Data storage
- **Gemini AI** - Content analysis
- **CoinMarketCap API** - Crypto data
- **Hunter.io** - Email discovery
- **Redis** - Job queue management

## Prerequisites

Before running the application locally, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **Airtable account** with API access
- **Redis** (for job queue functionality)

## Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd web3-prospector
```

### 2. Backend Environment Setup

Navigate to the server directory and create a `.env` file:

```bash
cd server
cp .env.example .env  # Create from example or manually create
```

Configure your `.env` file with the following variables:

```env
# Airtable Configuration
AIRTABLE_API_TOKEN=your_airtable_api_token
AIRTABLE_BASE_ID=your_airtable_base_id

# API Keys
GEMINI_API_KEY=your_gemini_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
CRYPTORANK_API_KEY=your_cryptorank_api_key
DAPPRADAR_API_KEY=your_dappradar_api_key
HUNTER_IO_API_KEY=your_hunter_io_api_key

# Redis Configuration
REDIS_HOST=localhost

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Environment Setup

Navigate to the client directory and create a `.env` file:

```bash
cd ../client
cp .env.example .env  # Create from example or manually create
```

Configure your client `.env` file:

```env
VITE_API_URL=http://localhost:3006
```

### 4. Airtable Database Setup

Create an Airtable base with the following tables:

#### Users Table
- `email` (Single line text)
- `password` (Single line text)
- `firstName` (Single line text)
- `lastName` (Single line text)
- `company` (Single line text)
- `tier` (Single select: free, paid)
- `resetToken` (Single line text) - Optional for password reset
- `resetTokenExpiry` (Single line text) - Optional for password reset

#### Leads Table
- `Lead ID` (Single line text)
- `Website` (URL)
- `Status` (Single select)
- `Source` (Single line text)
- `Deduplication Key` (Single line text)
- `Lead Summary` (Long text)
- `Competitor Analysis` (Long text)
- `Twitter` (URL)
- `LinkedIn` (URL)
- `Email` (Email)
- `Date Added` (Date)
- `Telegram` (URL)
- `Project Name` (Single line text)

## Installation & Running Locally

### 1. Install Dependencies

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd ../client
npm install
```

### 2. Start Redis (Required for job queue)

Install and start Redis on your system:

**macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows:**
Download Redis from the official website or use Docker.

### 3. Start the Backend Server

```bash
cd server
npm start
```

The backend server will start on `http://localhost:3006`

### 4. Start the Frontend Development Server

In a new terminal:
```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

## Available Scripts

### Backend (server/)
- `npm start` - Start the production server
- `npm run worker` - Start the background job worker
- `npm run ingest` - Run data ingestion manually
- `npm run validate` - Validate API keys

### Frontend (client/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /profile` - Get user profile (requires auth)

### Data
- `GET /projects` - Get all projects/leads
- `POST /api/v1/leads/start-ingestion` - Start data ingestion
- `POST /api/v1/leads/trigger-manual` - Trigger manual ingestion
- `GET /api/v1/scheduler/status` - Get scheduler status

## Project Structure

```
web3-prospector/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and types
│   │   └── App.tsx        # Main application component
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── services/      # Business logic services
│   │   └── index.js       # Main server file
│   └── package.json
└── README.md
```

## Data Sources

The application automatically scrapes data from:
- ICO tracking websites
- CoinMarketCap
- Various Web3 project directories
- Social media platforms for project information

## Authentication Flow

1. Users can register with email/password
2. JWT tokens are used for session management
3. Password reset functionality with secure tokens
4. Role-based access (free/paid tiers)

## Background Jobs

The application uses BullMQ for handling background tasks:
- Automated data ingestion
- Web scraping jobs
- Email discovery tasks
- Data processing and analysis

## Deployment

For production deployment:

1. Set up environment variables on your hosting platform
2. Build the frontend: `cd client && npm run build`
3. Deploy backend to Node.js hosting service
4. Deploy frontend build to static hosting (Vercel, Netlify, etc.)
5. Ensure Redis is available for production
6. Configure CORS settings for your production domains

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This application is designed for legitimate business development and lead generation in the Web3 space. Please ensure compliance with all applicable laws and website terms of service when using scraping features.