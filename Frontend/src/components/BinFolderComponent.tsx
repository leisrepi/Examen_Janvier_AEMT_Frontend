import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import type { MenuContextuelProps } from './MenuContextuelComponent';
import MenuContextuelComponent from './MenuContextuelComponent';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import coffinClosed from '../assets/coffin_closed.png';
import {restoreFromBin, getFolderChildreen, deleteFolder, updateFolder, } from '../service/SpookyService';

import './FolderComponent.css';

export type Item = Folder | Note;

interface Props {
    folderInfo: Folder;
    updateParent? : () => void;
}





export default function FolderComponent({folderInfo, updateParent}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([]);
    const [folderName, setFolderName] = useState<string>(folderInfo.nameFolder);
    const [folderOpen, setFolderOpen] = useState<boolean>(false);

    const [spiderLeft, setSpiderLeft] = useState<number>(0);
    const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);


    useEffect(() => {
        setSpiderLeft(5 + Math.random() * 100);
        setFolderName(folderInfo.nameFolder);
        console.log(spiderLeft);
    }, []);


    
    
    async function deleteFolderClick(){  
        if (!confirm("Voulez-vous vraiment supprimer ce dossier définitivement?")) {
            return; //refuse or cancel  
        }
        await deleteFolder(folderInfo.idFolder).then(() => {
            if (updateParent) {
                updateParent();
            }
        });

        
        
    }

    function restoreFolderClick(){  
        restoreFromBin(folderInfo).then(() => {
        if (updateParent){
          updateParent();
        }
      });
    }

    /*-------------------------------Event---------------------------------*/

    const handleRightClick = (event) => {
        event.preventDefault(); // Enable custom context menu
        event.stopPropagation(); 
        if (menuContextuel) {
            return; 
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Enterrer (supprimer)", onClick: () => deleteFolderClick() },
            { label: "Ressusciter (restaurer)", onClick: () => restoreFolderClick() },
            ],
            onClose: () => setMenuContextuel(null)
        });

    };

    function fetchChildItems(){
        getFolderChildreen(folderInfo.idFolder).then((items : Item[]) => {
            setChildFoldersAndNotes(items.map(item => ({ ...item })));
            console.log("Fetched child items:");
            console.log(items);
        });
    }

    function formatDate(dateInput: string | Date): string {
    // if not a date, we convert it too
    if (dateInput == null){return ""}
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
    

    const datePart = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    const timePart = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return `${datePart} ${timePart}`;
  }

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
            <div className="metaDataBin">
                <p>Création : {formatDate(folderInfo.creationDateFolder)} </p>
                <p>Modification : {formatDate(folderInfo.lastModificationFolder)} </p>
                <p>Suppression : {formatDate(folderInfo.dateBinFolder!)} </p>
            </div>
        </h3>
        <img style={{left: `${spiderLeft}px`}} src={SpiderImage} alt="Image à déplacer" className="MonsterImage" />
        {folderOpen && childfoldersAndNotes.map((item : Item) => {
                if ("nameFolder" in item) {
                    let folder = item as Folder;
                    return <FolderComponent key={`folder-${folder.idFolder}`} folderInfo={folder} updateParent={fetchChildItems} />;
                }else{
                    let note = item as Note;
                    return <OpenNoteComponent key={`note-${note.idNote}`} note={note} updateParent={fetchChildItems} />;
                }
            }
        )}
    </div>
  )
}
