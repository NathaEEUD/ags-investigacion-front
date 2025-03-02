import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Code, 
  File as FileIcon, 
  Loader2
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { cleanupPreviews, FileWithPreview, generateMarkdown, processFiles } from '@/lib/proccessingFiles';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';



interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isUploading?: boolean;
  iconOnly?: boolean;
}

export function FileUpload({ 
  onFileSelect,
  isUploading = false,
  iconOnly = false 
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      cleanupPreviews(selectedFiles);
    };
  }, [selectedFiles]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = processFiles(files);
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setIsOpen(true);
    }
    
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles(files => {
      const removedFile = files.find(f => f.id === id);
      if (removedFile?.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }
      return files.filter(file => file.id !== id);
    });
  };

  const getFileIcon = (fileType: 'image' | 'video' | 'code' | 'other') => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleInsert = () => {
    // Pass the files to the parent component for handling
    onFileSelect(selectedFiles.map(f => f.file));
    
    // Close dialog and clear selection
    setIsOpen(false);
    setSelectedFiles([]);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,video/*,.js,.jsx,.ts,.tsx,.py,.java,.html,.css,.json,.md"
      />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            onClick={handleButtonClick} 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Insert image"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Selected Files</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No files selected
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {selectedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-3 p-3 rounded-md border group hover:bg-accent/50"
                    >
                      <div className="flex-shrink-0">
                        {file.type === 'image' && file.previewUrl ? (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                            <Image
                              src={file.previewUrl}
                              alt={file.file.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10">
                            {getFileIcon(file.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-50 group-hover:opacity-100"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={handleButtonClick}
            >
              Select more files
            </Button>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInsert} 
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Insert into editor'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}