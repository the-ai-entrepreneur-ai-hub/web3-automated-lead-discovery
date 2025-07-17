# Web3 Prospector - Automated Lead Discovery Platform

A comprehensive Web3 project discovery and lead generation platform that helps users identify, track, and analyze emerging Web3 projects and opportunities in the blockchain ecosystem.

## 🚀 Live Application
**[View Live Web3 Prospector](https://the-ai-entrepreneur-ai-hub.github.io/web3-automated-lead-discovery)**

## 📋 Overview
Web3 Prospector is a full-stack application that automates the discovery and analysis of Web3 projects across various sources. It provides users with detailed insights, competitor analysis, and lead generation capabilities to stay ahead in the rapidly evolving Web3 space.

## ✨ Key Features
- **🔍 Automated Project Discovery**: Scrapes and aggregates Web3 projects from multiple sources including ICO tracking sites
- **📊 Comprehensive Analytics**: Provides detailed lead summaries and competitor analysis
- **🎯 Lead Management**: Organized project tracking with status management and categorization
- **🔗 Social Intelligence**: Collects social media links (Twitter, LinkedIn, Telegram) for outreach
- **👤 User Authentication**: Secure login/signup with password reset functionality
- **💼 Tiered Access**: Free and paid tier system for different feature access levels
- **📧 Contact Discovery**: Automated email finding for business development

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT authentication**
- **RESTful API design**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/the-ai-entrepreneur-ai-hub/web3-automated-lead-discovery.git
cd web3-automated-lead-discovery

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development
cd ../client && npm run dev
cd ../server && npm run dev
```

## 🌐 Deployment

### GitHub Pages (Frontend)
The frontend is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `master` branch triggers a new deployment.

### Backend Deployment
The backend can be deployed to services like:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**

## 📁 Project Structure
```
web3-prospector/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database models
│   │   └── middleware/    # Custom middleware
│   └── database/          # Database scripts
└── apify-actors/          # Web scraping automation
```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
APIFY_TOKEN=your-apify-token
```

## 🎯 Usage

1. **Sign up** for a new account
2. **Browse** discovered Web3 projects
3. **Track** projects of interest
4. **Analyze** competitor data
5. **Export** leads for outreach

## 📄 License
MIT License

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.