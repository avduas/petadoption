import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    advancedSearch: false,
    adoption_status: '',
    height: '',
    weight: '',
    type: '',
    name: '',
  });

  const handleSearch = () => {
    const searchParams2 = {
      advancedSearch: searchParams.advancedSearch,
      adoption_status: searchParams.adoption_status.trim(),
      height: searchParams.height.trim(),
      weight: searchParams.weight.trim(),
      type: searchParams.type.trim(),
      name: searchParams.name.trim(),
    };

    onSearch(searchParams2);
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type of animal..."
          value={searchParams.type}
          onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
        />
      </div>

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={searchParams.advancedSearch}
          onChange={() => setSearchParams({ ...searchParams, advancedSearch: !searchParams.advancedSearch })}
        />
        <label className="form-check-label">Advanced Search</label>
      </div>

      {searchParams.advancedSearch && (
        <div>
          <div className="mb-3">
            <label className="form-label">Adoption Status:</label>
            <select
              className="form-select"
              value={searchParams.adoption_status}
              onChange={(e) => setSearchParams({ ...searchParams, adoption_status: e.target.value })}
            >
              <option value="">Select Adoption Status</option>
              <option value="Available">Available</option>
              <option value="Fostered">Fostered</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Height:</label>
            <input
              type="text"
              className="form-control"
              value={searchParams.height}
              onChange={(e) => setSearchParams({ ...searchParams, height: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Weight:</label>
            <input
              type="text"
              className="form-control"
              value={searchParams.weight}
              onChange={(e) => setSearchParams({ ...searchParams, weight: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            />
          </div>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
