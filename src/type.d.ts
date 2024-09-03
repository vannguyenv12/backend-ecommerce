declare namespace Express {
  export interface Request {
    currentUser: UserPayload;
  }
}

interface UserPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
}