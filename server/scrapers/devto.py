import requests

def scrape_devto():
    """
    Scrapes Dev.to for various AI-related tags.
    """
    try:
        tags = ["ai", "machinelearning", "llm", "openai", "python"]
        results = []
        seen_urls = set()
        
        for tag in tags:
            url = f"https://dev.to/api/articles?tag={tag}&top=7" 
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                continue
                
            articles = response.json()
            for article in articles:
                article_url = article.get('url')
                if article_url not in seen_urls:
                    # Filter for specific keywords to ensure high relevance
                    title = article.get('title', '').lower()
                    keywords = ["ai", "agent", "claude", "gpt", "llm", "vibe", "coding", "automation", "intelligence"]
                    if any(kw in title for kw in keywords):
                        results.append({
                            "title": article.get('title'),
                            "url": article_url,
                            "source": "Dev.to",
                            "trending_score": article.get('public_reactions_count', 0)
                        })
                        seen_urls.add(article_url)
            
        return results
    except Exception as e:
        print(f"Error scraping Dev.to: {e}")
        return []

if __name__ == "__main__":
    print(scrape_devto())
