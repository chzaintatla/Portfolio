"use client";

import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Code, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { MediaPicker } from "./MediaPicker";

/** Rich-text editor (Tiptap). Emits HTML; the backend sanitizes it with an allow-list before saving. */
export function RichText({ value, onChange, label }: { value: string; onChange: (html: string) => void; label?: string }) {
  const [picker, setPicker] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: false }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image,
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "prose-spark min-h-40 px-4 py-3 focus:outline-none", "aria-label": label ?? "Rich text" },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
  });

  // Keep in sync when the record loads after mount.
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return <div className="h-48 rounded-xl border border-line bg-night" />;

  const btn = (active: boolean, onClick: () => void, Icon: typeof Bold, title: string) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn("rounded-lg p-1.5 text-mute hover:bg-white/5 hover:text-ink", active && "bg-white/10 text-ink")}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", prev ?? "https://");
    if (url === null) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-night focus-within:border-aqua/50">
      <div className="flex flex-wrap gap-0.5 border-b border-line p-1.5">
        {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2, "Heading 2")}
        {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3, "Heading 3")}
        {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), Bold, "Bold")}
        {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), Italic, "Italic")}
        {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), List, "Bullet list")}
        {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered, "Numbered list")}
        {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), Quote, "Quote")}
        {btn(editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), Code, "Code block")}
        {btn(editor.isActive("link"), setLink, Link2, "Link")}
        {btn(false, () => setPicker(true), ImagePlus, "Insert image")}
        <span className="mx-1 w-px bg-line" />
        {btn(false, () => editor.chain().focus().undo().run(), Undo2, "Undo")}
        {btn(false, () => editor.chain().focus().redo().run(), Redo2, "Redo")}
      </div>
      <EditorContent editor={editor} />
      <MediaPicker
        open={picker}
        onClose={() => setPicker(false)}
        onPick={(m) => {
          editor.chain().focus().setImage({ src: m.url, alt: m.alt ?? "" }).run();
          setPicker(false);
        }}
      />
    </div>
  );
}
