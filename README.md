# HumanRank AI

## Overview
HumanRank AI is a web application designed to convert AI-generated blog content into fully human-written, SEO-optimized, Google-rankable blog posts. It helps content creators maintain a natural tone while ensuring their content is structured for search engines.

## Core Features
1.  **Humanize Mode**: Rewrites content to sound natural and professional.
2.  **SEO Optimize Mode**: Transforms content with proper H1-H3 structures, keyword integration, and high readability.
3.  **Clean UI**: Simple, agency-style interface with "Copy to Clipboard" and live word count.
4.  **No Paid APIs**: Utilizes the free HuggingFace Inference API.

## 🛠️ Setup & Requirements

### 1. Environment Variables
This project requires a **HuggingFace Access Token** to function.

1.  Go to [HuggingFace Tokens Settings](https://huggingface.co/settings/tokens).
2.  Create a new token with **Read** permissions.
3.  Create a `.env.local` file in the root of the project.
4.  Add your token:

```bash
HF_TOKEN=hf_your_generated_token_here
```

### 2. Tech Stack
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: TailwindCSS
-   **AI Model**: `mistralai/Mistral-7B-Instruct-v0.2` via HuggingFace API

### 3. Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure
-   `/app`: Main application code (App Router).
-   `/api/optimize`: API route for handling AI content generation.
-   `/components`: Reusable UI components.
-   `/lib`: Utility functions and API clients.

## Deployment
This project is ready for deployment on **Vercel**.
-   Push to GitHub.
-   Import project in Vercel.
-   **Important**: Add `HF_TOKEN` in Vercel's Environment Variables settings.
