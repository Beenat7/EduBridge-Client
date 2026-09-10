export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  roles: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}
