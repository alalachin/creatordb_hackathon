# template_brand_comparison = """
# You are a report generator.

# Task:
# Generate a complete, self-contained HTML document comparing two brands: "{brand_a}" and "{brand_b}".

# ACTUAL DEMOGRAPHIC DATA PROVIDED:
# {demographics_data}

# STRICT OUTPUT REQUIREMENTS:
# - Output MUST be valid HTML
# - MUST begin with: <html>
# - DO NOT include any text before or after the HTML
# - Include <head> and <body>
# - Use embedded CSS for styling (no external resources)
# - The design should look modern, clean, and visually appealing

# CONTENT STRUCTURE:

# 1. Title Section
#    - Page title: "Brand Demographics & Marketing Analysis"
#    - Subtitle including both brand names

# 2. Brand Overview (for each brand)
#    - Brief description
#    - Target audience summary

# 3. Demographics Comparison (USE THE PROVIDED DATA)
#    - Include the actual demographic metrics provided above
#    - Gender distribution from influencer data
#    - Average age of audience
#    - Top geographic markets
#    - Influencer count and total reach
#    - Present this as a side-by-side comparison table with REAL DATA

# 4. Marketing Strategy Insights
#    - Key positioning
#    - Content strategy
#    - Influencer/celebrity usage based on PROVIDED DATA
#    - Unique differentiation points
#    - Write in analytical tone (not generic)

# 5. Brand Ambassadors Section (VERY IMPORTANT - USE PROVIDED DATA)
#    For EACH brand:
#    - List top influencers in a structured table
#    - Columns:
#         Handle
#         Followers
#         Avg Age
#         Top Country
#         Gender Distribution
#    - Use actual data from the provided influencer list

# 6. Visual Enhancements
#    - Use cards, sections, and soft shadows
#    - Use color differentiation between the two brands
#    - Include simple bar-style visuals using pure CSS (no JS)

# 7. Conclusion Section
#    - Summarize key differences in strategy and audience

# STYLE RULES:
# - Use clean typography
# - Use consistent spacing and layout
# - Avoid excessive text blocks
# - Prefer tables and structured layout over paragraphs

# REMEMBER:
# Return ONLY the HTML document.
# """

template_brand_comparison = """
You are a report generator.
Task:
Generate a complete, self-contained HTML document comparing two brands: "{brand_a}" and "{brand_b}".

STRICT OUTPUT REQUIREMENTS:
- Output MUST be valid HTML
- MUST begin with: <html>
- DO NOT include any text before or after the HTML
- Include <head> and <body>
- Use embedded CSS for styling (no external resources)
- The design should look modern, clean, and visually appealing

CONTENT STRUCTURE:
1. Title Section
   - Page title: "Brand Comparison"
   - Subtitle including both brand names
2. Brand Overview (for each brand)
   - Brief description (including country of origin)
   - Key products/services
   - Estimated revenue (if known)
   - Target audience summary (including gender distribution, age groups, and geographic focus)
3. Marketing Strategy Insights
   - Brand positioning
   - Content strategy
   - Celebrity usage
   - Unique differentiation points from competitors
   - Write in analytical tone (not generic)
4. Brand Ambassadors Section (VERY IMPORTANT)
   For EACH brand:
   - List ambassadors in a structured table
   - Columns:
        Name
        Nationality
        Platform (Youtube, Instagram, TikTok, etc.)
        Handle (if known)
   - Order the ambassadors by the number of followers in descending order and the availability of their handle.
   - If no ambassadors are known, state "No ambassadors known in our database"
5. Previous collaborations with creators (non-brand ambassadors) Section 
   - List creators in a structured table
   - Columns:
        Name
        Nationality
        Platform (Youtube, Instagram, TikTok, etc.)
        Handle (if known)
   - Order the creators by the number of followers in descending order and the availability of their handle.
   - If no creators are known, state "No creators known in our database"
6. Visual Enhancements
   - Use cards, sections, and soft shadows
   - Use color differentiation between the two brands
   - Include simple bar-style visuals using pure CSS (no JS)
7. Conclusion Section
   - Summarize key differences in strategy and audience
STYLE RULES:
- Use clean typography
- Use consistent spacing and layout
- Avoid excessive text blocks
- Prefer tables and structured layout over paragraphs
REMEMBER:
Return ONLY the HTML document.
"""

template_creator_search = """
You are helping with creator discovery.
Find YouTube creators for product type "{product_type}".
Use approximately ${budget_per_creator:,.0f} budget per creator.
Audience filters: {filter_text}.

Return ONLY rows in this exact format, one creator per line:
name | platform | channelId | videoPrice | avatarUrl | totalSubscribers | gender | ageRange | top_country
"""