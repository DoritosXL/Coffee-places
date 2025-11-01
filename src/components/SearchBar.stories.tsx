import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';

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
    availableCities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven'],
    availableTags: ['wifi', 'outdoor seating', 'pet friendly'],
  },
};

export const WithCityAutocomplete: Story = {
  args: {
    availableCities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven'],
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
    availableCities: ['Amsterdam', 'Rotterdam'],
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
    availableCities: ['Paris', 'London', 'Berlin'],
    availableTags: ['wifi'],
    placeholder: 'Find your perfect coffee spot...',
  },
};
