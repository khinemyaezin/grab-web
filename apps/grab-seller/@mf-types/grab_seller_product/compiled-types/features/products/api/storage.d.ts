export declare function collapseRequiredHeaders(headers?: Record<string, string>): Record<string, string>;
export declare function putPresignedObject(url: string, body: Blob, requiredHeaders?: Record<string, string>, method?: string): Promise<void>;
