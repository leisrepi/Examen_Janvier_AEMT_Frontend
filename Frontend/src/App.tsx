import { useState } from 'react'
import './App.css'
import FolderComponent from './components/folderComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FolderComponent/>
    </>
  )
}

export default App
