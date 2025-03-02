// lib/proccessingFiles.ts

import { uploadFiles } from "./file-upload";


export type FileWithPreview = {
  file: File;
  id: string;
  previewUrl?: string;
  type: 'image' | 'video' | 'code' | 'other';
};

export const fileTypes = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  code: ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.html', '.css', '.json', '.md']
};

// Determine file type from file object
export const determineFileType = (file: File): 'image' | 'video' | 'code' | 'other' => {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  
  if (fileTypes.image.includes(file.type)) return 'image';
  if (fileTypes.video.includes(file.type)) return 'video';
  if (fileTypes.code.some(codeExt => ext.endsWith(codeExt))) return 'code';
  return 'other';
};

// Process files into FileWithPreview objects
export const processFiles = (files: File[]): FileWithPreview[] => {
  return files.map(file => {
    const type = determineFileType(file);
    let previewUrl;
    
    if (type === 'image') {
      previewUrl = URL.createObjectURL(file);
    }
    
    return {
      file,
      id: Math.random().toString(36).substring(2, 9),
      previewUrl,
      type
    };
  });
};

// Keep your original synchronous function for compatibility
export function generateMarkdown(file: FileWithPreview): string {
  return generateMarkdownWithPlaceholder(file);
}

// Add a new async version for uploading
export async function uploadAndGenerateMarkdown(file: FileWithPreview): Promise<string> {
  // First upload the file
  try {
    const result = await uploadFiles([file.file]);
    if (result.success && result.fileUrls.length > 0) {
      const uploadUrl = result.fileUrls[0];
      return generateMarkdownWithUrl(file, uploadUrl);
    } else {
      // Fall back to placeholder if upload fails
      return generateMarkdownWithPlaceholder(file);
    }
  } catch (error) {
    console.error('Error uploading file for markdown:', error);
    return generateMarkdownWithPlaceholder(file);
  }
}

// Helper function to generate markdown with a real URL
export const generateMarkdownWithUrl = (file: FileWithPreview, url: string): string => {
  switch (file.type) {
    case 'image':
      return `![${file.file.name}](${url})\n\n`;
      
    case 'video':
      return `
<video width="100%" controls>
  <source src="${url}" type="${file.file.type}">
  Tu navegador no soporta la etiqueta de video.
</video>

`;
      
    case 'code':
      // For code files, we'll link to the file since we can't display the content directly
      const language = file.file.name.split('.').pop();
      return `[View code file: ${file.file.name}](${url})\n\n\`\`\`${language}\n// Content from ${file.file.name}\n\`\`\`\n\n`;
      
    default:
      return `[File: ${file.file.name}](${url})\n\n`;
  }
};

// Generate markdown with a placeholder URL
const generateMarkdownWithPlaceholder = (file: FileWithPreview): string => {
  switch (file.type) {
    case 'image':
      return `![${file.file.name}](image-url-placeholder)\n\n`;
      
    case 'video':
      return `
<video width="100%" controls>
  <source src="video-url-placeholder" type="${file.file.type}">
  Tu navegador no soporta la etiqueta de video.
</video>

`;
      
    case 'code':
      const language = file.file.name.split('.').pop();
      return `\`\`\`${language}\n// Code content from ${file.file.name}\n\`\`\`\n\n`;
      
    default:
      return `[File: ${file.file.name}](file-url-placeholder)\n\n`;
  }
};

// Clean up preview URLs when files are removed
export const cleanupPreviews = (files: FileWithPreview[]): void => {
  files.forEach(file => {
    if (file.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
  });
};