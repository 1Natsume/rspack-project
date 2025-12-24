import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// 按需注册语言
SyntaxHighlighter.registerLanguage('javascript', js);

interface CodeBlockProps{
    code:string;
    language:string;
}

function CodeBlock({ code, language = 'javascript' }:CodeBlockProps) {
  return (
    <SyntaxHighlighter language={language} style={docco}>
      {code}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;