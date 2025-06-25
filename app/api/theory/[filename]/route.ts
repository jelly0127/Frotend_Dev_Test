import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const filePath = path.join(process.cwd(), 'components/Theory', `${filename}.md`)
    
    //  exist
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
    
    //  read file content
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    //  convert markdown to HTML
    const processedContent = await remark()
      .use(remarkHtml)
      .process(fileContent)
    const htmlContent = processedContent.toString()
    
    // extract title
    const titleMatch = fileContent.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : filename
    
    //  calculate reading time
    const wordCount = fileContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 100)
    
    return NextResponse.json({
      title,
      content: htmlContent,
      readingTime: `${readingTime} min read`,
      wordCount
    })
  } catch (error) {
    console.error('Error reading theory file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 