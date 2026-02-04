export interface AddUserRequest {
    fullName: string,
    email: string;
    phone: string;
    roleName: string;
    password: string;
}

export interface AddCandidateRequest {
    fullName: string;
    email: string;
    phone: string;
    address: string | null;
    college: string | null;
    previousCompany: string | null;
    experienceLevelName: string;
    techStack: Array<string>;
    resumeUrl: string | null;
    linkedInUrl: string | null;
    gitHubUrl: string | null;
}

export interface LoginRequest {
    username: string,
    password: string
}