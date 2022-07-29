/* eslint-disable @typescript-eslint/naming-convention */
export interface User
{
    id: number;
    name: string;
    email: string;
    department: Department;
    avatar?: string;
    user_image: string;
    status?: string;
    role?:Role
}
export interface Role
{
    name:string
}

export interface Department
{
    id: number
    name:string
}
