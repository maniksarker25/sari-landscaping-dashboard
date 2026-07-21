import { useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./editor.css";

interface TiptapProps {
  content?: string;
  setContent?: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const getCurrentHeadingValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("heading", { level: 4 })) return "h4";
    if (editor.isActive("heading", { level: 5 })) return "h5";
    if (editor.isActive("heading", { level: 6 })) return "h6";
    return "p";
  };

  const handleHeadingChange = (value: string) => {
    if (value === "p") {
      editor.chain().focus().setParagraph().run();
    } else if (value.startsWith("h")) {
      const level = parseInt(value.substring(1), 10) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div
      className="editor-toolbar"
      role="toolbar"
      aria-label="Text Formatting Options"
    >
      {/* Undo & Redo */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="editor-toolbar-btn"
          title="Undo (Ctrl + Z)"
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="editor-toolbar-btn"
          title="Redo (Ctrl + Y)"
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Headings / Paragraph Selector */}
      <div className="editor-toolbar-group min-w-[130px]">
        <Select
          value={getCurrentHeadingValue()}
          onValueChange={handleHeadingChange}
        >
          <SelectTrigger className="h-8 text-xs border-border bg-background">
            <SelectValue placeholder="Paragraph" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">
              <div className="flex items-center gap-2 text-xs">
                <Pilcrow className="h-3.5 w-3.5" /> Paragraph
              </div>
            </SelectItem>
            <SelectItem value="h1">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Heading1 className="h-3.5 w-3.5" /> Heading 1
              </div>
            </SelectItem>
            <SelectItem value="h2">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Heading2 className="h-3.5 w-3.5" /> Heading 2
              </div>
            </SelectItem>
            <SelectItem value="h3">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Heading3 className="h-3.5 w-3.5" /> Heading 3
              </div>
            </SelectItem>
            <SelectItem value="h4">
              <div className="flex items-center gap-2 text-xs">
                <Heading4 className="h-3.5 w-3.5" /> Heading 4
              </div>
            </SelectItem>
            <SelectItem value="h5">
              <div className="flex items-center gap-2 text-xs">
                <Heading5 className="h-3.5 w-3.5" /> Heading 5
              </div>
            </SelectItem>
            <SelectItem value="h6">
              <div className="flex items-center gap-2 text-xs">
                <Heading6 className="h-3.5 w-3.5" /> Heading 6
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Basic Text Formatting */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`editor-toolbar-btn ${editor.isActive("bold") ? "is-active" : ""}`}
          title="Bold (Ctrl + B)"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`editor-toolbar-btn ${editor.isActive("italic") ? "is-active" : ""}`}
          title="Italic (Ctrl + I)"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`editor-toolbar-btn ${editor.isActive("strike") ? "is-active" : ""}`}
          title="Strike (Ctrl + Shift + X)"
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`editor-toolbar-btn ${editor.isActive("code") ? "is-active" : ""}`}
          title="Inline Code (Ctrl + E)"
          aria-label="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Lists */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`editor-toolbar-btn ${editor.isActive("bulletList") ? "is-active" : ""}`}
          title="Bullet List (Ctrl + Shift + 8)"
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`editor-toolbar-btn ${editor.isActive("orderedList") ? "is-active" : ""}`}
          title="Ordered List (Ctrl + Shift + 7)"
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Blocks & Separators */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`editor-toolbar-btn ${editor.isActive("blockquote") ? "is-active" : ""}`}
          title="Blockquote (Ctrl + Shift + B)"
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`editor-toolbar-btn ${editor.isActive("codeBlock") ? "is-active" : ""}`}
          title="Code Block (Ctrl + Alt + C)"
          aria-label="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="editor-toolbar-btn"
          title="Horizontal Rule"
          aria-label="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function Tiptap({ content, setContent }: TiptapProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="editor-wrapper">
      <MenuBar editor={editor} />
      <div className="editor-content-area">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
