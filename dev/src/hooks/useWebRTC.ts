import { useEffect, useRef, useState } from 'react';
import { WebRTCClient } from '../services/WebRTCClient';
import type { ConnectionState } from '../types/webrtc';

/**
 * Custom hook for managing WebRTC connection
 */
export function useWebRTC(signalingUrl?: string) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isSignalingConnected, setIsSignalingConnected] = useState(false);
  
  const clientRef = useRef<WebRTCClient | null>(null);

  useEffect(() => {
    // Initialize WebRTC client
    clientRef.current = new WebRTCClient({
      signalingUrl: signalingUrl,
    });
    
    // Set up event handlers
    clientRef.current.on({
      onStateChange: setConnectionState,
      onRemoteStream: setRemoteStream,
      onError: setError,
      onSignalingConnected: () => setIsSignalingConnected(true),
      onSignalingDisconnected: () => setIsSignalingConnected(false),
    });

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.close();
        clientRef.current = null;
      }
    };
  }, [signalingUrl]);

  const setSignalingUrl = (url: string) => {
    if (clientRef.current) {
      clientRef.current.setSignalingUrl(url);
    }
  };

  const initialize = async () => {
    if (clientRef.current) {
      await clientRef.current.initialize();
    }
  };

  const startLocalStream = async (constraints?: MediaStreamConstraints) => {
    if (clientRef.current) {
      try {
        const stream = await clientRef.current.startLocalStream(constraints);
        setLocalStream(stream);
        
        // Monitor stream for track ended events
        stream.getTracks().forEach(track => {
          track.addEventListener('ended', () => {
            console.log('Track ended:', track.kind);
            // Reset local stream when any track has ended
            const allTracksEnded = stream.getTracks().every(t => t.readyState === 'ended');
            const anyTrackEnded = stream.getTracks().some(t => t.readyState === 'ended');
            
            if (allTracksEnded || anyTrackEnded) {
              console.log('Resetting local stream due to track ending');
              setLocalStream(null);
              // Stop all remaining tracks
              stream.getTracks().forEach(t => {
                if (t.readyState === 'live') {
                  t.stop();
                }
              });
            }
          });
        });
        
        return stream;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    }
  };

  const createOffer = async () => {
    if (clientRef.current) {
      return await clientRef.current.createOffer();
    }
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    if (clientRef.current) {
      return await clientRef.current.createAnswer(offer);
    }
  };

  const setRemoteAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (clientRef.current) {
      await clientRef.current.setRemoteAnswer(answer);
    }
  };

  const addIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (clientRef.current) {
      await clientRef.current.addIceCandidate(candidate);
    }
  };

  const close = () => {
    if (clientRef.current) {
      clientRef.current.close();
      setLocalStream(null);
      setRemoteStream(null);
      setError(null);
      setIsSignalingConnected(false);
    }
  };

  return {
    connectionState,
    localStream,
    remoteStream,
    error,
    isSignalingConnected,
    setSignalingUrl,
    initialize,
    startLocalStream,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    addIceCandidate,
    close,
  };
}
