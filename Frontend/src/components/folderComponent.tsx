import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import { useState } from 'react'
import OpenNoteComponent from './openNoteComponent';


//melange des types pour faire fonctionner le map
export type Item = Folder | Note;

interface Props {
    rootFolderName: string;
    foldersAndNotes: Item[];
}





export default function FolderComponent({rootFolderName, foldersAndNotes}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([
    { idFolder: 1, nameFolder: "Work", idParent: 0 },
    { idFolder: 2, nameFolder: "Personal", idParent: 0 },
    { idNote: 1, nameNote: "Meeting Notes", contentNote: "Discuss project timeline", creationDateNote: new Date(), lastModificationNote: new Date(), idFolder: 1 },
  ]);

  const [folderOpen, setFolderOpen] = useState<boolean>(false);

  return (
    <div className="FolderComponent">
        <h2 onClick={() => setFolderOpen(!folderOpen)}> {folderOpen ? "📂" : "📁"} {rootFolderName}</h2>
        
        {folderOpen && foldersAndNotes.map((item : Item) => {
                if ("nameFolder" in item) {
                    let folder = item as Folder;
                    return <FolderComponent rootFolderName={folder.nameFolder} foldersAndNotes={childfoldersAndNotes} />;
                }else{
                    let note = item as Note;
                    return <OpenNoteComponent note={note} />;
                }
            }
        )}
    </div>
  )
}