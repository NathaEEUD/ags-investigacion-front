// lib/fileUpload.ts
export const uploadFile = async (file: File): Promise<{
    success: boolean;
    fileUrl?: string;
    error?: string;
  }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      const data = await response.json();
      return {
        success: true,
        fileUrl: data.fileUrl
      };
    } catch (error: any) {
      console.error('Error in uploadFile:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred during upload'
      };
    }
  };
  
  // Function to upload multiple files and return their URLs
  export const uploadFiles = async (files: File[]): Promise<{
    success: boolean;
    fileUrls: string[];
    errors: string[];
  }> => {
    const results = await Promise.all(
      files.map(file => uploadFile(file))
    );
    
    const fileUrls: string[] = [];
    const errors: string[] = [];
    
    results.forEach(result => {
      if (result.success && result.fileUrl) {
        fileUrls.push(result.fileUrl);
      } else if (result.error) {
        errors.push(result.error);
      }
    });
    
    return {
      success: fileUrls.length > 0,
      fileUrls,
      errors
    };
  };