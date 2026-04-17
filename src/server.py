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
from pathlib import Path
import utils

mcp = FastMCP("simple-server")
cretordb_api = creatordbAPI()
BASEDIR = "/Users/cdb/Desktop/creatordb_hackathon"



########################################################
# CreatorDB Tools
########################################################

@mcp.tool(description="Get the top N accounts with > 1M subscribers on a specific platform")
def get_popular_accounts(platform: str, limit: int) -> list[str]:
    """Get YT accounts with > 1M subscribers"""
    accounts = cretordb_api.get_popular_accounts(platform, limit)
    return accounts

@mcp.tool(description="Build filter object for CreatorDB NLS search")
def make_filter(display_name: str = None, min_subscribers: int = None, min_avg_views: int = None, category: str = None):
    filter = cretordb_api.make_filter(display_name, min_subscribers, min_avg_views, category)
    return filter

@mcp.tool(description="List all the CretorDB API endpoints.")
def list_endpoints() -> str:
    """List all the CretorDB API endpoints."""
    endpoints = cretordb_api.list_endpoints()
    return endpoints

@mcp.tool(description="Show the input and output information of a specific endpoint, endpoint example: '/youtube/profile'")
def show_endpoint_info(endpoint: str) -> dict:
    """Show the input and output information of a specific endpoint"""
    endpoint_info = cretordb_api.show_endpoint_info(endpoint)
    return endpoint_info

@mcp.tool(description='''Get account details from a specific API endpoint using required_fields. 
Use platform-specific account IDs: YouTube IDs start with "UC"; Instagram/TikTok use the handle without "@".
Example endpoint: '/instagram/profile'. Example required_fields: {'uniqueId': 'lalalalisa_m'}''')
def get_account_info(endpoint: str, required_fields: str) -> dict:
    """Retrieve the information of a specific account by API endpoint and required_fields"""
    demographics = cretordb_api.get_account_info(endpoint, required_fields)
    return demographics

@mcp.tool(description="Get the video price of a specific Youtube account.")
def get_video_price(account_id: str) -> int:
    """Get the video price of a specific Youtube account."""
    video_price = cretordb_api.get_video_price(account_id)
    return video_price

@mcp.tool(description="Get the Youtube accounts that is able to promote the given product type. List of channelIds will be returned.")
def get_related_creators_info(product_type: str) -> list[str]:
    query = f"Youtube accounts that is about {product_type}."
    return cretordb_api.search_creators_nl(query = query)



@mcp.tool(description="Read a specified resource file")
def read_file(path: str) -> str:
    """Read a specified resource file from the local filesystem"""
    with open(path, "r") as f:
        return f.read()

@mcp.tool(description="list all the available resources of data, you can find reference about external data and api-related information")
def list_resource_files() -> dict:
    tree = utils.list_resource_tree()
    return {
        "prefix": BASEDIR,
        "tree": tree,
    }

@mcp.tool(description="Write a report to a local file.")
def save_report(filename: str, content: str) -> str:
    """Write a report to a local file."""
    with open("/Users/cdb/Desktop/creatordb_hackathon/output/report_" + filename, "w") as f:
        f.write(content)
    return f"Report written to {filename}."


if __name__ == "__main__":
    mcp.run(transport="stdio")


