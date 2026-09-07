export interface ISetPasswordPayload {
  password: string;
  confirmPassword: string;
  tokenId: string;
}

export interface ITokenPyalod{
    token:string,
    email:string
}

export interface IUpdateTeacherProfile {
  phone: string;
  gender: string;
  dateOfBirth: Date;
  address: string;
  designation: string;
  bio: string;
  specialization: string;
  qualification: string;
  experience: string;
  profilePhoto?: string;
}