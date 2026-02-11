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
    createdDate: string;
    updatedDate?: string | null;
}

export interface Candidate {
    candidateId: number;
    fullName: string;
    email: string;
    phone: string;
    address: string | null;
    college: string | null;
    previousCompany: string | null;
    candidateExperienceLevel: string;
    techStack: Array<string>;
    resumeUrl: string | null;
    linkedInUrl: string | null;
    gitHubUrl: string | null;
    createdDate: string;
}

export interface Drive {
    driveId: number;
    driveName: string;
    driveDate: string;
    technicalRounds: number;
    driveStatus: string;
    createdBy: number;
    creatorName: string;
    createdDate: string;
}

export interface DriveMember {
    driveMemberId: number;
    driveId: number;
    driveName: string;
    driveDate: string;
    driveStatus: string;
    userId: number;
    userName: string;
    userEmail: string;
    roleId: number;
    roleName: string;
}

export interface DriveCandidate {
    driverCandidateId: number;
    candidateId: number;
    candidateName: string;
    candidateEmail: string;
    driveId: number;
    driveName: string;
    driveDate: string;
    driveStatus: string;
    candidateStatus: string;
    statusSetBy: number | null;
}

export interface DriveConfig {
  driveId: number;
  hrConfiguration: HrConfiguration;
  panelConfiguration: PanelConfiguration;
  mentorConfiguration: MentorConfiguration;
  panelVisibilitySettings: PanelVisibilitySettings;
  notificationSettings: NotificationSettings;
  feedbackConfiguration: FeedbackConfiguration;
}
export interface HrConfiguration {
  configId: number;
  driveId: number;
  allowBulkUpload: boolean;
  canEditSubmittedFeedback: boolean;
  allowPanelReassign: boolean;
  requireApprovalForReassignment: boolean;
}
export interface PanelConfiguration {
  configId: number;
  driveId: number;
  canEditSubmittedFeedback: boolean;
  allowPanelReassign: boolean;
  requireApprovalForReassignment: boolean;
}
export interface MentorConfiguration {
  configId: number;
  driveId: number;
  canViewFeedback: boolean;
  allowPanelReassign: boolean;
  requireApprovalForReassignment: boolean;
}
export interface PanelVisibilitySettings {
  visibilityId: number;
  driveId: number;
  showPhone: boolean;
  showEmail: boolean;
  showPreviousCompany: boolean;
  showResume: boolean;
  showCollege: boolean;
  showAddress: boolean;
  showLinkedIn: boolean;
  showGitHub: boolean;
}
export interface NotificationSettings {
  notificationId: number;
  driveId: number;
  emailNotificationEnabled: boolean;
}
export interface FeedbackConfiguration {
  feedbackConfigId: number;
  driveId: number;
  overallRatingRequired: boolean;
  technicalSkillRequired: boolean;
  communicationRequired: boolean;
  problemSolvingRequired: boolean;
  recommendationRequired: boolean;
  overallFeedbackRequired: boolean;
}

export interface Round {
  roundId: number;
  driveId: number;
  driveName: string;
  driveDate: string; // ISO string from backend
  driveStatus: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  userId: number;
  userName: string;
  userEmail: string;
  type: string;          // Tech1 / Tech2 / HR
  roundStatus: string;   // Skipped / Completed / Scheduled / OnProcess
  roundResult: string;   // Selected / Rejected / Pending
  feedbackId: number | null;
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