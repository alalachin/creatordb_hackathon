# clearHub

clearHub is a brand and creator intelligence platform built with Next.js 14. It helps users explore competitors, compare brand audiences, and discover creators for marketing campaigns.

## Features

- Explore competing brands by category
- Generate brand comparison reports
- Find creators by budget and audience criteria
- Review creator audience and risk information

## Requirements

- Node.js 18 or later
- npm
- Claude Code CLI
- CreatorDB API key

## Setup

Enter the frontend directory and install the dependencies:

```bash
cd creatordb_hackathon_frontend
npm install
```

Copy the environment variable template:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
CREATORDB_API_KEY=your_api_key_here
PROJECT_ROOT=/absolute/path/to/creatordb_hackathon
```

`PROJECT_ROOT` must be the absolute path to this repository's root directory—the directory containing `resource/` and `output/`.

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
├── creatordb_hackathon_frontend/  # Next.js application
├── resource/external/             # Brand and creator data
├── output/                        # Generated reports and cache
└── README.md
```

## Notes

- Do not commit `.env.local`, as it may contain API credentials.
- Brand comparison and creator discovery features use the Claude Code CLI.
- Initial report generation may take some time. Generated results are cached in `output/`.
