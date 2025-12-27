// components/RichTextEditor.tsx
import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = '请输入内容...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-[200px] p-4'
      }
    }
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor;