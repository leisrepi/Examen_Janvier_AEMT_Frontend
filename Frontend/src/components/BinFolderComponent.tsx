import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import type { MenuContextuelProps } from './MenuContextuelComponent';
import MenuContextuelComponent from './MenuContextuelComponent';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import coffinClosed from '../assets/coffin_closed.png';
import coffinOpened from '../assets/coffin_opened.png';
import {createFolder, getFolderChildreen, deleteFolder, updateFolder, createNote} from '../service/SpookyService';




import './FolderComponent.css';

export type Item = Folder | Note;

interface Props {
    folderInfo: Folder;
    updateParent? : () => void;
}





export default function FolderComponent({folderInfo, updateParent}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([]);
    const [folderName, setFolderName] = useState<string>(folderInfo.nameFolder);
    

    const [spiderLeft, setSpiderLeft] = useState<number>(0);
    const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);


    useEffect(() => {
        setSpiderLeft(5 + Math.random() * 100);
        setFolderName(folderInfo.nameFolder);
        console.log(spiderLeft);
    }, []);


    
    
    async function deleteFolderClick(){  
        if (!confirm("Voulez-vous vraiment supprimer ce dossier définitivement?")) {
            return; //refuser on quitte la fonction   
        }
        await deleteFolder(folderInfo.idFolder).then(() => {
            if (updateParent) {
                updateParent();
            }
        });

        
        
    }

    function restoreFolderClick(){  
        updateFolder({
            ...folderInfo,
            toBin: false
        }).then(() => {
            if (updateParent) {
                updateParent();
            }
        });
    }

    /*-------------------------------Event---------------------------------*/

    const handleRightClick = (event) => {
        event.preventDefault(); // Empêche le menu contextuel par défaut
        if (menuContextuel) {
            return; 
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Supprimer", onClick: () => deleteFolderClick() },
            { label: "Restaurer", onClick: () => restoreFolderClick() },
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
        <h3 onContextMenu={handleRightClick}>
            <img className="coffinPic" src={coffinClosed} alt="Coffin Closed" /> {folderInfo.nameFolder}
        </h3>
        <img style={{left: `${spiderLeft}px`}} src={SpiderImage} alt="Image à déplacer" className="MonsterImage" />
    </div>
  )
}
