#!/usr/bin/env python3
"""
A simple MCP server that provides basic tools for text manipulation and calculation.

This server demonstrates:
- Defining tools with type hints and docstrings
- Using FastMCP for rapid development
- Running the server with stdio transport
"""

import sys
import json
from mcp.server.fastmcp import FastMCP
from cretordbAPI import creatordbAPI
from mongodb import mongodb
from pathlib import Path

mcp = FastMCP("simple-server")
cretordb_api = creatordbAPI()
mongodb = mongodb()
BASEDIR = "/Users/cdb/Desktop/creatordb_hackathon"



########################################################
# CreatorDB Tools
########################################################

# @mcp.tool(description="Get the top N accounts with > 1M subscribers on a specific platform")
# def get_popular_accounts(platform: str, limit: int) -> list[str]:
#     """Get YT accounts with > 1M subscribers"""
#     accounts = cretordb_api.get_popular_accounts(platform, limit)
#     return accounts

# @mcp.tool(description="Build filter object for CreatorDB YouTube search API")
# def make_filter(display_name: str = None, min_subscribers: int = None, min_avg_views: int = None, category: str = None):
#     filter = cretordb_api.make_filter(display_name, min_subscribers, min_avg_views, category)
#     return filter

# @mcp.tool(description="List all the CretorDB API endpoints.")
# def list_endpoints() -> str:
#     """List all the CretorDB API endpoints."""
#     endpoints = cretordb_api.list_endpoints()
#     return endpoints


# @mcp.tool(description="Get the accounts that sell similar products to the given brand on a specific platform")
# def get_brand_competitors_info(platform: str, brand_name: str) -> dict:
#     """Get the top accounts of brands that are the competitors of the given brand on a specific platform"""
#     query = f"{platform} accounts of brands are the competitors of {brand_name}."
#     print(query)
#     return cretordb_api.search_creators_nl(query = query)



########################################################
# MongoDB Tools
########################################################

@mcp.tool(description="Get the top N accounts with > 1M subscribers on Youtube")
def get_popular_accounts_YT(limit: int) -> list[str]:
    """Get YT accounts with > 1M subscribers"""
    accounts = mongodb.get_popular_YT_accounts(limit)
    return accounts

@mcp.tool(description="Get the schema of a MongoDB collection. Please specify the platform: youtube_v2, instagram_v2, tiktok")
def get_account_schema(db_name: str) -> dict:
    """Get the schema of the MongoDB collection"""
    schema = mongodb.get_account_schema(db_name)
    schema_string = json.dumps(schema, indent=4)
    return schema_string

@mcp.tool(description='''Query an account on a specific platform. Specify the platform: youtube_v2, instagram_v2, tiktok;
 and the account id field: youtube_v2 - "uId", instagram_v2 - "handle", tiktok - "handle", @ should be removed for IG and TT, keep for YT.''')
def get_account_data(platform: str, account_id: str) -> dict:
    """Query an account on a specific platform"""
    account_data = mongodb.get_account_data(platform, account_id)
    return account_data

########################################################
# File System Tools
########################################################


@mcp.tool(description="Read a file from the local filesystem")
def read_file(path: str) -> str:
    """Read a file from the local filesystem"""
    with open(path, "r") as f:
        return f.read()

@mcp.tool(description="List the structure under the data folder")
def list_data_folder() -> list[str]:
    """List the structure of a folder under /data"""
    path = f"{BASEDIR}/data"
    return [f.name for f in Path(path).iterdir() if f.is_dir()]

@mcp.tool(description="Write a report to a local file.")
def save_report(filename: str, content: str) -> str:
    """Write a report to a local file."""
    with open("/Users/cdb/Desktop/creatordb_hackathon/output/report_" + filename, "w") as f:
        f.write(content)
    return f"Report written to {filename}."


if __name__ == "__main__":
    mcp.run(transport="stdio")


