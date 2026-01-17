/**
 * User model with role-based access control
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  RESEARCHER = 'researcher',
  LAB_TECH = 'lab_tech'
}
