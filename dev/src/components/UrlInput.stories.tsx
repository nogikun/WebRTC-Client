import type { Meta, StoryObj } from '@storybook/react';
import { UrlInput } from './UrlInput';

const meta = {
  title: 'Components/UrlInput',
  component: UrlInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UrlInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
