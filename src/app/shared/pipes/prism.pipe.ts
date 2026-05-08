import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import { Pipe, PipeTransform } from '@angular/core';
import * as Prism from 'prismjs';
import * as beautify from 'js-beautify';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
// 1. Separate the formatting logic so it can be called by the Copy button
  public getFormattedCode(code: string, fileName: string): string {
    if (!code) return '';
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    const options: beautify.JSBeautifyOptions = {
      indent_size: 4,
      brace_style: "expand",
      preserve_newlines: true,
      max_preserve_newlines: 2,
      wrap_line_length: 80,
      e4x: true 
    };

    let formattedCode = code;

    if (['js', 'ts', 'cs', 'json'].includes(ext)) {
      formattedCode = beautify.js(code, options);

      if (ext === 'cs') {
        // Fix for C# Attributes and Generics (Addressing image_f28609.png and image_f219fc.png)
        formattedCode = formattedCode
          .replace(/\]\s*\[/g, ']\n    [') // Separate chained attributes
          .replace(/(\[[^\]]+\])\s+(public|private|class|async)/g, '$1\n    $2') // Attribute above keyword
          .replace(/\}\s*(\[[^\]]+\])/g, '}\n    $1') // Newline between brace and attribute
          .replace(/<\s+/g, '<').replace(/\s+>/g, '>') // Fix generic spacing
          .replace(/\{\s+(get;|set;)\s+(get;|set;)\s+\}/g, '{ $1 $2 }') // Fix property shorthand
          .replace(/\{\s+(get;|set;)\s+\}/g, '{ $1 }');
      }
    } else if (ext === 'html') {
      formattedCode = beautify.html(code, options);
    }

    return formattedCode;
  }

  // 2. The transform method now just adds colors to the already formatted code
  transform(code: string, fileName: string): string {
    const formattedCode = this.getFormattedCode(code, fileName);
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    const langMap: Record<string, string> = {
      'cs': 'csharp', 'ts': 'typescript', 'js': 'javascript', 'json': 'json', 'html': 'markup'
    };
    const language = langMap[ext] || 'clike';

    if (Prism.languages[language]) {
      return Prism.highlight(formattedCode, Prism.languages[language], language);
    }

    return formattedCode;
  }
  // transform(code: string, fileName: string): string {
  //   if (!code) return '';

  //   const ext = fileName.split('.').pop()?.toLowerCase() || '';

  //   let formattedCode = code;
  //   const options: beautify.JSBeautifyOptions = {
  //     indent_size: 4,               // Standard C# indentation
  //     brace_style: "expand",        // Standard C# Allman style (braces on new lines)
  //     preserve_newlines: true,
  //     max_preserve_newlines: 2,
  //     wrap_line_length: 80,         // Prevents the "infinite horizontal line"
  //     e4x: true                     // Helps with some C# attribute parsing
  //   };

  //   if (['js', 'ts', 'cs', 'json'].includes(ext)) {
  //     formattedCode = beautify.js(code, options);
  //     if (ext === 'cs') {
       
  //       formattedCode = formattedCode.replace(/>\s+([A-Z][a-zA-Z0-9_]+\()/g, '> $1');

  //       formattedCode = formattedCode.replace(/\[\s*FromBody\s*\]\s+/g, '[FromBody] ');

  //       formattedCode = formattedCode.replace(/(\[[^\]]+\])\s+(public|private|class)/g, '$1\n    $2');

  //       formattedCode = formattedCode.replace(/\]\s*\[/g, ']\n    [');

  //       formattedCode = formattedCode.replace(/<\s+/g, '<').replace(/\s+>/g, '>');
  //     }

  //   } else if (ext === 'html') {
  //     formattedCode = beautify.html(code, options);
  //   }
  //   const langMap: Record<string, string> = {
  //     'cs': 'csharp',
  //     'ts': 'typescript',
  //     'js': 'javascript',
  //     'json': 'json',
  //     'html': 'markup'
  //   };
  //   const language = langMap[ext] || 'clike';

  //   if (Prism.languages[language]) {
  //     return Prism.highlight(formattedCode, Prism.languages[language], language);
  //   }

  //   return code;
  // }
}