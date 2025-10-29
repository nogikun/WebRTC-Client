import type { Meta, StoryObj } from '@storybook/react';
import { ServerUrlInput } from './ServerUrlInput';

const meta = {
  title: 'Components/ServerUrlInput',
  component: ServerUrlInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ServerUrlInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onConnect: (url) => console.log('Connect to:', url),
    defaultUrl: 'wss://localhost:8000/webrtc',
  },
};

export const CustomDefault: Story = {
  args: {
    onConnect: (url) => console.log('Connect to:', url),
    defaultUrl: 'wss://example.com:3000/ws',
  },
};

export const Disabled: Story = {
  args: {
    onConnect: (url) => console.log('Connect to:', url),
    disabled: true,
  },
};
