import { User, Novel, Chapter, Transaction } from '../types';

// Initial Mock Data
const MOCK_NOVELS: Novel[] = [
  {
    id: '1',
    title: "The Azure Sovereign",
    author: "Celestial Quill",
    description: "In a world where martial arts determine one's destiny, a young orphan discovers a mysterious azure ring that holds the soul of an ancient dragon. His journey to the peak of the cultivation world begins now.",
    coverUrl: "https://picsum.photos/seed/azure/300/450",
    tags: ["Xianxia", "Action", "Adventure", "Cultivation"],
    status: 'Ongoing',
    views: 12500,
    rating: 4.8,
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: "Reborn as a Cyber-Cat",
    author: "Neon Whisker",
    description: "After a fatal server crash, elite hacker Jin wakes up in 2077... as a cybernetic stray cat? He must navigate the neon-lit streets of Neo-Tokyo, hacking corp mainframes with his neural-linked paws.",
    coverUrl: "https://picsum.photos/seed/cat/300/450",
    tags: ["Sci-Fi", "Cyberpunk", "Comedy", "Reincarnation"],
    status: 'Ongoing',
    views: 8400,
    rating: 4.5,
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: "Silence of the Stars",
    author: "Void Walker",
    description: "Humanity has expanded to the edges of the galaxy, only to find that the stars are going out one by one. Captain Elara Vance commands the last scout ship to investigate the darkening void.",
    coverUrl: "https://picsum.photos/seed/space/300/450",
    tags: ["Sci-Fi", "Mystery", "Space Opera"],
    status: 'Completed',
    views: 45000,
    rating: 4.9,
    updatedAt: new Date().toISOString()
  }
];

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'c1-1',
    novelId: '1',
    title: "Chapter 1: The Awakening",
    content: "<p>The morning sun cast long shadows over the sleepy village of Green Willow. Han Li wiped the sweat from his brow...</p><p>Suddenly, the ring on his finger pulsed with a strange, cold light.</p>",
    order: 1,
    isPaid: false,
    price: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c1-2',
    novelId: '1',
    title: "Chapter 2: First Breath",
    content: "<p>Breathing techniques were the foundation of all cultivation. Han Li sat cross-legged, mimicking the posture he had seen in the ancient scroll...</p>",
    order: 2,
    isPaid: false,
    price: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c1-3',
    novelId: '1',
    title: "Chapter 3: The Challenge (Paid)",
    content: "<p>The village bully, Iron Fist Zhao, blocked the path. 'Hand over the herbs, trash!' he sneered.</p><p>Han Li clenched his fist. He was no longer the weak boy from yesterday.</p>",
    order: 3,
    isPaid: true,
    price: 15,
    createdAt: new Date().toISOString()
  }
];

const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    username: 'AdminUser',
    email: 'admin@novelverse.com',
    role: 'admin',
    coins: 9999,
    bookmarks: [],
    purchasedChapters: []
  },
  {
    id: 'user1',
    username: 'ReaderOne',
    email: 'reader@novelverse.com',
    role: 'user',
    coins: 50, // Enough for a few chapters
    bookmarks: ['1'],
    purchasedChapters: []
  }
];

export const MockBackendService = {
  init: () => {
    if (!localStorage.getItem('nv_novels')) {
      localStorage.setItem('nv_novels', JSON.stringify(MOCK_NOVELS));
    }
    if (!localStorage.getItem('nv_chapters')) {
      localStorage.setItem('nv_chapters', JSON.stringify(MOCK_CHAPTERS));
    }
    if (!localStorage.getItem('nv_users')) {
      localStorage.setItem('nv_users', JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem('nv_transactions')) {
      localStorage.setItem('nv_transactions', JSON.stringify([]));
    }
  },

  getNovels: (): Novel[] => {
    return JSON.parse(localStorage.getItem('nv_novels') || '[]');
  },

  getNovelById: (id: string): Novel | undefined => {
    const novels = MockBackendService.getNovels();
    return novels.find(n => n.id === id);
  },

  createNovel: (novel: Omit<Novel, 'id' | 'updatedAt' | 'views' | 'rating'>) => {
    const novels = MockBackendService.getNovels();
    const newNovel: Novel = {
      ...novel,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString(),
      views: 0,
      rating: 0
    };
    novels.push(newNovel);
    localStorage.setItem('nv_novels', JSON.stringify(novels));
    return newNovel;
  },

  updateNovel: (updatedNovel: Novel) => {
    const novels = MockBackendService.getNovels();
    const index = novels.findIndex(n => n.id === updatedNovel.id);
    if (index !== -1) {
      novels[index] = { ...updatedNovel, updatedAt: new Date().toISOString() };
      localStorage.setItem('nv_novels', JSON.stringify(novels));
    }
  },

  deleteNovel: (id: string) => {
    // Delete Novel
    let novels = MockBackendService.getNovels();
    novels = novels.filter(n => n.id !== id);
    localStorage.setItem('nv_novels', JSON.stringify(novels));

    // Delete associated chapters
    let chapters: Chapter[] = JSON.parse(localStorage.getItem('nv_chapters') || '[]');
    chapters = chapters.filter(c => c.novelId !== id);
    localStorage.setItem('nv_chapters', JSON.stringify(chapters));
    
    // Cleanup bookmarks
    let users: User[] = JSON.parse(localStorage.getItem('nv_users') || '[]');
    users = users.map(u => ({
        ...u,
        bookmarks: u.bookmarks.filter(bid => bid !== id)
    }));
    localStorage.setItem('nv_users', JSON.stringify(users));
  },

  getChapters: (novelId: string): Chapter[] => {
    const chapters: Chapter[] = JSON.parse(localStorage.getItem('nv_chapters') || '[]');
    return chapters.filter(c => c.novelId === novelId).sort((a, b) => a.order - b.order);
  },

  getChapter: (id: string): Chapter | undefined => {
    const chapters: Chapter[] = JSON.parse(localStorage.getItem('nv_chapters') || '[]');
    return chapters.find(c => c.id === id);
  },

  createChapter: (chapter: Omit<Chapter, 'id' | 'createdAt'>) => {
    const chapters = JSON.parse(localStorage.getItem('nv_chapters') || '[]');
    const newChapter: Chapter = {
      ...chapter,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    chapters.push(newChapter);
    localStorage.setItem('nv_chapters', JSON.stringify(chapters));
    
    // Update novel updated date
    const novels = MockBackendService.getNovels();
    const novelIndex = novels.findIndex(n => n.id === chapter.novelId);
    if (novelIndex >= 0) {
      novels[novelIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('nv_novels', JSON.stringify(novels));
    }
    return newChapter;
  },

  updateChapter: (updatedChapter: Chapter) => {
    const chapters = JSON.parse(localStorage.getItem('nv_chapters') || '[]');
    const index = chapters.findIndex((c: Chapter) => c.id === updatedChapter.id);
    if (index !== -1) {
      chapters[index] = updatedChapter;
      localStorage.setItem('nv_chapters', JSON.stringify(chapters));
    }
  },

  deleteChapter: (id: string) => {
    let chapters = JSON.parse(localStorage.getItem('nv_chapters') || '[]');
    chapters = chapters.filter((c: Chapter) => c.id !== id);
    localStorage.setItem('nv_chapters', JSON.stringify(chapters));
  },

  login: (email: string): User | undefined => {
    const users: User[] = JSON.parse(localStorage.getItem('nv_users') || '[]');
    return users.find(u => u.email === email);
  },

  signup: (username: string, email: string): User => {
    const users: User[] = JSON.parse(localStorage.getItem('nv_users') || '[]');
    if (users.find(u => u.email === email)) throw new Error("User already exists");
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      role: 'user',
      coins: 50, // Welcome bonus
      bookmarks: [],
      purchasedChapters: []
    };
    users.push(newUser);
    localStorage.setItem('nv_users', JSON.stringify(users));
    return newUser;
  },

  getUser: (id: string): User | undefined => {
    const users: User[] = JSON.parse(localStorage.getItem('nv_users') || '[]');
    return users.find(u => u.id === id);
  },

  getAllUsers: (): User[] => {
    return JSON.parse(localStorage.getItem('nv_users') || '[]');
  },

  updateUser: (user: User) => {
    const users = MockBackendService.getAllUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
        users[idx] = user;
        localStorage.setItem('nv_users', JSON.stringify(users));
    }
  },

  deleteUser: (id: string) => {
    const users = MockBackendService.getAllUsers();
    const newUsers = users.filter(u => u.id !== id);
    localStorage.setItem('nv_users', JSON.stringify(newUsers));
  },

  purchaseChapter: (userId: string, chapterId: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('nv_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    const chapter = MockBackendService.getChapter(chapterId);
    if (!chapter) return false;

    const user = users[userIndex];
    if (user.purchasedChapters.includes(chapterId)) return true; // Already owned
    if (user.coins < chapter.price) return false; // Not enough money

    // Deduct coins
    user.coins -= chapter.price;
    user.purchasedChapters.push(chapterId);
    users[userIndex] = user;
    localStorage.setItem('nv_users', JSON.stringify(users));

    // Record Transaction
    const transactions: Transaction[] = JSON.parse(localStorage.getItem('nv_transactions') || '[]');
    transactions.unshift({
        id: Math.random().toString(36).substr(2, 9),
        userId: userId,
        amount: chapter.price,
        type: 'purchase',
        description: `Purchased ${chapter.title}`,
        date: new Date().toISOString()
    });
    localStorage.setItem('nv_transactions', JSON.stringify(transactions));

    return true;
  },

  toggleBookmark: (userId: string, novelId: string): string[] => {
    const users: User[] = JSON.parse(localStorage.getItem('nv_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return [];

    const user = users[userIndex];
    if (user.bookmarks.includes(novelId)) {
      user.bookmarks = user.bookmarks.filter(id => id !== novelId);
    } else {
      user.bookmarks.push(novelId);
    }
    users[userIndex] = user;
    localStorage.setItem('nv_users', JSON.stringify(users));
    return user.bookmarks;
  },

  // Admin Helpers
  getTransactions: (): Transaction[] => {
      return JSON.parse(localStorage.getItem('nv_transactions') || '[]');
  },

  getStats: () => {
      const novels = MockBackendService.getNovels();
      const chapters = JSON.parse(localStorage.getItem('nv_chapters') || '[]');
      const users = JSON.parse(localStorage.getItem('nv_users') || '[]');
      const transactions: Transaction[] = JSON.parse(localStorage.getItem('nv_transactions') || '[]');
      
      const totalRevenue = transactions
        .filter(t => t.type === 'purchase')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
          totalNovels: novels.length,
          totalChapters: chapters.length,
          totalUsers: users.length,
          totalRevenue
      };
  }
};
export { type User };