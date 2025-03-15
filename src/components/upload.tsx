import { h, FunctionComponent, JSX } from "preact";
import { memo, useCallback, useRef, useState } from "preact/compat";
import { FaRegFileLines } from "react-icons/fa6";

type UploadProps = {
  /** maximum size of file, this is independent for each file. Should be defined in mega bytes */
  maxSize?: number;
  /** allow multiple files to be uploaded, otherwise only the first file will be selected */
  multiple?: boolean;
  /** supported file types, should follow https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept. Defaults to .pdf */
  supportedTypes?: string[];
  /** handler called with the uploaded files */
  onUpload?: (files: File[]) => void;
  /** handle error if any, the callback is called with file and type of error i.e. size, type */
  onError?: (file: File, type?: string) => void;
};

const Upload: FunctionComponent<UploadProps> = memo(
  ({ maxSize = 1, multiple, supportedTypes = [".pdf"], onUpload, onError }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDraggingFiles, setIsDraggingFiles] = useState(false);

    const processFiles = useCallback(
      (files: FileList) => {
        const uploadedFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i);
          // check file size
          if (maxSize && file.size > maxSize * 1e6) {
            console.error(`file size bigger than ${maxSize}mb`);
            onError?.(file, "size");
            return;
          }
          // check file type
          const isAllowedType = supportedTypes.some((t) => {
            const allowedType = t.split(".")?.[1];
            return file.type.includes(allowedType);
          });
          if (!isAllowedType) {
            console.error(`file type not allowed`);
            onError?.(file, "type");
            return;
          }
          uploadedFiles.push(file);
        }
        onUpload?.(uploadedFiles);
      },
      [onUpload, supportedTypes, maxSize],
    );

    const handleDragOver = useCallback(
      (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isDraggingFiles) {
          setIsDraggingFiles(true);
        }
        if (e instanceof DragEvent) {
          e.dataTransfer!.dropEffect = "copy";
          e.dataTransfer.effectAllowed = "copy";
        }
      },
      [isDraggingFiles],
    );

    const handleDragLeave = useCallback(
      (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (isDraggingFiles) {
          setIsDraggingFiles(false);
        }
        if (e instanceof DragEvent) {
          e.dataTransfer.dropEffect = "copy";
          e.dataTransfer.effectAllowed = "copy";
        }
      },
      [isDraggingFiles],
    );

    const handleDrop = useCallback((e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (e instanceof DragEvent) {
        e.dataTransfer!.dropEffect = "copy";
        e.dataTransfer.effectAllowed = "copy";
      }
      setIsDraggingFiles(false);
      processFiles(e.dataTransfer?.files);
    }, []);

    const handleOnClick = useCallback((e: JSX.TargetedMouseEvent<HTMLDivElement>) => inputRef?.current?.click(), []);
    const handleInputChange = useCallback(
      () => inputRef && inputRef.current && processFiles(inputRef.current.files),
      [],
    );

    return (
      <div
        class={"upload-container" + (isDraggingFiles ? " drag-active" : "")}
        onClick={handleOnClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaRegFileLines size={200} />
        <input
          ref={inputRef}
          type="file"
          class="hidden-input"
          multiple={multiple}
          accept={supportedTypes.join(",")}
          onChange={handleInputChange}
        />
        <div class="text">
          <p>Maximum file size: 1Mb</p>
          <p>Supported format: {supportedTypes.join(", ")}</p>
        </div>
      </div>
    );
  },
);

export default Upload;
