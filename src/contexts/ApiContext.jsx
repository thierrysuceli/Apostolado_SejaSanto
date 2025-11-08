// =====================================================
// API CONTEXT - Helper para chamadas de API
// =====================================================

import { createContext, useContext } from 'react';

// Detecta automaticamente o ambiente
// Em produção (Vercel), usa paths relativos
// Em desenvolvimento, usa localhost:3002
const API_URL = import.meta.env.PROD 
  ? '' // Produção: paths relativos (/api/...)
  : (import.meta.env.VITE_API_URL || 'http://localhost:3002'); // Dev: servidor local

export const ApiContext = createContext(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi deve ser usado dentro de ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const getToken = () => localStorage.getItem('token');

  const getHeaders = (includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (includeAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  };

  const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'Erro na requisição');
      error.response = { data, status: response.status };
      throw error;
    }

    return data;
  };

  const get = async (url, requireAuth = true) => {
    // 🔄 Add cache busting timestamp to force fresh data
    const separator = url.includes('?') ? '&' : '?';
    const cacheBustedUrl = `${url}${separator}_t=${Date.now()}`;
    
    const response = await fetch(`${API_URL}${cacheBustedUrl}`, {
      method: 'GET',
      headers: getHeaders(requireAuth),
      cache: 'no-store'  // Prevent browser caching
    });

    return handleResponse(response);
  };

  const post = async (url, body, requireAuth = true) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(requireAuth),
      body: JSON.stringify(body)
    });

    return handleResponse(response);
  };

  const put = async (url, body, requireAuth = true) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(requireAuth),
      body: JSON.stringify(body)
    });

    return handleResponse(response);
  };

  const del = async (url, body = null, requireAuth = true) => {
    const options = {
      method: 'DELETE',
      headers: getHeaders(requireAuth)
    };

    // Adicionar body se fornecido
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${url}`, options);

    return handleResponse(response);
  };

  // Alias para manter compatibilidade
  const deleteRequest = del;

  // ==================== POSTS ====================
  
  const posts = {
    getAll: () => {
      const token = getToken();
      return get('/api/posts', !!token);
    },
    getById: (id) => {
      const token = getToken();
      return get(`/api/posts/${id}`, !!token);
    },
    create: (data) => post('/api/posts/create', data),
    update: (id, data) => put(`/api/posts/${id}`, data),
    delete: (id) => del(`/api/posts/${id}`),
    assignTag: (postId, role) => post(`/api/posts/${postId}/tags`, { role })
  };

  // ==================== COURSES ====================
  
  const courses = {
    getAll: () => {
      // Envia token se existir, mas não falha se não existir
      const token = getToken();
      return get('/api/courses', !!token);
    },
    getById: (id) => {
      const token = getToken();
      return get(`/api/courses/${id}`, !!token);
    },
    create: (data) => post('/api/courses/create', data),
    update: (id, data) => put(`/api/courses/${id}`, data),
    delete: (id) => del(`/api/courses/${id}`),
    assignTag: (courseId, role) => post(`/api/courses/${courseId}/tags`, { role })
  };

  // ==================== TOPICS ====================
  
  const topics = {
    getById: (id) => {
      const token = getToken();
      return get(`/api/topics/${id}`, !!token);
    },
    create: (data) => post('/api/topics', data),
    update: (id, data) => put(`/api/topics/${id}`, data),
    delete: (id) => del(`/api/topics/${id}`)
  };

  // ==================== EVENTS ====================
  
  const events = {
    getAll: () => {
      const token = getToken();
      return get('/api/events', !!token);
    },
    getById: (id) => {
      const token = getToken();
      return get(`/api/events/${id}`, !!token);
    },
    create: (data) => post('/api/events', data),
    update: (id, data) => put(`/api/events/${id}`, data),
    delete: (id) => del(`/api/events/${id}`)
  };

  // ==================== COMMENTS ====================
  
  const comments = {
    getAll: (params) => {
      const query = new URLSearchParams(params).toString();
      const token = getToken();
      return get(`/api/comments?${query}`, !!token);
    },
    create: (data) => post('/api/comments', data),
    update: (id, data) => put(`/api/comments/${id}`, data),
    delete: (id) => del(`/api/comments/${id}`)
  };

  // ==================== MODULES ====================
  
  const modules = {
    create: (data) => post('/api/modules', data),
    update: (id, data) => put(`/api/modules/${id}`, data),
    delete: (id) => del(`/api/modules/${id}`),
    getById: (id) => get(`/api/modules/${id}`)
  };
  
  // ==================== ROLES ====================
  
  const roles = {
    getAll: () => get('/api/roles', false) // Endpoint público para listar roles do sistema
  };

  // ==================== TAGS (Thematic) ====================
  
  const tags = {
    getAll: () => get('/api/tags', false), // Endpoint público
    create: (data) => post('/api/tags', data),
    update: (id, data) => put(`/api/tags/${id}`, data),
    delete: (id) => del(`/api/tags/${id}`)
  };

  // ==================== EVENT CATEGORIES ====================
  
  const eventCategories = {
    getAll: () => get('/api/event-categories', false), // Endpoint público
    create: (data) => post('/api/event-categories', data),
    update: (id, data) => put(`/api/event-categories/${id}`, data),
    delete: (id) => del(`/api/event-categories/${id}`)
  };

  // ==================== GROUPS (Central) ====================
  
  const groups = {
    getAll: () => get('/api/central/groups'),
    getById: (id) => get(`/api/central/groups?id=${id}`),
    create: (data) => post('/api/central/groups?action=create', data),
    getPosts: (id) => get(`/api/central/groups?id=${id}&resource=posts`),
    getPolls: (id) => get(`/api/central/groups?id=${id}&resource=polls`),
    getRegistrations: (id) => get(`/api/central/groups?id=${id}&resource=registrations`)
  };

  // ==================== POLLS (Central) ====================
  
  const polls = {
    vote: (pollId, optionIds) => post(`/api/central/polls-actions?id=${pollId}&action=vote`, { option_ids: optionIds }),
    create: (groupId, data) => post(`/api/central/groups?id=${groupId}&resource=polls`, data),
    update: (pollId, data) => put(`/api/central/polls-actions?id=${pollId}&action=edit`, data),
    delete: (pollId) => del(`/api/central/polls-actions?id=${pollId}&action=delete`)
  };

  // ==================== REGISTRATIONS (Central) ====================
  
  const registrations = {
    register: (registrationId) => post(`/api/central/registrations-actions?id=${registrationId}&action=subscribe`),
    create: (groupId, data) => post(`/api/central/groups?id=${groupId}&resource=registrations`, data),
    update: (registrationId, data) => put(`/api/central/registrations-actions?id=${registrationId}&action=edit`, data),
    delete: (registrationId) => del(`/api/central/registrations-actions?id=${registrationId}&action=delete`)
  };

  // ==================== BIBLE NOTES ====================
  
  const bibleNotes = {
    getAll: (params) => {
      const query = new URLSearchParams(params).toString();
      return get(`/api/public-data?type=bible-notes&${query}`, false);
    },
    getByVerse: ({ book_abbrev, chapter, verse }) => {
      return get(`/api/public-data?type=bible-notes&book_abbrev=${book_abbrev}&chapter=${chapter}&verse=${verse}&_t=${Date.now()}`, false);
    },
    getById: (id) => get(`/api/public-data?type=bible-notes&id=${id}`, false),
    create: (data) => post('/api/public-data?type=bible-notes', data),
    update: (id, data) => put(`/api/public-data?type=bible-notes&id=${id}`, data),
    delete: (id) => del(`/api/public-data?type=bible-notes&id=${id}`)
  };

  // ==================== USER PROGRESS ====================
  
  const progress = {
    // Course Progress
    getCourseProgress: (courseId = null) => {
      const url = courseId 
        ? `/api/public-data?type=course-progress&course_id=${courseId}`
        : '/api/public-data?type=course-progress';
      return get(url, true);
    },
    saveCourseProgress: (data) => {
      return post('/api/public-data?type=course-progress', data, true);
    },
    deleteCourseProgress: (courseId) => {
      return del(`/api/public-data?type=course-progress&course_id=${courseId}`, null, true);
    },
    
    // Post Progress
    getPostProgress: (postId = null) => {
      const url = postId 
        ? `/api/public-data?type=post-progress&post_id=${postId}`
        : '/api/public-data?type=post-progress';
      return get(url, true);
    },
    savePostProgress: (data) => {
      return post('/api/public-data?type=post-progress', data, true);
    },
    deletePostProgress: (postId) => {
      return del(`/api/public-data?type=post-progress&post_id=${postId}`, null, true);
    }
  };

  // ==================== BIBLE ====================
  
  const bible = {
    getBooks: () => get('/api/public-data?type=bible-books'),
    getChapters: (bookId) => get(`/api/public-data?type=bible-chapters&book_id=${bookId}`),
    getVerses: (bookAbbrev, chapterNumber) => 
      get(`/api/public-data?type=bible-verses&book_abbrev=${bookAbbrev}&chapter_number=${chapterNumber}`)
  };

  const bibleComments = {
    getAll: (filters = {}) => {
      const params = new URLSearchParams({
        type: 'bible-verse-comments',
        ...filters
      });
      return get(`/api/public-data?${params}`);
    },
    create: (data) => post('/api/public-data?type=bible-verse-comments', data, true),
    delete: (id) => del(`/api/public-data?type=bible-verse-comments&id=${id}`, null, true)
  };

  const bibleProgress = {
    get: () => get('/api/public-data?type=bible-progress', true),
    save: (data) => post('/api/public-data?type=bible-progress', data, true)
  };

  // ==================== ADMIN ====================
  
  const admin = {
    roles: {
      getAll: () => get('/api/admin/roles'), // Lista completa com permissões (requer admin)
      create: (data) => post('/api/admin/roles', data),
      update: (id, data) => put(`/api/admin/roles/${id}`, data),
      delete: (id) => del(`/api/admin/roles/${id}`)
    },
    permissions: {
      getAll: () => get('/api/admin/permissions')
    },
    users: {
      getAll: () => get('/api/admin/users'),
      create: (data) => post('/api/admin/users', data),
      update: (id, data) => put(`/api/admin/users/${id}`, data),
      delete: (id) => del(`/api/admin/users/${id}`),
      assignRoles: (userId, roles) => put(`/api/admin/users/${userId}/roles`, { roles })
    }
  };
  
  // Convenience methods for users and roles (backward compatibility)
  const users = {
    ...admin.users,
    updateProfilePhoto: (userId, data) => put(`/api/admin/users/${userId}`, data)
  };

  return (
    <ApiContext.Provider
      value={{
        get,
        post,
        put,
        del,
        delete: deleteRequest, // Alias para delete
        posts,
        courses,
        topics,
        events,
        comments,
        modules,
        tags,
        eventCategories,
        groups,
        polls,
        registrations,
        bible,
        bibleNotes,
        bibleComments,
        bibleProgress,
        progress,
        roles,
        users,
        admin
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
