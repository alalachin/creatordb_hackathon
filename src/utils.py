import json
import csv
from pathlib import Path
from collections import defaultdict

BASEDIR = "/Users/cdb/Desktop/creatordb_hackathon"

def parse_sse_response(text: str):
    lines = text.splitlines()

    for i in range(len(lines)):
        if lines[i].startswith("event: result"):
            # next line should contain data
            if i + 1 < len(lines) and lines[i+1].startswith("data:"):
                json_str = lines[i+1].replace("data: ", "")
                return json.loads(json_str)

    raise ValueError("No result event found in response")

def infer_type_schema(obj):
    if isinstance(obj, dict):
        return {k: infer_type_schema(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        if not obj:
            return ["empty_list"]
        return [infer_type_schema(obj[0])]
    else:
        return type(obj).__name__


def list_resource_tree() -> str:
  """List all files and folders in a graphical tree format"""
  path = Path(f"{BASEDIR}/resource")

  def build_tree(dir_path: Path, prefix: str = "") -> list[str]:
      lines = []
      entries = sorted(dir_path.iterdir(), key=lambda x: (x.is_file(), x.name))

      for i, entry in enumerate(entries):
          is_last = i == len(entries) - 1
          connector = "└── " if is_last else "├── "
          lines.append(f"{prefix}{connector}{entry.name}")

          if entry.is_dir():
              extension = "    " if is_last else "│   "
              lines.extend(build_tree(entry, prefix + extension))

      return lines

  tree_lines = [path.name] + build_tree(path)
  return "\n".join(tree_lines)


def load_brands_by_product_type() -> dict[str, list[str]]:
    """Load brands from CSV file grouped by product type."""
    csv_path = Path(f"{BASEDIR}/resource/external/brand_influencers.csv")
    brands_by_type = defaultdict(set)

    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                product_type = row.get('product type', '').strip()
                brand_domain = row.get('brandDomain', '').strip()

                if product_type and brand_domain:
                    # Extract brand name from domain (e.g., 'nike.com' -> 'Nike')
                    brand_name = brand_domain.split('.')[0].capitalize()
                    brands_by_type[product_type].add(brand_name)
    except Exception as e:
        print(f"Error loading brands from CSV: {e}")

    # Convert sets to sorted lists
    return {k: sorted(list(v)) for k, v in brands_by_type.items()}


def get_brand_ambassadors_from_md(brand_name: str) -> list[dict]:
    """Read known brand ambassadors from the markdown files."""
    md_files = [
        Path(f"{BASEDIR}/resource/external/brand_ambassadors_kr.md"),
        Path(f"{BASEDIR}/resource/external/brand_ambassadors_th.md"),
    ]
    ambassadors = []
    for md_path in md_files:
        if not md_path.exists():
            continue
        with open(md_path, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.startswith('|') or '---' in line:
                    continue
                parts = [p.strip() for p in line.strip().strip('|').split('|')]
                if len(parts) < 4:
                    continue
                brand_col = parts[0]
                if brand_col.lower() == brand_name.lower():
                    ambassadors.append({
                        "celebrity_name": parts[2] if len(parts) > 2 else '',
                        "stage_name": parts[3] if len(parts) > 3 else '',
                        "instagram_handle": parts[4] if len(parts) > 4 else '',
                    })
    return ambassadors


def get_brand_demographics(brand_name: str) -> dict:
    """Calculate aggregate demographics for a brand from CSV influencer data."""
    csv_path = Path(f"{BASEDIR}/resource/external/brand_influencers.csv")
    brand_domain = f"{brand_name.lower()}.com"

    influencers = []
    ages = []
    genders_male = []
    genders_female = []
    countries = defaultdict(float)
    total_followers = 0

    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get('brandDomain', '').strip() == brand_domain:
                    influencers.append(row)

                    # Collect age data
                    try:
                        age = float(row.get('avgAge', 0) or 0)
                        if age > 0:
                            ages.append(age)
                    except (ValueError, TypeError):
                        pass

                    # Collect gender data
                    try:
                        male = float(row.get('genderManPercent', 0) or 0)
                        female = float(row.get('genderWomanPercent', 0) or 0)
                        if male > 0 or female > 0:
                            genders_male.append(male)
                            genders_female.append(female)
                    except (ValueError, TypeError):
                        pass

                    # Collect geographic data
                    country = row.get('maxCountry', '').strip()
                    try:
                        country_percent = float(row.get('maxCountryPercent', 0) or 0)
                        if country and country_percent > 0:
                            countries[country] += country_percent
                    except (ValueError, TypeError):
                        pass

                    # Collect follower data
                    try:
                        followers = float(row.get('followers', 0) or 0)
                        total_followers += followers
                    except (ValueError, TypeError):
                        pass
    except Exception as e:
        print(f"Error loading demographics for {brand_name}: {e}")

    # Calculate averages
    avg_age = sum(ages) / len(ages) if ages else 0
    avg_male_percent = sum(genders_male) / len(genders_male) if genders_male else 0
    avg_female_percent = sum(genders_female) / len(genders_female) if genders_female else 0

    # Get top countries
    top_countries = sorted(countries.items(), key=lambda x: x[1], reverse=True)[:3]

    return {
        "brand_name": brand_name,
        "influencer_count": len(influencers),
        "total_followers": int(total_followers),
        "avg_age": round(avg_age, 1),
        "gender_male_percent": round(avg_male_percent, 1),
        "gender_female_percent": round(avg_female_percent, 1),
        "top_countries": [{"country": c[0], "percent": round(c[1], 1)} for c in top_countries],
        "influencers": [
            {
                "handle": row.get('instagramHandle', ''),
                "followers": int(float(row.get('followers', 0) or 0)),
                "age": float(row.get('avgAge', 0) or 0),
                "gender_male": float(row.get('genderManPercent', 0) or 0),
                "gender_female": float(row.get('genderWomanPercent', 0) or 0),
                "country": row.get('maxCountry', ''),
            }
            for row in influencers[:10]  # Top 10 influencers
        ]
    }