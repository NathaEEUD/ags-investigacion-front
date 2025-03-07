import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Message } from "./types";

interface AgentMessageProps {
  message: Message;
}

// Variantes para las partículas de brillo
const sparkleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    transition: {
      delay: i * 0.2,
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 3,
    },
  }),
};

// Variante para animación de entrada
const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const AgentMessage = React.memo(({ message }: AgentMessageProps) => {
  return (
    <motion.div
      className="p-3 rounded-lg bg-[#24264A]/30 self-start max-w-[80%] relative"
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      {message.content}

      {/* Partículas de brillo para mensajes del agente */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`sparkle-${message.id}-${i}`}
          custom={i}
          variants={sparkleVariants}
          initial="hidden"
          animate="visible"
          className="absolute"
          style={{
            top: `${-5 + Math.random() * 10}px`,
            left: `${Math.random() * 100}%`,
            width: "8px",
            height: "8px",
          }}
        >
          <Sparkles className="text-primary w-full h-full" />
        </motion.div>
      ))}
    </motion.div>
  );
});

AgentMessage.displayName = "AgentMessage";