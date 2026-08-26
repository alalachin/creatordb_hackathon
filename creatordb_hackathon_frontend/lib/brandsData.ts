import { BrandsDataMap } from "./types";

export const BRANDS_DATA: BrandsDataMap = {
  Luxury: {
    Chanel: {
      description: "Iconic French luxury brand with timeless appeal",
      category: "Luxury",
      attributes: ["Classic", "Prestigious", "Exclusive"],
    },
    Dior: {
      description: "French haute couture and luxury goods brand",
      category: "Luxury",
      attributes: ["Elegant", "Innovative", "Premium"],
    },
    Prada: {
      description: "Italian luxury fashion and leather goods brand",
      category: "Luxury",
      attributes: ["Sophisticated", "Premium", "Trendsetting"],
    },
    Gucci: {
      description: "Italian luxury brand known for bold and colorful designs",
      category: "Luxury",
      attributes: ["Bold", "Artistic", "Trendy"],
    },
    Fendi: {
      description: "Italian luxury fashion house specializing in leather goods",
      category: "Luxury",
      attributes: ["Innovative", "Leather goods", "Heritage"],
    },
    Celine: {
      description: "French luxury fashion house known for minimalist design",
      category: "Luxury",
      attributes: ["Minimalist", "High-end", "Timeless"],
    },
  },
  Sportswear: {
    Nike: {
      description: "Global sportswear and athletic brand",
      category: "Sportswear",
      attributes: ["Performance", "Accessible", "Innovative"],
    },
    Adidas: {
      description: "German multinational athletic apparel manufacturer",
      category: "Sportswear",
      attributes: ["Performance", "Quality", "Innovative"],
    },
  },
  Cosmetics: {
    Maybelline: {
      description: "Global mass-market cosmetics and beauty brand",
      category: "Cosmetics",
      attributes: ["Accessible", "Trendy", "Wide product range"],
    },
    Lancome: {
      description: "French luxury beauty brand focused on skincare and fragrance",
      category: "Cosmetics",
      attributes: ["Luxury", "Prestige", "Elegant"],
    },
  },
  Smartphone: {
    Apple: {
      description: "Premium consumer electronics and ecosystem brand",
      category: "Smartphone",
      attributes: ["Premium", "Design-led", "Ecosystem"],
    },
    Samsung: {
      description: "Global electronics leader across mobile and home devices",
      category: "Smartphone",
      attributes: ["Innovative", "Comprehensive", "Global"],
    },
  },
  "E-commerce": {
    Temu: {
      description: "Cross-border e-commerce platform known for low prices",
      category: "E-commerce",
      attributes: ["Price-driven", "Viral", "Mass-market"],
    },
    Shopee: {
      description: "Southeast Asian e-commerce platform with broad product selection",
      category: "E-commerce",
      attributes: ["Convenient", "Promotional", "Mobile-first"],
    },
  },
  Watch: {
    Seiko: {
      description: "Japanese watchmaker known for precision and reliability",
      category: "Watch",
      attributes: ["Reliable", "Heritage", "Craftsmanship"],
    },
    Tissot: {
      description: "Swiss watch brand blending heritage with modern design",
      category: "Watch",
      attributes: ["Swiss-made", "Accessible luxury", "Heritage"],
    },
  },
  Retails: {
    Zara: {
      description: "Fast fashion retailer with trend-forward designs",
      category: "Retails",
      attributes: ["Fast fashion", "Affordable", "Trendy"],
    },
    "H&M": {
      description: "Global fashion retailer offering affordable everyday style",
      category: "Retails",
      attributes: ["Affordable", "Mass-market", "Accessible"],
    },
  },
  Skincare: {
    Clinique: {
      description: "Dermatologist-developed skincare and beauty brand",
      category: "Skincare",
      attributes: ["Skincare-led", "Trusted", "Clinical"],
    },
    Lancome: {
      description: "French luxury beauty brand focused on skincare and fragrance",
      category: "Skincare",
      attributes: ["Luxury", "Prestige", "Elegant"],
    },
  },
};

export const LUXURY_BRANDS = [
  "Balmain", "Balenciaga", "Boss", "Bottega Veneta", "Boucheron", "Bvlgari",
  "Calvin Klein", "Cartier", "Celine", "Chanel", "Chaumet", "Clé de Peau Beauté",
  "Diesel", "Dior", "Dolce & Gabbana", "Estée Lauder", "Fendi", "Fred",
  "Givenchy", "Gucci", "Hera", "Hublot", "Jaeger-LeCoultre", "Jimmy Choo",
  "Kenzo", "Loewe", "Longines", "Louis Vuitton", "Michael Kors", "Miu Miu",
  "Moncler", "Omega", "Piaget", "Prada", "Rado", "Ray-Ban", "Roger Vivier",
  "Saint Laurent", "Skechers", "Tiffany & Co.", "Tod's", "Tommy Hilfiger",
  "Tumi", "Valentino", "Versace", "Onitsuka Tiger",
];

export const BRAND_COMPARISON_PROMPT = `
You are a report generator.

Task:
Generate a complete, self-contained HTML document comparing two brands: "{brand_a}" and "{brand_b}".

Data Source:
- Ambassadors:
  - resource/external/brand_ambassadors_kr.md
  - resource/external/brand_ambassadors_th.md

Brand Demographics Calculation:
- For each brand, get the IG handles of the Ambassadors from data source
- Collect ambassadors' IG account followers and demographics, including age, gender, country.
- Weighted-sum the ambassadors' demographics data by the followers to be the final brand demographics

Workflow:
1. Load skill to understand how to inference the demographics data of brands
2. Use tools to get the demographic data of the two brands
3. Analyze the demographic data and get insights about the brands
4. Generate a complete, modern, and self-contained HTML document comparing the two brands

STRICT OUTPUT REQUIREMENTS:
- Output MUST be valid HTML
- MUST begin with: <html>
- DO NOT include any text before or after the HTML
- Include <head> and <body>
- Use embedded CSS for styling (no external resources)
- The design should look modern, clean, and visually appealing

CONTENT STRUCTURE:
1. Title Section
   - Page title: "clearCompetitors Report"
   - Subtitle including both brand names
2. Brand Overview (for each brand)
   - Brief description (including country of origin)
   - Key products/services
   - Estimated revenue (if known)
   - Target audience summary in diagrams(including gender distribution, age groups, and geographic focus)
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
 - Separate contents of the two brands left-right side by side
 - Choose a color scheme that is consistent with the brand's identity
 - Use consistent spacing and layout
 - Avoid excessive text blocks
 - Prefer tables and structured layout over paragraphs
REMEMBER:
Return ONLY the HTML document.
`.trim();
