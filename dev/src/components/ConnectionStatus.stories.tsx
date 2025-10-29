import type { Meta, StoryObj } from '@storybook/react';
import { ConnectionStatus } from './ConnectionStatus';

const meta = {
  title: 'Components/ConnectionStatus',
  component: ConnectionStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4 bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {
  args: {
    state: 'disconnected',
  },
};

export const Connecting: Story = {
  args: {
    state: 'connecting',
  },
};

export const Connected: Story = {
  args: {
    state: 'connected',
  },
};

export const Failed: Story = {
  args: {
    state: 'failed',
  },
};
