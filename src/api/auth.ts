import { api } from './client';
import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  RegisterBabyRequest,
  changePasswordRequest,
  changePasswordResponse,
} from '../types/auth';

export const authApi = {
  signup: (data: SignUpRequest) =>
    api.post<SignUpResponse>('/auth/signup', data),

  signin: (data: SignInRequest) =>
    api.post<SignInResponse>('/auth/signin', data),

  registerBaby: (data: RegisterBabyRequest) =>
    api.post<SignInResponse>('/auth/register-baby', data),

  changePassword: (data: changePasswordRequest) =>
    api.post<changePasswordResponse>('/auth/change-password', data),
};

