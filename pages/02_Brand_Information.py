"""
Brand Information Page
Displays brands in horizontal scrolling frames.
Users can select 2 brands to compare.
"""

import streamlit as st
import subprocess
import json
from pathlib import Path
from system_prompt import template_brand_comparison
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from utils import get_brand_demographics, get_brand_ambassadors_from_md

st.set_page_config(
    page_title="Brand Information",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hardcoded brand data by product type (from brand_ambassadors_kr.md and brand_ambassadors_th.md)
BRANDS_DATA = {
    "Luxury": {
        "Celine": {
            "description": "French luxury fashion house known for minimalist design",
            "category": "Luxury",
            "attributes": ["Minimalist", "High-end", "Timeless"],
        },
        "Chanel": {
            "description": "Iconic French luxury brand with timeless appeal",
            "category": "Luxury",
            "attributes": ["Classic", "Prestigious", "Exclusive"],
        },
        "Dior": {
            "description": "French haute couture and luxury goods brand",
            "category": "Luxury",
            "attributes": ["Elegant", "Innovative", "Premium"],
        },
        "Prada": {
            "description": "Italian luxury fashion and leather goods brand",
            "category": "Luxury",
            "attributes": ["Sophisticated", "Premium", "Trendsetting"],
        },
        "Gucci": {
            "description": "Italian luxury brand known for bold and colorful designs",
            "category": "Luxury",
            "attributes": ["Bold", "Artistic", "Trendy"],
        },
        "Fendi": {
            "description": "Italian luxury fashion house specializing in leather goods",
            "category": "Luxury",
            "attributes": ["Innovative", "Leather goods", "Heritage"],
        }
    },
    "Sportswear": {
        "Nike": {
            "description": "Global sportswear and athletic brand",
            "category": "Sportswear",
            "attributes": ["Performance", "Accessible", "Innovative"],
        },
        "Adidas": {
            "description": "German multinational athletic apparel manufacturer",
            "category": "Sportswear",
            "attributes": ["Performance", "Quality", "Innovative"],
        },
    },
    "Cosmetics": {
        "Maybelline": {
            "description": "Global mass-market cosmetics and beauty brand",
            "category": "Cosmetics",
            "attributes": ["Accessible", "Trendy", "Wide product range"],
        },
        "Lancome": {
            "description": "French luxury beauty brand focused on skincare and fragrance",
            "category": "Cosmetics",
            "attributes": ["Luxury", "Prestige", "Elegant"],
        },
    },
    "Smartphone": {
        "Apple": {
            "description": "Premium consumer electronics and ecosystem brand",
            "category": "Smartphone",
            "attributes": ["Premium", "Design-led", "Ecosystem"],
        },
        "Samsung": {
            "description": "Global electronics leader across mobile and home devices",
            "category": "Smartphone",
            "attributes": ["Innovative", "Comprehensive", "Global"],
        },
    },
    "E-commerce": {
        "Temu": {
            "description": "Cross-border e-commerce platform known for low prices",
            "category": "E-commerce",
            "attributes": ["Price-driven", "Viral", "Mass-market"],
        },
        "Shopee": {
            "description": "Southeast Asian e-commerce platform with broad product selection",
            "category": "E-commerce",
            "attributes": ["Convenient", "Promotional", "Mobile-first"],
        },
    },
    "Watch": {
        "Seiko": {
            "description": "Japanese watchmaker known for precision and reliability",
            "category": "Watch",
            "attributes": ["Reliable", "Heritage", "Craftsmanship"],
        },
        "Tissot": {
            "description": "Swiss watch brand blending heritage with modern design",
            "category": "Watch",
            "attributes": ["Swiss-made", "Accessible luxury", "Heritage"],
        },
    },
    "Retails": {
        "Zara": {
            "description": "Fast fashion retailer with trend-forward designs",
            "category": "Retails",
            "attributes": ["Fast fashion", "Affordable", "Trendy"],
        },
        "H&M": {
            "description": "Global fashion retailer offering affordable everyday style",
            "category": "Retails",
            "attributes": ["Affordable", "Mass-market", "Accessible"],
        },
    },
    "Skincare": {
        "Clinique": {
            "description": "Dermatologist-developed skincare and beauty brand",
            "category": "Skincare",
            "attributes": ["Skincare-led", "Trusted", "Clinical"],
        },
        "Lancome": {
            "description": "French luxury beauty brand focused on skincare and fragrance",
            "category": "Skincare",
            "attributes": ["Luxury", "Prestige", "Elegant"],
        },
    },
}

# Initialize session state
if "selected_brands" not in st.session_state:
    st.session_state.selected_brands = []

if "product_category" not in st.session_state:
    st.session_state.product_category = list(BRANDS_DATA.keys())[0] if BRANDS_DATA else "Sportswear"

if "comparison_report_path" not in st.session_state:
    st.session_state.comparison_report_path = ""

if "comparison_error" not in st.session_state:
    st.session_state.comparison_error = ""

IMAGES_DIR = Path("/Users/cdb/Desktop/creatordb_hackathon/images")


def get_brand_logo_path(brand_name: str) -> Path:
    """Return logo path based on '<brand>.png' naming."""
    brand_name = brand_name.lower()
    return IMAGES_DIR / f"{brand_name}.png"


def get_brand_logo_data_uri(brand_name: str) -> str:
    """Return PNG data URI for in-card HTML rendering."""
    logo_path = get_brand_logo_path(brand_name)
    if not logo_path.exists():
        return ""
    try:
        import base64
        # Read PNG content and return as base64 data URI
        with open(logo_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode()
        return f"data:image/png;base64,{image_data}"
    except Exception:
        return ""


product_category = st.session_state.product_category

st.markdown(
    f"""
    <div style="text-align: center; padding: 20px;">
        <h1>{product_category}</h1>
        <p style="color: #666;">Select 2 brands to compare</p>
    </div>
    """,
    unsafe_allow_html=True
)

# Get brands for the current product category
brands = BRANDS_DATA.get(product_category, {})

st.markdown("### Brand Information")

# Horizontal scrolling container using columns
# Display brands in rows of 3
cols_per_row = 3
brand_names = list(brands.keys())

for i in range(0, len(brand_names), cols_per_row):
    cols = st.columns(cols_per_row, gap="medium")

    for col_idx, col in enumerate(cols):
        brand_idx = i + col_idx
        if brand_idx >= len(brand_names):
            break

        brand_name = brand_names[brand_idx]
        brand_info = brands[brand_name]

        with col:
            # Brand card with selection state
            is_selected = brand_name in st.session_state.selected_brands
            border_color = "#4CAF50" if is_selected else "#ddd"
            bg_color = "#f0fff0" if is_selected else "#fafafa"
            logo_data_uri = get_brand_logo_data_uri(brand_name)
            logo_html = (
                f'<img src="{logo_data_uri}" alt="{brand_name} logo" '
                'style="height: 64px; width: auto; object-fit: contain; margin-bottom: 10px;" />'
            ) if logo_data_uri else ""

            st.markdown(
                f"""
                <div style="border: 2px solid {border_color}; border-radius: 8px; padding: 15px;
                            background-color: {bg_color}; min-height: 300px; display: flex; flex-direction: column;">
                    {logo_html}
                    <h4 style="margin-top: 0; color: #333;">{brand_name}</h4>
                    <p style="font-size: 0.85em; color: #666; margin: 5px 0;">
                    </p>
                    <p style="font-size: 0.9em; margin: 10px 0; flex-grow: 1;">
                        {brand_info['description']}
                    </p>
                    <p style="font-size: 0.8em; margin: 8px 0;">
                        <strong>Attributes:</strong><br/>
                        {', '.join(brand_info['attributes'])}
                    </p>
                </div>
                """,
                unsafe_allow_html=True
            )

            # Select/Deselect button
            if st.button(
                f"{'✅ Selected' if is_selected else '⭕ Select'} {brand_name}",
                key=f"btn_{brand_name}",
                use_container_width=True
            ):
                if is_selected:
                    st.session_state.selected_brands.remove(brand_name)
                else:
                    if len(st.session_state.selected_brands) < 2:
                        st.session_state.selected_brands.append(brand_name)
                    else:
                        st.warning("⚠️ You can only select up to 2 brands!")
                st.rerun()

st.markdown("---")

# Selection and comparison section
st.markdown("### Choose 2 to compare")

col1, col2, col3 = st.columns([1, 1, 1])

with col1:
    st.markdown(
        f"""
        <div style="border: 2px solid #4CAF50; border-radius: 8px; padding: 20px;
                    background-color: #f0fff0; text-align: center;">
            <h4 style="margin-top: 0;">Slot A</h4>
            <p style="font-size: 1.1em; color: #2E7D32; font-weight: bold;">
                {st.session_state.selected_brands[0] if len(st.session_state.selected_brands) > 0 else '—'}
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

with col2:
    st.markdown(
        """
        <div style="text-align: center; padding: 20px;">
            <h3 style="color: #999;">VS</h3>
        </div>
        """,
        unsafe_allow_html=True
    )

with col3:
    st.markdown(
        f"""
        <div style="border: 2px solid #d32f2f; border-radius: 8px; padding: 20px;
                    background-color: #fff0f0; text-align: center;">
            <h4 style="margin-top: 0;">Slot B</h4>
            <p style="font-size: 1.1em; color: #c62828; font-weight: bold;">
                {st.session_state.selected_brands[1] if len(st.session_state.selected_brands) > 1 else '—'}
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

st.markdown("")

# Go compare button
go_button_disabled = len(st.session_state.selected_brands) != 2

col_left, col_center, col_right = st.columns([1, 2, 1])

with col_center:
    if st.button(
        "🚀 Go compare!",
        disabled=go_button_disabled,
        use_container_width=True,
        key="btn_go_comparison"
    ):
        if len(st.session_state.selected_brands) == 2:
            brand_a, brand_b = st.session_state.selected_brands
            report_name = f"{brand_a}_{brand_b}.html"
            output_dir = Path("/Users/cdb/Desktop/creatordb_hackathon/output")
            output_dir.mkdir(parents=True, exist_ok=True)
            report_path = output_dir / report_name

            # Simple cache: if report already exists, skip expensive command.
            if report_path.exists():
                st.session_state.comparison_error = ""
                st.session_state.comparison_report_path = str(report_path)
                st.switch_page("pages/03_Brands_Comparison.py")

            # Load actual demographics from CSV
            with st.spinner("Loading brand demographics..."):
                demo_a = get_brand_demographics(brand_a)
                demo_b = get_brand_demographics(brand_b)
                amb_a = get_brand_ambassadors_from_md(brand_a)
                amb_b = get_brand_ambassadors_from_md(brand_b)

            def _format_brand_block(brand_name, demo, ambassadors):
                top_countries = ', '.join(
                    c['country'] + ' (' + str(round(c['percent'], 1)) + '%)'
                    for c in demo['top_countries']
                ) or 'N/A'
                amb_text = json.dumps(ambassadors, indent=2) if ambassadors else "  (none found)"
                return (
                    f"BRAND: {brand_name}\n"
                    f"- Influencer Count (from database): {demo['influencer_count']}\n"
                    f"- Total Followers: {demo['total_followers']:,}\n"
                    f"- Average Age: {demo['avg_age']}\n"
                    f"- Gender: {demo['gender_male_percent']:.1f}% Male, {demo['gender_female_percent']:.1f}% Female\n"
                    f"- Top Countries: {top_countries}\n"
                    f"- Known Ambassadors (from markdown database):\n{amb_text}\n"
                    f"- Top Influencers/Creators (from CSV database):\n"
                    + json.dumps(demo['influencers'][:5], indent=2)
                )

            demographics_text = (
                _format_brand_block(brand_a, demo_a, amb_a)
                + "\n\n"
                + _format_brand_block(brand_b, demo_b, amb_b)
            )

            prompt = template_brand_comparison.format(brand_a=brand_a, brand_b=brand_b)
            print(prompt)
            command = f"claude --dangerously-skip-permissions '{prompt}' > {report_path}"

            with st.spinner("Generating comparison report... this can take a while."):
                result = subprocess.run(
                    command,
                    shell=True,
                    capture_output=True,
                    text=True,
                    cwd="/Users/cdb/Desktop/creatordb_hackathon"
                )
                print(result.stdout)

            if result.returncode != 0:
                st.session_state.comparison_error = (
                    result.stderr.strip() or "The comparison command failed."
                )
                st.error("❌ Failed to generate report. Please try again.")
                st.code(st.session_state.comparison_error)
            else:
                st.session_state.comparison_error = ""
                st.session_state.comparison_report_path = str(report_path)
                st.switch_page("pages/03_Brands_Comparison.py")

if go_button_disabled and len(st.session_state.selected_brands) > 0:
    st.info(f"ℹ️ Select {2 - len(st.session_state.selected_brands)} more brand(s) to enable comparison")

st.markdown("---")
if st.button("← Back", use_container_width=True):
    st.session_state.selected_brands = []
    st.switch_page("pages/01_Entity_Explorer.py")
