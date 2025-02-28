'use client'

import { useApi } from "@/hooks/use-api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import LikeButton from '../shared/like-button'

interface VotingPeriod {
  startDate: string | null;
  endDate: string | null;
  votingOpen: boolean;
}

interface Project {
  id: string;
  assignmentId: string;
  title: string;
  description: string;
  youtubeUrl: string;
  uploadedAt: string;
  status: string;
  votingPeriod: VotingPeriod;
  votesCount: number;
}

// Función para convertir la URL de YouTube con parámetro t a start
const formatYoutubeEmbedUrl = (url: string): string => {
  try {
    // Si la URL ya es una URL de embed
    if (url.includes('youtube.com/embed/')) {
      // Verificar si tiene parámetro t
      if (url.includes('?t=') || url.includes('&t=')) {
        const urlObj = new URL(url);
        const tParam = urlObj.searchParams.get('t');
        
        if (tParam) {
          // Eliminar el parámetro t
          urlObj.searchParams.delete('t');
          
          // Convertir el valor de t a segundos
          let seconds = parseInt(tParam);
          
          // Añadir el parámetro start
          urlObj.searchParams.append('start', seconds.toString());
          
          return urlObj.toString();
        }
      }
      return url;
    }
    
    return url;
  } catch (error) {
    console.error('Error formatting YouTube URL:', error);
    return url;
  }
};

export function ProjectList() {
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/researchers-managements/agent-videos/voting-period');
        setProjects(data);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        setErrorMessage(
          error.response?.data?.message || 
          error.message || 
          'Error al cargar los proyectos'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [api]);

  if (isLoading) {
    return <div>Cargando proyectos...</div>;
  }

  if (errorMessage) {
    return <div className="text-red-500">Error: {errorMessage}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative w-full overflow-hidden rounded-sm bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-lg transition-all hover:shadow-lg hover:shadow-purple-500/20 flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 -z-10" />

          {project.youtubeUrl && (
            <iframe
              src={formatYoutubeEmbedUrl(project.youtubeUrl)}
              className="w-full h-48"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={project.title}
            />
          )}

          <div className="h-full flex flex-col items-center justify-between gap-4 p-4">
            {/*Datos Proyecto*/}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span className="text-lg font-bold text-white leading-none">{project.title}</span>
              <span className="font-medium text-xs opacity-80">{project.description}</span>
            </motion.div>

            {/*Boton de votacion*/}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center gap-2"
            >
              <LikeButton
                initialCount={project.votesCount}
                initialLiked={project.votesCount > 0}
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}