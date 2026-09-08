import { UserStatus } from '../../../generated/prisma/enums';
import { UsersWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import { IDepartment } from "../admin/admin.interface";
import { Query } from "./super-admin.interface";

class SuperAdminService {
  async createDepartmentDB(payload: IDepartment) {
    const { name, code, description } = payload;
    const departmentExits = await prisma.department.findUnique({
      where: { code },
    });
    if (departmentExits) {
      throw new Error("Already this department created");
    }

    const result = await prisma.department.create({
      data: {
        name,
        code,
        description,
      },
    });

    return result;
  }

  async getAllDepartmentDB() {
    const result = await prisma.department.findMany();
    return;
  }

  async getAllUserDB(queray: Query) {
    const { role, status } = queray;
    const whereQuery: UsersWhereInput = {};
    if (role) {
      whereQuery.role = role;
    }
    if (status) {
      whereQuery.status = status;
    }
    const result = await prisma.users.findMany({ where: whereQuery });
    return result;
  }

   async updateStatusUserDB(id:string,status:UserStatus) {
        if(!status)
        {
             throw new Error('status is empty')
        }
    const result = await prisma.users.update({ where:{id},data:{
        status
    } });
    return result;
  }

  async departmentAdminAssignDB(){

  }
}

export default new SuperAdminService();
