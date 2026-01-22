import axios from 'axios';
import {type Folder} from '../types/Folder';
import {type Note} from '../types/Note';


interface FolderResponse {
  idFolder: number;
  nameFolder: string;
  idParent: number | null;
  notes: Note[];
  SousDossier: any[]; // tu peux typer plus tard
}



export type Item = Folder | Note;




const API_BASE_URL = 'http://localhost:8080/spooky-api';

export const getAllFolders = async (): Promise<Item[]> => {
    const response = await axios.get(`${API_BASE_URL}/folder`);
    console.log('Fetched folders:', response.data);
   
    let listNote = response.data.orphanNotes as Note[];
    let listFolder = response.data.folders as Folder[];
    if (!listNote) {
        listNote = [];
    }
    if (!listFolder) {
        listFolder = [];
    }
    const finalItems: Item[] = listFolder;
    for (const note of listNote) {
        finalItems.push(note);
    }
    return finalItems;
}

export const getNotesInFolder = async (folderId: number): Promise<Note[]> => {
    const response = await axios.get<Note[]>(`${API_BASE_URL}/folder/${folderId}/notes`);
    return response.data;
}
//renvoie les dossiers et notes enfants d'un dossier
export const getFolderChildreen = async (folderId: number): Promise<Item[]> => {
    console.log(`Fetching children of folder ID: ${folderId}`);
    const url = `${API_BASE_URL}/folder/${folderId}`;
    console.log(`Constructed URL: ${url}`);
    const response = await axios.get<FolderResponse>(url);
    console.log('Response data:', response.data);
    let listNote = response.data.notes as Note[];
    let listFolder = response.data.SousDossier as Folder[];
    return [...listNote, ...listFolder];
}
export const createFolder = async (id : number|null): Promise<Folder> => {
    const response = await axios.post<Folder>(`${API_BASE_URL}/folder`, {
        "nameFolder": "Nouveau dossier",
        "parentId": id
    });
    return response.data;
}



export const createNote = async (folderId: number | null, nameNote: string, contentNote: string): Promise<Note> => {
    const response = await axios.post<Note>(`${API_BASE_URL}/note`, {
        name: nameNote,      
        content: contentNote,
        idFolder: folderId  
    });
    return response.data;
};


export const updateNote = async (note: Note): Promise<Note> => {
    const response = await axios.put<Note>(`${API_BASE_URL}/note/${note.idNote}`, {
        nameNote : note.nameNote,
        contentNote : note.contentNote,
        idFolder: note.idFolder,
        toBin : note.toBin
    });
    return response.data;
};
//TODO appeler sela pour renommer une note

export const updateFolder = async (folder: Folder): Promise<Folder> => {
    const response = await axios.put<Folder>(`${API_BASE_URL}/folder/${folder.idFolder}`, {
        "name": folder.nameFolder,
        "idParent": folder.idParent,
        "toBin" : folder.toBin
    });
    return response.data;
};


export const deleteNote = async (noteId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/note/${noteId}`);
}
export const deleteFolder = async (folderId: number): Promise<void> => {
    try {
    await axios.delete(`${API_BASE_URL}/folder/${folderId}`);

    } catch (error: any) {
    console.error("Erreur Axios :", error.response);
    }
}

export const getBinItems = async (): Promise<Item[]> => {
    const response = await axios.get(`${API_BASE_URL}/bin`);
    console.log('Fetched bin items:', response.data);

    let listNote = response.data.orphanNotes as Note[];
    let listFolder = response.data.folders as Folder[];
    if (!listNote) {
        listNote = [];
    }
    if (!listFolder) {
        listFolder = [];
    }
    const finalItems: Item[] = listFolder;
    for (const note of listNote) {
        finalItems.push(note);
    }
    return finalItems;
}