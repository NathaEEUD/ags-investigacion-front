import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Message } from "./types";
import { UserMessage } from "./user-message";
import { AgentMessage } from "./agent-message";
import { LoadingMessage } from "./loading-message";

// Hook para detectar si estamos en móvil
function useIsMobile() {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  return isMobile;
}

// Variantes para el contenedor de mensajes vacío
const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
      type: "spring",
      stiffness: 200,
    },
  },
};

// Componente para renderizar un mensaje individual
const MessageItem = ({ message }: { message: Message }) => {
  if (message.type === "loading") {
    return <LoadingMessage message={message} />;
  }

  if (message.type === "user") {
    return <UserMessage message={message} />;
  }

  return <AgentMessage message={message} />;
};

export function AgentChat({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isConnected] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Fases de investigación predefinidas
  const researchPhases = [
    "Investigando...",
    "Analizando información...",
    "Sintetizando resultados...",
    "Generando conclusiones...",
  ];
  const writingPhases = [
    "Planificando estructura...",
    "Redactando contenido...",
    "Revisando coherencia...",
    "Finalizando documento...",
  ];

  // Función para simular el progreso a través de las fases
  const simulatePhaseProgress = (messageId: string, phases: string[]) => {
    let currentPhase = 0;

    const interval = setInterval(() => {
      if (currentPhase < phases.length) {
        // Usar una función de actualización para evitar cierres sobre estados antiguos
        setMessages((prevMessages) => {
          // Crear una copia profunda solo del mensaje que está cambiando
          return prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, currentPhase } : msg
          );
        });
        currentPhase++;
      } else {
        clearInterval(interval);

        // Cuando terminan las fases, mostrar la respuesta final
        setTimeout(() => {
          setMessages((prevMessages) => {
            // Filtrar el mensaje de carga
            const updatedMessages = prevMessages.filter(
              (msg) => msg.id !== messageId
            );

            // Determinar qué tipo de respuesta dar basado en las fases
            let responseContent = "";
            if (phases === researchPhases) {
              responseContent =
                "He generado una investigación base sobre el tema solicitado. ¿Quieres continuar con este planteamiento o prefieres ajustarlo?";
            } else if (phases === writingPhases) {
              responseContent =
                "He redactado el documento según tus indicaciones. ¿Hay algún aspecto específico que quieras que desarrolle más a fondo?";
            }

            // Añadir el nuevo mensaje de respuesta
            return [
              ...updatedMessages,
              {
                id: Date.now().toString(),
                type: "agent",
                content: responseContent,
                timestamp: new Date(),
                isNew: true,
              },
            ];
          });

          setIsLoading(false);
        }, 500);
      }
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        type: "user",
        content: inputValue,
        timestamp: new Date(),
        isNew: true,
      },
    ]);

    setInputValue("");
    setIsLoading(true);

    // Determinar qué conjunto de fases usar basado en los mensajes previos
    const useWritingPhases = messages.some(
      (msg) =>
        msg.type === "agent" && msg.content.includes("investigación base")
    );

    // Agregar mensaje de carga con fases
    const loadingMessageId = (Date.now() + 1).toString();
    const phasesToUse = useWritingPhases ? writingPhases : researchPhases;

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: loadingMessageId,
          type: "loading",
          content: "",
          timestamp: new Date(),
          phases: phasesToUse,
          currentPhase: 0,
          isNew: true,
        },
      ]);

      simulatePhaseProgress(loadingMessageId, phasesToUse);
    }, 500);
  };

  // Scroll al final de los mensajes cuando se añade uno nuevo
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AnimatePresence>
      <motion.div
        className={isMobile ? "fixed bottom-0 left-0 right-0 z-50 w-full" : ""}
        initial={isMobile ? { y: 0 } : { x: 500 }}
        animate={isMobile ? { y: isOpen ? 0 : "calc(100% - 64px)" } : { x: 0 }}
        exit={isMobile ? { y: "100%" } : { x: 500 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <Sidebar
          collapsible="none"
          className={
            isMobile
              ? "w-full h-[80vh] border-t rounded-t-xl bg-gradient-to-tr from-[#24264A] from-10% via-[#24264A]/70 via-40% to-background to-90%"
              : "sticky hidden lg:flex top-0 h-svh w-[500px] max-w-[500px] bg-gradient-to-br from-[#24264A]/50 from-0% to-background/40 to-30%"
          }
          {...props}
        >
          <SidebarHeader
            className={`h-16 border-b border-[#24264A]/50 ${
              isMobile ? "cursor-pointer" : ""
            }`}
            onClick={isMobile ? () => setIsOpen(!isOpen) : undefined}
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="logo"
                width={50}
                height={50}
                className="rounded-full border-2 border-[#24264A]"
              />
              <div className="flex flex-col">
                <h2
                  className={
                    isMobile ? "text-md font-semibold" : "text-lg font-semibold"
                  }
                >
                  Agente Investigador
                </h2>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={
                      isMobile
                        ? "text-xs text-muted-foreground"
                        : "text-sm text-muted-foreground"
                    }
                  >
                    Conectado
                  </span>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex flex-col p-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  key="empty-state"
                  variants={emptyStateVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={100}
                      height={100}
                      className="rounded-full border-2 border-[#24264A] opacity-50 mb-4"
                    />
                  </motion.div>
                  <motion.h3
                    className="text-lg font-semibold mb-2"
                    animate={{
                      color: ["#6366f1", "#8b5cf6", "#ec4899", "#6366f1"],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    Agente Investigador
                  </motion.h3>
                  <motion.p
                    className="text-sm max-w-[80%]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Envía un mensaje para comenzar una investigación sobre
                    cualquier tema.
                  </motion.p>
                </motion.div>
              ) : (
                <div className="flex flex-col space-y-4 w-full overflow-x-hidden">
                  {messages.map((message) => (
                    <MessageItem key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-[#24264A]/50">
            <motion.div
              className="flex items-center gap-2 w-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Input
                placeholder="Escribe tu mensaje..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="relative overflow-hidden"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4" />
                      <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ x: "-100%" }}
                        animate={{ x: inputValue.trim() ? "100%" : "-100%" }}
                        transition={{
                          duration: 1,
                          repeat: inputValue.trim() ? Infinity : 0,
                          repeatDelay: 0.5,
                        }}
                      />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </SidebarFooter>
        </Sidebar>
      </motion.div>
    </AnimatePresence>
  );
}
