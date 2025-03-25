import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface RichTextEditorProps {
  value?: string
  onChange: (value: string) => void
  title?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, title }) => {
  const [editorContent, setEditorContent] = useState(value || '')

  useEffect(() => {
    setEditorContent(value || '')
  }, [value])

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
    //const plainText:string = content.replace(/<\/?[^>]+(>|$)/g, "");
    if (onChange) {
      onChange(content)
      //onChange(plainText);
    }
  }

  return (
    <Card className="max-h-96 overflow-hidden p-4 shadow-md gap-2">
      <CardTitle className="text-lg">{title || ''}</CardTitle>
      <CardContent className="h-full p-0">
        <div className="h-72 overflow-y-auto">
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            className="h-52"
            modules={{
              toolbar: {
                container: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  [{ size: [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                  ['link', 'image', 'video'],
                  ['code-block'],
                  ['clean'],
                ],
              },
              clipboard: { matchVisual: false },
            }}
            formats={[
              'header',
              'font',
              'size',
              'bold',
              'italic',
              'underline',
              'strike',
              'blockquote',
              'list',
              'indent',
              'link',
              'image',
              'video',
              'code-block',
            ]}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default RichTextEditor
