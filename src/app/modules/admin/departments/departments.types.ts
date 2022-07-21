export interface Departments{
    id: number;
    name: string;
    image: any;
    status:boolean
}

export interface Boards{
    findIndex(arg0: (x: any) => boolean);
    splice(index: any, arg1: number);
    id: number;
    department_id: string;
    name: string;
    description: string;
    type: any;
    users_assigned: any;
    border_order: string;
    is_his: any;
}
