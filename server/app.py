import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from models import db, Article
from sqlalchemy import desc
from collections import Counter
import re
import requests
from bs4 import BeautifulSoup

from scrapers import scrape_all
import threading

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

# Database initialization logic
with app.app_context():
    db.create_all()

def generate_snippet(text, max_sentences=2):
    """
    Simple local replacement for AI summarization.
    Extracts the first 2-3 sentences.
    """
    if not text:
        return ""
    # Split by common sentence endings
    sentences = re.split(r'[.!?]+', text)
    # Filter out very short segments and trim
    valid_sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
    
    if valid_sentences:
        snippet = ". ".join(valid_sentences[:max_sentences])
        return snippet + "." if not snippet.endswith('.') else snippet
    return text[:200] + "..." if len(text) > 200 else text

def fetch_content(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # --- Metadata Extraction ---
        author = "Unknown"
        date = "Unknown"
        
        # Try finding author
        author_tag = soup.find('meta', attrs={'name': 'author'}) or \
                     soup.find('meta', property='article:author') or \
                     soup.find(class_=re.compile(r'author|writer|byline', re.I))
        if author_tag:
            author = author_tag.get('content') or author_tag.get_text().strip()
            
        # Try finding date
        date_tag = soup.find('time') or \
                   soup.find('meta', property='article:published_time') or \
                   soup.find(class_=re.compile(r'date|publish', re.I))
        if date_tag:
            date = date_tag.get('datetime') or date_tag.get('content') or date_tag.get_text().strip()
            
        metadata_prefix = f"Article Author: {author}\nPublished Date: {date}\n\n"
        # ---------------------------

        # 1. Remove noise elements
        for element in soup(['nav', 'footer', 'header', 'aside', 'script', 'style', 'form', 'noscript', 'iframe']):
            element.decompose()
            
        # Remove elements related to social sharing, comments, or ads
        noise_pattern = re.compile(r'social|share|comment|disqus|related|recommend|sidebar|author-bio|newsletter|ad-', re.I)
        for element in soup.find_all(class_=noise_pattern):
            element.decompose()
        for element in soup.find_all(id=noise_pattern):
            element.decompose()

        # 2. Target structural tags for article bodies
        content = soup.find('article') or soup.find('main')
        if not content:
            content = soup.find('div', class_=re.compile(r'article-body|post-content|entry-content|main-content|story-content', re.I))
        
        target = content if content else soup.body
        if not target:
            return ""

        # 3. Extract text and clean up whitespace
        text = target.get_text(separator=' ')
        text = re.sub(r'\s+', ' ', text).strip()
        
        # 4. Final text with metadata
        final_text = metadata_prefix + text
        return final_text[:5000] # Limit slightly higher for context
    except Exception as e:
        print(f"Failed to fetch content from {url}: {e}")
        return ""

def perform_scrape():
    with app.app_context():
        try:
            print("Starting scrape...")
            articles_data = scrape_all()
            new_articles_count = 0
            
            for item in articles_data:
                # Check if article already exists
                existing = Article.query.filter_by(url=item['url']).first()
                if not existing:
                    # Fetch content for better summary
                    content = fetch_content(item['url'])
                    if not content:
                        content = item['title']
                    
                    summary = generate_snippet(content)
                    
                    new_article = Article(
                        title=item['title'],
                        url=item['url'],
                        source=item['source'],
                        summary=summary,
                        trending_score=item.get('trending_score', 0.0)
                    )
                    db.session.add(new_article)
                    new_articles_count += 1
            
            db.session.commit()
            print(f"Scrape completed. Added {new_articles_count} new articles.")
        except Exception as e:
            print(f"Error during scrape process: {e}")

@app.route('/api/articles', methods=['GET'])
def get_articles():
    search_query = request.args.get('q', '').lower()
    source_filter = request.args.get('source', '')
    
    query = Article.query
    
    if search_query:
        query = query.filter(
            (Article.title.ilike(f'%{search_query}%')) | 
            (Article.summary.ilike(f'%{search_query}%'))
        )
    
    if source_filter:
        query = query.filter(Article.source == source_filter)
        
    articles = query.order_by(desc(Article.created_at)).all()
    return jsonify([article.to_dict() for article in articles])

@app.route('/api/trending-repos', methods=['GET'])
def get_trending_repos():
    from scrapers.github import scrape_github
    repos = scrape_github()
    return jsonify(repos)

@app.route('/api/scrape', methods=['POST'])
def scrape_articles():
    # Trigger scraping in a background thread to avoid timeout
    thread = threading.Thread(target=perform_scrape)
    thread.start()
    return jsonify({"message": "Scraper triggered in background"}), 202

@app.route('/api/articles/<int:article_id>/like', methods=['POST'])
def toggle_like(article_id):
    article = Article.query.get_or_404(article_id)
    article.is_liked = not article.is_liked
    db.session.commit()
    return jsonify(article.to_dict())

@app.route('/api/trending-topics', methods=['GET'])
def get_trending_topics():
    # Extract top words from recent article titles
    articles = Article.query.order_by(desc(Article.created_at)).limit(100).all()
    
    stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are', 'was', 'were', 'ai', 'artificial', 'intelligence'])
    
    words = []
    for article in articles:
        # Simple regex to find words
        title_words = re.findall(r'\w+', article.title.lower())
        words.extend([w for w in title_words if w not in stop_words and len(w) > 2])
    
    most_common = Counter(words).most_common(10)
    trending = [{"topic": word, "count": count} for word, count in most_common]
    
    return jsonify(trending)

if __name__ == '__main__':
    app.run(debug=True)
