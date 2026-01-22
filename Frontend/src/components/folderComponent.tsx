import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import type { MenuContextuelProps } from './MenuContextuelComponent';
import MenuContextuelComponent from './MenuContextuelComponent';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import coffinClosed from '../assets/coffin_closed.png';
import coffinOpened from '../assets/coffin_opened.png';
import {createFolder, getFolderChildreen, restoreFromBin, updateFolder, createNote,exportFolderZip, moveToBin} from '../service/SpookyService';




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
    const [folderOpen, setFolderOpen] = useState<boolean>(false);
    const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);


    useEffect(() => {
        setSpiderLeft(5 + Math.random() * 100);
        setFolderName(folderInfo.nameFolder);
        console.log(spiderLeft);
    }, []);


    function fetchChildItems(){
        getFolderChildreen(folderInfo.idFolder).then((items : Item[]) => {
            setChildFoldersAndNotes(items.map(item => ({ ...item })));
            console.log("Fetched child items:");
            console.log(items);
        });
    }
    
    function openFolder(){
        setFolderOpen(!folderOpen);
        if (childfoldersAndNotes.length > 0) {
            return;
        }
        fetchChildItems(); 
    }
    async function deleteFolderClick(){  
        moveToBin(folderInfo).then(() => {
            if (updateParent){
                updateParent();
            }
        });
        
    }

    function renameFolderClick(){
        const info = prompt("Veuillez entrer un nouveau nom :", folderInfo.nameFolder);
        if (info) {
            console.log("Nom saisi :", info);
            if (!info.trim()) {
                console.log("Nom vide après trim, opération annulée.");
                return;
            }
            setFolderName(info);
            folderInfo.nameFolder = info;
            // Call the update function to save the new name
            updateFolder(folderInfo).then(() => fetchChildItems());
        } else {
            console.log("Aucune info saisie");
        }
        console.log("Renommer dossier");
    }

    /*-------------------------------Event---------------------------------*/

    const handleRightClick = (event) => {
        event.preventDefault(); // Disable default context
        event.stopPropagation(); 
        if (menuContextuel) {
            return; 
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Renommer", onClick: () => renameFolderClick() },
            { label: "Supprimer", onClick: () => deleteFolderClick() },
            { label: "Ajouter sous dossier", onClick: () => createFolder(folderInfo.idFolder).then(() => fetchChildItems()) },
            { label: "Ajouter note", onClick: () => createNote(folderInfo.idFolder, "", "").then(() => fetchChildItems()) },
            { 
                    label: "📦 Exporter (ZIP)", 
                    onClick: async () => {
                        try {
                            const blob = await exportFolderZip(folderInfo.idFolder);
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${folderInfo.nameFolder}.zip`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        } catch (err) {
                            console.error("Erreur ZIP dossier", err);
                            alert("Impossible de zipper ce dossier effrayant !");
                        }
                        setMenuContextuel(null);
                    }
                }
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

            {folderOpen
            ? <img className="coffinPic" src={coffinOpened} alt="Coffin Opened" />
            : <img className="coffinPic" src={coffinClosed} alt="Coffin Closed" />
            }
            {folderInfo.nameFolder}
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