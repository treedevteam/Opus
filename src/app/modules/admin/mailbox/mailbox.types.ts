/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable eol-last */
export interface Mail
{
    id?: string;
    type?: string;
    from?: {
        avatar?: string;
        contact?: string;
    };
    to?: string;
    cc?: string[];
    ccCount?: number;
    bcc?: string[];
    bccCount?: number;
    date?: string;
    subject?: string;
    content?: string;
    attachments?: {
        type?: string;
        name?: string;
        size?: number;
        preview?: string;
        downloadUrl?: string;
    }[];
    starred?: boolean;
    important?: boolean;
    unread?: boolean;
    folder?: string;
    labels?: string[];
}

export interface MailCategory
{
    type: 'folder' | 'filter' | 'label';
    name: string;
}

export interface MailFolder
{
    id: string;
    title: string;
    slug: string;
    icon: string;
    count?: number;
}

export interface MailFilter
{
    id: string;
    title: string;
    slug: string;
    icon: string;
}

export interface MailLabel
{
    id: string;
    title: string;
    slug: string;
    color: string;
}
export interface Maill
{
    id: number;
    subject: string;
    conten: string;
    files: object;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    sent_to: {
        name: string;
        image: string;
    };
    sender: {
        name: string;
        image: string;
    };
    read: number;
}

export interface SentEmails
{
    id: number;
    subcject: string;
    content: string;
    user_id: 11;
    files: string;
}