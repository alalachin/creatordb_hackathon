import sys
sys.path.insert(0, '/Users/cdb/Desktop/creatordb_hackathon/src')

from cretordbAPI import creatordbAPI
import json
import time

# List of YouTube channel IDs with video prices
creators_data = [
    {"channel_id": "UCICRLxrMEgzYMMOdjGDiOvQ", "name": "Road Runner Sports", "price": 3213},
    {"channel_id": "UCch0pyPXmlB1X1x324uk1Pw", "name": "David Bluetile", "price": 459},
    {"channel_id": "UC3h4BbV9hbAcYlM4__imOyw", "name": "RunRepeat.com", "price": 1103},
    {"channel_id": "UCnVo8RafJC8kNL6CVI_h_Sg", "name": "Alastair Running", "price": 409},
    {"channel_id": "UCpUtRsyAx5rluUDmF4k_gHw", "name": "Doctors of Running", "price": 481},
    {"channel_id": "UC029CQxPO_w-ENYRuhK1Q_g", "name": "Fleet Feet", "price": 338},
    {"channel_id": "UCrBbne8HfONwYK569YNTOgA", "name": "VertiMax", "price": 1060},
    {"channel_id": "UCdLuu6qncgyTpRGJu02sTfA", "name": "ALTIS World", "price": 39},
    {"channel_id": "UCMHe0UKRkYxb8JWt7C_c_kA", "name": "NOBULL", "price": 2202},
    {"channel_id": "UCwZcNfPpV9CXSVbpH1ckVmw", "name": "REI", "price": 583},
    {"channel_id": "UCqTtwbwc3VgVKax6NP-ZvJw", "name": "DanteTheBody FIT", "price": 1388},
    {"channel_id": "UCmVhS0qulkRshtLrXMeMToQ", "name": "DesFit", "price": 3414},
    {"channel_id": "UCeSHo5kTvzoik4STh7MuMCA", "name": "Seth James DeMoor", "price": 258},
    {"channel_id": "UCvJ3gIxdoPpGYnrbXECnw_w", "name": "Jason and Lauren", "price": 1187},
    {"channel_id": "UC2-2J_y_jpOYz8Rld5C6C5w", "name": "Believe in the Run", "price": 477},
]

api = creatordbAPI()
results = []

print("Fetching profile and audience information for sportswear creators...")
print(f"Total creators to process: {len(creators_data)}\n")

for idx, creator in enumerate(creators_data, 1):
    channel_id = creator["channel_id"]
    name = creator["name"]
    price = creator["price"]

    print(f"[{idx}/{len(creators_data)}] Processing {name} ({channel_id})...", end=" ")

    try:
        # Fetch profile information
        profile_response = api.get_account_info("/youtube/profile", channel_id)
        profile_data = profile_response.get("data", {})

        # Fetch audience information
        audience_response = api.get_account_info("/youtube/audience", channel_id)
        audience_data = audience_response.get("data", {})

        creator_info = {
            "channel_id": channel_id,
            "channel_name": profile_data.get("displayName", name),
            "provided_name": name,
            "video_price": price,
            "profile": {
                "avatar_url": profile_data.get("avatarUrl"),
                "subscriber_count": profile_data.get("totalSubscribers"),
                "total_contents": profile_data.get("totalContents"),
                "country": profile_data.get("country"),
                "language": profile_data.get("mainLanguage"),
                "is_verified": profile_data.get("isVerified"),
                "has_sponsors": profile_data.get("hasSponsors"),
                "description": profile_data.get("bio"),
            },
            "audience_demographics": {
                "average_age": audience_data.get("audienceAvgAge"),
                "age_breakdown": audience_data.get("audienceAgeBreakdown", []),
                "gender": audience_data.get("audienceGender", {}),
                "top_countries": audience_data.get("audienceLocations", []),
            }
        }

        results.append(creator_info)
        print("✓")
        time.sleep(0.5)  # Rate limiting

    except Exception as e:
        print(f"✗ Error: {str(e)[:60]}")
        results.append({
            "channel_id": channel_id,
            "channel_name": name,
            "video_price": price,
            "error": str(e)
        })
        time.sleep(0.5)

# Filter creators within budget ($12,500 max) and sort by price
budget = 12500
affordable_creators = [c for c in results if "error" not in c and c["video_price"] <= budget]
affordable_creators.sort(key=lambda x: x["video_price"])

print(f"\n\n{'='*80}")
print(f"SUMMARY")
print(f"{'='*80}")
print(f"Total creators processed: {len(results)}")
print(f"Successfully fetched: {len([r for r in results if 'error' not in r])}")
print(f"Failed: {len([r for r in results if 'error' in r])}")
print(f"\nCreators within budget (≤${budget}): {len(affordable_creators)}")
print(f"\nAffordable creators (sorted by price):")
for c in affordable_creators:
    subs = c.get('profile', {}).get('subscriber_count', 'N/A')
    print(f"  - {c['channel_name']}: ${c['video_price']} ({subs} subscribers)")

# Save results to JSON file
output_file = "/Users/cdb/Desktop/creatordb_hackathon/sportswear_creators_profile.json"
with open(output_file, "w") as f:
    json.dump({
        "total_creators": len(results),
        "successfully_fetched": len([r for r in results if 'error' not in r]),
        "budget": budget,
        "affordable_count": len(affordable_creators),
        "all_creators": results,
        "affordable_creators": affordable_creators
    }, f, indent=2)

print(f"\n\nDetailed results saved to: {output_file}")
