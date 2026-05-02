import requests

def scrape_hn():
    """
    Scrapes HackerNews for AI or Machine Learning related stories using Algolia API.
    """
    try:
        # Searching for 'AI' or 'Machine Learning' in the last 24 hours
        url = "https://hn.algolia.com/api/v1/search_by_date?tags=story&query=AI&numericFilters=created_at_i>0"
        # We'll do two searches or one with OR if possible. Algolia query is just a string.
        # Let's try to get recent top stories and filter them.
        
        response = requests.get("https://hn.algolia.com/api/v1/search?tags=front_page", timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results = []
        keywords = [
            "ai", "machine learning", "llm", "neural", "deep learning", 
            "gpt", "transformer", "claude", "anthropic", "openai", 
            "agentic", "agent", "vibe coding", "stable diffusion", "llama"
        ]
        
        # Strategy: Search for top recent stories and filter by modern AI keywords
        response = requests.get("https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=100", timeout=10)

        response.raise_for_status()
        data = response.json()
        
        for hit in data.get('hits', []):
            title = hit.get('title', '')
            url = hit.get('url')
            
            if not url:
                url = f"https://news.ycombinator.com/item?id={hit.get('objectID')}"
            
            # Match keywords, handling multi-word keywords like "vibe coding"
            title_lower = title.lower()
            if any(kw in title_lower for kw in keywords):
                results.append({
                    "title": title,
                    "url": url,
                    "source": "HackerNews",
                    "trending_score": hit.get('points', 0)
                })
        
        return results
    except Exception as e:
        print(f"Error scraping HackerNews: {e}")
        return []
