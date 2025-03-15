import { h, FunctionComponent, JSX, createRef } from "preact"
import {
  memo,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from "preact/compat"
import { FaRegFileLines } from "react-icons/fa6"

type UploadProps = {
  multiple?: boolean
  supportedTypes?: string[]
  onUpload: (files: FileList) => void
}

const Upload: FunctionComponent<UploadProps> = memo(
  ({ multiple, supportedTypes = [".pdf"], onUpload }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDraggingFiles, setIsDraggingFiles] = useState(false)

    const handleDragOver = useCallback(
      (e: DragEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (!isDraggingFiles) {
          setIsDraggingFiles(true)
        }
        if (e instanceof DragEvent) {
          e.dataTransfer!.dropEffect = "copy"
          e.dataTransfer.effectAllowed = "copy"
        }
      },
      [isDraggingFiles],
    )

    const handleDragLeave = useCallback(
      (e: DragEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (isDraggingFiles) {
          setIsDraggingFiles(false)
        }
        if (e instanceof DragEvent) {
          e.dataTransfer.dropEffect = "copy"
          e.dataTransfer.effectAllowed = "copy"
        }
      },
      [isDraggingFiles],
    )

    const handleDrop = useCallback((e: DragEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (e instanceof DragEvent) {
        e.dataTransfer!.dropEffect = "copy"
        e.dataTransfer.effectAllowed = "copy"
      }
      setIsDraggingFiles(false)
      console.log(e)
      setTimeout(() => {
        const files = e.dataTransfer?.files
        if (files && files.length > 0) {
          console.log("files", files)
          onUpload(files)
        }
      }, 0)
    }, [])

    const handleOnClick = useCallback(
      (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
        inputRef.current?.click()
      },
      [],
    )

    return (
      <div
        class={"upload-container" + (isDraggingFiles ? " drag-active" : "")}
        onClick={handleOnClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaRegFileLines size={80} />
        <input
          ref={inputRef}
          type="file"
          class="hidden-input"
          multiple={multiple}
          accept={supportedTypes.join(",")}
        />
        <div class="text">
          <p>Maximum file size: 1Mb</p>
          <p>Supported format: {supportedTypes.join(", ")}</p>
        </div>
      </div>
    )
  },
)

export default Upload
