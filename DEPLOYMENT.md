# GitHub Pages Deployment Guide

This guide will help you deploy INSIGHTIFY to GitHub Pages.

## Automatic Deployment (Recommended)

The repository is already configured with GitHub Actions for automatic deployment.

### Setup Steps:

1. **Fork this repository** to your GitHub account (if you haven't already)

2. **Enable GitHub Pages** in your repository:
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** section
   - Under **Source**, select "Deploy from a branch"
   - Select branch: `gh-pages` (this will be created automatically)
   - Click **Save**

3. **Enable GitHub Actions** (if needed):
   - Go to **Actions** tab in your repository
   - If workflows are disabled, click "I understand my workflows, go ahead and enable them"

4. **Trigger deployment**:
   - Push any change to the `main` branch, or
   - Go to **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

5. **Access your deployed app**:
   - After deployment completes, your app will be available at:
   - `https://[your-username].github.io/INSIGHTIFY/`

## API Key Setup

Since this is a client-side application, you'll need to provide your Gemini API key:

1. **Get your API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **For development**: Add it to `.env.local` as `VITE_GEMINI_API_KEY=your_key_here`
3. **For production**: The deployed app will prompt you to enter your API key when needed

## Manual Deployment

If you prefer to deploy manually:

1. **Build the project**:
   ```bash
   npm run build:prod
   ```

2. **Deploy the `dist` folder** to any static hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any web server

## Troubleshooting

### Build Fails
- Make sure you have Node.js 16+ installed
- Run `npm install` to install dependencies
- Check that all files are properly committed

### Pages Not Loading
- Check that GitHub Pages is enabled in repository settings
- Verify the source is set to `gh-pages` branch
- Wait a few minutes for DNS propagation

### App Shows Errors
- Ensure you have a valid Gemini API key
- Check browser console for specific error messages
- Verify the API key has the correct permissions

## Security Note

⚠️ **Important**: Never commit your API key to the repository. The current setup prompts users to enter their API key at runtime, which is secure for client-side applications.

For production applications with high usage, consider implementing a backend proxy to protect your API key.