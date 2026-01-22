export interface Folder{
    notes: any;
    idFolder: number;
    nameFolder: string;
    idParent : number | null;
    toBin : boolean;
    dateBinFolder : Date | null;
    creationDateFolder : Date;
    lastModificationFolder : Date;

}