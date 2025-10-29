import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Video as VideoIcon } from 'lucide-react';

export interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  label?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  stream, 
  muted = false,
  label 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream && stream.active) {
        videoRef.current.srcObject = stream;
      } else {
        videoRef.current.srcObject = null;
        // Reset video element to clear any displayed frame
        videoRef.current.load();
      }
    }
  }, [stream]);

  return (
    <Card className="overflow-hidden shadow border">
      <CardContent className="p-0 relative bg-black">
        {label && (
          <Badge className="absolute top-2 left-2 z-10 bg-black/60 text-white border-white/20 text-xs">
            {label}
          </Badge>
        )}
        <div className="aspect-video relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full object-cover"
          />
          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
              <VideoIcon className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">ビデオストリームなし</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
