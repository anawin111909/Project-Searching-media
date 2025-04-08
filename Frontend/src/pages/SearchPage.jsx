import React, { useEffect, useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');


  
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/search-history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to fetch');
      }

      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch(`http://localhost:8000/openverse?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setImages(data.results || []);
    } catch (err) {
      console.error('Openverse error:', err);
      setError('Failed to load images');
    }
  };
  

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Search failed');
      }

      await fetchHistory();      
      await fetchImages(query);  
      setQuery('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/search-history/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to delete');
      }

      fetchHistory();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: '#ff5252',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Search History</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a query"
          required
          style={{
            padding: '0.5rem',
            width: '70%',
            marginRight: '0.5rem',
            borderRadius: '4px',
            border: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            background: '#00bcd4',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map((item) => (
          <li
            key={item.id}
            style={{
              background: '#333',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{item.query}</span>
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                background: '#e53935',
                border: 'none',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '2rem' }}>Results from Openverse</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {images.map((img) => (
          <div key={img.id} style={{ background: '#222', padding: '0.5rem', borderRadius: '6px' }}>
            <img src={img.thumbnail} alt={img.title} style={{ width: '100%', borderRadius: '4px' }} />
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{img.title || 'Untitled'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
