export interface CreateRequestResponse {
    id: string;
}

export interface ErrorResponse {
    error: string;
    details?: Record<string, string[]>;
}

export interface AnalysisRequestDocument {
    _id: string;
    source_url: string;
    created_at: Date;
}
