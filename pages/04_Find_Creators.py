"""
Find Creators For Your Brand - CreatorDB
"""

import streamlit as st
import shlex
import subprocess
import html
import json
import re
from pathlib import Path
from system_prompt import template_creator_search

st.set_page_config(
    page_title="Find Creators",
    layout="centered",
    initial_sidebar_state="collapsed"
)

if "creator_results" not in st.session_state:
    st.session_state.creator_results = []

if "creator_search_error" not in st.session_state:
    st.session_state.creator_search_error = ""

if "creator_result_source" not in st.session_state:
    st.session_state.creator_result_source = ""

OUTPUT_DIR = Path("/Users/cdb/Desktop/creatordb_hackathon/output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def make_cache_file_path(product_type: str, budget_label: str) -> Path:
    """Create cache filename like recommended_creator_list_{product_type}_{budget}.json."""
    product_slug = re.sub(r"[^a-z0-9]+", "_", product_type.strip().lower()).strip("_")
    budget_slug = re.sub(r"[^a-z0-9]+", "_", budget_label.strip().lower()).strip("_")
    return OUTPUT_DIR / f"recommended_creator_list_{product_slug}_{budget_slug}.json"


def sanitize_claude_output(text: str) -> str:
    """Remove markdown fences if Claude wraps output."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if len(lines) >= 2 and lines[-1].strip() == "```":
            cleaned = "\n".join(lines[1:-1]).strip()
    return cleaned


def parse_creator_rows(text: str) -> list[dict]:
    """Parse rows returned by Claude into structured creator dicts."""
    rows = []
    for line in text.splitlines():
        line = line.strip().lstrip("-").strip()
        if not line or "|" not in line:
            continue
        parts = [part.strip() for part in line.split("|")]
        if len(parts) < 4:
            continue
        if len(parts) >= 11:
            rows.append(
                {
                    "name": parts[0],
                    "platform": parts[1],
                    "channelId": parts[2],
                    "videoPrice": parts[3],
                    "avatarUrl": parts[4],
                    "totalSubscribers": parts[5],
                    "country": parts[6],
                    "language": parts[7],
                    "ageRange": parts[8],
                    "topCountries": parts[9],
                    "mainAgeRange": parts[10],
                }
            )
        else:
            rows.append(
                {
                    "name": parts[0],
                    "platform": parts[1],
                    "channelId": parts[2],
                    "videoPrice": "N/A",
                    "avatarUrl": "",
                    "totalSubscribers": "N/A",
                    "country": "N/A",
                    "language": "N/A",
                    "ageRange": "N/A",
                    "topCountries": "N/A",
                    "mainAgeRange": "N/A",
                }
            )
    return rows


def load_creator_cache(cache_file: Path) -> list[dict]:
    """Load creators from JSON cache, transforming field names to match display format."""
    try:
        data = json.loads(cache_file.read_text(encoding="utf-8", errors="replace"))
        creators = []
        for item in data:
            demographics = item.get("demographics", {})
            creators.append({
                "name": item.get("channel_name", "Unknown"),
                "platform": "YouTube",
                "channelId": item.get("channelId", "N/A"),
                "videoPrice": str(item.get("sponsorship_price", "N/A")),
                "avatarUrl": item.get("avatar", ""),
                "totalSubscribers": str(item.get("subscribers", "N/A")),
                "country": item.get("country", "N/A"),
                "language": item.get("language", "N/A"),
                "ageRange": demographics.get("main age range", "N/A"),
                "topCountries": str(demographics.get("top_countries", "N/A")),
                "mainAgeRange": demographics.get("main age range", "N/A"),
            })
        return creators
    except (json.JSONDecodeError, TypeError, KeyError):
        return []

st.markdown(
    """
    <div style="text-align: center; padding: 40px 20px;">
        <h1 style="font-size: 2.5em; margin-bottom: 10px;">🎬 Find Creators For Your Brand</h1>
        <p style="font-size: 1em; color: #666; margin-bottom: 30px;">Tell us about your brand and find the perfect influencers</p>
    </div>
    """,
    unsafe_allow_html=True
)

# Create the form
st.markdown("### Your Campaign Requirements")

col1, col2, col3 = st.columns(3, gap="large")

with col1:
    st.markdown("Step 1:  \n**Select Your Product Type**")
    product_type = st.selectbox(
        "Your product type",
        options=["Sportswear", "Cosmetics", "Skincare", "Smartphones", "E-commerce", "Retail", "Watches"],
        label_visibility="collapsed"
    )

with col2:
    st.markdown("Step 2:  \n**Select Your Budget**")
    budget_options = {
        "Micro ($1K - $5K)": (1000, 5000),
        "Small ($5K - $25K)": (5000, 25000),
        "Medium ($25K - $50K)": (25000, 50000),
        "Large ($50K - $100K)": (50000, 100000),
        "Enterprise ($100K+)": (100000, 100000)
    }
    budget = st.selectbox(
        "Your Budget",
        options=list(budget_options.keys()),
        label_visibility="collapsed"
    )

with col3:
    st.markdown("Step 3:  \n**Select Number of Creators**")
    number_of_creators = st.selectbox(
        "Number of creators to collaborate with (1-10)",
        options=list(range(1, 11)),
        index=0,
        label_visibility="collapsed"
    )

st.markdown("---")

# Optional filters section
with st.expander("🎯 Advanced Filters (Optional)", expanded=False):
    st.markdown("**Refine your search with audience demographics:**")

    filter_col1, filter_col2 = st.columns(2)

    with filter_col1:
        st.markdown("**Language**")
        language = st.selectbox(
            "Language",
            options=["Any", "English", "Spanish", "French", "German", "Mandarin", "Japanese", "Korean", "Thai", "Portuguese"],
            label_visibility="collapsed"
        )

        st.markdown("**Age Group**")
        age_group = st.selectbox(
            "Age Group",
            options=["Any", "<17", "18-24", "25-34", "35-44", "45+"],
            label_visibility="collapsed"
        )

    with filter_col2:
        st.markdown("**Location**")
        location = st.selectbox(
            "Location",
            options=["Any", "USA", "Canada", "UK", "Europe", "Asia", "South Korea", "Thailand", "Japan", "India", "Brazil", "Mexico"],
            label_visibility="collapsed"
        )

        st.markdown("**Gender**")
        gender = st.selectbox(
            "Gender",
            options=["Any", "Male", "Female", "Mixed"],
            label_visibility="collapsed"
        )

st.markdown("---")

# Submit button
col_submit = st.columns(3)
with col_submit[1]:
    if st.button("🔍 Find Creators", use_container_width=True, key="btn_find_creators_submit"):
        budget_min, budget_max = budget_options[budget]
        total_budget = budget_max
        budget_per_creator = total_budget / number_of_creators

        st.session_state.search_query = {
            "product_type": product_type,
            "budget": {
                "label": budget,
                "min": budget_min,
                "max": budget_max
            },
            "budget_per_creator": budget_per_creator,
            "filters": {
                "language": language if language != "Any" else None,
                "location": location if location != "Any" else None,
                "gender": gender if gender != "Any" else None,
                "age_group": age_group if age_group != "Any" else None
            }
        }
        active_filters = {
            "language": language if language != "Any" else "Any",
            "location": location if location != "Any" else "Any",
            "gender": gender if gender != "Any" else "Any",
            "age_group": age_group if age_group != "Any" else "Any",
        }
        filter_text = ", ".join([f"{k}={v}" for k, v in active_filters.items()])

        prompt = template_creator_search.format(
            product_type=product_type,
            budget_per_creator=budget_per_creator,
            filter_text=filter_text
        )

        cache_file = make_cache_file_path(product_type, budget)
        if cache_file.exists():
            st.session_state.creator_search_error = ""
            # Try loading as JSON first, fall back to pipe-separated format
            results = load_creator_cache(cache_file)
            if not results:
                cached_text = cache_file.read_text(encoding="utf-8", errors="replace")
                results = parse_creator_rows(cached_text)
            st.session_state.creator_results = results
            st.session_state.creator_result_source = f"cache: {cache_file.name}"
        else:

            command = f"claude --dangerously-skip-permissions {shlex.quote(prompt)}"
            with st.spinner("Searching creators... this can take a while."):
                result = subprocess.run(
                    command,
                    shell=True,
                    capture_output=True,
                    text=True,
                    cwd="/Users/cdb/Desktop/creatordb_hackathon"
                )

            if result.returncode != 0:
                st.session_state.creator_results = []
                st.session_state.creator_search_error = result.stderr.strip() or "Creator search failed."
                st.session_state.creator_result_source = ""
            else:
                st.session_state.creator_search_error = ""
                output_text = sanitize_claude_output(result.stdout)
                cache_file.write_text(output_text, encoding="utf-8")
                st.session_state.creator_results = parse_creator_rows(output_text)
                st.session_state.creator_result_source = f"new search cached: {cache_file.name}"


st.markdown("---")

# Display search results placeholder
st.markdown("### 🌟 Recommended Creators")
if st.session_state.creator_search_error:
    st.error("❌ Failed to retrieve creators.")
    st.code(st.session_state.creator_search_error)
elif st.session_state.creator_results:
    if st.session_state.creator_result_source:
        st.caption(f"Result source: {st.session_state.creator_result_source}")
    st.markdown(
        """
        <style>
        .creator-card {
            border: 1px solid #dbeafe;
            border-radius: 18px;
            padding: 18px 20px;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #f1f7ff 100%);
            box-shadow: 0 10px 30px rgba(30, 64, 175, 0.10);
        }
        .creator-top {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 16px;
            padding-bottom: 14px;
            border-bottom: 1px solid #e2e8f0;
        }
        .creator-avatar {
            width: 78px;
            height: 78px;
            border-radius: 14px;
            object-fit: cover;
            flex-shrink: 0;
            background: #f8fafc;
            border: 2px solid #dbeafe;
        }
        .creator-avatar-placeholder {
            width: 78px;
            height: 78px;
            border-radius: 14px;
            background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1e3a8a;
            font-size: 2rem;
            flex-shrink: 0;
            border: 2px solid #93c5fd;
        }
        .creator-info {
            flex: 1;
        }
        .creator-name {
            font-size: 1.16rem;
            font-weight: 700;
            color: #0b1220;
            margin: 0 0 6px 0;
        }
        .creator-platform {
            font-size: 0.78rem;
            color: #1e3a8a;
            background: #dbeafe;
            border-radius: 999px;
            padding: 5px 12px;
            display: inline-block;
            font-weight: 600;
        }
        .creator-meta-row {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        .creator-chip {
            font-size: 0.76rem;
            color: #0f172a;
            background: #f1f5f9;
            border: 1px solid #dbeafe;
            border-radius: 999px;
            padding: 4px 10px;
        }
        .creator-fields {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
        }
        .creator-item {
            background: #ffffff;
            border-radius: 10px;
            padding: 10px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #e2e8f0;
        }
        .creator-label {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 500;
        }
        .creator-value {
            font-size: 0.9rem;
            color: #0f172a;
            font-weight: 500;
            word-break: break-word;
            text-align: right;
            margin-left: 10px;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    for idx, creator in enumerate(st.session_state.creator_results, start=1):
        name = html.escape(str(creator.get("name", "Unknown")))
        platform = html.escape(str(creator.get("platform", "Unknown")))
        channel_id = html.escape(str(creator.get("channelId", "N/A")))
        video_price = html.escape(str(creator.get("videoPrice", "N/A")))
        avatar_url = str(creator.get("avatarUrl", ""))
        total_subscribers = html.escape(str(creator.get("totalSubscribers", "N/A")))
        country = html.escape(str(creator.get("country", "N/A")))
        language_value = html.escape(str(creator.get("language", "N/A")))
        age_range = html.escape(str(creator.get("ageRange", "N/A")))
        top_countries = html.escape(str(creator.get("topCountries", "N/A")))

        # Build avatar HTML
        avatar_html = ""
        if avatar_url and avatar_url != "N/A" and avatar_url.lower().startswith("http"):
            avatar_html = f'<img src="{html.escape(avatar_url)}" class="creator-avatar" alt="{name} avatar" onerror="this.style.display=\'none\'">'
        else:
            avatar_html = '<div class="creator-avatar-placeholder">👤</div>'

        st.markdown(
            f"""
            <div class="creator-card">
                <div class="creator-top">
                    {avatar_html}
                    <div class="creator-info">
                        <p class="creator-name">{idx}. {name}</p>
                        <span class="creator-platform">{platform}</span>
                        <div class="creator-meta-row">
                            <span class="creator-chip">Country: {country}</span>
                            <span class="creator-chip">Language: {language_value}</span>
                            <span class="creator-chip">Age: {age_range}</span>
                        </div>
                    </div>
                </div>
                <div class="creator-fields">
                    <div class="creator-item"><div class="creator-label">Total Subscribers</div><div class="creator-value">{total_subscribers}</div></div>
                    <div class="creator-item"><div class="creator-label">Video Price</div><div class="creator-value">{video_price}</div></div>
                    <div class="creator-item"><div class="creator-label">Top Countries</div><div class="creator-value">{top_countries}</div></div>
                    <div class="creator-item"><div class="creator-label">Channel ID</div><div class="creator-value">{channel_id}</div></div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
else:
    st.info("🔍 Submit your search to discover matching creators for your brand!")
