import time
import os
import requests
from dotenv import load_dotenv
import utils
load_dotenv()

BASEDIR = "/Users/cdb/Desktop/creatordb_hackathon"

class creatordbAPI:
    def __init__(self):
        self.url = "https://apiv3.creatordb.app/"
        self.headers = {
            "Accept": "application/json",
            "api-key": os.getenv("CREATORDB_API_KEY")
        }


    def get_popular_accounts(self, platform: str, limit: int):
        url = f"{self.url}/{platform}/search"
        page_size = 100  # API max (assumed)
        offset = 0

        all_accounts = []
        while len(all_accounts) < limit:
            payload = {
                "filters": [
                    {
                        "filterName": "totalSubscribers",
                        "op": ">",
                        "value": 1000000
                    }
                ],
                "desc": True,
                "sortBy": "totalSubscribers",
                "pageSize": min(page_size, limit - len(all_accounts)),  # avoid over-fetch
                "offset": offset
            }

            response = requests.post(url, json=payload, headers=self.headers)

            if response.status_code != 200:
                raise Exception(f"API Error: {response.status_code}, {response.text}")

            data = response.json().get('data', {})
            account_list = data.get('creatorList', [])

            if not account_list:
                break

            all_accounts.extend(account_list)
            offset += len(account_list)

            if len(account_list) < page_size:
                break
            time.sleep(0.1)

    def list_endpoints(self):
        with open(f"{BASEDIR}/resource/creatordbAPI/schema/endpoints.md", "r") as f:
            endpoints = f.read()
        return endpoints

    def make_filter(self, display_name: str = None, min_subscribers: int = None, min_avg_views: int = None, category: str = None):
        filters = []
        if display_name:
            filters.append({
                "filterName": "displayName",
                "op": "=",
                "value": display_name,
                "isFuzzySearch": True
            })
        if min_subscribers:
            filters.append({
                "filterName": "totalSubscribers",
                "op": ">",
                "value": min_subscribers
            })
        if min_avg_views:
            filters.append({
                "filterName": "avgVideosViewsAll",
                "op": ">",
                "value": min_avg_views
            })
        if category:
            filters.append({
                "filterName": "mainCategory",
                "op": "=",
                "value": category
            })
        return {
            "filters": filters,
            "pageSize": 10,
            "offset": 0,
            "desc": True,
            "sortBy": "totalSubscribers"
        }



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


    def search_creators_nl(self, query: str):
        url = f"{self.url}/nls"

        payload = {
            "description": query,
        }

        response = requests.post(url, json=payload, headers=self.headers)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(f"API Error: {response.status_code}, {response.text}")

        accounts = utils.parse_sse_response(response.text)

        return accounts["data"]["creatorList"]

if __name__ == "__main__":
    api = creatordbAPI()
    accounts = api.search_creators_nl(query = "youtube accounts of brands are the competitors of sufshark")
    print(accounts)