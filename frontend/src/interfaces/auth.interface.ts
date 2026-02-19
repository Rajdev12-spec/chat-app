
export interface SignInPayload {
  email: string
  password: string
}

export interface SignInResponse {
  accessToken: string
  user: {
    id: string
    email: string
  }
}
export interface UserData{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
  avatar: string
}
