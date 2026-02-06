// WebSocket hook for real-time updates

import { useState, useEffect, useCallback, useRef } from 'react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

interface UseWebSocketOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = import.meta.env.VITE_WS_URL || `ws://${window.location.host}`,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      setStatus('connecting');
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setStatus('connected');
        setReconnectAttempts(0);
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch {
          // Handle non-JSON messages
          setLastMessage({
            type: 'raw',
            data: event.data,
            timestamp: Date.now(),
          });
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        onDisconnect?.();
        
        // Attempt reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        setStatus('error');
        onError?.(error);
      };

      wsRef.current = ws;
    } catch (error) {
      setStatus('error');
      console.error('WebSocket connection error:', error);
    }
  }, [url, reconnectInterval, maxReconnectAttempts, reconnectAttempts, onConnect, onDisconnect, onError, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  const subscribe = useCallback((channel: string) => {
    return send({ type: 'subscribe', channel });
  }, [send]);

  const unsubscribe = useCallback((channel: string) => {
    return send({ type: 'unsubscribe', channel });
  }, [send]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    lastMessage,
    reconnectAttempts,
    isConnected: status === 'connected',
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
  };
}

// Specialized hook for tranche price updates
export function useTranchePriceStream() {
  const [prices, setPrices] = useState<Record<string, {
    price: number;
    change24h: string;
    volume24h: number;
    apy: string;
    timestamp: number;
  }>>({});

  const ws = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'tranche-price') {
        const data = message.data as {
          tranche: string;
          price: number;
          change24h: string;
          volume24h: number;
          apy: string;
        };
        setPrices(prev => ({
          ...prev,
          [data.tranche]: {
            ...data,
            timestamp: message.timestamp,
          },
        }));
      } else if (message.type === 'market-snapshot') {
        const data = message.data as {
          prices: Record<string, unknown>;
        };
        if (data.prices) {
          setPrices(prev => ({ ...prev, ...data.prices as typeof prices }));
        }
      }
    },
    onConnect: () => {
      ws.subscribe('tranche-prices');
    },
  });

  useEffect(() => {
    ws.connect();
    return () => ws.disconnect();
  }, []);

  return {
    prices,
    isConnected: ws.isConnected,
    status: ws.status,
  };
}

// Specialized hook for HSM status updates
export function useHSMStatusStream() {
  const [hsmStatus, setHsmStatus] = useState<{
    healthy: boolean;
    rotationDaysRemaining: number;
    keysActive: number;
    mrenclave?: string;
    timestamp: number;
  } | null>(null);

  const ws = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'hsm-update' || message.type === 'hsm-snapshot') {
        const data = message.data as typeof hsmStatus;
        setHsmStatus({
          ...data!,
          timestamp: message.timestamp,
        });
      }
    },
    onConnect: () => {
      ws.subscribe('hsm-status');
    },
  });

  useEffect(() => {
    ws.connect();
    return () => ws.disconnect();
  }, []);

  return {
    hsmStatus,
    isConnected: ws.isConnected,
    status: ws.status,
  };
}

// Specialized hook for alerts
export function useAlertsStream() {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    timestamp: number;
  }>>([]);

  const ws = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'new-alert') {
        const alert = message.data as typeof alerts[0];
        setAlerts(prev => [alert, ...prev].slice(0, 50));
      } else if (message.type === 'alerts-snapshot') {
        const data = message.data as typeof alerts;
        setAlerts(data);
      }
    },
    onConnect: () => {
      ws.subscribe('alerts');
    },
  });

  useEffect(() => {
    ws.connect();
    return () => ws.disconnect();
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    clearAlerts,
    isConnected: ws.isConnected,
    status: ws.status,
  };
}
