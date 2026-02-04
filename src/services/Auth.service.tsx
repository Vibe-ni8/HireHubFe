import api from './axios'
import type { AddUserRequest, LoginRequest } from '../dto/Request'
import type { LoginResponse, User, Response, AdminDashboardDetails } from '../dto/Response'

export function getToken(request: LoginRequest) {
    return api.post<LoginResponse>('Auth/token', request);
}

export function getUser(userId: number) {
    return api.get<Response<User>>(`User/fetch/${userId}/test`)
}

export function getUsers(role: string | null, isActive: boolean | null, 
pageNumber: number | null, pageSize: number | null) {
    return api.get<Response<Array<User>>>('User/fetch/all/test', { params: {role, isActive, pageNumber, pageSize} });
}

export function editUser(payload: any) {
    return api.post<Response<User>>('User/edit/test', payload);
}

export function addUser(payload: AddUserRequest) {
    return api.post<Response<User>>('User/add/test', payload);
}

export function getAdminDashboardDetails() {
    return api.get<Response<AdminDashboardDetails>>('Admin/dashboard/details/test')
}
