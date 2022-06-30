export interface User
{
    id: string;
    name: string;
    email: string;
    department: Department;
    avatar?: string;
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
