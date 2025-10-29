# WebRTC Client

A modern WebRTC client application built with React, TypeScript, and Storybook.

## Features

- 📹 Real-time video and audio communication using WebRTC
- 🎨 Component-driven development with Storybook
- 💪 Type-safe with TypeScript
- ⚡ Fast development with Vite
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Start Storybook:

```bash
npm run storybook
```

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Build Storybook:

```bash
npm run build-storybook
```

## Project Structure

```
src/
├── components/        # React components
│   ├── VideoPlayer.tsx
│   ├── ConnectionStatus.tsx
│   └── ControlPanel.tsx
├── hooks/            # Custom React hooks
│   └── useWebRTC.ts
├── services/         # Business logic
│   └── WebRTCClient.ts
├── types/            # TypeScript type definitions
│   └── webrtc.ts
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Components

### VideoPlayer
Displays video streams from MediaStream objects.

### ConnectionStatus
Shows the current WebRTC connection state with visual indicators.

### ControlPanel
Provides controls for starting/ending calls, muting audio, and toggling video.

## Services

### WebRTCClient
A service class that manages WebRTC peer connections, handles signaling, and manages media streams.

## Hooks

### useWebRTC
A custom React hook that provides a convenient interface for managing WebRTC connections in React components.

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Storybook 8** - Component development environment
- **WebRTC API** - Real-time communication

## License

ISC
