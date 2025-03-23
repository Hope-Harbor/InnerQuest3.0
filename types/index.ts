export interface QuestionResponse {
  question: string;
  answer: string;
}

export interface SessionData {
  clientUuid: string;
  userRole: string;
  responses: QuestionResponse[];
}