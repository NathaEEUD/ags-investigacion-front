import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useApi } from "@/hooks/use-api"
import { useChallengeStatus } from '@/contexts/challenge-status-context'

type PrimaryResearch = {
  assignmentId: string
  presentationDate: string
  presentationTime: string
  status: string
  presentationWeek: string
  agentName: string
  agentDescription: string
  agentCategory: string
  agentIndustry: string
  showOrder: number
}

type ContributorResearch = {
  id: string
  name: string
  category: string
  industry: string
  shortDescription: string
  longDescription: string | null
  role: string
  assignmentId: string
}

type ResearcherDetails = {
  id: string
  name: string
  email: string
  avatarUrl: string
  repositoryUrl: string
  linkedinProfile: string
  role: string | null
  githubUsername: string
  primaryResearches: PrimaryResearch[]
  contributorsResearches: ContributorResearch[]
  showOrder: number
}

export function ResearcherInvestigations({ details }: { details: ResearcherDetails }) {
  const { challengeStatus } = useChallengeStatus();
  const api = useApi();
  const [selectedResearch, setSelectedResearch] = useState<string | null>(
    details.primaryResearches[0]?.assignmentId || 
    details.contributorsResearches[0]?.assignmentId || 
    null
  )
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    videoUrl: '',
  });

  const allResearches = [
    ...details.primaryResearches.map(r => ({
      ...r,
      type: 'primary' as const
    })),
    ...details.contributorsResearches.map(r => ({
      assignmentId: r.assignmentId,
      agentName: r.name,
      agentDescription: r.shortDescription,
      agentCategory: r.category,
      agentIndustry: r.industry,
      type: 'contributor' as const,
      showOrder: 0 // Los contribuidores no tienen showOrder, así que asignamos 0
    }))
  ]

  const selectedResearchDetails = allResearches.find(r => r.assignmentId === selectedResearch)
  
  // Verificar si el agente seleccionado cumple con la condición para mostrar el botón
  const shouldShowUploadButton = 
    selectedResearchDetails?.type === 'primary' && 
    selectedResearchDetails?.showOrder === challengeStatus?.currentMonth;

  const handleCreateProject = async () => {
    if (!selectedResearchDetails) return;
    
    setIsSaving(true);
    try {
      // Formatear la URL de YouTube si es necesario
      const formattedVideoUrl = projectForm.videoUrl.includes('youtube.com/watch') || 
                               projectForm.videoUrl.includes('youtu.be/') ? 
                               convertToEmbedUrl(projectForm.videoUrl) : 
                               projectForm.videoUrl;
      
      const payload = {
        assignmentId: selectedResearchDetails.assignmentId,
        title: projectForm.name,
        description: projectForm.description,
        youtubeUrl: formattedVideoUrl
      };

      const response = await api.post('/researchers-managements/agent-videos/upload', payload);
      
      if (response.status === 200 || response.status === 201) {
        toast.success("¡Proyecto cargado exitosamente! Tu video ha sido registrado y será revisado por el equipo.");
        setIsCreatingProject(false);
        setProjectForm({ name: '', description: '', videoUrl: '' });
      }
    } catch (error) {
      console.error('Error uploading project:', error);
      toast.error("Error al cargar el proyecto. Por favor intente nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Función para convertir una URL normal de YouTube a una URL de embed
  const convertToEmbedUrl = (url: string): string => {
    try {
      let videoId = '';
      let startTime = '';
      
      // Extraer el ID del video y el tiempo de inicio
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
        const tParam = urlObj.searchParams.get('t');
        if (tParam) startTime = `?start=${tParam}`;
      } else if (url.includes('youtu.be/')) {
        const urlObj = new URL(url);
        videoId = urlObj.pathname.substring(1);
        const tParam = urlObj.searchParams.get('t');
        if (tParam) startTime = `?start=${tParam}`;
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}${startTime}`;
      }
      
      return url;
    } catch (error) {
      console.error('Error converting YouTube URL:', error);
      return url;
    }
  };

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
            
            // Convertir el valor de t a segundos si tiene formato de tiempo (e.g., 16m30s)
            let seconds = 0;
            
            if (tParam.includes('m') || tParam.includes('h') || tParam.includes('s')) {
              // Formato como 1h20m30s
              const hours = tParam.match(/(\d+)h/);
              const minutes = tParam.match(/(\d+)m/);
              const secs = tParam.match(/(\d+)s/);
              
              if (hours) seconds += parseInt(hours[1]) * 3600;
              if (minutes) seconds += parseInt(minutes[1]) * 60;
              if (secs) seconds += parseInt(secs[1]);
            } else {
              // Es un número directo de segundos
              seconds = parseInt(tParam);
            }
            
            // Añadir el parámetro start
            urlObj.searchParams.append('start', seconds.toString());
            
            return urlObj.toString();
          }
        }
        return url;
      }
      
      // Si es una URL normal de YouTube, convertirla a embed
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        let embedUrl = `https://www.youtube.com/embed/${videoId}`;
        
        // Verificar si tiene parámetro t
        const tParam = urlObj.searchParams.get('t');
        if (tParam) {
          // Convertir a segundos si es necesario
          let seconds = 0;
          
          if (tParam.includes('m') || tParam.includes('h') || tParam.includes('s')) {
            const hours = tParam.match(/(\d+)h/);
            const minutes = tParam.match(/(\d+)m/);
            const secs = tParam.match(/(\d+)s/);
            
            if (hours) seconds += parseInt(hours[1]) * 3600;
            if (minutes) seconds += parseInt(minutes[1]) * 60;
            if (secs) seconds += parseInt(secs[1]);
          } else {
            seconds = parseInt(tParam);
          }
          
          embedUrl += `?start=${seconds}`;
        }
        
        return embedUrl;
      }
      
      // Si es una URL corta de YouTube
      if (url.includes('youtu.be/')) {
        const urlObj = new URL(url);
        const videoId = urlObj.pathname.substring(1);
        let embedUrl = `https://www.youtube.com/embed/${videoId}`;
        
        // Verificar si tiene parámetro t
        const tParam = urlObj.searchParams.get('t');
        if (tParam) {
          // Convertir a segundos si es necesario
          let seconds = 0;
          
          if (tParam.includes('m') || tParam.includes('h') || tParam.includes('s')) {
            const hours = tParam.match(/(\d+)h/);
            const minutes = tParam.match(/(\d+)m/);
            const secs = tParam.match(/(\d+)s/);
            
            if (hours) seconds += parseInt(hours[1]) * 3600;
            if (minutes) seconds += parseInt(minutes[1]) * 60;
            if (secs) seconds += parseInt(secs[1]);
          } else {
            seconds = parseInt(tParam);
          }
          
          embedUrl += `?start=${seconds}`;
        }
        
        return embedUrl;
      }
      
      return url;
    } catch (error) {
      console.error('Error formatting YouTube URL:', error);
      return url;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Select
          value={selectedResearch || ''}
          onValueChange={setSelectedResearch}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecciona una investigación" />
          </SelectTrigger>
          <SelectContent>
            {details.primaryResearches.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold">Investigaciones Primarias</div>
                {details.primaryResearches.map((research) => (
                  <SelectItem key={research.assignmentId} value={research.assignmentId}>
                    {research.agentName}
                  </SelectItem>
                ))}
              </>
            )}
            {details.contributorsResearches.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold">Investigaciones Contribuidor</div>
                {details.contributorsResearches.map((research) => (
                  <SelectItem key={research.assignmentId} value={research.assignmentId}>
                    {research.name}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
        
        {/* Botón de carga de proyecto que aparece solo cuando se cumple la condición */}
        {shouldShowUploadButton && (
          <Button 
            onClick={() => setIsCreatingProject(true)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Cargar Proyecto
          </Button>
        )}
      </div>

      {selectedResearchDetails && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedResearchDetails.agentName}</CardTitle>
              <Badge variant={selectedResearchDetails.type === 'primary' ? 'default' : 'secondary'}>
                {selectedResearchDetails.type === 'primary' ? 'Primario' : 'Contribuidor'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{selectedResearchDetails.agentDescription}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{selectedResearchDetails.agentCategory}</Badge>
                <Badge variant="outline">{selectedResearchDetails.agentIndustry}</Badge>
              </div>
            </div>

            {selectedResearchDetails.type === 'primary' && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">Detalles de Presentación</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{(selectedResearchDetails as PrimaryResearch).presentationDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{(selectedResearchDetails as PrimaryResearch).presentationTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Semana {(selectedResearchDetails as PrimaryResearch).presentationWeek}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog para cargar proyecto */}
      <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargar Proyecto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                id="name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Proyecto</Label>
              <Input
                id="description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL del Video</Label>
              <Input
                id="videoUrl"
                value={projectForm.videoUrl}
                onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
              />
            </div>
            <Button 
              onClick={handleCreateProject} 
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? "Cargando..." : "Cargar Proyecto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 