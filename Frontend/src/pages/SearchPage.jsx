import React, { useState, useEffect } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [license, setLicense] = useState('');
  const [source, setSource] = useState('');
  const [extension, setExtension] = useState('');
  const [history, setHistory] = useState([]); 

  const handleSearch = async () => {
    let url = `http://localhost:8000/openverse?query=${query}`;
    if (license) url += `&license=${license}`;
    if (source) url += `&source=${source}`;
    if (extension) url += `&extension=${extension}`;
  
    const token = localStorage.getItem('token');  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
    const res = await fetch('http://localhost:8000/search/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setHistory(data); 
  };

  useEffect(() => {
    fetchHistory(); 
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Search Media</h2>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <div style={{ marginTop: '1rem' }}>
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
      <button onClick={handleSearch} style={{ marginTop: '1rem' }}>Search</button>

      <div style={{ marginTop: '2rem' }}>
        <h3>Search History</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item.query}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {results.map((img) => (
          <img key={img.id} src={img.url} alt={img.title} width={200} style={{ margin: '1rem' }} />
        ))}
      </div>
    </div>
  );
}
