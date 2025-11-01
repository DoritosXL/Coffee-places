import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  const availableCities = ['Amsterdam', 'Rotterdam', 'Utrecht'];
  const availableTags = ['wifi', 'outdoor seating'];

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders search input with placeholder', () => {
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search by city or wifi/i);
    expect(input).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it('shows city autocomplete suggestion when typing', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search by city or wifi/i);
    await user.type(input, 'am');

    // Check if Amsterdam suggestion appears
    expect(screen.getByText(/Amsterdam/i)).toBeInTheDocument();
  });

  it('shows tag autocomplete suggestion when typing', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search by city or wifi/i);
    await user.type(input, 'wi');

    // Check if wifi suggestion appears
    expect(screen.getByText(/wifi/i)).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search by city or wifi/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Amsterdam');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Amsterdam', 'city');
  });

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search by city or wifi/i);
    await user.type(input, 'wifi{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('wifi', 'tag');
  });

  it('autocompletes on Tab key press', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search by city or wifi/i) as HTMLInputElement;
    await user.type(input, 'am');

    // Press Tab to autocomplete
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });

    expect(input.value).toBe('Amsterdam');
  });

  it('does not call onSearch with empty input', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
      />
    );

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('uses custom placeholder when provided', () => {
    render(
      <SearchBar
        availableCities={availableCities}
        availableTags={availableTags}
        onSearch={mockOnSearch}
        placeholder="Custom placeholder"
      />
    );

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });
});
