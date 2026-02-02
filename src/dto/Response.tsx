export interface User {
    userId: number,
    fullName: string,
    email: string,
    phone: string,
    isActive: boolean,
    roleId: number,
    roleName: string,
    createdDate: Date,
    updatedDate: Date
}

export interface LoginResponse extends Response<string> {
}

export interface Response<T> extends BaseResponse {
    data?: T | null
}

export interface BaseResponse {
    warnings: Array<string>,
    errors: Array<ValidationError>
}

interface ValidationError {
    propertyName: string,
    errorMessage: string
}

export interface ErrorResponse {
    statusCode: number,
    message: string,
    traceId?: string | null,
    stackTrace?: string | null
}