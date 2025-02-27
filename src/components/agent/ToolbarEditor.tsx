import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Heading, 
  Quote, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FileUpload } from './FileUpload';

interface EditorToolbarProps {
  onFileSelect: (files: File[]) => void;
  onInsertMarkdown: (markdown: string) => void;
  isReadOnly?: boolean;
}

export function EditorToolbar({ 
  onFileSelect, 
  onInsertMarkdown, 
  isReadOnly = false 
}: EditorToolbarProps) {
  
  const insertFormatting = (type: string) => {
    let markdown = '';
    switch (type) {
      case 'bold':
        markdown = '**Texto en negrita**';
        break;
      case 'italic':
        markdown = '*Texto en cursiva*';
        break;
      case 'heading':
        markdown = '## Encabezado';
        break;
      case 'quote':
        markdown = '> Cita';
        break;
      case 'list':
        markdown = '\n- Elemento 1\n- Elemento 2\n- Elemento 3\n';
        break;
      case 'ordered-list':
        markdown = '\n1. Elemento 1\n2. Elemento 2\n3. Elemento 3\n';
        break;
      case 'link':
        markdown = '[Texto del enlace](https://ejemplo.com)';
        break;
      default:
        break;
    }
    onInsertMarkdown(markdown);
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 border-b bg-background rounded-t-lg">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => insertFormatting('bold')}
        disabled={isReadOnly}
        title="Negrita"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => insertFormatting('italic')}
        disabled={isReadOnly}
        title="Cursiva"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => insertFormatting('heading')}
        disabled={isReadOnly}
        title="Encabezado"
      >
        <Heading className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => insertFormatting('quote')}
        disabled={isReadOnly}
        title="Cita"
      >
        <Quote className="h-4 w-4" />
      </Button>
      
      <div className="h-4 w-px bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => insertFormatting('list')}
        disabled={isReadOnly}
        title="Lista"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => insertFormatting('ordered-list')}
        disabled={isReadOnly}
        title="Lista numerada"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <div className="h-4 w-px bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => insertFormatting('link')}
        disabled={isReadOnly}
        title="Enlace"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      
      <div className={cn(
        "flex items-center",
        isReadOnly && "opacity-50 pointer-events-none"
      )}>
        <FileUpload
          onFileSelect={onFileSelect}
          onInsertMarkdown={onInsertMarkdown}
          iconOnly
        />
      </div>
    </div>
  );
}