import { FALLBACK_BOOKS, FALLBACK_BOOK_DETAILS, getFallbackBooksForSubject } from './fallbackData';

const BASE_URL = 'https://openlibrary.org';

const fetchWithTimeout = async (url, timeoutMs = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

// Fetch books by Open Library subject
export const getBooksBySubject = async (subject, limit = 15) => {
  try {
    const formattedSubject = (subject || '').toLowerCase().replace(/ /g, '_');
    const res = await fetchWithTimeout(`${BASE_URL}/subjects/${formattedSubject}.json?limit=${limit}`);
    if (!res.ok) throw new Error(`Open Library API Error (${res.status}): Failed to fetch ${subject} books`);
    const data = await res.json();
    if (data.works && data.works.length > 0) {
      return data.works;
    }
    return getFallbackBooksForSubject(subject);
  } catch (error) {
    console.warn(`[API Notice] Using curated fallback data for subject '${subject}':`, error.message);
    return getFallbackBooksForSubject(subject);
  }
};

// Generic search
export const searchBooks = async (query, limit = 15) => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error(`Open Library API Error (${res.status}): Failed to search books for '${query}'`);
    const data = await res.json();
    if (data.docs && data.docs.length > 0) {
      return data.docs;
    }
    return getFallbackBooksForSubject(query);
  } catch (error) {
    console.warn(`[API Notice] Using curated fallback data for search '${query}':`, error.message);
    return getFallbackBooksForSubject(query);
  }
};

export const getTrendingBooks = async (limit = 15) => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/trending/weekly.json?limit=${limit}`);
    if (!res.ok) throw new Error(`Open Library API Error (${res.status}): Failed to fetch trending books`);
    const data = await res.json();
    if (data.works && data.works.length > 0) {
      return data.works;
    }
    return FALLBACK_BOOKS.trending;
  } catch (error) {
    console.warn(`[API Notice] Using curated fallback data for trending books:`, error.message);
    return FALLBACK_BOOKS.trending;
  }
};

export const getBookDetails = async (key) => {
  try {
    // key is usually like /works/OL12345W
    const res = await fetchWithTimeout(`${BASE_URL}${key}.json`);
    if (!res.ok) throw new Error(`Open Library API Error (${res.status}): Failed to fetch book details for ${key}`);
    const data = await res.json();
    
    // Try to fetch author details if authors exist
    let authorName = 'Unknown Author';
    if (data.authors && data.authors.length > 0) {
      try {
        const authorRes = await fetchWithTimeout(`${BASE_URL}${data.authors[0].author.key}.json`, 3000);
        if (authorRes.ok) {
          const authorData = await authorRes.json();
          authorName = authorData.name || authorName;
        }
      } catch (e) {
        console.warn(`[API Warning] Failed to fetch author details for ${key}:`, e.message);
      }
    }

    return { ...data, authorName };
  } catch (error) {
    console.warn(`[API Notice] Using curated fallback details for book key '${key}':`, error.message);
    if (FALLBACK_BOOK_DETAILS[key]) {
      return FALLBACK_BOOK_DETAILS[key];
    }
    return {
      key,
      title: 'Featured Literary Work',
      description: 'A compelling literary title currently available on Bookmarkd.',
      authorName: 'Renowned Author',
      covers: [12547191],
      first_publish_date: 'Classic Edition',
      subjects: ['Literature', 'Featured Work']
    };
  }
};

export const getCoverUrl = (coverId, size = 'L') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

