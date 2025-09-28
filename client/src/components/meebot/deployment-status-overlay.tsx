
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  Wifi,
  WifiOff 
} from 'lucide-react';
import { 
  isFallbackEnabled, 
  isFallbackRequired,
  isDeploymentSuccessful,
  getNetwork,
  getEnvironment,
  getVersion,
  validateDeployment,
  getFallbackConfig 
} from '@/services/deploy-registry';

export function DeploymentStatusOverlay() {
  const validation = validateDeployment();
  const fallbackConfig = getFallbackConfig();
  const network = getNetwork();
  const environment = getEnvironment();
  const version = getVersion();
  
  // Don't show overlay if everything is fine
  if (validation.isValid && !isFallbackRequired()) {
    return null;
  }

  const getStatusColor = () => {
    if (!validation.isValid) return 'destructive';
    if (isFallbackRequired()) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!validation.isValid) return <WifiOff className="w-4 h-4" />;
    if (isFallbackRequired()) return <Wifi className="w-4 h-4 animate-pulse" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusMessage = () => {
    if (!validation.isValid) {
      return "Contract deployment issues detected";
    }
    if (isFallbackRequired()) {
      return "Using fallback network configuration";
    }
    return "All systems operational";
  };

  const getMeeBotEmotion = () => {
    if (!validation.isValid) return '😰';
    if (isFallbackRequired()) return '😅';
    return '😊';
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className={`border-2 ${
        !validation.isValid ? 'border-red-500/50 bg-red-500/10' :
        isFallbackRequired() ? 'border-yellow-500/50 bg-yellow-500/10' :
        'border-green-500/50 bg-green-500/10'
      }`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span>{getMeeBotEmotion()} MeeBot Status</span>
            <Badge variant={getStatusColor()} className="ml-auto">
              {environment}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="font-medium text-white">{getStatusMessage()}</p>
            <p className="text-gray-400 text-xs mt-1">
              Network: {network} • Version: {version}
            </p>
          </div>

          {/* Validation Errors */}
          {validation.errors.length > 0 && (
            <Alert variant="destructive" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm">Deployment Issues</AlertTitle>
              <AlertDescription className="text-xs">
                <ul className="list-disc pl-4 mt-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Warnings */}
          {validation.warnings.length > 0 && (
            <Alert className="py-2 border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertTitle className="text-sm text-yellow-200">Warnings</AlertTitle>
              <AlertDescription className="text-xs text-yellow-100">
                <ul className="list-disc pl-4 mt-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Fallback Status */}
          {isFallbackRequired() && (
            <Alert className="py-2 border-blue-500/50 bg-blue-500/10">
              <Wifi className="h-4 w-4 text-blue-400" />
              <AlertTitle className="text-sm text-blue-200">Fallback Active</AlertTitle>
              <AlertDescription className="text-xs text-blue-100">
                Connected to: {fallbackConfig.network}
                <br />
                Some features may be limited.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
            
            {(isFallbackRequired() || !validation.isValid) && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs"
                onClick={() => {
                  const registryUrl = '/api/registry-status';
                  window.open(registryUrl, '_blank');
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Debug
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
