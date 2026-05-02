<div align="center">
  <img src="./public/project-banner.avif" alt="Sentional" width="100%" />
</div>

<br />

<div align="center">
  <strong>Sentional</strong> — AI-powered account intelligence for Twitter&nbsp;/&nbsp;X: sentiment analysis, activity patterns, and topic discovery in seconds.
</div>

<br />

---

## Quick Start

**Prerequisites:** Node.js 20+, pnpm, Upstash Redis, TikHub API key, OpenRouter API key.

#### 1. Clone

```bash
git clone https://github.com/febriadj/sentional.git
```

```bash
cd sentional
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Configure environment variables

```bash
mv .env.example .env.local
```

Edit `.env.local`:

```env
# Upstash Redis (from Vercel KV integration or upstash.com)
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token
KV_URL=redis://your-redis.upstash.io
REDIS_URL=redis://your-redis.upstash.io

# TikHub — Twitter/X data provider
TIKHUB_BEARER_TOKEN=your_tikhub_token

# OpenRouter — AI model routing
OPENROUTER_API_KEY=sk-or-your_key
OPENROUTER_HTTP_REFERER=https://your-domain.com
OPENROUTER_APP_TITLE=Sentional
```

#### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/febriadj/sentional)

Add the same environment variables in your Vercel project settings. Enable **Vercel KV** from the Storage tab to provision Upstash Redis automatically.

> [!CAUTION]
> **Vercel Hobby Plan is not supported.** The `/api/analyses` route runs on Edge Runtime and streams inference from a free-tier model with high latency (30–90s typical). Vercel caps Edge Function execution at **30 seconds** on Hobby, the model response will exceed this limit before completion.
>
> **Options:**
>
> - Upgrade to **Vercel Pro** for a 30s Edge Function limit increase.
> - Switch to a low-latency paid model (e.g. `google/gemini-2.5-flash-lite`) — response time drops to under 10s, making Hobby viable.
> - Deploy on a platform with no duration limit (e.g. self-hosted, Cloudflare Workers).

---

## Stack

| Layer     | Technology                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Edge Runtime)                                      |
| UI        | Tailwind CSS v4, shadcn/ui, Framer Motion                                  |
| Charts    | Recharts 3                                                                 |
| AI        | OpenRouter → `poolside/laguna-m.1:free` (Best performing free-tier model). |
| Data      | TikHub Twitter/X API                                                       |
| Storage   | Upstash Redis (Vercel KV)                                                  |
| Language  | TypeScript                                                                 |

---

<div align="center">
  <sub>Not affiliated with X Corp. or Twitter, Inc.</sub>
</div>
