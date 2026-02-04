export interface AddUserRequest {
    fullName: string,
    email: string;
    phone: string;
    roleName: string;
    password: string;
}

export interface LoginRequest {
    username: string,
    password: string
}