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
import { SendIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

// Hook para detectar si estamos en móvil
function useIsMobile() {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  return isMobile;
}

export function AgentChat({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isConnected, setIsConnected] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      <motion.div
        className={isMobile ? "fixed bottom-0 left-0 right-0 z-50 w-full" : ""}
        initial={isMobile ? { y: 0 } : { x: 500 }}
        animate={
          isMobile
            ? { y: isOpen ? 0 : "calc(100% - 64px)" }
            : { x: 0 }
        }
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
            className={`h-16 border-b border-[#24264A]/50 ${isMobile ? "cursor-pointer" : ""}`}
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
                <h2 className={isMobile ? "text-md font-semibold" : "text-lg font-semibold"}>Agente Investigador</h2>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className={isMobile ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>
                    Conectado
                  </span>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent></SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2">
              <Input placeholder="Escribe tu mensaje..." />
              <Button>
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
      </motion.div>
    </AnimatePresence>
  );
}
