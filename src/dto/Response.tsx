
export interface LoginResponse extends Response<string> {
}

export interface Response<T> extends BaseResponse {
    data?: T
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
    traceId?: string,
    stackTrace?: string
}