# Web3 Prospector - Frontend

Frontend application for the Web3 Prospector platform built with React, TypeScript, and Vite.

## Environment Setup

**IMPORTANT**: For production deployment on Netlify, set these environment variables in your Netlify dashboard:

### Required Environment Variables
```
VITE_API_URL = https://web3-automated-lead-discovery-production.up.railway.app
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_51RlQ0ZC1BQAlOs1ZJAlFZgbciKe0xFPBOkYhNlAbwP0FezYKthOrpMukNLzgbg26nAWlw8uFIYhe6uHEEpmTw6lK00AoGgCxoF
NODE_ENV = production
```

### How to set Netlify Environment Variables:
1. Go to: https://app.netlify.com/sites/dulcet-madeleine-2018aa/settings/env
2. Click "Add variable" for each environment variable above
3. After adding all variables, go to Deploys tab
4. Click "Trigger deploy" → "Deploy site"

## Troubleshooting Network Errors
If you see "Network error" messages:
1. Check browser console for environment debug logs
2. Verify environment variables are set in Netlify dashboard
3. Ensure Railway backend is running at the configured URL

## Project info

**URL**: https://lovable.dev/projects/f5eb3f83-976f-400f-983d-ad6c9ba84788

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f5eb3f83-976f-400f-983d-ad6c9ba84788) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f5eb3f83-976f-400f-983d-ad6c9ba84788) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
