
import BandeauComponent from "../../components/bandeau/BandeauComponent";
import { useState } from "react";
import type { Item } from "../folderComponent";
import {getBinItems} from "../../service/SpookyService";
import type { Note } from "../../types/Note";
import type { Folder } from "../../types/Folder";
import BinFolderComponent from "../BinFolderComponent";
import BinNoteComponent from "../BinNoteComponent";
import type { MenuContextuelProps } from "../MenuContextuelComponent";
import MenuContextuelComponent from "../MenuContextuelComponent";
import { useNavigate } from "react-router";

export default function BinPage() {
    const navigate = useNavigate();
    const [foldersAndNotes, setFoldersAndNotes] = useState<Item[]>([]);
    const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);
  
    useState(() => {
        fetchBinItems();
    });

    function fetchBinItems() {
        getBinItems().then((items : Item[]) => {
            setFoldersAndNotes([...items]);
            console.log(foldersAndNotes);
        });
    }

    const handleRightClickTitle = (event) => {
        event.preventDefault(); // Empêche le menu contextuel par défaut
        console.log("right click explorer div");
        if (menuContextuel) {
          return; // Si le menu est déjà ouvert, ne rien faire
        }
        
        setMenuContextuel({
          position: { x: event.pageX - 10, y: event.pageY - 10},
          actions: [
            { label: "Retourne au note", onClick: () => navigate('/main') },
          ],
          onClose: () => setMenuContextuel(null)
        });
    
      };

    return <>
    <div className="MainDiv">
        <div>
            <BandeauComponent/>
        </div>
        {menuContextuel && (
              <MenuContextuelComponent
                  position={menuContextuel.position}
                  actions={menuContextuel.actions}
                  onClose={() => setMenuContextuel(null)}
              />)}
        <div>
            <h2 onContextMenu={handleRightClickTitle}>Bin Page</h2>
            <div>
                {foldersAndNotes.map((item : Item) => {
                    if ("nameFolder" in item) {
                        let folder = item as Folder;
                        return <BinFolderComponent key={folder.idFolder} folderInfo={folder} updateParent={fetchBinItems}/>;
                    }else{
                        let note = item as Note;
                        return <BinNoteComponent key={note.idNote} note={note} updateParent={fetchBinItems} />;
                    }
                })}
            </div>
        </div>
    </div>
    </>
}