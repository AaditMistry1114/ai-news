import os
import praw
from dotenv import load_dotenv

load_dotenv()

def scrape_reddit():
    """
    Uses praw to scrape r/MachineLearning and r/artificial for top daily posts.
    """
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    user_agent = "AI Radar Scraper 1.0"
    
    if not client_id or not client_secret:
        print("Reddit credentials missing. Skipping Reddit scraping.")
        return []

    try:
        reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent
        )
        
        subreddits = ["MachineLearning", "artificial", "LocalLLaMA", "OpenAI", "Claude"]
        results = []
        
        for sub_name in subreddits:
            subreddit = reddit.subreddit(sub_name)
            # Get top 10 posts from the last 24 hours
            for submission in subreddit.top(time_filter="day", limit=10):
                results.append({
                    "title": submission.title,
                    "url": submission.url,
                    "source": f"r/{sub_name}",
                    "trending_score": submission.score
                })
                
        return results
    except Exception as e:
        print(f"Error scraping Reddit: {e}")
        return []

if __name__ == "__main__":
    print(scrape_reddit())
