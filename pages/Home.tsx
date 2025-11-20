import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MockBackendService } from '../services/mockBackend';
import { Novel } from '../types';
import { TrendingUp, Star, Clock } from 'lucide-react';
import { FadeIn, BlurIn, StaggerContainer, StaggerItem, ScaleButton, BlobBackground } from '../components/Anim';

export const Home: React.FC = () => {
  const [novels, setNovels] = useState<Novel[]>([]);

  useEffect(() => {
    setNovels(MockBackendService.getNovels());
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BlobBackground />
      
      {/* Hero Section */}
      <FadeIn className="relative rounded-2xl overflow-hidden bg-slate-900 text-white mb-12 shadow-xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/80 z-10"></div>
        <img src="https://picsum.photos/seed/library/1200/400" alt="Library" className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105" />
        <div className="relative z-20 px-8 py-16 md:py-24 md:px-12 max-w-3xl">
          <BlurIn className="text-4xl md:text-6xl font-bold mb-4 font-serif tracking-tight">
            Dive into infinite worlds.
          </BlurIn>
          <FadeIn delay={0.3}>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed">
              Discover thousands of web novels, from eastern fantasy cultivation to western cyberpunk thrillers.
            </p>
            <Link to="/auth">
              <ScaleButton className="inline-block bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 shadow-lg">
                Start Reading Free
              </ScaleButton>
            </Link>
          </FadeIn>
        </div>
      </FadeIn>

      {/* Section Title */}
      <FadeIn delay={0.4} className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <TrendingUp className="mr-2 text-primary" /> Popular Now
        </h2>
      </FadeIn>

      {/* Novel Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" delay={0.5}>
        {novels.map((novel) => (
          <StaggerItem key={novel.id}>
            <Link to={`/novel/${novel.id}`} className="group block bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                    src={novel.coverUrl} 
                    alt={novel.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <Star size={12} className="text-yellow-400 mr-1 fill-yellow-400" /> {novel.rating}
                </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{novel.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{novel.author}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {novel.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                        {tag}
                    </span>
                    ))}
                </div>
                <div className="mt-auto flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center"><Clock size={12} className="mr-1"/> {novel.status}</span>
                </div>
                </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
};