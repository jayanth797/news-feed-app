import React, { useState, useEffect, useCallback } from 'react';
import NewsCard from './components/NewsCard';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [darkMode, setDarkMode] = useState(false);

  // API key for NewsAPI (you should replace this with your own key)
  const API_KEY = '0bbb70343c7c435b9789c2af8e5f8c23';
  const BASE_URL = 'https://newsapi.org/v2';

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${BASE_URL}/top-headlines?category=${selectedCategory}&apiKey=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, API_KEY, BASE_URL]);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    // Save theme preference
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, fetchNews]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      fetchNews();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
      console.error('Error searching news:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchNews, API_KEY, BASE_URL]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold">News Feed App</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="mt-4">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>
        </header>

        <main>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3">Loading...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <p>No articles found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;