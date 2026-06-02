const fs = require('fs');
const transcript = fs.readFileSync('/root/.gemini/antigravity-cli/brain/6cb56caa-b3e2-44bc-8b70-020519ee972d/.system_generated/logs/transcript_full.jsonl', 'utf8');
const lines = transcript.split('\n');

for (let line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (let tc of obj.tool_calls) {
        if ((tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') && 
             tc.args.TargetFile && tc.args.TargetFile.includes('app.tsx')) {
          console.log('--- FOUND REPLACEMENT ---');
          console.log(JSON.stringify(tc.args, null, 2));
        }
      }
    }
  } catch(e) {}
}
