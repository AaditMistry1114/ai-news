from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Article(db.Model):
    __tablename__ = 'articles'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(512), unique=True, nullable=False)
    source = db.Column(db.String(100), nullable=False)
    summary = db.Column(db.Text, nullable=True)
    is_liked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    trending_score = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'url': self.url,
            'source': self.source,
            'summary': self.summary,
            'is_liked': self.is_liked,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'trending_score': self.trending_score
        }
