"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/custom/shared/loader";
import { toast } from "sonner";
import { useChallengeStatus } from '@/contexts/challenge-status-context';
import { DetailPresentation } from "@/components/ui/custom/detail-presentation";
import { ResearcherInvestigations } from "@/components/ui/custom/researcher-investigations";

// Actualizar la definición del tipo para que coincida con la estructura esperada por ResearcherInvestigations
type ResearcherDetails = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  repositoryUrl: string;
  linkedinProfile: string;
  role: string | null;
  githubUsername: string;
  primaryResearches: Array<{
    assignmentId: string;
    presentationDate: string;
    presentationTime: string;
    status: string;
    presentationWeek: string;
    agentName: string;
    agentDescription: string;
    agentCategory: string;
    agentIndustry: string;
    showOrder: number;
  }>;
  contributorsResearches: Array<{
    id: string;
    name: string;
    category: string;
    industry: string;
    shortDescription: string;
    longDescription: string | null;
    role: string;
    assignmentId: string;
  }>;
  showOrder: number;
  currentRole?: string;
};

type ResearcherUpdate = {
  currentRole: string;
  githubUsername: string;
  linkedinProfile: string;
};

export default function MisInvestigacionesPage() {
  const { challengeStatus } = useChallengeStatus();
  const { profile } = useAuth();
  const api = useApi();
  const [details, setDetails] = useState<ResearcherDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateForm, setUpdateForm] = useState<ResearcherUpdate>({
    currentRole: "",
    githubUsername: "",
    linkedinProfile: "",
  });

  useEffect(() => {
    if (profile?.email) {
      loadResearcherDetails();
    }
  }, [profile?.email]);

  const loadResearcherDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<ResearcherDetails>(`/researchers-managements/researchers/details?email=${profile?.email}`);
      setDetails(data);
      setUpdateForm({
        currentRole: data.currentRole || "",
        githubUsername: data.githubUsername || "",
        linkedinProfile: data.linkedinProfile || "",
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setDetails(null);
      } else {
        toast.error("Error al cargar los detalles del investigador");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      await api.put(
        `/researchers-managements/researchers/${profile?.email}/profile`, 
        updateForm
      );
      
      await loadResearcherDetails();
      
      setIsEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="space-y-4 text-center">
          <Loader />
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Aún no eres investigador</h2>
          <p className="text-muted-foreground max-w-md">
            Para ver tus investigaciones, primero debes registrarte como investigador y seleccionar un agente para investigar.
          </p>
        </div>
        <a 
          href="/dashboard/documentation/nuevo-agente" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Comenzar a Investigar
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Mis Investigaciones</h1>
        <p className="text-muted-foreground">
          Gestiona y monitorea tus investigaciones actuales.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Detalles de la Presentación */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">Presentación</Badge>
            </div>
            <CardTitle className="text-xl">Detalles de la Presentación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {details && <ResearcherInvestigations details={details} />}
            </div>
          </CardContent>
        </Card>
      </div>

      <DetailPresentation />
    </div>
  );
}
