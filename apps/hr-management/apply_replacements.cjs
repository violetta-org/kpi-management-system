const fs = require('fs');

const transcript = fs.readFileSync('/root/.gemini/antigravity-cli/brain/6cb56caa-b3e2-44bc-8b70-020519ee972d/.system_generated/logs/transcript_full.jsonl', 'utf8');
const lines = transcript.split('\n');

const appPath = '/mnt/c/Users/violet/Documents/MQF/Study Materials/Sixth Semester/QLDA/vibepowerapps/apps/hr-management/src/app.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

for (let line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (let tc of obj.tool_calls) {
        if ((tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') && 
             tc.args.TargetFile && tc.args.TargetFile.includes('app.tsx')) {
          
          if (tc.name === 'replace_file_content') {
            const { TargetContent, ReplacementContent } = tc.args;
            if (appContent.includes(TargetContent)) {
              appContent = appContent.replace(TargetContent, ReplacementContent);
              console.log('Applied single replacement:', tc.args.Description);
            }
          } else if (tc.name === 'multi_replace_file_content') {
            const chunks = tc.args.ReplacementChunks;
            for (let chunk of chunks) {
              if (appContent.includes(chunk.TargetContent)) {
                appContent = appContent.replace(chunk.TargetContent, chunk.ReplacementContent);
                console.log('Applied multi replacement chunk.');
              }
            }
          }
        }
      }
    }
  } catch(e) {}
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Done applying replacements to app.tsx.');
