import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { API_BASE_URL } from '../lib/utils';

interface Topic {
  topic: string;
  count: number;
}

const TrendingTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/trending-topics`);
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleTopicClick = (topic: string) => {
    if (currentQuery === topic) {
      searchParams.delete('q');
    } else {
      searchParams.set('q', topic);
    }
    setSearchParams(searchParams);
  };

  if (loading || topics.length === 0) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
      <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm whitespace-nowrap">
        <TrendingUp size={16} />
        Trending:
      </div>
      <div className="flex gap-2">
        {topics.map((topicObj, i) => (
          <button 
            key={i} 
            onClick={() => handleTopicClick(topicObj.topic)}
            className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1 border ${
              currentQuery === topicObj.topic 
                ? 'bg-indigo-500 text-white border-indigo-400' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500/50'
            }`}
          >
            #{topicObj.topic}
            {currentQuery === topicObj.topic && <X size={10} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
