
interface PlanSection {
    id: string;
    name: string;
    description: string;
    research: boolean;
  }
  type StartedMessage =  {
    type: string;
    message:string;
    plan?: PlanSection[];
  };
export const HML_MOCK_FEEDBACK:StartedMessage =  {
    "type": "human_review",
    "message": "¿Apruebas este plan? (Responde 'continuar' o sugiere cambios)",
    "plan": [
        {
            "id": "1",
            "name": "Introducción",
            "description": "Presentación de n8n como plataforma de automatización de flujos de trabajo, su relevancia en el contexto actual de la automatización y la inteligencia artificial, y un resumen de los temas que se abordarán en el documento.",
            "research": false
        },
        {
            "id": "2",
            "name": "Características de n8n",
            "description": "Exploración de las principales características de n8n, incluyendo su naturaleza de código abierto, la capacidad de integración con múltiples aplicaciones, y su constructor visual de flujos de trabajo.",
            "research": true
        },
        {
            "id": "3",
            "name": "Ventajas de usar n8n",
            "description": "Análisis de las ventajas competitivas que ofrece n8n en comparación con otras herramientas de automatización, como la reducción de costos operativos, la flexibilidad en la creación de flujos de trabajo y el control sobre los datos.",
            "research": true
        },
        {
            "id": "4",
            "name": "Casos de uso de n8n en empresas",
            "description": "Presentación de ejemplos prácticos de cómo las empresas están utilizando n8n para automatizar procesos, mejorar la eficiencia y optimizar la gestión de recursos.",
            "research": true
        },
        {
            "id": "5",
            "name": "Integración de IA en n8n",
            "description": "Discusión sobre cómo n8n combina la automatización de flujos de trabajo con inteligencia artificial, y cómo esto puede transformar procesos empresariales.",
            "research": true
        },
        {
            "id": "6",
            "name": "Conclusión",
            "description": "Síntesis de los puntos clave discutidos en el documento, reflexiones sobre el futuro de la automatización con n8n y su impacto en los procesos empresariales.",
            "research": false
        }
    ]
}