import { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';

import { API_BASE_URL } from '../lib/utils';

interface Article {
  id: number;
  title: string;
  url: string;
  source: string;
  summary: string;
  is_liked: boolean;
  created_at: string;
  trending_score: number;
}

const LikedPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/articles`);
      // Filter liked articles client-side if the API doesn't support filtering
      // Assuming the API returns all and we filter, or ideally we'd have /api/articles?liked=true
      setArticles(response.data.filter((a: Article) => a.is_liked));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedArticles();
  }, []);

  const handleLikeToggle = (id: number, isLiked: boolean) => {
    if (!isLiked) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-12">
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-4xl font-bold text-slate-100 m-0">Liked Articles</h1>
          <p className="text-slate-400 mt-2">Your personal collection of interesting AI news.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-900 animate-pulse rounded-xl border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} onLikeToggle={handleLikeToggle} />
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400">You haven't liked any articles yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedPage;
