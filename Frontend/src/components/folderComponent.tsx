import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import {getFolderChildreen} from '../service/SpookyService';



import './FolderComponent.css';

//melange des types pour faire fonctionner le map
export type Item = Folder | Note;

interface Props {
    folderInfo: Folder;
    foldersAndNotes: Item[];
}





export default function FolderComponent({folderInfo, foldersAndNotes}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([]);
    /*const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([
        { idFolder: 1, nameFolder: "Work", idParent: 0 },
        { idFolder: 2, nameFolder: "Personal", idParent: 0 },
        { idNote: 1, nameNote: "Meeting Notes", contentNote: "Discuss project timeline", creationDateNote: new Date(), lastModificationNote: new Date(), idFolder: 1 },
    ]);*/

    const [spiderLeft, setSpiderLeft] = useState<number>(0);
    const [folderOpen, setFolderOpen] = useState<boolean>(false);
    useEffect(() => {
        setSpiderLeft(5 + Math.random() * 100);
        console.log(spiderLeft);
    }, []);

    function fetchChildItems(){
        getFolderChildreen(folderInfo.idFolder).then((items : Item[]) => {
            setChildFoldersAndNotes([...items]);
            console.log(childfoldersAndNotes);
        });
    }
    
    function openFolder(){
        setFolderOpen(!folderOpen);
        if (childfoldersAndNotes.length > 0) {
            return;
        }
        fetchChildItems();
        
        
    }

    return (
    <div className="FolderComponent">
        <h2 onClick={() => openFolder()} className={folderOpen ? "FolderOpen" : "FolderClosed"}>
            {folderOpen ? "📂" : "📁"} {folderInfo.nameFolder}
        </h2>
        <img style={{left: `${spiderLeft}px`}} src={SpiderImage} alt="Image à déplacer" className="MonsterImage" />
        
        
        {folderOpen && childfoldersAndNotes.map((item : Item) => {
                if ("nameFolder" in item) {
                    let folder = item as Folder;
                    return <FolderComponent folderInfo={item} foldersAndNotes={childfoldersAndNotes} />;
                }else{
                    let note = item as Note;
                    return <OpenNoteComponent note={note} />;
                }
            }
        )}
    </div>
  )
}