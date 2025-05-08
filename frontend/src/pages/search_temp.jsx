import React, { useState, useEffect } from 'react';


export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [license, setLicense] = useState('');
  const [source, setSource] = useState('');
  const [extension, setExtension] = useState('');
  const [history, setHistory] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleSearch = async () => {
    let url = `http://localhost:8000/openverse?query=${query}`;
    if (license) url += `&license=${license}`;
    if (source) url += `&source=${source}`;
    if (extension) url += `&extension=${extension}`;

    const token = localStorage.getItem('token');
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setResults(data.results);

    await fetch('http://localhost:8000/search-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    fetchHistory();
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8000/search-history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log('HISTORY RESPONSE:', data);
    setHistory(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8000/search-history/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchHistory(); 
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="search-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleLogout}>Log out</button>
      </div>
  
      <h2>Search Media</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <div>
        <label>License:</label>
        <select value={license} onChange={(e) => setLicense(e.target.value)}>
          <option value="">All</option>
          <option value="cc0">CC0</option>
          <option value="by">BY</option>
          <option value="by-sa">BY-SA</option>
        </select>
  
        <label>Source:</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All</option>
          <option value="flickr">Flickr</option>
          <option value="wikimedia">Wikimedia</option>
        </select>
  
        <label>Extension:</label>
        <select value={extension} onChange={(e) => setExtension(e.target.value)}>
          <option value="">All</option>
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
        </select>
      </div>
      <button onClick={handleSearch}>Search</button>
  
      <div className="search-history">
        <h3>Search History</h3>
        {history.map((item, index) => (
          <div key={item.id} className="history-item">
            <span>{item.query}</span>
            <button onClick={() => handleDelete(item.id)}>❌</button>
          </div>
        ))}
      </div>
  
      <div style={{ marginTop: '2rem' }}>
        {results.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.title}
            width={200}
            style={{ margin: '1rem' }}
          />
        ))}
      </div>
    </div>
  );  
}
