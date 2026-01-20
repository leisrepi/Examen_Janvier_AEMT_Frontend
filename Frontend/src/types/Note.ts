export interface Note{
    idNote: number;
    nameNote: string;
    contentNote: string;
    creationDateNote: Date;
    lastModificationNote: Date;
    idFolder: number | null;
}