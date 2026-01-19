import { useState } from 'react'
import './App.css'
import FolderComponent from './components/folderComponent'
import type { Item } from './components/folderComponent'



function App() {
  const [foldersAndNotes, setFoldersAndNotes] = useState<Item[]>([
    { idFolder: 1, nameFolder: "Work", idParent: 0 },
    { idFolder: 2, nameFolder: "Personal", idParent: 0 },
    { idNote: 1, nameNote: "Meeting Notes", contentNote: "Discuss project timeline", creationDateNote: new Date(), lastModificationNote: new Date(), idFolder: 1 },
  ]);

  const rootFolderName :string = "root";
  
  return (
    <>
      <FolderComponent rootFolderName={rootFolderName} foldersAndNotes={foldersAndNotes} />
    </>
  )
}

export default App
