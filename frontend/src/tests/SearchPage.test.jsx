import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from '../pages/SearchPage';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  // mock token
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

  if (url.includes('openverse')) {
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

  return Promise.reject(new Error('Unhandled fetch'));
});

describe('SearchPage', () => {
  test('renders input and button', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/enter a query/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('allows user to search and displays image', async () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter a query/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'dog' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/test image/i)).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
