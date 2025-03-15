import { h } from "preact";
import { useState } from "preact/compat";
import { RxCross2 } from "react-icons/rx";

import Upload from "./components/upload";
import "./index.css";

export function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  return (
    <div>
      <h1 class="heading">File upload</h1>
      {files && files.length > 0 ? (
        <div class="file-container">
          <p>
            Uplaoded {files.length} file{files.length > 1 ? "s" : ""}:
          </p>
          <div>
            {files.map((f, idx, arr) => (
              <p class="file" key={f.name + f.size}>
                {f.name}
                <span
                  onClick={() => {
                    setFiles((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1, arr.length)]);
                  }}
                >
                  <RxCross2 />
                </span>
              </p>
            ))}
          </div>
          <button class="button" onClick={() => setFiles([])}>
            Clear All
          </button>
        </div>
      ) : (
        <Upload
          multiple
          maxSize={1}
          supportedTypes={[".jpg,.png,.pdf"]}
          onUpload={(files) => setFiles(files)}
          onError={(file) => setError(`${file.name} size is larger than 1mb`)}
        />
      )}
      {error && <p class="error">{error}</p>}
    </div>
  );
}
