// ─── Creator ────────────────────────────────────────────────────────────────

export interface Creator {
  name: string;
  platform: string;
  channelId: string;
  videoPrice: string;
  avatarUrl: string;
  totalSubscribers: string;
  country: string;
  language: string;
  ageRange: string;
  topCountries: string;
  mainAgeRange: string;
}

// ─── Brand ──────────────────────────────────────────────────────────────────

export interface BrandInfo {
  description: string;
  category: string;
  attributes: string[];
}

export type BrandsDataMap = Record<string, Record<string, BrandInfo>>;

// ─── Demographics ───────────────────────────────────────────────────────────

export interface TopCountry {
  country: string;
  percent: number;
}

export interface InfluencerRow {
  handle: string;
  followers: number;
  age: number;
  gender_male: number;
  gender_female: number;
  country: string;
}

export interface BrandDemographics {
  brand_name: string;
  influencer_count: number;
  total_followers: number;
  avg_age: number;
  gender_male_percent: number;
  gender_female_percent: number;
  top_countries: TopCountry[];
  influencers: InfluencerRow[];
}

// ─── CreatorDB API ──────────────────────────────────────────────────────────

export interface CreatorDBFilter {
  filterName: string;
  op: string;
  value: string | number;
  isFuzzySearch?: boolean;
}

export interface CreatorDBSearchPayload {
  filters: CreatorDBFilter[];
  desc: boolean;
  sortBy: string;
  pageSize: number;
  offset: number;
}

export interface CreatorDBCreator {
  channelId: string;
  displayName: string;
  [key: string]: unknown;
}

// ─── Search ─────────────────────────────────────────────────────────────────

export interface CreatorSearchQuery {
  product_type: string;
  budget: {
    label: string;
    min: number;
    max: number;
  };
  budget_per_creator: number;
  filters: {
    language?: string | null;
    location?: string | null;
    gender?: string | null;
    age_group?: string | null;
  };
  number_of_creators: number;
}
