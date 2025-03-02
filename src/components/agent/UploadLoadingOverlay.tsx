// components/agent/UploadLoadingOverlay.tsx
import React from 'react';
import { Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadLoadingOverlayProps {
  isUploading: boolean;
  filesCount?: number;
}

export const UploadLoadingOverlay: React.FC<UploadLoadingOverlayProps> = ({ 
  isUploading, 
  filesCount = 0 
}) => {
  if (!isUploading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
    >
      <div className="bg-card p-6 rounded-lg shadow-lg border flex flex-col items-center gap-4 max-w-sm">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <Upload className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-1">Uploading files...</h3>
          <p className="text-muted-foreground">
            {filesCount > 0 ? `${filesCount} file${filesCount > 1 ? 's' : ''}` : 'Processing your files'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};