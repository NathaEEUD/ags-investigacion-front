
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/custom/shared/loader";
import { AlertCircle, CheckCircle, Pen } from "lucide-react";
import { iconVariants } from "@/styles/animations";
interface ProgressIndicatorProps {
    progress: number;
    currentPhase: string;
  }
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    progress,
    currentPhase,
  }) => (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center gap-1">
        <AnimatePresence mode="wait">
          {progress < 100 ? (
            currentPhase.includes("Escribiendo") ? (
              <motion.div
                key="pen"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <Pen className="w-4 h-4 animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="loader"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <Loader size="xxs" mode="light" />
              </motion.div>
            )
          ) : (
            <motion.div
              key="check"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="text-sm font-medium md:truncate md:overflow-hidden md:whitespace-nowrap md:max-w-[350px] inline-block">
          {currentPhase}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {Math.round(progress)}%
      </span>
    </div>
  );
  