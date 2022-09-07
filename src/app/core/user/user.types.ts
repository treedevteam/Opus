/* eslint-disable @typescript-eslint/naming-convention */
export interface User
{
    id: number;
    name: string;
    email: string;
    department: Department;
    avatar?: string;
    status?: string;
    role?:Role
    user_image: string;
}
export interface Role
{
    name:string,
    id:number
}

export interface Department
{
    id: number
    name:string
    image:string
}
