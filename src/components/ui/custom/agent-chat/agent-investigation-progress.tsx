// Componente para visualizar el progreso de la investigación
import { useInvestigation } from "@/contexts/investigation-context";
import { motion} from "framer-motion";
export const InvestigationProgressMessage = ({ stage }: { stage: string }) => {

    const { progress, currentPhase } = useInvestigation();
  
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="w-full"
      >
        <div className="h-full bg-card rounded-lg border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-[#5cbef8]">Progreso de Investigación</h3>
            
            <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
              <motion.div
                className="absolute h-full bg-[#5cbef8] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeInOut" 
                }}
              />
            </div>
  
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {currentPhase || "Iniciando investigación..."}
              </span>
              <span className="text-sm font-semibold text-[#5cbef8]">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };