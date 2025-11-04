import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Débouncer la recherche pour éviter de spammer à chaque frappe rapide
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // 300 ms après la dernière frappe
    return () => clearTimeout(timeout);
  }, [searchTerm, onSearch]);

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Rechercher des événements..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      />
    </div>
  );
};

export default SearchBar;
