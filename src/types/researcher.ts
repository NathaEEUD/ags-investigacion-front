export type SuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    githubUsername: string;
    avatarUrl: string;
    repositoryUrl: string;
    linkedinProfile: string | null;
    agentId: string;
    status: string;
    role: string;
  };
  researcher_type: "PRIMARY" | "CONTRIBUTOR";
  presentationDateTime: string | null;
  errorType: string | null;
  errorCode: string | null;
} 

export type ResearcherDetails = {
  name: string;
  email: string;
  avatarUrl: string;
  agentName: string;
  agentDescription: string;
  agentCategory: string;
  agentIndustry: string;
  primaryResearches: {
    assignmentId: string;
    agentName: string;
    agentDescription: string;
    agentCategory: string;
    agentIndustry: string;
    status: string;
  }[];
  contributorsResearches: {
    assignmentId: string;
    name: string;
    shortDescription: string;
    category: string;
    industry: string;
    status: string;
  }[];
};