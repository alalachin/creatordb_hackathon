"""
CreatorDB Dashboard - Home Page
Multi-page Streamlit app for exploring and comparing brands and celebrities.
"""

import streamlit as st

st.set_page_config(
    page_title="CreatorDB Dashboard",
    layout="centered",
    initial_sidebar_state="collapsed"
)

st.markdown(
    """
    <div style="text-align: center; padding: 60px 20px;">
        <h1 style="font-size: 3em; margin-bottom: 10px;">🎯 CreatorDB</h1>
        <p style="font-size: 1.2em; color: #666; margin-bottom: 50px;">Explore & Compare Brands and Influencers</p>
    </div>
    """,
    unsafe_allow_html=True
)

st.markdown("### For Brands")

col1, col2 = st.columns(2)

with col1:
    if st.button("See Your Competitors", use_container_width=True, key="btn_competitors"):
        st.session_state.domain = "See Your Competitors"
        st.switch_page("pages/01_Entity_Explorer.py")

with col2:
    if st.button("Find Creators For Your Brand", use_container_width=True, key="btn_find_creators"):
        st.session_state.domain = "Find Creators For Your Brand"
        st.switch_page("pages/04_Find_Creators.py")

st.markdown("### For Creators")

if st.button("Compare Brands", use_container_width=True, key="btn_compare_brands"):
    st.session_state.domain = "Compare Brands"
    st.switch_page("pages/05_Compare_Brands.py")

st.markdown("---")
st.caption("💡 Click on a section to get started")
