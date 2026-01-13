# Usage App

A Next.js web application for viewing usage data from Metronome's API. Deployed on Vercel.

## Features

- **Usage Tab**: Query and display usage data from Metronome API
- **Customer Dropdown**: Select customers from a dropdown in the top right (demo feature)
- Clean, modern UI
- Sidebar navigation with multiple tabs (only Usage tab is functional)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```
   METRONOME_API_TOKEN=your_metronome_api_token_here
   ```

   To get your API token:
   - Log in to Metronome
   - Go to **Connections** > **API tokens & webhooks**
   - Click **+ Add** to create a new token
   - Copy the token and add it to `.env.local`

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add the `METRONOME_API_TOKEN` environment variable in Vercel's project settings
   - Deploy!

## Usage

1. Navigate to the **Usage** tab in the sidebar
2. Select a customer from the dropdown in the top right, or enter a Customer ID manually
3. Select a date range (defaults to last 7 days)
4. Click "Fetch Usage Data"
5. View the results including total events, total seconds, and individual event details

## Project Structure

```
usage-ui-demo/
├── app/
│   ├── api/
│   │   ├── usage/
│   │   │   └── route.ts          # API route for fetching usage data
│   │   └── customers/
│   │       └── route.ts          # API route for fetching customers
│   ├── usage/
│   │   ├── page.tsx              # Usage page component
│   │   └── usage.module.css      # Usage page styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── page.module.css           # Shared styles
│   └── globals.css               # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json
```

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling
- **Vercel** - Deployment platform
