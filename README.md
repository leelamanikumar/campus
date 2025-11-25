## Campus job links

Next.js 16 (App Router + Turbopack) app for curating latest job links with shareable slugs and a private `/leela` dashboard for publishing/deleting posts.

### Local setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables by creating `.env.local`

```
MONGODB_URI="your-mongodb-atlas-connection-string"
MONGODB_DB="job-links"
MONGODB_COLLECTION="jobs"
LEELA_PASSWORD="set-a-strong-passcode"
```

3. Run dev server

```bash
npm run dev
```

### MongoDB Atlas expectations

- The app creates (or reuses) the collection defined by `MONGODB_COLLECTION` and stores every job document with slug uniqueness enforced via an index.
- Deployments on Vercel require the same environment variables set in the dashboard (Project Settings → Environment Variables). Atlas must allow connections from Vercel’s IPs or use the “0.0.0.0/0” rule plus credentials.
- Because persistence lives in MongoDB, the old `data/jobs.json` file is no longer the source of truth; it can be used for manual imports/exports but is not read by the app.

### Admin usage

- Visit `/leela`, enter the passcode (`LEELA_PASSWORD`), and you’ll see the dashboard to add or delete job links.
- Each job can be reached at `/{slug}` (e.g., `/infosys-analyst`). The home page automatically lists the latest entries.

### Deployment

- Works on Vercel, Netlify, or any Node hosting that supports Next.js 16.
- Remember to set `LEELA_PASSWORD` to a strong secret in production and restrict MongoDB user permissions to the specific database.
