import api from './axios'
import type { LoginRequest } from '../dto/Request'
import type { LoginResponse, User, Response } from '../dto/Response'

export function getToken(request: LoginRequest) {
    return api.post<LoginResponse>('Auth/token', request);
}

export function getUser(userId: number) {
    return api.get<Response<User>>(`User/fetch/${userId}/test`)
}
