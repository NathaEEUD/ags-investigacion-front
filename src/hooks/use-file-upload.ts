// hooks/useFileUploads.ts
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { uploadFiles } from '@/lib/file-upload';
import { processFiles, generateMarkdownWithUrl } from '@/lib/proccessingFiles';

type UseFileUploadsProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isGenerationComplete: boolean;
  markdown: string;
  setMarkdown: (value: string) => void;
  streamingContent: string;
  setStreamingContent: (value: string) => void;
};

export function useFileUploads({
  textareaRef,
  isGenerationComplete,
  markdown,
  setMarkdown,
  streamingContent,
  setStreamingContent
}: UseFileUploadsProps) {
  // States for file upload handling
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(0);
  const [isUploadError, setIsUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [pendingRetryFiles, setPendingRetryFiles] = useState<File[]>([]);

  // Helper function to insert text at cursor position
  const insertAtCursor = (text: string, insertion: string, textarea: HTMLTextAreaElement): string => {
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    return text.substring(0, startPos) + insertion + text.substring(endPos, text.length);
  };

  // Insert markdown at the cursor position
  const handleInsertMarkdown = (markdownText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const newText = isGenerationComplete
      ? insertAtCursor(streamingContent, markdownText, textarea)
      : insertAtCursor(markdown, markdownText, textarea);

    if (isGenerationComplete) {
      setStreamingContent(newText);
    } else {
      setMarkdown(newText);
    }
  };

  // Handle file uploads
  const handleFilesDrop = async (files: File[]) => {
    if (files.length === 0) return;
    
    try {
      // Reset error state
      setIsUploadError(false);
      setUploadErrorMessage("");
      
      // Set uploading state
      setIsUploading(true);
      setUploadingFiles(files.length);
      toast.info(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`);
      
      // Process the files
      const processedFiles = processFiles(files);
      
      // Upload the files
      const uploadResult = await uploadFiles(files);
      
      if (uploadResult.success) {
        // Associate upload URLs with processed files
        let allMarkdown = '';
        processedFiles.forEach((file, index) => {
          if (index < uploadResult.fileUrls.length) {
            // Generate markdown with real URLs
            const fileUrl = uploadResult.fileUrls[index];
            allMarkdown += generateMarkdownWithUrl(file, fileUrl);
          }
        });
        
        // Insert markdown at cursor position
        handleInsertMarkdown(allMarkdown);
        
        // Show success toast
        toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded and inserted`);
        
        // Check for partial failures
        if (uploadResult.errors.length > 0) {
          setUploadErrorMessage(`${uploadResult.errors.length} file${uploadResult.errors.length > 1 ? 's' : ''} failed to upload. You can retry the upload.`);
          setIsUploadError(true);
          // Store files for retry
          const failedFileIndices = uploadResult.errors.map((_, index) => index);
          const failedFiles = files.filter((_, index) => failedFileIndices.includes(index));
          setPendingRetryFiles(failedFiles);
        }
      } else {
        // All files failed
        setUploadErrorMessage("Failed to upload files. Please check your connection and try again.");
        setIsUploadError(true);
        setPendingRetryFiles(files);
      }
    } catch (error: any) {
      console.error('Error handling file drop:', error);
      setUploadErrorMessage(error.message || "An unexpected error occurred during upload");
      setIsUploadError(true);
      setPendingRetryFiles(files);
    } finally {
      setIsUploading(false);
      setUploadingFiles(0);
    }
  };

  // Retry failed uploads
  const handleRetryUpload = () => {
    if (pendingRetryFiles.length > 0) {
      // Reset error state
      setIsUploadError(false);
      setUploadErrorMessage("");
      
      // Retry with the pending files
      handleFilesDrop(pendingRetryFiles);
    }
  };

  // Dismiss error state
  const handleDismissError = () => {
    setIsUploadError(false);
    setUploadErrorMessage("");
    setPendingRetryFiles([]);
  };

  // Use same function for file selection
  const handleFileSelect = async (files: File[]) => {
    await handleFilesDrop(files);
  };

  return {
    // States
    isUploading,
    uploadingFiles,
    isUploadError,
    uploadErrorMessage,
    
    // Handlers
    handleFilesDrop,
    handleFileSelect,
    handleInsertMarkdown,
    handleRetryUpload,
    handleDismissError
  };
}