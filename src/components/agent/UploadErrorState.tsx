// components/agent/UploadErrorState.tsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface UploadErrorStateProps {
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const UploadErrorState: React.FC<UploadErrorStateProps> = ({ 
  isError, 
  errorMessage,
  onRetry,
  onDismiss
}) => {
  if (!isError) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4"
    >
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="mb-2">Error al subir archivos</AlertTitle>
          <AlertDescription>
            {errorMessage || "Ocurrió un error al subir los archivos. Por favor intenta nuevamente."}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onDismiss}>
            Cerrar
          </Button>
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};