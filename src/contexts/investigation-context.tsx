"use client";
import React, { createContext, useContext, useState, useCallback, useRef } from "react";

/**
 * Tipo de contexto para la gestión de investigaciones
 * Define la estructura y métodos para manejar el estado de una investigación
 */
interface InvestigationContextType {
  /** Identificador único del agente seleccionado */
  selectedAgentId: string | null;
  
  /** Nombre del agente seleccionado */
  agentName: string | null;
  
  /** Indica si una investigación está en curso */
  isInvestigating: boolean;
  
  /** Progreso actual de la investigación (0-100) */
  progress: number;
  
  /** Fase actual de la investigación */
  currentPhase: string;
  
  /** Mensaje de retroalimentación del sistema */
  messageFeedback: string | null;
  
  /** Mensaje de retroalimentación del usuario */
  userMessageFeedback: string | null;
  
  /** Función para iniciar la investigación */
  startInvestigation: () => Promise<void>;
  
  /** Actualiza el agente seleccionado */
  updateSelectedAgent: (id: string | null, name: string | null) => void;
  
  /** Actualiza el estado de la investigación */
  updateInvestigationState: (progress: number, phase: string) => void;
  
  /** Registra la función de inicio de investigación */
  registerStartResearchFn: (fn: (() => Promise<void>)) => void;
  
  /** Establece el estado de investigación */
  setIsInvestigating: (value: boolean) => void;
  
  /** Establece el mensaje de retroalimentación del sistema */
  setMessageFeedback: (value: string | null) => void;
  
  /** Establece el mensaje de retroalimentación del usuario */
  setUserMessageFeedback: (value: string | null) => void;
}

/** Contexto predeterminado con valores iniciales vacíos */
const defaultContext: InvestigationContextType = {
  selectedAgentId: null,
  agentName: null,
  isInvestigating: false,
  progress: 0,
  currentPhase: "",
  messageFeedback: null,
  userMessageFeedback: null,
  startInvestigation: async () => {},
  updateSelectedAgent: () => {},
  updateInvestigationState: () => {},
  registerStartResearchFn: () => {},
  setIsInvestigating: () => {},
  setMessageFeedback: () => {},
  setUserMessageFeedback: () => {}
};

/** Crear el contexto de investigación */
const InvestigationContext = createContext<InvestigationContextType>(defaultContext);

/** Hook personalizado para acceder al contexto de investigación */
export const useInvestigation = () => useContext(InvestigationContext);

/**
 * Proveedor del contexto de investigación
 * Gestiona el estado global de la investigación
 */
export const InvestigationProvider = ({ 
  children 
}: { 
  children: React.ReactNode;
}) => {
  // Estados para gestionar diferentes aspectos de la investigación
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("");
  const [messageFeedback, setMessageFeedback] = useState<string | null>(null);
  const [userMessageFeedback, setUserMessageFeedback] = useState<string | null>(null);

  // Referencia para almacenar la función de inicio de investigación
  const startResearchFnRef = useRef<(() => Promise<void>) | null>(null);
  
  /** Actualiza el agente seleccionado de manera segura */
  const updateSelectedAgent = useCallback((id: string | null, name: string | null) => {
    setSelectedAgentId(id);
    setAgentName(name);
  }, []);
  
  /** Actualiza el estado de la investigación */
  const updateInvestigationState = useCallback((newProgress: number, newPhase: string) => {
    setProgress(newProgress);
    setCurrentPhase(newPhase);
  }, []);
  
  /** Registra la función de inicio de investigación */
  const registerStartResearchFn = useCallback((fn: () => Promise<void>) => {
    startResearchFnRef.current = fn;
  }, []);
  
  /** Inicia la investigación de manera segura */
  const startInvestigation = useCallback(async () => {
    if (!startResearchFnRef.current) {
      console.warn("No se proporcionó un manejador de inicio de investigación");
      return;
    }
    
    try {
      setIsInvestigating(true);
      await startResearchFnRef.current();
    } catch (error) {
      console.error("Error al iniciar la investigación:", error);
      setIsInvestigating(false);
    }
  }, []);

  /** Establece explícitamente el estado de investigación */
  const explicitSetIsInvestigating = useCallback((value: boolean) => {
    setIsInvestigating(value);
  }, []);

  return (
    <InvestigationContext.Provider
      value={{
        selectedAgentId,
        agentName,
        isInvestigating,
        progress,
        currentPhase,
        messageFeedback,
        userMessageFeedback,
        startInvestigation,
        updateSelectedAgent,
        updateInvestigationState,
        registerStartResearchFn,
        setIsInvestigating: explicitSetIsInvestigating,
        setMessageFeedback,
        setUserMessageFeedback
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};