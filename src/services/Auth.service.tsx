import api from './axios'
import type { AddCandidateRequest, AddUserRequest, LoginRequest } from '../dto/Request'
import type { LoginResponse, User, Response, AdminDashboardDetails, Candidate } from '../dto/Response'

export function getToken(request: LoginRequest) {
    return api.post<LoginResponse>('Auth/token', request);
}

export function getUser(userId: number) {
    return api.get<Response<User>>(`User/fetch/${userId}/test`)
}

export function getUsers(role: string | null = null, 
isActive: boolean | null = null, isLatestFirst: boolean | null = null, 
pageNumber: number | null = null, pageSize: number | null = null, 
startDate: Date | null = null, endDate: Date | null = null) {
    return api.get<Response<Array<User>>>('User/fetch/all/test', { 
        params: {role, isActive, isLatestFirst, pageNumber, pageSize, startDate, endDate} 
    });
}

export function editUser(payload: any) {
    return api.post<Response<User>>('User/edit/test', payload);
}

export function addUser(payload: AddUserRequest) {
    return api.post<Response<User>>('User/add/test', payload);
}

export function getCandidate(candidateId: number) {
    return api.get<Response<Candidate>>(`Candidate/fetch/${candidateId}/test`)
}

export function getCandidates(experienceLevel: string | null = null, 
isLatestFirst: boolean | null = null, 
pageNumber: number | null, pageSize: number | null, 
startDate: Date | null = null, endDate: Date | null = null) {
    return api.get<Response<Array<Candidate>>>('Candidate/fetch/all/test', { 
        params: {experienceLevel, isLatestFirst, pageNumber, pageSize, startDate, endDate} 
    });
}

export function editCandidate(payload: any) {
    return api.post<Response<Candidate>>('Candidate/edit/test', payload);
}

export function addCandidate(payload: AddCandidateRequest) {
    return api.post<Response<Candidate>>('Candidate/add/test', payload);
}

export function candidateBulkUpload(file: File) {
    const formData = new FormData().append("file", file);
    return api.post<Response<Array<number>>>('Candidate/upload/bulk/test', formData, {
        headers: { "Content-Type": "multipart/form-data"}
    });
}

export function getAdminDashboardDetails() {
    return api.get<Response<AdminDashboardDetails>>('Admin/dashboard/details/test')
}
