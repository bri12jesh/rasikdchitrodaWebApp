export interface Product {
  id: number;
  title: string;
  category: string;
  price_min: number;
  price_max: number;
  description: string;
  image_url: string;
  key_features: string[] | string;
  specs: Record<string, string> | string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  client: string;
  location: string;
  completed_year: number;
  contract_type: "Government Contract" | "Private Contract" | string;
  gallery_urls?: string[];
}
