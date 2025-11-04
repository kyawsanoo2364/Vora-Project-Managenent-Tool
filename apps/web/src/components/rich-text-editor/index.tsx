"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/libs/utils/helpers";

interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  onTextChange?: (value: string) => void;
  className?: string;
}

const RichTextEditor = ({
  className,
  value,
  onValueChange,
  onTextChange,
}: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: value ?? "",

    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "h-full min-h-[156px] border max-h-[156px] overflow-auto rounded-b-md bg-gray-700/10 py-2 px-3",
          className,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onTextChange?.(text);
      onValueChange?.(html);
    },
  });

  return (
    <div>
      <Menubar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
