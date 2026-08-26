# clearHub

clearHub is a brand and creator intelligence platform built with Next.js 14. This public demo uses saved reports and creator data, so it can run without Claude or external API calls.

## Live Demo

[Open clearHub](https://creatordb-hackathon.vercel.app)

## Features

- Explore competing brands by category
- Generate brand comparison reports
- Find creators by budget and audience criteria
- Review creator audience and risk information

## Requirements

- Node.js 18 or later
- npm

## Setup

Enter the frontend directory and install the dependencies:

```bash
cd creatordb_hackathon_frontend
npm install
```

## Run the Project

```bash
cd creatordb_hackathon_frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
cd creatordb_hackathon_frontend
npm run build
npm run start
```

## Project Structure

```text
creatordb_hackathon/
├── creatordb_hackathon_frontend/  # Next.js application and bundled demo data
└── README.md
```

## Notes

- This demo does not require environment variables or API credentials.
- Brand comparisons are limited to the reports included with the demo.
- Creator discovery uses a bundled static dataset and does not make live AI calls.
