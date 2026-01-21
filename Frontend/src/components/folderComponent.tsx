import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import type { MenuContextuelProps } from './MenuContextuelComponent';
import MenuContextuelComponent from './MenuContextuelComponent';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import coffinClosed from '../assets/coffin_closed.png';
import coffinOpened from '../assets/coffin_opened.png';
import {createFolder, getFolderChildreen, deleteFolder, updateFolderName, createNote} from '../service/SpookyService';




import './FolderComponent.css';

export type Item = Folder | Note;

interface Props {
    folderInfo: Folder;
    updateParent? : () => void;
}





export default function FolderComponent({folderInfo, updateParent}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([]);
    const [folderName, setFolderName] = useState<string>(folderInfo.nameFolder);
    /*const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([
        { idFolder: 1, nameFolder: "Work", idParent: 0 },
        { idFolder: 2, nameFolder: "Personal", idParent: 0 },
        { idNote: 1, nameNote: "Meeting Notes", contentNote: "Discuss project timeline", creationDateNote: new Date(), lastModificationNote: new Date(), idFolder: 1 },
    ]);*/

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
            setChildFoldersAndNotes([...items]);
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
        if (!confirm("Voulez-vous vraiment supprimer ce dossier ?")) {
            return; //refuser on quitte la fonction   
        }
        await deleteFolder(folderInfo.idFolder).then(() => {
            if (updateParent) {
                updateParent();
            }
        });
        
    }

    function renameFolderClick(){
        const info = prompt("Veuillez entrer un nouveau nom :");
        if (info) {
            console.log("Nom saisi :", info);
            setFolderName(info);
            folderInfo.nameFolder = info;
            //Appel service pour renommer le dossier
            updateFolderName(folderInfo).then(() => fetchChildItems());
        } else {
            console.log("Aucune info saisie");
        }
        console.log("Renommer dossier");
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
            { label: "Renommer", onClick: () => renameFolderClick() },
            { label: "Supprimer", onClick: () => deleteFolderClick() },
            { label: "Ajouté sous dossier", onClick: () => createFolder(folderInfo.idFolder).then(() => fetchChildItems()) },
            { label: "Ajouté note", onClick: () => createNote(folderInfo.idFolder, "", "").then(() => fetchChildItems()) },
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