import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import type { MenuContextuelProps } from './MenuContextuelComponent';
import MenuContextuelComponent from './MenuContextuelComponent';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import {createFolder, getFolderChildreen} from '../service/SpookyService';
import coffinClosed from '../assets/coffin_closed.png';
import coffinOpened from '../assets/coffin_opened.png';




import './FolderComponent.css';

//melange des types pour faire fonctionner le map
export type Item = Folder | Note;

interface Props {
    folderInfo: Folder;
}





export default function FolderComponent({folderInfo}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([]);
    /*const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([
        { idFolder: 1, nameFolder: "Work", idParent: 0 },
        { idFolder: 2, nameFolder: "Personal", idParent: 0 },
        { idNote: 1, nameNote: "Meeting Notes", contentNote: "Discuss project timeline", creationDateNote: new Date(), lastModificationNote: new Date(), idFolder: 1 },
    ]);*/

    const [spiderLeft, setSpiderLeft] = useState<number>(0);
    const [folderOpen, setFolderOpen] = useState<boolean>(false);
    const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);


    /*------------------------------UseEffect--------------------------------*/
    useEffect(() => {
        setSpiderLeft(5 + Math.random() * 100);
        console.log(spiderLeft);
    }, []);

    /*------------------------------Fonction--------------------------------*/

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
    

    /*-------------------------------Event---------------------------------*/

    const handleRightClick = (event) => {
        event.preventDefault(); // Empêche le menu contextuel par défaut
        if (menuContextuel) {
            return; // Si le menu est déjà ouvert, ne rien faire
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Renommer TMP", onClick: () => console.log("Renommer") },
            { label: "Supprimer TMP", onClick: () => console.log("Supprimer") },
            { label: "Ajouté sous dossier", onClick: () => createFolder(folderInfo.idFolder).then(() => fetchChildItems()) },
            { label: "Ajouté note", onClick: () => console.log("Propriétés") },
            ],
            onClose: () => setMenuContextuel(null)
        });

    };



    return (
    
    <div className="FolderComponent">

        {menuContextuel && (
        <MenuContextuelComponent
            position={menuContextuel.position}
            actions={menuContextuel.actions}
            onClose={() => setMenuContextuel(null)}
        />
        )}

        <h3
            onClick={() => openFolder()} 
            onContextMenu={handleRightClick}
            className={folderOpen ? "FolderOpen" : "FolderClosed"}
        >

            {/* {folderOpen ? "📂" : "📁"} {folderInfo.nameFolder} */}
            {folderOpen
            ? <img className="coffinPic" src={coffinOpened} alt="Coffin Opened" />
            : <img className="coffinPic" src={coffinClosed} alt="Coffin Closed" />} {folderInfo.nameFolder}
        </h3>
        <img style={{left: `${spiderLeft}px`}} src={SpiderImage} alt="Image à déplacer" className="MonsterImage" />
        
        
        {folderOpen && childfoldersAndNotes.map((item : Item) => {
                if ("nameFolder" in item) {
                    let folder = item as Folder;
                    return <FolderComponent folderInfo={folder} />;
                }else{
                    let note = item as Note;
                    return <OpenNoteComponent note={note} />;
                }
            }
        )}
    </div>
  )
}