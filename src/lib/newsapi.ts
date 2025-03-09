
import { Article } from "@/types/chat";

// Spaceflight News API configuration
const SPACEFLIGHT_API_BASE_URL = "https://api.spaceflightnewsapi.net/v4";

// Function to fetch articles
export async function fetchNewsArticles(params: {
  query?: string;
  category?: string;
  country?: string;
  pageSize?: number;
  page?: number;
}): Promise<Article[]> {
  const {
    query = "",
    pageSize = 50,
    page = 1,
  } = params;

  // Build the API endpoint
  let endpoint = `${SPACEFLIGHT_API_BASE_URL}/articles`;
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("limit", String(pageSize));
  queryParams.append("offset", String((page - 1) * pageSize));
  
  // Add search query if provided
  if (query) {
    queryParams.append("title_contains", query);
  }
  
  // Add the query string to the endpoint
  endpoint = `${endpoint}?${queryParams.toString()}`;
  
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Spaceflight News API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.results) {
      throw new Error("Invalid API response structure");
    }
    
    // Map the API response to our Article type
    return data.results.map((article: any): Article => ({
      id: article.id?.toString() || Math.random().toString(),
      title: article.title || "No title",
      description: article.summary || "No description available",
      url: article.url || "#",
      coverImage: article.image_url || "https://placehold.co/600x400?text=Space+News",
      publishedAt: article.published_at || new Date().toISOString(),
      readingTimeMinutes: Math.ceil((article.summary?.length || 2000) / 1000) || 3,
      author: {
        name: article.news_site || "Unknown",
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(article.news_site || "Space")}`,
      },
      tags: article.news_site ? [article.news_site] : ["Space News"],
    }));
  } catch (error) {
    console.error("Failed to fetch news articles:", error);
    throw error;
  }
}
