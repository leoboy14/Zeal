const fs = require('fs');
const content = fs.readFileSync('src/pages/admin/QAFeedbackPage.tsx', 'utf8');

const regex = /<\/?div[^>]*>/g;
let match;
let depth = 0;
const stack = [];

while ((match = regex.exec(content)) !== null) {
  const isClosing = match[0].startsWith('</');
  const line = content.substring(0, match.index).split('\n').length;
  if (line < 450) continue; // skip early parts
  if (line > 1092) break;
  if (isClosing) {
    depth--;
    const last = stack.pop();
    //console.log(`Line ${line}: ${match[0]} (depth ${depth}) matched with ${last.line}`);
  } else {
    // exclude self-closing
    if (!match[0].endsWith('/>')) {
      depth++;
      stack.push({line: line, tag: match[0]});
      //console.log(`Line ${line}: ${match[0]} (depth ${depth})`);
    }
  }
}

console.log("Remaining unclosed tags:");
console.log(stack);
