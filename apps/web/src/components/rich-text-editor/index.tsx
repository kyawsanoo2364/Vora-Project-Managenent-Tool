"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const RichTextEditor = () => {
  const [text, setText] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: text,

    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] border max-h-[156px] overflow-auto rounded-b-md bg-gray-700/10 py-2 px-3",
      },
    },
  });

  useEffect(() => {
    if (editor?.getHTML()) {
      setText(editor.getHTML());
    }
  }, [editor?.getHTML]);

  return (
    <div>
      <Menubar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
