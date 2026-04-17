# Sportswear Creators Campaign Strategy

## Overview
Successfully fetched detailed profiles for **15 YouTube sportswear creators** using CreatorDB API. All creators fit within the $12,500 per creator budget with a collective investment of **$16,611** and combined reach of **1.96 million subscribers**.

---

## Key Findings

### Audience Profile
- **Gender**: Predominantly male (79-95% across channels)
- **Primary Age**: 25-34 years (peak demographic)
- **Geography**: 70-80% USA-based, secondary markets in UK (7%), Canada (4%), India (4%)
- **Content Niche**: Running, fitness, athletic apparel, sports gear

### Pricing Insights
- **Price Range**: $39 - $3,414 per video
- **Average CPM**: $8.49 (Cost Per Mille/1000 subscribers)
- **Best Value**: Seth James DeMoor ($258 for 169K subscribers = $1.53 CPM)
- **Reach Leaders**: REI (449K subs), DesFit (268K subs), DanteTheBody FIT (396K subs)

---

## Recommended Campaign Scenarios

### Scenario 1: PREMIUM REACH
**Target**: Maximum audience exposure with established creators
- **Creators**: REI, DesFit, DanteTheBody FIT, Road Runner Sports
- **Investment**: $8,828
- **Total Reach**: 1.17M subscribers
- **Avg CPM**: $7.52
- **Best For**: Brand awareness, wide market penetration

### Scenario 2: VALUE MAXIMIZATION
**Target**: Best ROI with balanced reach and affordability
- **Creators**: Seth James DeMoor, David Bluetile, Believe in the Run, REI
- **Investment**: $1,777
- **Total Reach**: 870K subscribers
- **Avg CPM**: $2.04
- **Best For**: Budget-conscious campaigns, early-stage products

### Scenario 3: MICRO-INFLUENCER NETWORK
**Target**: Multiple touchpoints with growing channels
- **Creators**: ALTIS World, Fleet Feet, Alastair Running, Doctors of Running
- **Investment**: $1,267
- **Total Reach**: 118K subscribers
- **Avg CPM**: $10.73
- **Best For**: Niche targeting, community building, authentic engagement

---

## Top 10 Creators by Subscriber Count

| Rank | Creator | Subscribers | Price | CPM |
|------|---------|-------------|-------|-----|
| 1 | REI | 449,000 | $583 | $1.30 |
| 2 | DanteTheBody FIT | 396,000 | $1,388 | $3.51 |
| 3 | DesFit | 268,000 | $3,414 | $12.74 |
| 4 | Seth James DeMoor | 169,000 | $258 | $1.53 |
| 5 | Jason and Lauren | 158,000 | $1,187 | $7.51 |
| 6 | David Bluetile | 129,000 | $459 | $3.56 |
| 7 | Believe in the Run | 123,000 | $477 | $3.88 |
| 8 | Road Runner Sports | 56,500 | $3,213 | $56.87 |
| 9 | RunRepeat.com | 54,600 | $1,103 | $20.20 |
| 10 | Doctors of Running | 46,700 | $481 | $10.30 |

---

## Best Value Creators (Under $600)

These creators offer excellent value with 100K+ subscribers:

1. **Seth James DeMoor** - $258 (169K subs) ⭐ BEST VALUE
2. **David Bluetile** - $459 (129K subs)
3. **Believe in the Run** - $477 (123K subs)
4. **REI** - $583 (449K subs) ⭐ HIGHEST REACH

---

## Budget-Friendly Options (Under $500)

For campaigns with tighter budgets or testing new product launches:

1. **ALTIS World** - $39 (15.3K subs)
2. **Fleet Feet** - $338 (38.1K subs)
3. **Alastair Running** - $409 (18.1K subs)
4. **Doctors of Running** - $481 (46.7K subs)

---

## Deliverables Generated

### JSON Files
- **sportswear_creators_profile.json** - Complete profile data with audience demographics
  - All 15 creators with full details
  - Avatar URLs, subscriber counts, audience breakdowns
  - Age, gender, and geographic distribution

### CSV Export
- **sportswear_creators_summary.csv** - Quick reference spreadsheet
  - Rank, Channel ID, Name, Subscribers, Price, CPM
  - Country, Language, Average Audience Age
  - Gender demographics, Avatar URLs
  - Ready for import into campaign management tools

### Summary Documents
- **CREATOR_ANALYSIS_SUMMARY.txt** - Text analysis with recommendations
- **fetch_sportswear_creators.py** - Reusable script for fetching creator data

---

## API Integration Details

### Endpoints Used
- `/youtube/profile` - Channel information, subscriber counts, avatars, descriptions
- `/youtube/audience` - Audience demographics, age ranges, gender distribution, geography

### Data Points Retrieved per Creator
- Channel ID and Name
- Subscriber count and content volume
- Country and primary language
- Verification and sponsorship status
- Channel description/bio
- Avatar URL (for visual reference)
- Average audience age
- Age breakdown (7 age brackets)
- Gender distribution (male/female ratio)
- Top 5-6 geographic markets by audience share

---

## Next Steps

1. **Review Recommendations**: Select creators based on campaign objectives
2. **Budget Planning**: Choose from scenarios (Premium, Value, Micro-Influencer)
3. **Outreach**: Contact creators through CreatorDB platform or direct channels
4. **Brief Development**: Customize content brief based on audience profile
5. **Performance Tracking**: Monitor engagement metrics and audience feedback

---

## Notes for Campaign Managers

- All data fetched on 2026-04-16 using CreatorDB API
- Pricing reflects current video rates from each creator
- Audience demographics are current as of data retrieval
- CPM (Cost Per Mille) helps compare value across different follower counts
- RunRepeat.com has missing age data (marked as 0) - verify with API before campaign
- NOBULL and Road Runner Sports have premium pricing due to smaller subscriber bases
- REI offers best combination of reach and affordability for major campaigns

---

*Analysis prepared using CreatorDB API integration*
*All creators: USA-based, English-speaking, Sports/Fitness/Running niche*
