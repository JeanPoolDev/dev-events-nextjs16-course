# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the DevEvent JP Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the singleton pattern recommended for Next.js 15.3+. Configured with a reverse proxy path (`/ingest`), exception capture enabled, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites for PostHog ingestion endpoints and `skipTrailingSlashRedirect: true` to support PostHog trailing slash API requests.
- **`components/EventCard.tsx`**: Converted to a client component (`'use client'`). Added `posthog.capture('event_card_clicked')` in an `onClick` handler on the `<Link>`, passing `event_title`, `event_slug`, `event_location`, and `event_date` as properties.
- **`components/ExplorerBtn.tsx`**: Added `posthog.capture('explore_events_clicked')` to the existing button `onClick` handler.
- **`components/Navbar.tsx`**: Converted to a client component (`'use client'`). Added `posthog.capture('nav_link_clicked')` to each nav link's `onClick`, passing the link `label` as a property.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables (never hardcoded in source).

| Event Name | Description | File |
|---|---|---|
| `event_card_clicked` | User clicks on an event card to view event details | `components/EventCard.tsx` |
| `explore_events_clicked` | User clicks the 'Explora Eventos' CTA button to scroll to event listings | `components/ExplorerBtn.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the top navbar | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/339956/dashboard/1354470)
- [User Engagement Overview](https://us.posthog.com/project/339956/insights/vTkBGFsz) — All key interactions over time (line chart)
- [Event Card Click-Through Rate](https://us.posthog.com/project/339956/insights/ZUCQbVKd) — Daily unique users clicking event cards
- [Homepage to Event Detail Funnel](https://us.posthog.com/project/339956/insights/cbu6tcyn) — Conversion from "Explore Events" CTA to event card click
- [Nav Link Click Breakdown](https://us.posthog.com/project/339956/insights/jZeEC4j1) — Which nav links users click most
- [Most Clicked Events](https://us.posthog.com/project/339956/insights/KvmTVpWO) — Which specific developer events attract most interest (pie chart)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
