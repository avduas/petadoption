import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    advancedSearch: false,
    adoptionStatus: '',
    height: '',
    weight: '',
    type: '',
    name: '',
  });

  const [searchResults, setSearchResults] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const queryParams = new URLSearchParams(searchParams).toString();
        const response = await fetch(`https://peaceful-fortress-25463-6e87ef8d0bd7.herokuapp.com/search?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchPets();
  }, [searchParams]);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Search Page</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={searchResults} userId={userId} />
    </div>
  );
};

export default SearchPage;