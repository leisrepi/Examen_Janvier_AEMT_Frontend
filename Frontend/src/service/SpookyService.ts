import axios from 'axios';
import {type Folder} from '../types/Folder';
import {type Note} from '../types/Note';

const API_BASE_URL = 'http://localhost:8080/spooky-api';

export const getAllFolders = async (): Promise<Folder[]> => {
    const response = await axios.get<Folder[]>(`${API_BASE_URL}/folder`);
    return response.data;
}
export const getNotesInFolder = async (folderId: string): Promise<Note[]> => {
    const response = await axios.get<Note[]>(`${API_BASE_URL}/folder/${folderId}/notes`);
    return response.data;
}
export const createFolder = async (name: string): Promise<Folder> => {
    const response = await axios.post<Folder>(`${API_BASE_URL}/folder`, { name });
    return response.data;
}
export const createNote = async (folderId: string, title: string, content: string): Promise<Note> => {
    const response = await axios.post<Note>(`${API_BASE_URL}/note`, { folderId, title, content });
    return response.data;
}
export const updateNote = async (note: Note): Promise<Note> => {
    const response = await axios.put<Note>(`${API_BASE_URL}/note/${note.idNote}`, note);
    return response.data;
}
export const deleteNote = async (noteId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/note/${noteId}`);
}
export const deleteFolder = async (folderId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/folder/${folderId}`);
}