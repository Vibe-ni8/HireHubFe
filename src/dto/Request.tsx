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

export interface AddMemberToDriveRequest {
    driveId: number;
    memberId: number;
    memberRole: string;
}

export interface AddCandidatesToDriveRequest {
    driveId: number;
    candidateIds: number[];
}

export interface RemoveDriveMemberRequest {
    driveId: number;
    memberId: number;
}

export interface RemoveDriveCandidatesRequest {
    driveId: number;
    candidateIds: number[];
}

export interface LoginRequest {
    username: string,
    password: string
}