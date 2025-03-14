// ai/actions.ts
import { z } from "zod";

// Define los tipos para los agentes
export interface AgentSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
}

// Función para generar sugerencias de agentes usando datos proporcionados
export async function generateAgentSuggestions({ 
  researcherType = "default",
  activeResearches = null
}: { 
  researcherType: string,
  activeResearches?: {
    primary: AgentSuggestion[];
    contributor: AgentSuggestion[];
  } | null
}) {
  try {
    // Si tenemos activeResearches ya pasados desde el cliente, usarlos directamente
    if (activeResearches) {
      // Combinar agentes primarios y contribuidores
      const suggestions = [
        ...activeResearches.primary,
        ...activeResearches.contributor
      ];
      
      // Filtrar por tipo si es necesario
      let filteredSuggestions = suggestions;
      if (researcherType !== "default") {
        filteredSuggestions = suggestions.filter(s => 
          s.category.toLowerCase().includes(researcherType.toLowerCase()) || 
          s.industry.toLowerCase().includes(researcherType.toLowerCase())
        );
      }

      return {
        suggestions: filteredSuggestions,
      };
    } 
    
    // Si no hay datos disponibles, proporcionar sugerencias de ejemplo
    const suggestions: AgentSuggestion[] = [
     
    ];
    
    // Filtrar por tipo si es necesario
    let filteredSuggestions = suggestions;
    if (researcherType !== "default") {
      filteredSuggestions = suggestions.filter(s => 
        s.category.toLowerCase().includes(researcherType.toLowerCase()) || 
        s.industry.toLowerCase().includes(researcherType.toLowerCase())
      );
    }
    
    return {
      suggestions: filteredSuggestions,
      message: "Estos son agentes de ejemplo. Para ver tus agentes reales, por favor inicia sesión."
    };
  } catch (error) {
    console.error("Error fetching agent suggestions:", error);
    return {
      suggestions: [],
      error: "No se pudieron cargar las sugerencias de agentes"
    };
  }
}

// Función para crear un nuevo agente
export async function createAgent(props: {
  name: string;
  description: string;
  category: string;
  industry: string;
}) {
  // En un entorno real, esta función enviaría los datos a la API
  // y retornaría el nuevo agente creado
  return {
    id: `agent-${Date.now()}`,
    ...props
  };
}

// Función para iniciar una investigación
export async function startInvestigation(props: {
  agentId: string;
  stage: string;
  agentDetails?: {
    id: string;
    name: string;
    description: string;
    category: string;
    industry: string;
  };
}) {
  try {
     //EN ESTE CASO NO USAREMOS ESTA FUNCION POR QUE USAMOS WEB SOCKETS 
    // Simular una llamada a API con un retraso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En un entorno real, esta sería una llamada a la API
    // const response = await fetch(`/api/investigations/start`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(props)
    // });
    // const data = await response.json();
    
    return {
      id: `investigation-${Date.now()}`,
      agentId: props.agentId,
      stage: props.stage,
      status: "in_progress",
      startTime: new Date().toISOString(),
      // Incluir detalles del agente en la respuesta si están disponibles
      agent: props.agentDetails || {
        id: props.agentId,
        name: "Agente",
        description: "Investigación en progreso",
        category: "General",
        industry: "General"
      }
    };
  } catch (error) {
    console.error("Error starting investigation:", error);
    throw new Error("No se pudo iniciar la investigación");
  }
}