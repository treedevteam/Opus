export class Dashboard {
}


export interface Posts{
    id: number,
    description: string,
    file: string,
    user_id:number,
    replies: Replies[],
    likes: number[]
}
export interface Replies{
    id: number,
    text: string,
    user_id: number,
    post_id: number,
    created_at: string,
}
