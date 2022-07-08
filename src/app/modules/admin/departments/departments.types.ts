export interface Departments{
    id: number;
    name: string;
    image: any;
    status:boolean
}

export interface Boards{
    id: number;
    department_id: string;
    name: string;
    description: string;
    type: any;
}
