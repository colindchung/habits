// TipTapEditor.tsx
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TipTapEditorProps {
  initialContent: string;
}

export interface TipTapEditorHandle {
  getHTML: () => string;
}

const TipTapEditor = forwardRef<TipTapEditorHandle, TipTapEditorProps>(
  function TipTapEditor(
    { initialContent }: TipTapEditorProps,
    ref: React.ForwardedRef<TipTapEditorHandle>
  ) {
    const editor = useEditor({
      extensions: [StarterKit],
      content: initialContent,
      // onUpdate: ({ editor }) => {
      //   const html = editor.getHTML();
      //   debouncedContentChange(html);
      // },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => {
        if (!editor) return "";
        return editor.getHTML();
      },
    }));

    useEffect(() => {
      if (editor) {
        editor.commands.setContent(initialContent);
      }
    }, [editor, initialContent]);

    return <EditorContent editor={editor} />;
  }
);

export default TipTapEditor;

// const TipTapEditor: React.FC<TipTapEditorProps> = ({
//   initialContent,
//   onContentChange,
// }) => {
//   const debouncedContentChange = useCallback(
//     debounce((html: string) => onContentChange(html), 500),
//     []
//   );

//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: initialContent,
//     onUpdate: ({ editor }) => {
//       const html = editor.getHTML();
//       debouncedContentChange(html);
//     },
//   });

//   useEffect(() => {
//     if (editor) {
//       editor.commands.setContent(initialContent);
//     }
//   }, [editor, initialContent]);

//   return <EditorContent editor={editor} />;
// };

// export default TipTapEditor;
