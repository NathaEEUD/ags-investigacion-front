import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Message } from "./types";

interface LoadingMessageProps {
  message: Message;
}

// Variantes para la barra de progreso
const progressVariants = {
  initial: { width: "0%" },
  animate: (percentage: number) => ({
    width: `${percentage}%`,
    transition: { duration: 0.8, ease: "easeInOut" },
  }),
};

// Variantes para la animación de entrada
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const LoadingMessage = React.memo(({ message }: LoadingMessageProps) => {
  const percentage = message.currentPhase
    ? (message.currentPhase / (message.phases?.length || 1)) * 100
    : 25;

  return (
    <motion.div
      className="flex flex-col space-y-2 p-3 rounded-lg bg-[#24264A]/30 max-w-[80%] self-start"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{message.phases?.[message.currentPhase || 0]}</span>
      </div>
      <div className="w-full bg-[#24264A]/20 h-1 rounded-full overflow-hidden">
        <motion.div
          className="bg-primary h-full"
          variants={progressVariants}
          initial="initial"
          animate="animate"
          custom={percentage}
        />
      </div>
    </motion.div>
  );
});

LoadingMessage.displayName = "LoadingMessage";