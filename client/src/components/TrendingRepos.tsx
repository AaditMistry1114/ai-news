import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, ExternalLink, GitBranch, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { API_BASE_URL } from '../lib/utils';

interface Repo {
  title: string;
  url: string;
  description: string;
  language: string;
  source: string;
  trending_score: number;
}

const TrendingRepos = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/trending-repos`);
        setRepos(response.data);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="min-w-[320px] h-48 bg-slate-900/50 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (repos.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <GitBranch size={22} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Trending Repositories</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Top AI/ML Projects on GitHub</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
          Scroll to explore <ExternalLink size={12} className="ml-1 opacity-50" />
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x">
        {repos.map((repo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="min-w-[320px] max-w-[320px] snap-center"
          >
            <a 
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative h-full"
            >
              {/* Background Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              
              <Card className="relative h-full p-6 bg-slate-900/40 backdrop-blur-sm border-slate-800/80 rounded-3xl flex flex-col gap-4 group-hover:bg-slate-900/60 group-hover:border-indigo-500/30 transition-all duration-300 shadow-2xl">
                <CardContent className="p-0 flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors">
                        <GitBranch size={16} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                        {repo.title}
                      </h3>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/5 text-amber-500 rounded-full border-amber-500/10 text-[10px] font-bold">
                      <Star size={10} fill="currentColor" />
                      {repo.trending_score.toLocaleString()}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-8">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                          {repo.language}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <Sparkles size={12} className="text-indigo-400" />
                        Trending
                      </div>
                    </div>
                    <div className="p-1.5 bg-slate-800/30 rounded-full text-slate-600 group-hover:text-indigo-400 transition-colors">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrendingRepos;
