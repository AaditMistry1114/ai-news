import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import TrendingRepos from '../components/TrendingRepos';
import { RefreshCcw, SearchX, Sparkles, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

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

const HomePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Pure local state for the search input to ensure zero lag
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Instant filtering logic - runs on every keystroke
  const filteredArticles = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return articles;
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.summary.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query)
    );
  }, [articles, searchTerm]);

  // Update URL in the background after typing stops, but don't let it affect the UI speed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setSearchParams({ q: searchTerm }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await axios.post(`${API_BASE_URL}/api/scrape`);
      // Briefly wait for scrape to finish then re-fetch all
      setTimeout(fetchArticles, 3000);
    } catch (error) {

      console.error("Error scraping:", error);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-12 min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-12"
      >
        <header className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-950">
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center border-2 border-slate-950">
                    <RefreshCcw size={10} className="text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Intelligent Aggregator</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white m-0 tracking-tight leading-[0.9]">
                {searchTerm ? (
                  <>Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Results</span></>
                ) : (
                  <>ai-<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">news</span></>
                )}
              </h1>
              <p className="text-slate-400 mt-6 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                Aggregating the world's most relevant tech news, with smart snippets and real-time trending analysis.
              </p>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto"
            >
              <div className="relative w-full sm:w-80 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                  <Search size={18} />
                </div>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to filter instantly..."
                  className="w-full bg-slate-900/40 border-slate-800/80 focus:border-indigo-500/50 rounded-2xl pl-12 pr-10 py-6 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500/20 text-base backdrop-blur-sm transition-all shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <SearchX size={16} />
                  </button>
                )}
              </div>

              <Button
                onClick={handleScrape}
                disabled={scraping}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all px-6 py-6 h-auto shadow-lg shadow-indigo-500/10 w-full sm:w-auto active:scale-95"
              >
                <RefreshCcw size={18} className={`mr-2 ${scraping ? 'animate-spin' : ''}`} />
                {scraping ? 'Syncing...' : 'Sync Feed'}
              </Button>
            </motion.div>
          </div>

          {!searchParams.get('q') && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <TrendingRepos />
            </motion.div>
          )}
        </header>

        <div className="flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
            {searchTerm ? `Found ${filteredArticles.length} Matches` : 'Latest Updates'}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 bg-slate-900/50 rounded-3xl border border-slate-800/50" />
              ))}
            </motion.div>
          ) : filteredArticles.length > 0 ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </motion.div>
          ) : (

            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-slate-900/10 rounded-3xl border border-dashed border-slate-800 flex flex-col items-center gap-6"
            >
              <div className="p-6 bg-slate-900/50 rounded-full border border-slate-800 text-slate-700">
                <SearchX size={64} strokeWidth={1.5} />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-slate-300">Nothing found for "{searchTerm}"</h3>
                <p className="text-slate-500 mt-2 font-medium">Try searching for broader terms like "LLM", "Agent", or "OpenAI".</p>
                <Button variant="outline" onClick={() => {setSearchTerm(''); fetchArticles();}} className="mt-8 border-slate-700 hover:bg-slate-800 text-slate-400">
                  Reset Search
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HomePage;

