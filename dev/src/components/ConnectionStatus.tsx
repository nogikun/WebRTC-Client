import React from 'react';
import type { ConnectionState } from '../types/webrtc';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export interface ConnectionStatusProps {
  state: ConnectionState;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ state }) => {
  const getStatusConfig = () => {
    switch (state) {
      case 'connected':
        return {
          variant: 'default' as const,
          text: 'Connected',
          color: 'bg-foreground',
          className: 'bg-foreground text-background'
        };
      case 'connecting':
        return {
          variant: 'secondary' as const,
          text: 'Connecting...',
          color: 'bg-muted-foreground',
          className: 'bg-muted text-muted-foreground'
        };
      case 'failed':
        return {
          variant: 'destructive' as const,
          text: 'Failed',
          color: 'bg-destructive',
          className: 'bg-destructive text-destructive-foreground'
        };
      case 'disconnected':
      default:
        return {
          variant: 'outline' as const,
          text: 'Disconnected',
          color: 'bg-muted-foreground',
          className: 'border-border text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge className={cn("flex items-center gap-2 px-2 py-1 text-xs", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
      <span>{config.text}</span>
    </Badge>
  );
};
