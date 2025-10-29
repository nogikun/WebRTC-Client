import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from './VideoPlayer';

const meta = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoStream: Story = {
  args: {
    stream: null,
    label: 'Local Video',
  },
};

export const WithLabel: Story = {
  args: {
    stream: null,
    label: 'Remote Video',
    muted: false,
  },
};

export const Muted: Story = {
  args: {
    stream: null,
    label: 'Muted Video',
    muted: true,
  },
};
