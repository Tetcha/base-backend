import { Student } from './src/core/models';

declare module 'express' {
  export interface Request {
    account: Student;
  }
}
