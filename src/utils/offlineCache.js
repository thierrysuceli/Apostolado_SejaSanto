// =====================================================
// OFFLINE CACHE - IndexedDB Manager
// Reduz custos no servidor armazenando dados localmente
// =====================================================

import { openDB } from 'idb';

const DB_NAME = 'apostolado-cache';
const DB_VERSION = 1;

const STORES = {
  articles: 'articles',
  news: 'news',
  courses: 'courses',
  posts: 'posts',
  events: 'events',
  liturgy: 'liturgy',
  bible: 'bible-chapters',
  metadata: 'cache-metadata'
};

// Cache durations (em segundos)
const CACHE_DURATION = {
  articles: 24 * 60 * 60,      // 24 horas
  news: 24 * 60 * 60,          // 24 horas
  courses: 7 * 24 * 60 * 60,   // 7 dias
  posts: 24 * 60 * 60,         // 24 horas
  events: 6 * 60 * 60,         // 6 horas
  liturgy: 24 * 60 * 60,       // 24 horas
  bible: 30 * 24 * 60 * 60     // 30 dias (raramente muda)
};

class OfflineCacheManager {
  constructor() {
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;

    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Criar object stores se não existirem
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      }
    });

    return this.db;
  }

  // Verificar se cache está válido
  async isCacheValid(storeName, cacheKey) {
    try {
      const db = await this.init();
      const metadata = await db.get(STORES.metadata, `${storeName}:${cacheKey}`);
      
      if (!metadata) return false;

      const now = Date.now();
      const age = (now - metadata.timestamp) / 1000; // em segundos
      const maxAge = CACHE_DURATION[storeName] || 24 * 60 * 60;

      return age < maxAge;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return false;
    }
  }

  // Salvar metadata do cache
  async saveCacheMetadata(storeName, cacheKey) {
    try {
      const db = await this.init();
      await db.put(STORES.metadata, {
        id: `${storeName}:${cacheKey}`,
        timestamp: Date.now(),
        storeName,
        cacheKey
      });
    } catch (error) {
      console.error('Error saving cache metadata:', error);
    }
  }

  // Salvar lista de items (artigos, notícias, etc)
  async saveList(storeName, items, cacheKey = 'list') {
    try {
      const db = await this.init();
      const tx = db.transaction(storeName, 'readwrite');
      
      // Limpar cache antigo
      await tx.store.clear();
      
      // Garantir que items seja array
      const itemsArray = Array.isArray(items) ? items : [items];
      
      // Salvar novos items
      await Promise.all(
        itemsArray.map(item => tx.store.put({ ...item, _cacheKey: cacheKey }))
      );

      await tx.done;
      await this.saveCacheMetadata(storeName, cacheKey);
      
      console.log(`✅ Cached ${items.length} items in ${storeName}`);
      return true;
    } catch (error) {
      console.error(`Error saving to ${storeName}:`, error);
      return false;
    }
  }

  // Recuperar lista do cache
  async getList(storeName, cacheKey = 'list') {
    try {
      const isValid = await this.isCacheValid(storeName, cacheKey);
      
      if (!isValid) {
        console.log(`⏰ Cache expired for ${storeName}`);
        return null;
      }

      const db = await this.init();
      const items = await db.getAll(storeName);
      
      console.log(`📦 Loaded ${items.length} items from ${storeName} cache`);
      return items.filter(item => item._cacheKey === cacheKey);
    } catch (error) {
      console.error(`Error reading from ${storeName}:`, error);
      return null;
    }
  }

  // Salvar item individual (por ID)
  async saveItem(storeName, item) {
    try {
      const db = await this.init();
      await db.put(storeName, { ...item, _cached: Date.now() });
      console.log(`✅ Cached item ${item.id} in ${storeName}`);
      return true;
    } catch (error) {
      console.error(`Error saving item to ${storeName}:`, error);
      return false;
    }
  }

  // Recuperar item individual
  async getItem(storeName, id) {
    try {
      const db = await this.init();
      const item = await db.get(storeName, id);
      
      if (!item) return null;

      // Verificar idade do cache individual
      const age = (Date.now() - item._cached) / 1000;
      const maxAge = CACHE_DURATION[storeName] || 24 * 60 * 60;

      if (age > maxAge) {
        console.log(`⏰ Cached item ${id} expired`);
        return null;
      }

      console.log(`📦 Loaded item ${id} from ${storeName} cache`);
      return item;
    } catch (error) {
      console.error(`Error reading item from ${storeName}:`, error);
      return null;
    }
  }

  // Limpar cache de uma store específica
  async clearStore(storeName) {
    try {
      const db = await this.init();
      await db.clear(storeName);
      console.log(`🗑️ Cleared ${storeName} cache`);
      return true;
    } catch (error) {
      console.error(`Error clearing ${storeName}:`, error);
      return false;
    }
  }

  // Limpar todo o cache
  async clearAll() {
    try {
      const db = await this.init();
      await Promise.all(
        Object.values(STORES).map(store => db.clear(store))
      );
      console.log('🗑️ Cleared all cache');
      return true;
    } catch (error) {
      console.error('Error clearing all cache:', error);
      return false;
    }
  }

  // Obter tamanho aproximado do cache
  async getCacheSize() {
    try {
      const db = await this.init();
      let total = 0;

      for (const storeName of Object.values(STORES)) {
        const count = await db.count(storeName);
        total += count;
      }

      return total;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }
}

// Singleton instance
export const offlineCache = new OfflineCacheManager();

// Helpers específicos para cada tipo de conteúdo
export const cacheHelpers = {
  // Artigos
  async saveArticles(articles) {
    return offlineCache.saveList(STORES.articles, articles);
  },
  async getArticles() {
    return offlineCache.getList(STORES.articles);
  },
  async getArticle(id) {
    return offlineCache.getItem(STORES.articles, id);
  },

  // Notícias
  async saveNews(newsList) {
    return offlineCache.saveList(STORES.news, newsList);
  },
  async getNews() {
    return offlineCache.getList(STORES.news);
  },
  async getNewsItem(id) {
    return offlineCache.getItem(STORES.news, id);
  },

  // Cursos
  async saveCourses(courses) {
    return offlineCache.saveList(STORES.courses, courses);
  },
  async getCourses() {
    return offlineCache.getList(STORES.courses);
  },
  async getCourse(id) {
    return offlineCache.getItem(STORES.courses, id);
  },

  // Posts
  async savePosts(posts) {
    return offlineCache.saveList(STORES.posts, posts);
  },
  async getPosts() {
    return offlineCache.getList(STORES.posts);
  },

  // Eventos
  async saveEvents(events) {
    return offlineCache.saveList(STORES.events, events);
  },
  async getEvents() {
    return offlineCache.getList(STORES.events);
  },

  // Liturgia
  async saveLiturgy(liturgyData, date) {
    const cacheKey = `liturgy-${date}`;
    return offlineCache.saveList(STORES.liturgy, [liturgyData], cacheKey);
  },
  async getLiturgy(date) {
    const cacheKey = `liturgy-${date}`;
    const items = await offlineCache.getList(STORES.liturgy, cacheKey);
    return items && items.length > 0 ? items[0] : null;
  },

  // Bíblia (capítulos)
  async saveBibleChapter(bookAbbrev, chapterNum, verses) {
    const id = `${bookAbbrev}-${chapterNum}`;
    return offlineCache.saveItem(STORES.bible, { id, bookAbbrev, chapterNum, verses });
  },
  async getBibleChapter(bookAbbrev, chapterNum) {
    const id = `${bookAbbrev}-${chapterNum}`;
    return offlineCache.getItem(STORES.bible, id);
  }
};

export default offlineCache;
