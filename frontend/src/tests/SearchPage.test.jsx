import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from "../pages/SearchPage.jsx";



beforeEach(() => {
  localStorage.setItem('token', 'fake-token');
});

global.fetch = vi.fn((url, options) => {
  if (url.includes('/search-history') && (!options || options.method === 'GET')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, query: 'cat' }])
    });
  }

  if (url.includes('/search-history') && options.method === 'POST') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Search saved successfully' })
    });
  }

  if (url.includes('/search-history') && options.method === 'DELETE') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Search history deleted' })
    });
  }

  if (url.includes('openverse') || url.includes('/search?q=')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              id: '1',
              title: 'Test Image',
              thumbnail: 'https://example.com/test.jpg'
            }
          ]
        })
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  });
});

describe('SearchPage', () => {
  test('renders input and button', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('allows user to search and displays image', async () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
  
    const input = screen.getByPlaceholderText(/search/i);
    const button = screen.getByRole('button', { name: /search/i });
  
    fireEvent.change(input, { target: { value: 'dog' } });
  
    await act(async () => {
      fireEvent.click(button);
    });
  
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /test image/i })).toBeInTheDocument();
    });
  });
});
