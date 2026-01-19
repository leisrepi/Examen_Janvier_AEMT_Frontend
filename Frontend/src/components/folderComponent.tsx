import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';


//melange des types pour faire fonctionner le map
export type Item = Folder | Note;

interface Props {
    rootFolderName: string;
    foldersAndNotes: Item[];
}





export default function FolderComponent({rootFolderName, foldersAndNotes}: Props)  {
  return (
    <div className="FolderComponent">
        <h2>{rootFolderName}</h2>
        {foldersAndNotes.map((item : Item) => {
                if ("nameFolder" in item) {
                    let folder = item as Folder;
                    return <FolderComponent rootFolderName={folder.nameFolder} foldersAndNotes={[]} />;
                }
            }
        )}
    </div>
  )
}