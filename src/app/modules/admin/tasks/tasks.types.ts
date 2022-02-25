import { Departments } from '../pages/departaments/model/departments.model';
import { Priorities } from '../priorities/model/priorities';
import { Status } from '../statuses/model/status';

export interface Tag
{
    id?: string;
    title?: string;
}

export interface Task
{
    id: string;
    type: 'task' | 'section';
    title: string;
    notes: string;
    completed: boolean;
    dueDate: string | null;
    priority: 0 | 1 | 2;
    tags: string[];
    order: number;
}
export class Users {
    id: number;
    name: string;
    email: string;
    department_id: Departments;
    role: number;
    user_image: string;
    last_seen: string;
}


export interface Task2
{
    id: number;
    title: string;
    raport: string;
    deadline: string;
    restrictions: string;
    description: string ;
    status: number;
    priority: number;
    location: number;
    user: Users;
    users_assigned: number[];
    departments: number[];
    has_expired: boolean;
    // department: string | null;
}

export interface TaskWithDepartment{
    id: number;
    name: string;
    tasks: Task2[];
}

