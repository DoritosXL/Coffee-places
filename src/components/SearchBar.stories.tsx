import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';
import type { CityInfo } from '../types/coffeePlace';

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    availableCities: {
      description: 'List of available cities for autocomplete',
    },
    availableTags: {
      description: 'List of available tags for autocomplete',
    },
    onSearch: {
      description: 'Callback function when search is triggered',
    },
    placeholder: {
      description: 'Placeholder text for the search input',
    },
  },
  args: {
    onSearch: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    availableCities: [
      { name: 'amsterdam', displayName: 'Amsterdam', count: 25 },
      { name: 'rotterdam', displayName: 'Rotterdam', count: 15 },
      { name: 'utrecht', displayName: 'Utrecht', count: 10 },
      { name: 'the-hague', displayName: 'The Hague', count: 8 },
      { name: 'eindhoven', displayName: 'Eindhoven', count: 12 },
    ] as CityInfo[],
    availableTags: ['wifi', 'outdoor seating', 'pet friendly'],
  },
};

export const WithCityAutocomplete: Story = {
  args: {
    availableCities: [
      { name: 'amsterdam', displayName: 'Amsterdam', count: 25 },
      { name: 'rotterdam', displayName: 'Rotterdam', count: 15 },
      { name: 'utrecht', displayName: 'Utrecht', count: 10 },
      { name: 'the-hague', displayName: 'The Hague', count: 8 },
      { name: 'eindhoven', displayName: 'Eindhoven', count: 12 },
    ] as CityInfo[],
    availableTags: ['wifi'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Try typing "am" to see Amsterdam autocomplete suggestion',
      },
    },
  },
};

export const WithTagAutocomplete: Story = {
  args: {
    availableCities: [
      { name: 'amsterdam', displayName: 'Amsterdam', count: 25 },
      { name: 'rotterdam', displayName: 'Rotterdam', count: 15 },
    ] as CityInfo[],
    availableTags: ['wifi', 'outdoor seating', 'pet friendly'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Try typing "wi" to see wifi autocomplete suggestion',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    availableCities: [],
    availableTags: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchBar with no autocomplete options available',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    availableCities: [
      { name: 'paris', displayName: 'Paris', count: 30 },
      { name: 'london', displayName: 'London', count: 28 },
      { name: 'berlin', displayName: 'Berlin', count: 20 },
    ] as CityInfo[],
    availableTags: ['wifi'],
    placeholder: 'Find your perfect coffee spot...',
  },
};
