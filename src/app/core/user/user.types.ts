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
    image: string;
    user_image: string;
    color:string;
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
