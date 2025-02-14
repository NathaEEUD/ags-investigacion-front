"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { InfoIcon, Settings } from "lucide-react"
import { AgentSearch } from "./agent-search"
import { toast } from "sonner"
import { useApi } from "@/hooks/use-api"

interface SelectAgentModalProps {
    email: string;
    onSuccess: () => void;
    refreshAgentKey: number;
}

export function SelectAgentModal({ email, onSuccess, refreshAgentKey }: SelectAgentModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState("")
    const [researcherType, setResearcherType] = useState<"primary" | "contributor">("contributor")
    const api = useApi()

    const handleNewAgentSubmit = async () => {
        setIsSaving(true)
        try {
            if (!email || !selectedAgent) {
                throw new Error('Información incompleta')
            }

            const payload = {
                email,
                agent: selectedAgent,
                researcher_type: researcherType
            }

            await api.post('/researchers-managements/researchers/assign-agent', payload)

            setIsOpen(false)
            toast.success("Agente asignado correctamente")
            setSelectedAgent("")
            setResearcherType("contributor")
            onSuccess()
        } catch (error) {
            console.error('Error assigning agent:', error)
            toast.error("Error al asignar el agente")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full"
                >
                    <Settings className="mr-2 h-4 w-4" />
                    Investigar Nuevo Agente
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Seleccionar Nuevo Agente</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Label className="text-base">Tipo de Investigador</Label>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Tipos de Investigador</h4>
                                        <div className="text-sm space-y-2">
                                            <p>
                                                <strong>Investigador Primario:</strong> Realiza presentaciones
                                                semanales y participa activamente en las sesiones de revisión.
                                            </p>
                                            <p>
                                                <strong>Investigador Contribuidor:</strong> Aporta documentación
                                                a la plataforma sin compromiso de presentaciones.
                                            </p>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                        <RadioGroup
                            value={researcherType}
                            onValueChange={(value: "primary" | "contributor") => setResearcherType(value)}
                            className="flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="primary" id="primary" />
                                <Label htmlFor="primary" className="font-normal">
                                    Investigador Primario
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="contributor" id="contributor" />
                                <Label htmlFor="contributor" className="font-normal">
                                    Investigador Contribuidor
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Selecciona un Agente de Investigación</Label>
                        <AgentSearch
                            key={refreshAgentKey}
                            onSelect={(value) => setSelectedAgent(value)}
                        />
                    </div>

                    <Button
                        onClick={handleNewAgentSubmit}
                        className="w-full"
                        disabled={isSaving || !selectedAgent}
                    >
                        {isSaving ? "Asignando agente..." : "Asignar Agente"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 