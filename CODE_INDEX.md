# Web3 Prospector - Complete Code Index

## Project Overview
Web3 Prospector is a comprehensive lead generation platform for Web3 projects, featuring automated scraping, AI-powered enrichment, and a modern React frontend.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js + Express + Prisma + Airtable
- **Scraping**: Puppeteer + BullMQ + Multiple scrapers
- **AI**: Google Gemini API for content generation
- **Database**: Airtable (Users, Leads) + Prisma (Queue management)

## File Structure

### Frontend (client/)
```
client/
├── src/
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx               # Entry point
│   ├── pages/
│   │   ├── Index.tsx          # Landing page
│   │   ├── Login.tsx          # Login page with validation
│   │   ├── Register.tsx       # Registration page with validation
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Profile.tsx        # User profile management
│   │   └── NotFound.tsx       # 404 page
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── Navbar.tsx         # Navigation component
│   │   ├── Hero.tsx           # Landing hero section
│   │   ├── Features.tsx       # Feature showcase
│   │   ├── Pricing.tsx        # Pricing tiers
│   │   ├── Footer.tsx         # Site footer
│   │   └── ProfileModal.tsx   # Profile editing modal
│   ├── hooks/
│   │   ├── use-mobile.tsx     # Mobile detection
│   │   └── use-toast.ts       # Toast notifications
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   └── types.ts           # TypeScript types
│   └── index.css              # Global styles
```

### Backend (server/)
```
server/
├── src/
│   ├── index.js               # Main server file
│   └── services/
│       ├── ai.js              # AI content generation
│       ├── airtable.js        # Airtable integration
│       ├── enrichment.js      # Lead enrichment
│       ├── queue.js           # BullMQ queue management
│       ├── scheduler.js       # Cron job scheduling
│       ├── scrapers.js        # Web scraping orchestration
│       └── worker.js          # Background job processing
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database
└── scrapers/
    ├── coinmarketcap-scraper/
    └── icodrops-scraper/
```

## Key Features

### Authentication System
- **Registration**: Email validation, password requirements, duplicate email detection
- **Login**: JWT token-based authentication
- **Profile Management**: User data storage in Airtable

### Lead Generation
- **Automated Scraping**: Multiple sources (CoinMarketCap, ICODrops, DappRadar, etc.)
- **AI Enrichment**: LinkedIn profile finding, email discovery, competitor analysis
- **Queue Management**: BullMQ for background processing
- **Scheduling**: Automated daily scraping with cron jobs

### Frontend Features
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Shadcn/ui components with custom styling
- **Real-time Updates**: React Query for data fetching
- **Form Validation**: Client and server-side validation

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile

### Leads
- `GET /projects` - Get all leads
- `POST /api/v1/leads/start-ingestion` - Start scraping process
- `POST /api/v1/leads/trigger-manual` - Manual trigger
- `GET /api/v1/scheduler/status` - Check scheduler status

## Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:3006
```

### Server (.env)
```
AIRTABLE_API_TOKEN=your_airtable_token
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
```

## Recent Updates

### Registration Flow Improvements
- **Enhanced Validation**: Better error messages for duplicate emails
- **User Experience**: Clear feedback for registration failures
- **Security**: Password requirements and email format validation

### Backend Updates
- **Error Handling**: Specific error messages for duplicate email detection
- **Validation**: Email format and password length validation
- **Security**: JWT token generation and validation

## Development Commands

### Frontend
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
```

### Backend
```bash
cd server
npm start            # Start server
npm run worker       # Start background worker
npm run ingest       # Run scrapers manually
```

## Database Schema

### Airtable Tables
- **Users**: email, password, tier, firstName, lastName, company
- **Leads**: All scraped project data with enrichment

### Prisma Schema
- **Job**: Queue management for background tasks
- **Lead**: Processed lead data

## Scraping Sources
1. **CoinMarketCap**: New listings and trending
2. **ICODrops**: Upcoming and active ICOs
3. **DappRadar**: DApp rankings and analytics
4. **Zealy**: Community quests and campaigns
5. **DAO Maker**: Launchpad projects
6. **Polkastarter**: IDO projects

## AI Integration
- **Content Generation**: Project summaries and competitor analysis
- **Lead Enrichment**: LinkedIn profile discovery, email finding
- **Analysis**: Competitor research and market insights

## Deployment Notes
- **Frontend**: Vercel/Netlify ready
- **Backend**: Railway/Heroku compatible
- **Database**: Airtable cloud database
- **Queue**: Redis for BullMQ (production)

## Security Features
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication tokens
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Server-side validation for all inputs
