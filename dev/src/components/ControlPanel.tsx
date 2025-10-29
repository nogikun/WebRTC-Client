import React from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

export interface ControlPanelProps {
  onStartCall?: () => void;
  onEndCall?: () => void;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  isCallActive?: boolean;
  isMuted?: boolean;
  isVideoEnabled?: boolean;
  disabled?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  isCallActive = false,
  isMuted = false,
  isVideoEnabled = true,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 p-3 bg-card rounded-lg shadow border border-border">
      {!isCallActive ? (
        <Button
          onClick={onStartCall}
          disabled={disabled}
          size="lg"
          className="gap-2 px-6"
        >
          <Phone className="h-4 w-4" />
          通話を開始
        </Button>
      ) : (
        <>
          <Button
            variant={isMuted ? 'destructive' : 'secondary'}
            onClick={onToggleMute}
            disabled={disabled}
            size="icon"
            className="h-10 w-10"
            title={isMuted ? 'ミュート解除' : 'ミュート'}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={!isVideoEnabled ? 'destructive' : 'secondary'}
            onClick={onToggleVideo}
            disabled={disabled}
            size="icon"
            className="h-10 w-10"
            title={isVideoEnabled ? 'ビデオOFF' : 'ビデオON'}
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="destructive"
            onClick={onEndCall}
            disabled={disabled}
            size="lg"
            className="gap-2 px-6"
          >
            <PhoneOff className="h-4 w-4" />
            通話を終了
          </Button>
        </>
      )}
    </div>
  );
};
