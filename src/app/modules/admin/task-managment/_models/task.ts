export interface Task
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
    board_id: number;
    user: Users;
    users_assigned: number[];
    departments: number[];
    has_expired: boolean;
    subtasks_count: number;
    checklists: TaskCheckList[];
    file: any;
    checkListInfo:any
}

export interface Users{
    id: number;
    name: string;
    email: string;
    department_id: number;
    role: number;
    user_image: string;
    last_seen: string;
    selected: boolean;
}

export interface TaskLogs{
    message?: string;
    created_at: string;
    type: {
        name: string;
        image: string;
    };
}

export interface TaskCheckList{
    id: number;
    task_id: number;
    text: string;
    value: number;
}

export interface TaskComment{
    id: number;
    text: string;
    image: string;
    is_his: boolean;
    user_id: number;
    created_at: string;
    mentions: number[];
}

export interface Board{
    id: number;
    department_id: string;
    name: string;
    description: string;
    type: any;
    is_his:number
}