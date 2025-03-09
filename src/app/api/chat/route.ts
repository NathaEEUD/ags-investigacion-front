import { APICallError, convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";
import { openai} from "@ai-sdk/openai";


import {
  generateAgentSuggestions,
  createAgent,
  startInvestigation
} from "@/ai/actions";
import { error } from "console";
/**
 * Manejador de peticiones POST para iniciar una investigación con un agente de IA.
 * 
 * @param request - Solicitud HTTP entrante con los parámetros de la investigación.
 * @returns Respuesta de transmisión de texto generada por el modelo de IA.
 */

export async function POST(request: Request) {
    const { 
      id, 
      messages, 
      agentId, 
      agentName,
      email, 
      activeResearches 
    }: { 
      id: string; 
      messages: Array<Message>;
      agentId?: string | null;
      agentName?: string | null;
      email?: string;
      activeResearches?: {
        primary: Array<any>;
        contributor: Array<any>;
      }
    } = await request.json();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  if (APICallError.isInstance(error)) {
    // Handle the error
    console.log(error)
  }

  let selectedAgent = null;
  if (id && activeResearches) {
    const primaryAgent = activeResearches.primary.find(a => a.id === id);
    const contributorAgent = activeResearches.contributor.find(a => a.id === id);
    selectedAgent = primaryAgent || contributorAgent || null;
  }

  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    onError({ error }) {
      console.error(error);
    },
    system: `
    Eres un asistente especializado en investigación con IA.
    
    INSTRUCCIONES IMPORTANTES:
    - Comunícate siempre en español con un tono amigable y conversacional
    - Sé conciso y directo
    - Si el usuario pide ver agentes, muestra las opciones disponibles
    - Si el usuario quiere iniciar investigación, pide confirmación
    
    ${selectedAgent ? `
    CONTEXTO ACTUAL DEL AGENTE:
    - Nombre: "${selectedAgent.name}"
    - Descripción: "${selectedAgent.description}"
    ` : 'No hay agente seleccionado actualmente.'}
    `,
    messages: coreMessages,
    tools: {
       /**
       * Herramienta para mostrar sugerencias de agentes de investigación.
       * 
       * @param researcherType - Tipo de investigador o categoría.
       * @returns Lista de agentes sugeridos y detalles del agente actual (si existe).
       */
      displayAgentSuggestions: {
        description: "Muestra las opciones de agentes de investigación disponibles para que el usuario seleccione",
        parameters: z.object({
          researcherType: z.string().describe("Tipo de investigador/categoría. Usar 'default' si no se especifica"),
        }),
        execute: async ({ researcherType }) => {
          // Pasar directamente activeResearches a la función
          const result = await generateAgentSuggestions({
            researcherType,
            activeResearches
          });
          
          // Si hay un agente seleccionado actualmente, mencionarlo en la respuesta
          if (selectedAgent) {
            return {
              ...result,
              currentAgent: {
                id: selectedAgent.id,
                name: selectedAgent.name,
                description: selectedAgent.description,
                category: selectedAgent.category,
                industry: selectedAgent.industry
              }
            };
          }
          
          return result;
        },
      },
        /**
       * Herramienta para iniciar y gestionar el proceso de investigación de un agente.
       * 
       * @param agentId - ID del agente que realiza la investigación.
       * @param investigationStage - Etapa actual de la investigación.
       * @returns Detalles del proceso de investigación o información de error.
       */
      startInvestigationProcess: {
        description: "Inicia y gestiona el proceso de investigación del agente",
        parameters: z.object({
          agentId: z.string().describe("ID del agente que realiza la investigación"),
          investigationStage: z
            .enum(["initialize", "data_collection", "analysis", "synthesis", "complete"])
            .describe("Etapa actual de la investigación"),
        }),
        execute: async ({ agentId, investigationStage }) => {
          try {
            // Identificar detalles del agente seleccionado para investigación
            let agentDetails = {
              id: agentId,
              name: "Agente desconocido",
              description: "Sin descripción",
              category: "General",
              industry: "General"
            };
            
            // Buscar detalles del agente en los datos disponibles
            if (activeResearches) {
              const found = [...activeResearches.primary, ...activeResearches.contributor]
                .find(agent => agent.id === agentId);
                
              if (found) {
                agentDetails = {
                  id: found.id,
                  name: found.name,
                  description: found.description,
                  category: found.category,
                  industry: found.industry
                };
              }
            }
            
           
            
            // Mensaje simple para el usuario - el progreso visual se maneja en el cliente
            const message = `Iniciando proceso de investigación con ${agentDetails.name}`;
            
            return {
              success: true,
              stage: investigationStage,
              message: message,
              agent: agentDetails
            };
          } catch (error) {
            console.error("Investigation process error:", error);
            return {
              success: false,
              message: "Error en el proceso de investigación",
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();


}