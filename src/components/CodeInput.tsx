import { useState, forwardRef, useImperativeHandle } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { bytesToSize } from "../utils/bytesToSize";
import { CodePreviewModal } from "./CodePreviewModal";
import { DragDrop, DragDropProps } from "./DragDrop";
import { IconButton } from "./IconButton";

interface CodeInputProps {
  label: string;
  onContentChange: (content: string) => void;
  accept: DragDropProps["accept"];
  index?: number;
  prismTag: string;
  subtitle: DragDropProps["subtitle"];
}

interface FileState {
  filename: string;
  size: number;
  content: string;
}

interface CodeInputMethods {
  reset: () => void;
}

const CodeInput = forwardRef<CodeInputMethods, CodeInputProps>(
  ({ label, onContentChange, accept, prismTag, subtitle }, ref) => {
    const [{ filename, size, content }, setState] = useState<
      FileState | Record<string, never>
    >({});

    const onDrop = (acceptedFiles: FileList) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        const newContent = reader.result as string;
        setState({
          filename: file.name,
          size: file.size,
          content: newContent,
        });
        onContentChange(newContent);
      };

      reader.readAsText(file);
    };

    useImperativeHandle(ref, () => ({
      reset: () => {
        setState({});
      },
    }));

    return (
      <div className="flex flex-col mr-8">
        {!content ? (
          <div className="mt-2 min-w-full">
            <DragDrop
              label={`Upload a ${label}`}
              onFilesAdded={onDrop}
              accept={accept}
              subtitle={subtitle}
            />
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex flex-row text-sm font-medium break-all">
              {filename && size ? (
                <>
                  <span className="max-w-lg">{filename}</span>
                  <span className="mx-1">-</span>
                  <span>{bytesToSize(size)}</span>
                </>
              ) : null}
            </div>
            <div className="flex flex-row mt-2">
              <CodePreviewModal
                modalTitle={filename}
                prismTag={prismTag}
                content={content}
              />
              <IconButton
                Icon={TrashIcon}
                label="Delete"
                onClick={() => setState({})}
                buttonClassName="ml-3"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export { CodeInput };
