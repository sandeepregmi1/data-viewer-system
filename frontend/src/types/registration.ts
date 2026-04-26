
// /home/sandeep/Projects/data-viewer-system/frontend/src/types/registration.ts
export interface TeamMember {
    name: string;
    github: string;
}

export interface Registration {
    _id: string;
    full_name: string;
    email: string;
    age: number;
    phone_number: string;
    institution: string;
    role: string;
    track: string;
    team_name: string;
    team_size: number;
    experience: string;
    github_portfolio: string;
    linkedin: string;
    coc_accepted: boolean;
    team_members: TeamMember[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export { };