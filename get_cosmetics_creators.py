#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/cdb/Desktop/creatordb_hackathon/src')

from cretordbAPI import creatordbAPI

# Creator IDs from the Cosmetics product type search
creator_ids = [
    "UC28FD2v19VZFryIjpvGIFLw",  # Mixed Makeup
    "UC3Qo58SU-QExQvULmjS2lug",  # Eddy J Smith
    "UCQdY9ML-YiVmnNUtkIFTGVA",  # Pammy Cosmetix
    "UC8gaiQHu6uEfWa87kZ0_FkQ",  # MrsMelissaM
    "UCxwZnmLwSvrp1RjHNNeAeFQ",  # Estee Lauder
    "UCTwjH6j9CnmtXdXraKgHOvA",  # Makeup of things
    "UCwe-36cDI9OA4_bRfMrtiVg",  # Jen Phelps
    "UCgRXgVznLA_jE7Tcr_QKOSw",  # Ariel Black
    "UCi13sYFFhBF80aCjhDphRAw",  # Makeup Compilation
    "UCgjx2QQ-b1Kscjc9xE06LDg",  # Dawn Gallagher
    "UC2_NoH96vBrJ4Q3Qqo2_kYw",  # SHISEIDO_USA
    "UCVd4ujVgjpFgqWBjqrFk2qg",  # Lola Bello
    "UCPTlNK-KtTC4OJRguQfL_jA",  # Rita Almusa Beauty
    "UCF79odgBUiSJ3oEoV9l4u5Q",  # GlamourbyLexi
    "UCzlgsdcnqJq8BDWY7bqWUmA",  # Alexandra Anele
    "UCDJ7jU-bV_OfTg039JAFahQ",  # Ale Jay
    "UCY8LkGSO_34lHxujnvATGAw",  # Lisa J
    "UCTRUB2otFFPY0C1xpWJJJmg",  # Graceful Beauty
]

# Video prices from previous queries
video_prices = {
    "UC28FD2v19VZFryIjpvGIFLw": 896,
    "UC3Qo58SU-QExQvULmjS2lug": 57,
    "UCQdY9ML-YiVmnNUtkIFTGVA": 35,
    "UC8gaiQHu6uEfWa87kZ0_FkQ": 334,
    "UCxwZnmLwSvrp1RjHNNeAeFQ": 912,
    "UCTwjH6j9CnmtXdXraKgHOvA": 5329,
    "UCwe-36cDI9OA4_bRfMrtiVg": 717,
    "UCgRXgVznLA_jE7Tcr_QKOSw": 124,
    "UCi13sYFFhBF80aCjhDphRAw": 0,
    "UCgjx2QQ-b1Kscjc9xE06LDg": 417,
    "UC2_NoH96vBrJ4Q3Qqo2_kYw": 201,
    "UCVd4ujVgjpFgqWBjqrFk2qg": 14,
    "UCPTlNK-KtTC4OJRguQfL_jA": 257,
    "UCF79odgBUiSJ3oEoV9l4u5Q": 73,
    "UCzlgsdcnqJq8BDWY7bqWUmA": 4609,
    "UCDJ7jU-bV_OfTg039JAFahQ": 2260,
    "UCY8LkGSO_34lHxujnvATGAw": 562,
    "UCTRUB2otFFPY0C1xpWJJJmg": 1140,
}

api = creatordbAPI()
budget = 16667

creators = []

for channel_id in creator_ids:
    try:
        profile_response = api.get_account_info("/youtube/profile", channel_id)
        profile_data = profile_response.get('data', {})

        # Extract basic fields
        name = profile_data.get('displayName', 'N/A')
        platform = "YouTube"
        video_price = video_prices.get(channel_id, 0)
        avatar_url = profile_data.get('avatarUrl', 'N/A')
        total_subscribers = profile_data.get('totalSubscribers', 0)
        country = profile_data.get('country', 'N/A')
        language = profile_data.get('mainLanguage', 'N/A')

        # Get audience demographic info
        age_range = 'N/A'
        top_countries_str = 'N/A'
        main_age_range = 'N/A'

        try:
            audience_response = api.get_account_info("/youtube/audience", channel_id)
            audience_data = audience_response.get('data', {})

            # Get top countries from audience locations
            locations = audience_data.get('audienceLocations', [])
            top_countries = [loc['country'] for loc in locations[:3]]
            top_countries_str = ', '.join(top_countries) if top_countries else 'N/A'

            # Get main age range from age breakdown
            age_breakdown = audience_data.get('audienceAgeBreakdown', [])
            if age_breakdown:
                # Find age range with highest share
                main_age = max(age_breakdown, key=lambda x: x.get('share', 0))
                main_age_range = main_age.get('ageRange', 'N/A')
                # Also set age_range to the most common range
                age_range = main_age_range

        except Exception as audience_error:
            # If audience endpoint fails, use N/A
            pass

        # Only include if within budget
        if video_price <= budget:
            creators.append({
                'name': name,
                'platform': platform,
                'channelId': channel_id,
                'videoPrice': video_price,
                'avatarUrl': avatar_url,
                'totalSubscribers': total_subscribers,
                'country': country,
                'language': language,
                'ageRange': age_range,
                'topCountries': top_countries_str,
                'mainAgeRange': main_age_range
            })

    except Exception as e:
        print(f"Error fetching data for {channel_id}: {e}", file=sys.stderr)
        continue

# Sort by video price (ascending) then by subscribers (descending)
creators.sort(key=lambda x: (x['videoPrice'], -x['totalSubscribers']))

# Print in required format
print("name | platform | channelId | videoPrice | avatarUrl | totalSubscribers | country | language | ageRange | top_countries | main_age_range")
for creator in creators:
    print(f"{creator['name']} | {creator['platform']} | {creator['channelId']} | {creator['videoPrice']} | {creator['avatarUrl']} | {creator['totalSubscribers']} | {creator['country']} | {creator['language']} | {creator['ageRange']} | {creator['topCountries']} | {creator['mainAgeRange']}")
