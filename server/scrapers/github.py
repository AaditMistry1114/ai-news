import requests
from bs4 import BeautifulSoup

def scrape_github():
    """
    Scrapes GitHub Trending for repositories with 'AI', 'LLM', or 'Machine Learning' in their description.
    """
    try:
        url = "https://github.com/trending"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        repos = soup.select('article.Box-row')
        
        results = []
        keywords = ["ai", "llm", "machine learning", "artificial intelligence", "deep learning", "neural", "gpt"]
        
        for repo in repos:
            title_elem = repo.select_one('h2 a')
            desc_elem = repo.select_one('p')
            
            if not title_elem:
                continue
                
            title = title_elem.get_text(strip=True).replace(' ', '')
            desc = desc_elem.get_text(strip=True) if desc_elem else ""
            link = "https://github.com" + title_elem['href']
            
            # Check if keywords are in title or description
            if any(kw in title.lower() or kw in desc.lower() for kw in keywords):
                # Try to get stars
                stars_elem = repo.select_one('a[href$="/stargazers"]')
                stars_str = stars_elem.get_text(strip=True).replace(',', '') if stars_elem else "0"
                try:
                    stars = float(stars_str)
                except ValueError:
                    stars = 0.0
                
                # Try to get language
                lang_elem = repo.select_one('span[itemprop="programmingLanguage"]')
                lang = lang_elem.get_text(strip=True) if lang_elem else ""
                
                results.append({
                    "title": title,
                    "url": link,
                    "description": desc,
                    "language": lang,
                    "source": "GitHub Trending",
                    "trending_score": stars
                })
                
        return results
    except Exception as e:
        print(f"Error scraping GitHub: {e}")
        return []

if __name__ == "__main__":
    print(scrape_github())
