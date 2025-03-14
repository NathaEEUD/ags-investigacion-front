// components/agent-suggestions-message.tsx
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInvestigation } from "@/contexts/investigation-context";
import { CheckCircle } from "lucide-react";

interface AgentSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
}

interface AgentSuggestionsMessageProps {
  suggestions: AgentSuggestion[];
  onSelectAgent?: (agentId: string, agentName: string) => void;
}

export const AgentSuggestionsMessage = ({ 
  suggestions, 
  onSelectAgent 
}: AgentSuggestionsMessageProps) => {
  // Use the shared investigation context
  const { selectedAgentId, agentName, updateSelectedAgent } = useInvestigation();
  
  const handleSelectAgent = (agentId: string, agentName: string) => {
    // Update the global context first - this affects both components
    updateSelectedAgent(agentId, agentName);
    
    // If a local handler is provided, call it too
    if (onSelectAgent) {
      onSelectAgent(agentId, agentName);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      <Card className="h-full">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-[#5cbef8]">Agentes Disponibles</h3>
          
          {/* Current agent info */}
          {selectedAgentId && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Agente actual</span>
                </div>
                <Badge variant="outline" className="text-xs font-normal">En uso</Badge>
              </div>
              <p className="text-sm font-medium text-foreground">{agentName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Puedes continuar con este agente o seleccionar uno nuevo de la lista.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-3">
            {suggestions.map((agent) => (
              <Button 
                key={agent.id} 
                variant="outline" 
                className={`flex flex-col items-start gap-1 h-auto p-3 transition-colors
                  ${agent.id === selectedAgentId 
                    ? 'bg-primary/10 border-primary/30 hover:bg-primary/15' 
                    : 'hover:bg-primary/10'}`}
                onClick={() => handleSelectAgent(agent.id, agent.name)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium">
                    {agent.name}
                    {agent.id === selectedAgentId && (
                      <span className="ml-2 text-xs text-primary">(Seleccionado)</span>
                    )}
                  </span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {agent.category}
                  </Badge>
                </div>
                <p className="text-xs text-left text-muted-foreground">{agent.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};