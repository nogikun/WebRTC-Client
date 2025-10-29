import type { ConnectionState, WebRTCConfig, WebRTCEvents, SignalingMessage } from '../types/webrtc';

/**
 * WebRTC Client Service with Signaling
 * Manages peer-to-peer connections using WebRTC API and WebSocket signaling
 */
export class WebRTCClient {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private events: Partial<WebRTCEvents> = {};
  private websocket: WebSocket | null = null;
  private signalingUrl: string;

  constructor(private config: WebRTCConfig = {}) {
    this.config = {
      iceServers: config.iceServers || [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
      signalingUrl: config.signalingUrl || '',
    };
    this.signalingUrl = this.config.signalingUrl || '';
  }

  /**
   * Set event handlers
   */
  public on(events: Partial<WebRTCEvents>): void {
    this.events = { ...this.events, ...events };
  }

  /**
   * Set signaling server URL
   */
  public setSignalingUrl(url: string): void {
    this.signalingUrl = url;
  }

  /**
   * Connect to signaling server
   */
  private async connectSignaling(): Promise<void> {
    if (!this.signalingUrl) {
      console.warn('No signaling URL provided');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.websocket = new WebSocket(this.signalingUrl);

        this.websocket.onopen = () => {
          console.log('Signaling server connected');
          this.events.onSignalingConnected?.();
          
          // Send join message
          this.sendSignalingMessage({
            type: 'join',
          });
          
          resolve();
        };

        this.websocket.onmessage = async (event) => {
          try {
            const message: SignalingMessage = JSON.parse(event.data);
            await this.handleSignalingMessage(message);
          } catch (error) {
            console.error('Failed to handle signaling message:', error);
          }
        };

        this.websocket.onerror = (error) => {
          console.error('Signaling error:', error);
          this.handleError(new Error('Signaling connection error'));
          reject(error);
        };

        this.websocket.onclose = () => {
          console.log('Signaling server disconnected');
          this.events.onSignalingDisconnected?.();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle signaling messages
   */
  private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
    console.log('Received signaling message:', message);

    switch (message.type) {
      case 'offer':
        if (message.data && this.peerConnection) {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.data as RTCSessionDescriptionInit)
          );
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          this.sendSignalingMessage({
            type: 'answer',
            data: answer,
          });
        }
        break;

      case 'answer':
        if (message.data && this.peerConnection) {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.data as RTCSessionDescriptionInit)
          );
        }
        break;

      case 'ice-candidate':
        if (message.data && this.peerConnection) {
          await this.peerConnection.addIceCandidate(
            new RTCIceCandidate(message.data as RTCIceCandidateInit)
          );
        }
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  /**
   * Send signaling message
   */
  private sendSignalingMessage(message: SignalingMessage): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    } else {
      console.warn('Signaling not connected');
    }
  }

  /**
   * Initialize peer connection
   */
  public async initialize(): Promise<void> {
    try {
      this.updateConnectionState('connecting');
      
      // Connect to signaling server if URL is provided
      if (this.signalingUrl) {
        await this.connectSignaling();
      }
      
      this.peerConnection = new RTCPeerConnection(this.config);
      
      // Set up event handlers
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          // Send ICE candidate to signaling server
          this.sendSignalingMessage({
            type: 'ice-candidate',
            data: event.candidate.toJSON(),
          });
        }
      };

      this.peerConnection.ontrack = (event) => {
        console.log('Remote track received:', event.streams[0]);
        this.remoteStream = event.streams[0];
        this.events.onRemoteStream?.(this.remoteStream);
      };

      this.peerConnection.onconnectionstatechange = () => {
        const state = this.peerConnection?.connectionState;
        console.log('Connection state changed:', state);
        
        if (state === 'connected') {
          this.updateConnectionState('connected');
        } else if (state === 'failed' || state === 'closed') {
          this.updateConnectionState('failed');
        }
      };

    } catch (error) {
      this.updateConnectionState('failed');
      this.handleError(error as Error);
    }
  }

  /**
   * Get local media stream (camera/microphone)
   */
  public async startLocalStream(constraints: MediaStreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to peer connection
      if (this.peerConnection && this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection!.addTrack(track, this.localStream!);
        });
      }
      
      return this.localStream;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Create an offer for the remote peer
   */
  public async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Create an answer to a received offer
   */
  public async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Set remote description (answer from remote peer)
   */
  public async setRemoteAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Add ICE candidate received from remote peer
   */
  public async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Get local stream
   */
  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Get remote stream
   */
  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  /**
   * Close connection and cleanup
   */
  public close(): void {
    // Send leave message to signaling server
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.sendSignalingMessage({
        type: 'leave',
      });
    }

    // Close WebSocket connection
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.updateConnectionState('disconnected');
  }

  /**
   * Update connection state and notify listeners
   */
  private updateConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.events.onStateChange?.(state);
  }

  /**
   * Handle errors
   */
  private handleError(error: Error): void {
    console.error('WebRTC Error:', error);
    this.events.onError?.(error);
  }
}
