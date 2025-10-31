import React from 'react';

const NewsCard = ({ article }) => {
  const {
    title,
    description,
    urlToImage,
    url,
    publishedAt,
    source
  } = article;

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {urlToImage && (
        <img 
          src={urlToImage} 
          alt={title} 
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{title}</h2>
        
        {description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          {source && <span>{source.name}</span>}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default NewsCard;