import { useState } from "preact/hooks"
import Upload from "./components/upload"
import "./index.css"

export function App() {
  const [files, setFiles] = useState()

  return (
    <>
      <h1 class="heading">File upload</h1>
      <Upload multiple onUpload={(files) => setFiles(files)} />
    </>
  )
}
