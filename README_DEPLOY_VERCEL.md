## Deploying to Vercel

This project is a Next.js site and is ready to deploy to Vercel. The playground is client-first and runs entirely in the browser (localStorage + export), so no external database or API keys are required for the basic experience.

Recommended branch to deploy: `feature/pxl-platform-enhancements` (contains latest playground & docs). You can also deploy `main` if you prefer.

Steps to deploy via the Vercel dashboard

1. Go to https://vercel.com and sign in with GitHub.
2. Click "New Project" → "Import Git Repository" and select the repository: `King-pe/PXL-PROGRAMMING-LANGUAGE`.
3. Choose the branch to deploy (select `feature/pxl-platform-enhancements` or `main`).
4. Framework Preset: Next.js (Vercel will auto-detect).
5. Build Command: `npm run build` (default)
6. Output Directory: (leave empty, Next will handle it)
7. Environment Variables: none required for the local-first playground. If you later enable Cobase or other DB integrations, add them here (e.g., `COBASE_API_KEY`, `COBASE_API_URL`, `DATABASE_URL`).
8. Click "Deploy". Vercel will build and provide a public URL.

Continuous Deployment

- Every push to the selected branch will trigger a new deployment automatically.
- To deploy changes from the feature branch to production, either merge the branch into `main` or change the Git branch in the Vercel project settings.

Live playground usage for visitors

- Open `https://<your-vercel-domain>/playground`.
- Users can write `index.pxl`, `pxl.css`, and `pxl.js` in the editors and click Run to see the result in the sandbox iframe.
- Save/Load is stored in the user's browser localStorage. To share a snippet across users, use Export HTML (Download) and share the exported file (users can open it locally or upload it into the Playground via Import).

Optional: GitHub Actions + Preview Deployments

- Vercel provides preview deployments for Pull Requests automatically when connected to GitHub.
- If you want GitHub Actions in addition to Vercel, create a job that runs `npm run build` and tests, but Vercel's preview system is usually sufficient.

Security notes for public playground

- The playground executes user-provided JavaScript inside an iframe. While usage is sandboxed by the browser, avoid enabling server-side execution of untrusted code.
- Keep any secret or cloud-save APIs server-side (Next.js API routes) behind authentication and environment variables.

Troubleshooting

- Build fails with "Cannot find module 'next'" — ensure you ran `npm install` before deploying or include `package-lock.json` in the repo.
- Missing Node version errors — set the Node version in Vercel project settings or add an `engines` entry to `package.json`.

---

### Quick local deploy test

1. Clone repo (or fetch branch):
```
git clone https://github.com/King-pe/PXL-PROGRAMMING-LANGUAGE.git
cd PXL-PROGRAMMING-LANGUAGE
git checkout feature/pxl-platform-enhancements
```
2. Install & run:
```
npm install
npm run dev
```
3. Visit `http://localhost:3000/playground`.

If you want, I can also add a small GitHub Actions workflow that validates the build on push—tell me and I'll add it.
