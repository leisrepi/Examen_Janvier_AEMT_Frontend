import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import type { MenuContextuelProps } from './MenuContextuelComponent';
import MenuContextuelComponent from './MenuContextuelComponent';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import {createFolder, getFolderChildreen} from '../service/SpookyService';
import './FolderComponent.css';

export type Item = Folder | Note;

interface Props {
    folderInfo: Folder;
}

export default function FolderComponent({folderInfo}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([]);
  

    const [spiderLeft, setSpiderLeft] = useState<number>(0);
    const [folderOpen, setFolderOpen] = useState<boolean>(false);
    const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);


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
    

    const handleRightClick = (event: React.MouseEvent<HTMLHeadingElement>) => {
        event.preventDefault(); 
        if (menuContextuel) {
            return; 
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

        <h2 
            onClick={() => openFolder()} 
            onContextMenu={handleRightClick}
            className={folderOpen ? "FolderOpen" : "FolderClosed"}
        >

            {folderOpen ? "📂" : "📁"} {folderInfo.nameFolder}
        </h2>
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