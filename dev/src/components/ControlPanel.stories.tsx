import type { Meta, StoryObj } from '@storybook/react';
import { ControlPanel } from './ControlPanel';

const meta = {
  title: 'Components/ControlPanel',
  component: ControlPanel,
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
} satisfies Meta<typeof ControlPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BeforeCall: Story = {
  args: {
    isCallActive: false,
    onStartCall: () => console.log('Start call clicked'),
  },
};

export const DuringCall: Story = {
  args: {
    isCallActive: true,
    isMuted: false,
    isVideoEnabled: true,
    onEndCall: () => console.log('End call clicked'),
    onToggleMute: () => console.log('Toggle mute clicked'),
    onToggleVideo: () => console.log('Toggle video clicked'),
  },
};

export const DuringCallMuted: Story = {
  args: {
    isCallActive: true,
    isMuted: true,
    isVideoEnabled: true,
    onEndCall: () => console.log('End call clicked'),
    onToggleMute: () => console.log('Toggle mute clicked'),
    onToggleVideo: () => console.log('Toggle video clicked'),
  },
  name: 'During Call (Muted)',
};

export const DuringCallVideoOff: Story = {
  args: {
    isCallActive: true,
    isMuted: false,
    isVideoEnabled: false,
    onEndCall: () => console.log('End call clicked'),
    onToggleMute: () => console.log('Toggle mute clicked'),
    onToggleVideo: () => console.log('Toggle video clicked'),
  },
  name: 'During Call (Video Off)',
};

export const AllDisabled: Story = {
  args: {
    isCallActive: true,
    isMuted: true,
    isVideoEnabled: false,
    onEndCall: () => console.log('End call clicked'),
    onToggleMute: () => console.log('Toggle mute clicked'),
    onToggleVideo: () => console.log('Toggle video clicked'),
  },
  name: 'All Disabled (Muted + Video Off)',
};

export const Disabled: Story = {
  args: {
    isCallActive: false,
    disabled: true,
  },
};
