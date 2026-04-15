import time
import os
import requests
from dotenv import load_dotenv
import utils
from pymongo import MongoClient
import json
load_dotenv()

BASEDIR = "/Users/cdb/Desktop/creatordb_hackathon"

class mongodb:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.profile_info_yt = {'_id': 1, 'cName': 1, 'desc': 1, 'stats.channel.followers': 1, 'misc.calculated': 1}



    def get_popular_YT_accounts(self, limit: int=10):
        all_accounts = []
        collection = self.client['youtube_v2']['channels']
        cursor = collection.find(filter={"stats.channel.followers": {"$gt": 1000000}}, 
                                 projection=self.profile_info_yt).limit(limit)
        for document in cursor:
            all_accounts.append(document.get('cName'))
        return all_accounts

    def get_account_data(self, platform: str, account_id: str):
        collection_dict = {"youtube_v2": "channels", "instagram_v2": "accounts", "tiktok": "accounts"}
        account_id_dict = {"youtube_v2": "uId", "instagram_v2": "handle", "tiktok": "handle"}
        collection = self.client[platform][collection_dict[platform]]
        document = collection.find_one({account_id_dict[platform]: account_id}, projection=self.profile_info_yt)
        # convert document to string
        document_string = json.dumps(document, indent=4)
        return document




    def get_account_schema(self, db_name: str):
        collection_dict = {"youtube_v2": "channels", "instagram_v2": "accounts", "tiktok": "accounts"}
        accountId_dict = {"youtube_v2": "UCX6OQ3DkcsbYNE6H8uQQuVA", "instagram_v2": "2278169415", "tiktok": "6614519312189947909"}
        collection = self.client[db_name][collection_dict[db_name]]
        document = collection.find_one({'_id': accountId_dict[db_name]})
        schema = utils.infer_type_schema(document)
        print(schema)
        # # save schema to json
        # with open(f"{BASEDIR}/resource/mongodb/schema/{db_name.split('_')[0]}_profile.json", "w") as f:
        #     json.dump(schema, f, indent=4)
        return schema

    def get_video_transcript(self, vid, verbose=False):
        url = f"{self.url}/youtube/subtitles/download"
        params = {
            "videoId": vid,
            "vssId": ".en" # a.en
        }

        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            data = response.json()
            
            # Check if the API call was successful
            if isinstance(data, dict) and data.get('success') == False:
                if verbose:
                    print(f"⚠️  Video {vid}: {data.get('message', 'Unknown error')}")
                return None
            
            # Check if data is a list (successful response with subtitles)
            if not isinstance(data, list):
                if verbose:
                    print(f"⚠️  Video {vid}: Unexpected response format")
                return None
            
            # Parse the transcript
            whole_transcript = " ".join([text_info['text'] for text_info in data])
            return whole_transcript
            
        except (KeyError, TypeError, requests.RequestException) as e:
            if verbose:
                print(f"⚠️  Video {vid}: Error - {e}")
            return None

if __name__ == "__main__":
    api = mongodb()
    # accounts = api.get_popular_YT_accounts(limit=10)
    # schema = api.get_schema(db_name="youtube_v2", collection_name="channels")
    # document = api.get_profile_schema(db_name="tiktok")
    document = api.get_account_data(platform="youtube_v2", account_id="@mrbeast")
    print(document) 


# from pymongo import MongoClient
# import os
# from dotenv import load_dotenv
# load_dotenv()

# client = MongoClient(os.getenv("MONGO_URI"))
# collection = client["youtube_v2"]['channels']
# document = collection.find_one({'uid': 'UCX6OQ3DkcsbYNE6H8uQQuVA'})
# print(document)



        