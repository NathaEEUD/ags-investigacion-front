"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

const IGNORED_USERS = ['pargara']; // Lista de usuarios a ignorar

export function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    // Aquí puedes hacer la llamada a la API de GitHub
    // Por ahora, usaremos datos de ejemplo
    const fetchContributors = async () => {
      try {
        const response = await fetch('https://api.github.com/orgs/tribu-ia/repos');
        const repos = await response.json();
        
        let allContributors: Contributor[] = [];
        
        for (const repo of repos) {
          const contributorsResponse = await fetch(
            `https://api.github.com/repos/tribu-ia/${repo.name}/contributors`
          );
          const repoContributors = await contributorsResponse.json();
          allContributors = [...allContributors, ...repoContributors];
        }

        // Eliminar duplicados y filtrar usuarios ignorados
        const uniqueContributors = Array.from(
          new Map(
            allContributors
              .filter(contributor => !IGNORED_USERS.includes(contributor.login))
              .map(item => [item.id, item])
          ).values()
        );

        setContributors(uniqueContributors);
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <>
      {/* Desktop version */}
      <motion.div 
        className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-4">
          <h3 className="text-sm text-center text-blue-400 mb-4">Colaboradores</h3>
          <ul className="flex flex-col gap-2 items-center">
            {contributors.map((contributor, index) => (
              <motion.li
                key={contributor.id}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative"
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={`Avatar de ${contributor.login}`}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-blue-500/20 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-blue-500/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {contributor.login}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-black/50 backdrop-blur-md"
            onClick={() => window.open('https://github.com/tribu-ia', '_blank')}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-black/50 backdrop-blur-md"
            onClick={() => window.open('https://chat.whatsapp.com/Kxi3ftAYymLJ79YbYR6vXm', '_blank')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </motion.div>

      {/* Mobile version */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/80 backdrop-blur-md p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs text-blue-400">Colaboradores</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => window.open('https://github.com/tribu-ia', '_blank')}
              >
                <Github className="h-3 w-3 mr-1" />
                GitHub
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => window.open('https://chat.whatsapp.com/Kxi3ftAYymLJ79YbYR6vXm', '_blank')}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Chat
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <ul className="flex gap-2 items-center pb-1">
              {contributors.map((contributor, index) => (
                <motion.li
                  key={contributor.id}
                  className="relative flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative group"
                  >
                    <Image
                      src={contributor.avatar_url}
                      alt={`Avatar de ${contributor.login}`}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-blue-500/20"
                    />
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-blue-500/90 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {contributor.login}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
} 