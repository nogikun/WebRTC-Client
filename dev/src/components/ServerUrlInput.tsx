import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Server } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUrl } from '../redux/slices/urlSlice';

export interface ServerUrlInputProps {
  onConnect: (url: string) => void;
  disabled?: boolean;
  defaultUrl?: string;
}

export const ServerUrlInput: React.FC<ServerUrlInputProps> = ({
  onConnect,
  disabled = false,
  defaultUrl = 'wss://localhost:8000/webrtc',
}) => {
  const dispatch = useAppDispatch();
  const savedUrl = useAppSelector((state) => state.url.url);

  const parseUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return {
        protocol: (parsedUrl.protocol.replace(':', '') + '://') as 'wss://' | 'ws://',
        host: parsedUrl.host,
        path: parsedUrl.pathname,
      };
    } catch {
      return {
        protocol: 'wss://' as const,
        host: 'localhost:8000',
        path: '/webrtc',
      };
    }
  };

  // 保存されたURLがあればそれを使用、なければdefaultUrl
  const initialUrl = savedUrl || defaultUrl;
  const parsed = parseUrl(initialUrl);
  
  const [protocol, setProtocol] = useState<'wss://' | 'ws://'>(parsed.protocol);
  const [host, setHost] = useState(parsed.host);
  const [path, setPath] = useState(parsed.path);

  // URLが変更されたらReduxに保存
  useEffect(() => {
    const fullUrl = `${protocol}${host}${path}`;
    dispatch(setUrl(fullUrl));
  }, [protocol, host, path, dispatch]);

  const handleConnect = () => {
    const fullUrl = `${protocol}${host}${path}`;
    dispatch(setUrl(fullUrl));
    onConnect(fullUrl);
  };

  const handleProtocolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProtocol(e.target.value as 'wss://' | 'ws://');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Server className="h-5 w-5" />
          シグナリングサーバー設定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            接続先サーバー
          </label>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={protocol}
              onChange={handleProtocolChange}
              disabled={disabled}
              className="w-24 flex-shrink-0 sm:w-24 max-sm:w-full max-sm:flex-1"
            >
              <option value="wss://">wss://</option>
              <option value="ws://">ws://</option>
            </Select>

            <Input
              type="text"
              placeholder="localhost:8000"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              disabled={disabled}
              className="flex-1 min-w-[180px] max-w-full max-sm:min-w-full max-sm:w-full"
            />

            <Input
              type="text"
              placeholder="/webrtc"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              disabled={disabled}
              className="w-32 min-w-[100px] flex-shrink-0 max-sm:w-full max-sm:flex-1 max-sm:min-w-full"
            />
          </div>
        </div>

        <div className="bg-muted rounded-md p-2 border border-border">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">接続先URL:</span>
            <code className="text-foreground font-mono text-xs">
              {protocol}{host}{path}
            </code>
          </div>
        </div>

        <Button
          onClick={handleConnect}
          disabled={disabled}
          className="w-full"
          size="default"
        >
          <Server className="mr-2 h-4 w-4" />
          接続
        </Button>
      </CardContent>
    </Card>
  );
};
