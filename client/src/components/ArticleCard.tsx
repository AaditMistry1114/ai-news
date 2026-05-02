import { Heart, ExternalLink, Clock, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { API_BASE_URL } from '@/lib/utils';

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

interface ArticleCardProps {
  article: Article;
  onLikeToggle?: (id: number, isLiked: boolean) => void;
}

const sourceColors: Record<string, { bg: string, text: string, dot: string }> = {
  hackernews: { bg: 'bg-orange-500/10', text: 'text-orange-500', dot: 'bg-orange-500' },
  github: { bg: 'bg-slate-500/10', text: 'text-slate-300', dot: 'bg-slate-400' },
  devto: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-500' },
  default: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-500' },
};

const ArticleCard = ({ article, onLikeToggle }: ArticleCardProps) => {
  const [isLiked, setIsLiked] = useState(article.is_liked);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const newStatus = !isLiked;
      await axios.post(`${API_BASE_URL}/api/articles/${article.id}/like`, { is_liked: newStatus });
      setIsLiked(newStatus);
      if (onLikeToggle) onLikeToggle(article.id, newStatus);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getSourceStyles = () => {
    const source = article.source.toLowerCase();
    if (source.includes('hacker')) return sourceColors.hackernews;
    if (source.includes('github')) return sourceColors.github;
    if (source.includes('dev')) return sourceColors.devto;
    return sourceColors.default;
  };

  const styles = getSourceStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-800/50 hover:border-indigo-500/30 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-indigo-500/10">
        {/* Top Image/Gradient Area */}
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="p-6 flex flex-col flex-1 gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${styles.bg} border border-${styles.text.split('-')[1]}-500/20`}>
              <div className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.text}`}>
                {article.source}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-800/40 px-2 py-1 rounded-lg">
                <ArrowUpRight size={10} className="text-indigo-400" />
                {article.trending_score}
              </div>
              <button
                onClick={handleLike}
                className={`p-2 rounded-xl transition-all duration-300 ${isLiked ? 'bg-red-500/10 text-red-500 shadow-inner' : 'bg-slate-800/40 text-slate-500 hover:text-red-400 hover:bg-red-500/5'}`}
              >
                <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Title & Summary */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 group/link"
          >
            <h3 className="text-lg font-bold leading-tight text-slate-100 group-hover/link:text-indigo-400 transition-colors duration-300 line-clamp-2 mb-3">
              {article.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
              {article.summary || 'Reading this technical development... Click to view full article on source website.'}
            </p>
          </a>

          {/* Meta & Actions */}
          <div className="pt-4 mt-auto border-t border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
              <Clock size={12} className="text-indigo-500/70" />
              <span>{formatTime(article.created_at)}</span>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 gap-1.5 transition-all group/btn"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                Read More
              </a>
            </Button>
          </div>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent_70%)]" />
      </div>
    </motion.div>
  );
};


export default ArticleCard;
