import sys
sys.path.insert(0, '/Users/cdb/Desktop/creatordb_hackathon/src')

from cretordbAPI import creatordbAPI
import json

api = creatordbAPI()
response = api.get_account_info("/youtube/profile", "UC28FD2v19VZFryIjpvGIFLw")
print(json.dumps(response, indent=2))
