// Types for file handling
export type FileWithPreview = {
    file: File;
    id: string;
    previewUrl?: string;
    type: "image" | "video" | "code" | "other";
  };
  
  // File type definitions
  export const fileTypes = {
    image: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "image/webp",
    ],
    video: ["video/mp4", "video/webm", "video/ogg"],
    code: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".html",
      ".css",
      ".json",
      ".md",
    ],
  };
  
  // Determine file type from file object
  export const determineFileType = (
    file: File
  ): "image" | "video" | "code" | "other" => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
  
    if (fileTypes.image.includes(file.type)) return "image";
    if (fileTypes.video.includes(file.type)) return "video";
    if (fileTypes.code.some((codeExt) => ext.endsWith(codeExt))) return "code";
    return "other";
  };
  
  // Process files into FileWithPreview objects
  export const processFiles = (files: File[]): FileWithPreview[] => {
    return files.map((file) => {
      const type = determineFileType(file);
      let previewUrl;
  
      if (type === "image") {
        previewUrl = URL.createObjectURL(file);
      }
  
      return {
        file,
        id: Math.random().toString(36).substring(2, 9),
        previewUrl,
        type,
      };
    });
  };
  
  // Generate markdown for file
  // Update only the video part of the generateMarkdown function
  export const generateMarkdown = (file: FileWithPreview): string => {
    switch (file.type) {
      case "image":
        return `![${file.file.name}](image-url-placeholder)\n\n`;
  
      case "video":
        return `
  <video width="600" height="400" controls>
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="${file.file.type}">
    Tu navegador no soporta la etiqueta de video.
  </video>
  `;
      case "code":
        const language = file.file.name.split(".").pop();
        return `\`\`\`${language}\n// Code content from ${file.file.name}\n\`\`\`\n\n`;
  
      default:
        return `[File: ${file.file.name}](file-url-placeholder)\n\n`;
    }
  };
  
  // Clean up preview URLs when files are removed
  export const cleanupPreviews = (files: FileWithPreview[]): void => {
    files.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
  };
  