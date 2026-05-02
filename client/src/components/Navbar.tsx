import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Radar, Search, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-20 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/50 z-50 flex items-center px-8 gap-12"
    >
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => navigate('/')}
      >
        <div className="p-2 bg-indigo-500 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-300">
          <Radar className="text-white" size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-100 hidden md:block uppercase">ai-news</span>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
        <Input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the radar..." 
          className="w-full bg-slate-900/50 border-slate-800 rounded-2xl py-6 pl-12 pr-4 text-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-500/50 transition-all placeholder:text-slate-600"
        />
      </form>

      <div className="flex gap-8 items-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-sm font-bold uppercase tracking-widest transition-colors hover:text-indigo-400 ${isActive && !searchParams.get('q') ? 'text-indigo-500' : 'text-slate-500'}`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/liked" 
          className={({ isActive }) => 
            `text-sm font-bold uppercase tracking-widest transition-colors hover:text-indigo-400 flex items-center gap-2 ${isActive ? 'text-indigo-500' : 'text-slate-500'}`
          }
        >
          <Heart size={16} />
          Liked
        </NavLink>
      </div>
    </motion.nav>
  );
};

export default Navbar;
