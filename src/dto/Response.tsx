export interface AdminDashboardDetails {
    totalUsers: number;
    activeUsers: number,
    inactiveUsers: number,
    totalPanelMembers: number;
    totalMentors: number;
    totalHrs: number;
    totalCandidates: number;
    totalCandidatesHired: number;
    totalCandidatesRejected: number;
    totalDrives: number,
    scheduledDrives: number,
    ongoingDrives: number,
    haltedDrives: number,
    completedDrives: number,
    cancelledDrives: number,
    totalInterviews: number;
    interviewsScheduled: number;
    interviewsOnProcess: number;
    interviewsCompleted: number;
    interviewsSkipped: number;
}

export interface User {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    isActive: boolean;
    roleId: number;
    roleName: string;
    createdDate: Date;
    updatedDate: Date;
}

export interface LoginResponse extends Response<string> {
}

export interface Response<T> extends BaseResponse {
    data?: T | null;
}

export interface BaseResponse {
    warnings: Array<string>;
    errors: Array<ValidationError>;
}

interface ValidationError {
    propertyName: string;
    errorMessage: string;
}

export interface ErrorResponse {
    statusCode: number;
    message: string;
    traceId?: string | null;
    stackTrace?: string | null;
}