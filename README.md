# 🛠 Challenges & Solutions

## 1️⃣ Connecting Frontend to Backend

**Problem:**  
I needed to connect my Next.js frontend form to a backend to save user data. Initially, I wasn’t sure how to send the form data properly.

**Solution:**  
- Created an **API route** in Next.js (`app/api/register/route.js`) to handle POST requests.  
- Used `fetch` from the frontend form to send data as JSON.  
- Verified that the API receives data correctly before saving to the database.

**Key Learning:**  
Next.js API routes allow building backend logic without a separate server, simplifying full-stack development.

---

## 2️⃣ Using MongoDB Atlas

**Problem:**  
I wanted to save form data to MongoDB Atlas, but wasn’t sure how to handle connections correctly in Next.js.

**Solution:**  
- Installed the `mongodb` package.  
- Created a utility file `lib/mongodb.js` to manage connections and avoid multiple connections during hot reload.  
- Connected to Atlas using the URI stored in `.env.local`.  
- Inserted data into the `users` collection successfully.

**Key Learning:**  
Proper connection handling is crucial in Next.js to prevent performance issues and errors during development and deployment.

---

## 3️⃣ Adding Google Authentication

**Problems Encountered:**  

1. **redirect_uri_mismatch**  
   - **Cause:** The redirect URI sent by NextAuth did not match what was registered in Google Cloud Console.  
   - **Solution:** Added exact URIs for both development (`http://localhost:3000/api/auth/callback/google`) and production (`https://bookmark-chi-ashy.vercel.app/api/auth/callback/google`) in Google OAuth credentials.

2. **Access blocked / OAuth policy error**  
   - **Cause:** App in Google OAuth Testing mode, only test users allowed.  
   - **Solution:** Added my Gmail as a **Test User** in Google Cloud Console’s OAuth consent screen.

**Key Learning:**  
Google OAuth is strict about redirect URIs and testing policies. Using NextAuth simplifies implementation but requires careful environment and credential management.

---

## 4️⃣ Advanced Challenges

### a) The “Double Sync” Race Condition

**Problem:**  
During initial Google Login, duplicate user documents were created in MongoDB. This occurred because React 18’s `useEffect` runs twice in development, and the first “check if user exists” request hadn’t finished before the second one started.

**Solution:**  
- Implemented an **Atomic Upsert** using MongoDB’s `findOneAndUpdate` with `{ upsert: true }`.  
- Added a **unique index** on the email field in the Mongoose schema to ensure data integrity.

---

### b) OAuth Redirect URI Mismatch

**Problem:**  
After deploying to Vercel, the Google Sign-In button triggered a `400: redirect_uri_mismatch` error.

**Solution:**  
- Updated the Google Cloud Console **Authorized Redirect URIs** to include the production Vercel callback path: `/api/auth/callback/google`.  
- Ensured the `NEXTAUTH_URL` environment variable on Vercel matched the deployment domain exactly, with **no trailing slash**.

---

### c) Mongoose Connection Buffering (Serverless Timeouts)

**Problem:**  
API routes occasionally threw: `MongooseError: Operation buffering timed out`. This happened because the database connection failed to establish within the serverless function execution window.

**Solution:**  
- Updated MongoDB Atlas **Network Access** to `0.0.0.0/0` to allow Vercel’s dynamic IP range.  
- Implemented a **singleton connection pattern** in the database utility to reuse the same MongoDB client across multiple API calls, preventing socket exhaustion.

---

## 5️⃣ General Learnings

- Next.js 13 **App Router components are Server by default** — to use hooks like `useState` or event handlers, you must mark components with `"use client"`.  
- Environment variables (`NEXTAUTH_URL`, `MONGODB_URI`) must match the actual deployed domain for API routes and OAuth flows to work.  
- Accepting challenges outside my comfort zone (Next.js) helped me **learn rapidly**, debug effectively, and strengthen full-stack development skills.  

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
