# clearHub Static Demo

A deployment-ready Next.js 14 demo of clearHub. It uses bundled brand reports and creator data and makes no Claude or external API calls.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run start
```

No environment variables are required.

## Demo data

- `public/demo-reports/` contains saved brand comparison reports.
- `demo-data/creators.json` contains creator, audience, and risk data.
- Creator discovery is limited to the bundled sportswear dataset.
- Unsupported brand pairs return a list of available comparisons.

## Deploy to Vercel

1. Import `alalachin/creatordb_hackathon` into Vercel.
2. Select the `demo` branch.
3. Set **Root Directory** to `creatordb_hackathon_frontend`.
4. Keep the detected Next.js build settings and deploy.
