declare namespace Express {
  export interface User {
    userId: number;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    dob?: Date;
    address?: string;
    rating?: double;
    roleId: number;
    banned?: boolean;
  }
}
