import sys
sys.path.insert(0, '/Users/cdb/Desktop/creatordb_hackathon/src')

from cretordbAPI import creatordbAPI
import json

api = creatordbAPI()
try:
    response = api.get_account_info("/youtube/audience", "UC28FD2v19VZFryIjpvGIFLw")
    print(json.dumps(response, indent=2))
except Exception as e:
    print(f"Error: {e}")
