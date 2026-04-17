"""
Brands Comparison Page
Displays generated HTML comparison report for two selected brands.
"""

import streamlit as st
from pathlib import Path
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Brands Comparison",
    layout="wide",
    initial_sidebar_state="collapsed"
)


def strip_html_code_fences(content: str) -> str:
    """Remove markdown ```html ... ``` wrapper when present."""
    stripped = content.strip()
    if not stripped.startswith("```html"):
        return content

    lines = stripped.splitlines()
    if len(lines) < 2:
        return content

    if lines[0].strip().lower() == "```html" and lines[-1].strip() == "```":
        return "\n".join(lines[1:-1]).strip()

    return content

# Get selected brands from session state
if "selected_brands" not in st.session_state or len(st.session_state.selected_brands) != 2:
    st.error("❌ Please select 2 brands to compare")
    if st.button("← Back", use_container_width=True):
        st.switch_page("pages/02_Brand_Information.py")
    st.stop()

brand_a, brand_b = st.session_state.selected_brands

st.markdown(
    f"""
    <div style="text-align: center; padding: 20px;">
        <h1>Brand Demographics Report</h1>
        <p style="font-size: 1.1em; color: #666;">{brand_a} vs {brand_b}</p>
    </div>
    """,
    unsafe_allow_html=True
)

output_dir = Path("/Users/cdb/Desktop/creatordb_hackathon/output")
report_name = f"{brand_a}_{brand_b}.html"

expected_report_path = output_dir / report_name
reversed_report_path = output_dir / f"{brand_b}_{brand_a}.html"
session_report_path = Path(st.session_state.get("comparison_report_path", ""))
comparison_error = st.session_state.get("comparison_error", "")

if session_report_path.exists():
    report_file = session_report_path
elif expected_report_path.exists():
    report_file = expected_report_path
elif reversed_report_path.exists():
    report_file = reversed_report_path
else:
    report_file = None

if comparison_error:
    st.error("❌ Report generation error")
    st.code(comparison_error)
elif report_file and report_file.exists():
    report_content = report_file.read_text(encoding="utf-8", errors="replace")
    report_content = strip_html_code_fences(report_content)
    st.markdown("### 📄 Generated Report")
    components.html(report_content, height=1200, scrolling=True)
    st.markdown("---")
    st.caption(f"Rendered file: {report_file}")
else:
    st.warning(
        "No generated HTML report was found yet. Click Go compare again from the previous page."
    )

st.markdown("---")

col_left, col_center, col_right = st.columns([1, 2, 1])

with col_left:
    if st.button("← Back to Selection", use_container_width=True):
        st.session_state.selected_brands = []
        st.switch_page("pages/02_Brand_Information.py")

with col_right:
    if st.button("🏠 Home", use_container_width=True):
        st.session_state.selected_brands = []
        st.switch_page("app.py")
