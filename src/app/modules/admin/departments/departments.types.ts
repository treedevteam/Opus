export interface Departments{
    id: number;
    name: string;
    image: any;
}

export interface Boards{
    id: number;
    department_id: string;
    name: string;
    description: string;
    type: any
}