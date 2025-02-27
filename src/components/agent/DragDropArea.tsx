import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';

interface DragDropAreaProps {
  onFilesDrop: (files: File[]) => void;
  isDisabled?: boolean;
  children: React.ReactNode;
}

export function DragDropArea({ onFilesDrop, isDisabled = false, children }: DragDropAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (isDisabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onFilesDrop(files);
      e.dataTransfer.clearData();
    }
  };

  // Prevent the browser from opening dropped files
  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventDefaults, false);
    window.addEventListener('drop', preventDefaults, false);

    return () => {
      window.removeEventListener('dragover', preventDefaults, false);
      window.removeEventListener('drop', preventDefaults, false);
    };
  }, []);

  return (
    <div
      ref={dropAreaRef}
      className="relative w-full h-full"
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {children}
      
      <AnimatePresence>
        {isDragging && !isDisabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/40 rounded-lg flex items-center justify-center z-10"
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-primary" />
              <p className="font-medium">Suelta los archivos aquí</p>
              <p className="text-sm text-muted-foreground">Imágenes, videos y archivos de código</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}