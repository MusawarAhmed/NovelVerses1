import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MockBackendService } from '../services/mockBackend';
import { Novel, Chapter } from '../types';
import { AppContext } from '../App';
import { BookOpen, Bookmark, List, Lock, Unlock, Eye, TrendingUp, Star, Edit } from 'lucide-react';
import { FadeIn, BlurIn, StaggerContainer, StaggerItem, ScaleButton, SpringCard } from '../components/Anim';
import { motion } from 'framer-motion';

export const NovelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, refreshUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedNovels, setRelatedNovels] = useState<Novel[]>([]);

  useEffect(() => {
    if (!id) return;
    const n = MockBackendService.getNovelById(id);
    if (n) {
      setNovel(n);
      setChapters(MockBackendService.getChapters(n.id));
      
      // Logic for related novels
      const allNovels = MockBackendService.getNovels();
      let related = allNovels.filter(item => item.id !== n.id && item.tags.some(t => n.tags.includes(t)));
      if (related.length < 4) {
        const remaining = allNovels.filter(item => item.id !== n.id && !related.includes(item));
        related = [...related, ...remaining];
      }
      setRelatedNovels(related.slice(0, 4));
    } else {
        navigate('/');
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  useEffect(() => {
    if (user && novel) {
      setIsBookmarked(user.bookmarks.includes(novel.id));
    }
  }, [user, novel]);

  const handleBookmark = () => {
    if (!user) return navigate('/auth');
    if (novel) {
      MockBackendService.toggleBookmark(user.id, novel.id);
      refreshUser();
    }
  };

  if (!novel) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Novel Info Card */}
      <FadeIn className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-10">
        {/* Admin Edit Button */}
        {user?.role === 'admin' && (
            <Link 
                to="/admin" 
                state={{ editNovelId: novel.id }}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm"
                title="Edit Novel"
            >
                <Edit size={20} />
            </Link>
        )}
        
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 relative">
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="aspect-[2/3] md:h-full w-full overflow-hidden"
            >
              <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
          </div>
          <div className="p-8 md:w-2/3 lg:w-3/4 flex flex-col">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <BlurIn className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif">{novel.title}</BlurIn>
                </div>
                <FadeIn delay={0.2}>
                  <p className="text-primary font-medium mb-4">{novel.author}</p>
                  <div className="flex items-center space-x-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center"><List size={16} className="mr-1" /> {chapters.length} Chapters</span>
                      <span className="flex items-center"><Eye size={16} className="mr-1" /> {novel.views.toLocaleString()} Views</span>
                      <span className={`px-2 py-0.5 rounded text-xs border ${novel.status === 'Ongoing' ? 'border-green-500 text-green-500' : 'border-blue-500 text-blue-500'}`}>{novel.status}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{novel.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                      {novel.tags.map(tag => (
                          <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                              {tag}
                          </span>
                      ))}
                  </div>
                </FadeIn>
            </div>
            <FadeIn delay={0.4} className="flex space-x-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <ScaleButton 
                    onClick={() => chapters.length > 0 && navigate(`/read/${novel.id}/${chapters[0].id}`)}
                    className="flex-1 bg-primary hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                    <BookOpen size={20} className="mr-2" /> Start Reading
                </ScaleButton>
                <ScaleButton 
                    onClick={handleBookmark}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors border flex items-center justify-center ${isBookmarked ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:border-pink-900/50 dark:text-pink-400' : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                   <Bookmark size={20} className={`mr-2 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'In Library' : 'Add to Library'}
                </ScaleButton>
            </FadeIn>
          </div>
        </div>
      </FadeIn>

      {/* Chapter List */}
      <FadeIn delay={0.5} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 mb-10">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <List className="mr-2" /> Chapter List
        </h3>
        <StaggerContainer className="space-y-2" delay={0.6}>
            {chapters.length === 0 ? (
                <p className="text-slate-500 italic">No chapters uploaded yet.</p>
            ) : (
                chapters.map((chapter) => {
                    const isOwned = !chapter.isPaid || user?.purchasedChapters.includes(chapter.id) || user?.role === 'admin';
                    return (
                        <StaggerItem key={chapter.id}>
                          <Link 
                              to={`/read/${novel.id}/${chapter.id}`}
                              className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          >
                              <div className="flex items-center">
                                  <span className="text-slate-400 dark:text-slate-500 mr-4 font-mono text-sm w-8">#{chapter.order}</span>
                                  <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-primary transition-colors">{chapter.title}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                  {chapter.isPaid ? (
                                      isOwned ? (
                                          <span className="text-green-600 dark:text-green-400 flex items-center"><Unlock size={14} className="mr-1"/> Purchased</span>
                                      ) : (
                                          <span className="text-amber-600 dark:text-amber-400 flex items-center"><Lock size={14} className="mr-1"/> {chapter.price} Coins</span>
                                      )
                                  ) : (
                                      <span className="text-slate-400 dark:text-slate-500">Free</span>
                                  )}
                                  <span className="ml-4 text-xs text-slate-400">{new Date(chapter.createdAt).toLocaleDateString()}</span>
                              </div>
                          </Link>
                        </StaggerItem>
                    );
                })
            )}
        </StaggerContainer>
      </FadeIn>

      {/* Related Novels */}
      {relatedNovels.length > 0 && (
        <div className="mt-12">
          <FadeIn delay={0.8}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="mr-2 text-primary" /> You Might Also Like
            </h3>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" delay={0.9}>
            {relatedNovels.map((related) => (
              <StaggerItem key={related.id}>
                <Link to={`/novel/${related.id}`} className="group block bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={related.coverUrl} 
                      alt={related.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <Star size={12} className="text-yellow-400 mr-1 fill-yellow-400" /> {related.rating}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{related.title}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate max-w-[80px]">{related.author}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${related.status === 'Ongoing' ? 'border-green-500 text-green-500' : 'border-blue-500 text-blue-500'}`}>{related.status}</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}
    </div>
  );
};