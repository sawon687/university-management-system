import { Role, StudentStatus } from '../../../generated/prisma/enums';

export interface Query{
    role:Role,
    status:StudentStatus
}