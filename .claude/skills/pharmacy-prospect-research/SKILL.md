---
name: pharmacy-prospect-research
description: Research a UK pharmacy owner or superintendent pharmacist ahead of a Pharmapresence sales conversation, producing a sales-prep briefing that covers who they are, any public funding/advocacy story, the private services they already run, their review reputation, and concrete, evidence-backed digital-presence gaps mapped to Pharmapresence's services (websites, Google Business Profile, AI agents, Bookings Booster). Use this whenever the user names a specific pharmacy or pharmacist and wants to look them up, research them, find a talking-point angle, or "get ready" / "prep" for a call, meeting, or outreach with them — even if they don't say "skill," "briefing," or "Pharmapresence" explicitly. Examples: "can you research the owner of Green Cross Pharmacy before I call them", "what should I know about this pharmacist before my meeting", "dig up anything useful on [pharmacy name] for my sales call".
---

# Pharmacy Prospect Research

Turns a pharmacist's name and/or pharmacy name into a sales-prep briefing for a Pharmapresence conversation. Pharmapresence sells UK community pharmacies four things: modern websites, Google Business Profile optimisation, an AI agent for patient Q&A/booking, and "Bookings Booster" (a system for filling private clinics — travel jabs, ear wax microsuction, weight loss/GLP-1, etc). The best prep material isn't generic — it's specific, verifiable facts about *this* pharmacy that make the opening minute of a call land.

## Why this process works

Independent pharmacy owners are usually easy to research because they're public-facing local business owners: they're indexed by GPhC, Companies House, NHS listings, review platforms, and often local/trade press (because NHS funding pressure is a live, emotive topic in the sector — see Step 3). The goal isn't a biography, it's finding the handful of facts a salesperson can actually use: something that proves you did your homework, and something concrete enough that the prospect can verify it themselves in the moment (which builds more trust than a generic pitch).

## Inputs

You need at least a pharmacy name, or a pharmacist name — ideally both, plus a town/postcode if the name is common (there are a lot of "Smith" pharmacists and a lot of pharmacies called "Manor Pharmacy"). If the user gives only a pharmacy name, Step 1 below will surface the owner's name; don't ask the user to look it up themselves first.

## Tooling note: WebSearch first, WebFetch as a fallback only

Direct `WebFetch` on the actual target pages (the pharmacy's own website, LinkedIn, Companies House, trade-press sites) reliably returns 403 Forbidden — these sites block automated fetches. `WebSearch`'s synthesized snippets, by contrast, work well and are usually enough. Default to `WebSearch` for every step below. Try `WebFetch` opportunistically if a WebSearch snippet is thin and a specific URL looks promising, but don't burn time retrying it — if it 403s, move on to another search query instead of treating it as blocked and stopping.

## Research steps

Run these as a sequence of `WebSearch` calls (batch independent ones in parallel). Skip a step quickly if it turns up nothing after one or two queries — a thin footprint is a valid finding, not a failure.

1. **Identity.** Search `"<name>" "<pharmacy name>" pharmacist` (or just `"<pharmacy name>" owner pharmacist` if you don't have a name yet). Confirm: is this person the owner, the superintendent pharmacist, or both (usually both at a genuine independent)? Get the GPhC registration number and the pharmacy's address/postcode if available — useful for disambiguation and for Step 6's "same street" competitor checks.

2. **Ownership and tenure.** Search `"<pharmacy name>" Companies House director` to find the owning company, its registration number, and how long the owner has held the directorship. A long tenure (5+ years) signals an established, stable business — useful context for how you pitch (they're not desperate, they're comfortable and need a reason to change).

3. **Public advocacy / news footprint.** Search `"<owner name>" news funding` and `"<owner name>" pharmacy protest` and, if the pharmacy is in a politically notable constituency, `"<pharmacy name>" MP visit`. Independent pharmacy owners are frequently vocal — via their local LPC, or trade press like Pharmacy Magazine, Chemist+Druggist, or The Pharmaceutical Journal — about NHS funding cuts. This matters because funding pressure is *why* pharmacies diversify into the private services Pharmapresence sells: if you find this, it's the strongest possible opening, because you're not introducing the funding-pressure narrative, you're referencing something they already said publicly. Don't force this — plenty of pharmacies will have nothing here, and that's fine, just don't include a hook section with nothing in it.

4. **Services audit.** Search `"<pharmacy name>" services` plus targeted queries for specific private services: travel clinic / yellow fever, weight loss / GLP-1 / Mounjaro / Wegovy, ear wax removal / microsuction, Pharmacy First, blood pressure checks, contraception service. Build a list of what they already offer — this is what Bookings Booster and the AI agent are *for*, so knowing their existing service line lets you pitch against something concrete rather than a hypothetical.

5. **Reputation.** Search `"<pharmacy name>" reviews`. Get the Google rating and review count if available. A strong rating (4.5+, decent volume) is worth noting explicitly in the briefing — it reframes the pitch from "fix your service" to "your service is already good, your digital presence hasn't caught up," which is a much easier conversation to have with an owner who's proud of their pharmacy.

6. **Digital presence audit — this is the section that produces the best talking points.** Spend the most effort here:
   - **Website platform/age.** Look at the URL structure and any search snippets describing the site. Old CMS tells (e.g. Joomla-style `index.php?Itemid=` URLs, or a site described as unchanged for years) signal a dated site — a concrete instance of the "digital business card" problem.
   - **Booking fragmentation.** Search `"<pharmacy name>" booking` and check whether appointments run through their own site or are scattered across third-party platforms (Patient Access, Healthera, NowPatient, PharmaDoctor, etc). Fragmentation across 2+ platforms is a strong, specific talking point: no unified patient experience, no data ownership, no single place bookings feed reminders/follow-up from.
   - **Split microsites.** Check whether any individual service (weight loss clinics are the most common case) lives on a separate domain instead of the main site. This dilutes both brand and SEO — a concrete "consolidate" recommendation.
   - **Local competitor check on their own turf.** For each profitable private service they offer (Step 4), search `"<service> <suburb/town>"` (e.g. "ear wax removal Ruislip Manor") and see who ranks. If a dedicated specialist — especially one physically near the pharmacy — is outranking them for a service the pharmacy itself already offers, that is the single best kind of finding: concrete, local, and verifiable by the prospect on their own phone in the meeting. Prioritize finding at least one of these if possible; it's worth several extra search queries.

7. **Ground the "maps to" language in Pharmapresence's actual positioning, not generic pitch-speak.** If you're running inside the `pharmacy-business-insights` repo, read `src/pages/services/*.astro` (each file has `headline`, `subhead`, `problems`, and `outcomes` props) and phrase each digital gap in that language, so the briefing sounds like it was written by someone who knows what Pharmapresence actually says in its pitch, not a generic marketing summary. If those files aren't available (e.g. this skill is being used outside that repo), fall back to `references/pharmapresence-services.md`, a snapshot of the same four services.

## Output: the briefing

Write the briefing directly in the chat response (not a separate file, unless the user asks for one). Use these sections, and only include ones that have real content — an empty "Advocacy hook" section with a paragraph of "nothing found" padding is worse than omitting it:

- **Who they are** — name, role (owner/superintendent pharmacist), how long established, company name if relevant.
- **Advocacy/news hook** (if found) — what they said publicly and where, with the connection to why it's relevant to a Pharmapresence conversation made explicit but brief.
- **Services already offered** — the private services list from Step 4, since these are what Bookings Booster and the AI agent sell around.
- **Reputation** — rating/review count, one line, framed as "trust isn't the problem."
- **Digital gaps** — the strongest, most specific findings from Step 6, each stated as a verifiable fact (not a vague impression), each tied to the specific Pharmapresence service it maps to.
- **Suggested opening** — one or two sentences on how to start the conversation, ideally chaining the advocacy hook (if present) into the single strongest digital-gap finding.

Close with a short, honest caveat if any of the direct-fetch sources were blocked and the findings rely on search snippets rather than the live page — the user should know to sanity-check anything time-sensitive (current promotions, exact current pricing) by looking at the live site themselves before the call.

## What not to do

Don't fabricate specifics that didn't turn up in search — no invented GPhC numbers, ages, review counts, or quotes. If a step comes up empty, say so in one line or omit the section; don't pad it with generic filler about "the importance of community pharmacy" that could apply to any pharmacy in the country. The whole value of this briefing is that it's specific to *this* pharmacy — generic content defeats the purpose.
