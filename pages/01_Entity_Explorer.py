"""
Entity Explorer Page
Allows users to choose their brand's product category
"""

import streamlit as st
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from utils import load_brands_by_product_type

st.set_page_config(
    page_title="Entity Explorer",
    layout="centered",
    initial_sidebar_state="collapsed"
)

st.markdown(
    """
    <div style="text-align: center; padding: 40px 20px;">
        <h1>📊 Competitors</h1>
    </div>
    """,
    unsafe_allow_html=True
)

st.markdown("### What's your brand's product category?")

# Load brands from CSV and get available product types
brands_by_type = load_brands_by_product_type()
product_categories = sorted(brands_by_type.keys())

# Add Luxury category (from brand ambassador files)
if "Luxury" not in product_categories:
    product_categories = ["Luxury"] + product_categories
    brands_by_type["Luxury"] = ["Balmain", "Balenciaga", "Boss", "Bottega Veneta", "Boucheron", "Bvlgari",
                                 "Calvin Klein", "Cartier", "Celine", "Chanel", "Chaumet", "Clé de Peau Beauté",
                                 "Diesel", "Dior", "Dolce & Gabbana", "Estée Lauder", "Fendi", "Fred",
                                 "Givenchy", "Gucci", "Hera", "Hublot", "Jaeger-LeCoultre", "Jimmy Choo",
                                 "Kenzo", "Loewe", "Longines", "Louis Vuitton", "Michael Kors", "Miu Miu",
                                 "Moncler", "Omega", "Piaget", "Prada", "Rado", "Ray-Ban", "Roger Vivier",
                                 "Saint Laurent", "Skechers", "Tiffany & Co.", "Tod's", "Tommy Hilfiger",
                                 "Tumi", "Valentino", "Versace", "Onitsuka Tiger"]

st.markdown(
    """
    <style>
    .tag-button > button {
        border-radius: 20px !important;
        padding: 10px 20px !important;
        font-weight: 500;
        border: 2px solid #e0e0e0 !important;
        background-color: white !important;
        transition: all 0.3s ease;
        font-size: 0.95rem;
        white-space: nowrap !important;
    }
    .tag-button > button:hover {
        border-color: #333 !important;
        background-color: #f5f5f5 !important;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Create a wrapped grid of tag buttons
tags_per_row = 3
for i in range(0, len(product_categories), tags_per_row):
    row_categories = product_categories[i:i + tags_per_row]
    cols = st.columns(tags_per_row)
    for j, category in enumerate(row_categories):
        with cols[j]:
            st.markdown('<div class="tag-button">', unsafe_allow_html=True)
            # Get brand count for this category
            brand_count = len(brands_by_type.get(category, []))
            if st.button(f"{category}", use_container_width=True, key=f"btn_{category.lower().replace('-', '_')}"):
                st.session_state.product_category = category
                st.switch_page("pages/02_Brand_Information.py")
            st.markdown('</div>', unsafe_allow_html=True)

st.markdown("---")
if st.button("← Back to Home", use_container_width=True):
    st.switch_page("app.py")
