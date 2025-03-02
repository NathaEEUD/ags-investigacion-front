// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create unique filename to prevent overwriting
    const originalName = file.name;
    const fileExtension = path.extname(originalName);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Create buffer from file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Define path to save file (within public folder for easy access)
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    
    // Ensure the uploads directory exists
    try {
      await writeFile(path.join(uploadsDir, fileName), buffer);
    } catch (error: any) {
      // If directory doesn't exist, create it and try again
      if (error.code === 'ENOENT') {
        const fs = require('fs');
        fs.mkdirSync(uploadsDir, { recursive: true });
        await writeFile(path.join(uploadsDir, fileName), buffer);
      } else {
        throw error;
      }
    }
    
    // Return the URL to access the file
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      fileName,
      originalName,
      fileUrl,
      fileType: file.type
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}