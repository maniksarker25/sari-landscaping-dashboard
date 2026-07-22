import { useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
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
  Palette,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "./editor.css";

interface TiptapProps {
  content?: string;
  setContent?: (content: string) => void;
  placeholder?: string;
}

const PRESET_COLORS = [
  { name: "Default", value: "" },
  { name: "Charcoal Black", value: "#1e293b" },
  { name: "Muted Slate", value: "#64748b" },
  { name: "Crimson Red", value: "#ef4444" },
  { name: "Sunset Orange", value: "#f97316" },
  { name: "Amber Gold", value: "#f59e0b" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Teal Water", value: "#06b6d4" },
  { name: "Sky Blue", value: "#3b82f6" },
  { name: "Royal Violet", value: "#8b5cf6" },
];

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const activeColor = editor.getAttributes("textStyle").color || "";

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

      {/* Color Picker */}
      <div className="editor-toolbar-group">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              className={`editor-toolbar-btn relative flex flex-col items-center justify-center ${
                activeColor ? "text-primary bg-primary/5" : ""
              }`}
              title="Text Color"
              aria-label="Text Color"
            >
              <Palette className="h-4 w-4" />
              {activeColor && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-[3px] rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 p-3 space-y-3"
            align="start"
            onFocusOutside={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => {
              const target = e.target as HTMLElement;
              if (target && (target.closest(".editor-toolbar") || target.tagName.toLowerCase() === "input")) {
                e.preventDefault();
              }
            }}
          >
            <div className="text-xs font-semibold text-muted-foreground">Text Color</div>
            
            {/* Presets Grid */}
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => {
                const isActive = color.value 
                  ? activeColor === color.value 
                  : !activeColor;
                
                return (
                  <button
                    key={color.name}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (color.value) {
                        editor.chain().focus().setColor(color.value).run();
                      } else {
                        editor.chain().focus().unsetColor().run();
                      }
                    }}
                    className="h-7 w-7 rounded-full border border-border relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm"
                    style={{ 
                      backgroundColor: color.value || "var(--background)",
                      backgroundImage: color.value ? "none" : "linear-gradient(45deg, transparent 45%, #ef4444 45%, #ef4444 55%, transparent 55%)"
                    }}
                    title={color.name}
                  >
                    {isActive && (
                      <Check className={`h-3.5 w-3.5 ${color.value === "#f59e0b" || !color.value ? "text-slate-800" : "text-white"}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <span className="text-xs font-medium text-muted-foreground flex-grow">
                Custom Color
              </span>
              <div className="relative h-7 w-7 rounded-full overflow-hidden border border-border cursor-pointer shadow-sm">
                <input
                  type="color"
                  value={activeColor && /^#[0-9a-fA-F]{6}$/.test(activeColor) ? activeColor : "#000000"}
                  onChange={(e) => {
                    editor.chain().focus().setColor(e.target.value).run();
                  }}
                  className="absolute inset-[-4px] h-[36px] w-[36px] p-0 border-0 cursor-pointer"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
    ],
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
    <div
      className="editor-wrapper"
      onDragStart={(e) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (!target || target.tagName.toLowerCase() !== "img") {
          e.preventDefault();
        }
      }}
    >
      <MenuBar editor={editor} />
      <div className="editor-content-area">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
