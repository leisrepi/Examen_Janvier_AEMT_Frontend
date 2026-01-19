import { useState } from 'react'
import './App.css'
import FolderComponent from './components/folderComponent'
import type { Item } from './components/folderComponent'
import type { Folder } from './types/Folder';



function App() {
  const [foldersAndNotes, setFoldersAndNotes] = useState<Item[]>([
    { idFolder: 1, nameFolder: "Work", idParent: 0 },
    { idFolder: 2, nameFolder: "Personal", idParent: 0 }
  ]);

  const rootFolderName :string = "root";
  
  return (
    <>
      <FolderComponent rootFolderName={rootFolderName} foldersAndNotes={foldersAndNotes} />
    </>
  )
}

export default App
