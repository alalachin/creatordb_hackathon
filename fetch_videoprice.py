#!/usr/bin/env python3
from src.cretordbAPI import creatordbAPI
import json

api = creatordbAPI()

# List of YouTube channel IDs
channel_ids = [
    ("UCMHe0UKRkYxb8JWt7C_c_kA", "NOBULL"),
    ("UCbVEx9qG_hLrb6FrWQJz_Tg", "Nick Bare"),
    ("UCmVhS0qulkRshtLrXMeMToQ", "DesFit"),
    ("UCOsFVEylgXEcnxAEt9E0c4Q", "Max Euceda"),
    ("UC4Tq3b1EAb4roSp0AiYQL6g", "Aitza Fitness"),
    ("UCTJXMoehEPDTsRwme-IpbMQ", "Chris Duffin"),
    ("UCN-xLVDmw3PzzAeGQXR0Gnw", "Arsenal Strength"),
    ("UCEu66fKlIRa9-JtZj27X8Vw", "BARNATURALS"),
    ("UCGYMkmFm_-tGuZWEhhKLABw", "Maxx Stewart"),
    ("UCrBbne8HfONwYK569YNTOgA", "VertiMax"),
    ("UC_eHJ-1HBB9ZTaZPOUdyhkw", "ringsking"),
    ("UCyU_1i2UB0dWa2VXZugfalA", "Vitalii Sport"),
    ("UCqoXqOQ2t2H8_JfHNNBhzVg", "Tony Solo"),
]

print("Fetching videoPrice data for sports content creators...\n")
print(f"{'Creator Name':<25} | {'CPM (Raw)':<10} | {'Price (Raw)':<12}")
print("-" * 52)

for channel_id, name in channel_ids:
    try:
        data = api.get_account_info("/youtube/profile", channel_id)
        video_price = data.get('data', {}).get('videoPrice', {})
        cpm = video_price.get('cpmRaw', 'N/A')
        price = video_price.get('priceRaw', 'N/A')
        print(f"{name:<25} | ${cpm:<9} | ${price:<11}")
    except Exception as e:
        print(f"{name:<25} | Error: {str(e)[:30]}")
