import React from 'react';
import Loader from "@/components/ui/custom/shared/loader";
import Link from "next/link";

/**
 * Loading State Component
 * Displays a loading spinner with a message
 */
export function LoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="space-y-4 text-center">
        <Loader />
        <p className="text-muted-foreground">Cargando información...</p>
      </div>
    </div>
  );
}

/**
 * Not Researcher State Component
 * Displayed when user is not registered as a researcher
 */
export function NotResearcherState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold">Aún no eres investigador</h2>
      <p className="text-muted-foreground max-w-md">
        Para comenzar tu investigación, primero debes registrarte como
        investigador.
      </p>
    </div>
    <Link
      href="/dashboard/documentation/nuevo-agente"
      className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Comenzar a Investigar
    </Link>
  </div>
  );
}

/**
 * No Active Research State Component
 * Displayed when user has no active research projects
 */
export function NoActiveResearchState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold">
        No tienes investigaciones activas
      </h2>
      <p className="text-muted-foreground max-w-md">
        Aquí no termina todo, puedes investigar un nuevo agente.
      </p>
    </div>
    <a
      href="/dashboard/documentation/nuevo-agente"
      className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Investigar nuevo agente
    </a>
  </div>
  );
}