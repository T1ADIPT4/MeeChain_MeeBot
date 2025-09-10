
import { useState, useEffect } from 'react';

export interface SecretsStatus {
  ok: boolean;
  missing: string[];
  warnings: string[];
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

export function useSecretsStatus() {
  const [secretsStatus, setSecretsStatus] = useState<SecretsStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSecrets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/secrets/health');
      const result = await response.json();
      
      if (result.success) {
        setSecretsStatus(result.data);
      } else {
        setError('Failed to check secrets status');
      }
    } catch (err) {
      setError('Network error while checking secrets');
      console.error('Secrets check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSecrets();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(checkSecrets, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    secretsStatus,
    isLoading,
    error,
    refetch: checkSecrets
  };
}
