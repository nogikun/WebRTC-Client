import { useState } from 'react';
import { useWebRTC } from './hooks/useWebRTC';
import { VideoPlayer } from './components/VideoPlayer';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ControlPanel } from './components/ControlPanel';
import { ServerUrlInput } from './components/ServerUrlInput';
import { Card } from './components/ui/card';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [signalingUrl, setSignalingUrl] = useState<string>('');
  const {
    connectionState,
    localStream,
    remoteStream,
    error,
    isSignalingConnected,
    setSignalingUrl: updateSignalingUrl,
    initialize,
    startLocalStream,
    close,
  } = useWebRTC(signalingUrl);

  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const handleServerConnect = (url: string) => {
    setSignalingUrl(url);
    updateSignalingUrl(url);
    console.log('Signaling URL set to:', url);
  };

  const handleStartCall = async () => {
    try {
      await initialize();
      await startLocalStream();
      setIsCallActive(true);
    } catch (err) {
      console.error('Failed to start call:', err);
    }
  };

  const handleEndCall = () => {
    close();
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoEnabled(true);
  };

  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              WebRTC Client
            </h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <ConnectionStatus state={connectionState} />
              {isSignalingConnected && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span>
                  </span>
                  シグナリングサーバー接続済み
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        {error && (
          <Card className="mb-4 border-destructive bg-card">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <h3 className="font-semibold text-destructive">エラーが発生しました</h3>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!isCallActive && (
          <div className="mb-4">
            <ServerUrlInput
              onConnect={handleServerConnect}
              disabled={isCallActive}
              defaultUrl="wss://localhost:8000/webrtc"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <VideoPlayer
            stream={localStream}
            muted={true}
            label="Local Video"
          />
          <VideoPlayer
            stream={remoteStream}
            muted={false}
            label="Remote Video"
          />
        </div>

        <div className="flex justify-center">
          <ControlPanel
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            isCallActive={isCallActive}
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
          />
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-4">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, and WebRTC API
            </p>
            {signalingUrl && (
              <p className="text-xs text-muted-foreground font-mono">
                接続先: {signalingUrl}
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
