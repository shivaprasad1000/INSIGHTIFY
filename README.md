# INSIGHTIFY

Insightify is a powerful analysis tool designed for product managers, marketers, and data analysts. By simply uploading a CSV or XLSX file of raw customer reviews, the application leverages the advanced capabilities of the Google Gemini AI model to perform a deep and nuanced analysis.

It goes beyond simple keyword counting to deliver a rich, interactive dashboard that provides an at-a-glance executive summary, a precise sentiment breakdown, and automatically discovered feedback categories. The standout feature is a dynamic Venn diagram that visualizes the overlap between topics, revealing complex relationships in customer feedback that would otherwise be missed. This tool turns unstructured review data into clear, strategic insights.

## 🚀 Live Demo

Visit the live application: [https://shivaprasad1000.github.io/INSIGHTIFY/](https://shivaprasad1000.github.io/INSIGHTIFY/)

## 🛠️ Local Development

**Prerequisites:** Node.js (version 16 or higher)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivaprasad1000/INSIGHTIFY.git
   cd INSIGHTIFY
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### GitHub Pages (Automatic)

This repository is configured with GitHub Actions for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: Choose `gh-pages` (this will be created automatically)

2. **Set up your Gemini API key** (for your deployment):
   - Since this is a client-side application, you'll need to provide the API key when using the deployed version
   - The application will prompt you to enter your API key on first use
   - You can get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Deploy**: Push to the `main` branch and GitHub Actions will automatically build and deploy your application.

### Manual Deployment

You can also deploy to any static hosting service:

1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your hosting service

## 🔑 API Key Setup

For security reasons, the Gemini API key is not included in the repository. You'll need to:

1. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. For local development: Add it to your `.env.local` file
3. For production: The app will securely prompt for the API key when needed

## 📊 Features

- **Smart Review Analysis**: Upload CSV/XLSX files with customer reviews
- **AI-Powered Insights**: Leverages Google Gemini AI for deep analysis
- **Sentiment Analysis**: Automatic positive/neutral/negative classification
- **Category Discovery**: Finds key themes in your reviews automatically
- **Interactive Visualizations**: Dynamic charts and Venn diagrams
- **Executive Summaries**: Get the key insights at a glance
- **Mobile Responsive**: Works on all devices

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini AI
- **File Processing**: PapaParse (CSV) + SheetJS (XLSX)
- **Deployment**: GitHub Pages with GitHub Actions