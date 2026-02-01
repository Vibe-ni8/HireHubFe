import api from '../api/axios'
import type { LoginRequest } from '../dto/Request'
import type { LoginResponse } from '../dto/Response'

export function getToken(request: LoginRequest) {
    return api.post<LoginResponse>('Auth/token', request)
}