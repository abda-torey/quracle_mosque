# Quracle Mosque — Solar Project Campaign Site

Mobile-first fundraising web app. People visit the link, see the progress and contributors, and submit a pledge. You get an instant email notification and contact them to arrange payment.

---

## Stack (all free, no credit card required)

| Service | What it does | Free tier |
|---|---|---|
| Next.js 14 | Framework | Always free |
| Vercel | Hosting | Free hobby plan |
| Supabase | Database (stores pledges) | 500MB free |
| Resend | Email notifications | 3,000 emails/month free |

---

## Step 1 — Supabase (database)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New project** — give it a name like `quracle-mosque`
3. Once created, go to **SQL Editor** in the left sidebar
4. Paste the contents of `supabase-schema.sql` and click **Run**
5. Go to **Settings → API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → this is your `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2 — Resend (email notifications)

1. Go to [resend.com](https://resend.com) and sign up (free)
2. Go to **API Keys** and click **Create API Key**
3. Name it `quracle-mosque` and copy the key → this is your `RESEND_API_KEY`

> Note: On Resend's free plan, you can only send emails *from* `onboarding@resend.dev` until you verify a custom domain. The notification emails will still arrive at `abdatorey@gmail.com` correctly — only the sender address looks generic. To fix this later, verify your own domain in Resend and update the `from` field in `app/api/pledge/route.ts`.

---

## Step 3 — Add your mosque images

1. Put your image files in the `public/images/` folder
2. Open `lib/constants.ts` and update the `GALLERY_IMAGES` array with your filenames:

```ts
export const GALLERY_IMAGES = [
  { src: '/images/mosque-exterior.jpg', alt: 'Mosque exterior and minaret' },
  { src: '/images/mosque-hall.jpg', alt: 'Main prayer hall' },
  // add more here
]
```

The first image in the array becomes the hero image on the home page.

---

## Step 4 — Deploy to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub (free)
3. Click **Add New Project** and import your repository
4. Under **Environment Variables**, add these one by one:

```
NEXT_PUBLIC_SUPABASE_URL        = (from Supabase Step 2)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (from Supabase Step 2)
SUPABASE_SERVICE_ROLE_KEY       = (from Supabase Step 2)
RESEND_API_KEY                  = (from Resend Step 2)
ADMIN_EMAIL                     = abdatorey@gmail.com
```

5. Click **Deploy** — Vercel will build and give you a live URL like `quracle-mosque.vercel.app`

---

## Managing pledges (marking as paid)

When someone pays, go to your Supabase project → **Table Editor** → `pledges` table, find their row, and change `status` from `pledged` to `paid`. Their badge on the website will update within 60 seconds.

---

## Updating the fundraising target

Open `lib/constants.ts` and change `FUNDRAISING_TARGET`:

```ts
export const FUNDRAISING_TARGET = 550000
```

Commit and push — Vercel redeploys automatically.

---

## Adding more images later

1. Add the image file to `public/images/`
2. Add a line to `GALLERY_IMAGES` in `lib/constants.ts`
3. Commit and push

---

## Project structure

```
app/
  page.tsx              ← Home (hero, progress, contributors)
  pledge/
    page.tsx            ← Pledge form page
    success/page.tsx    ← Thank you page
  gallery/page.tsx      ← Full gallery
  contributors/page.tsx ← Full contributors list
  api/pledge/route.ts   ← API: saves to Supabase + sends email
components/
  PledgeForm.tsx        ← Form with quick-select amounts
  ContributorList.tsx   ← Contributor rows with avatars
  ProgressBar.tsx       ← Raised vs target bar
  ShareButtons.tsx      ← WhatsApp + copy link
lib/
  constants.ts          ← Mosque name, target, images list
  supabase.ts           ← Supabase client
  types.ts              ← TypeScript types
public/
  images/               ← Put mosque photos here
supabase-schema.sql     ← Run once in Supabase SQL editor
```
