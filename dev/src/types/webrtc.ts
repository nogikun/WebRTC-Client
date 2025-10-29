/**
 * WebRTC Connection State
 */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';

/**
 * WebRTC Connection Configuration
 */
export interface WebRTCConfig {
  iceServers?: RTCIceServer[];
  signalingUrl?: string;
}

/**
 * Signaling Message Types
 */
export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave';
  data?: RTCSessionDescriptionInit | RTCIceCandidateInit | any;
}

/**
 * WebRTC Client Events
 */
export interface WebRTCEvents {
  onStateChange: (state: ConnectionState) => void;
  onRemoteStream: (stream: MediaStream) => void;
  onError: (error: Error) => void;
  onSignalingConnected?: () => void;
  onSignalingDisconnected?: () => void;
}
