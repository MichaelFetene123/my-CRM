const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('c:/Users/micha/Projects/Laravel/secondLaravel/my-crm/resources/js/hooks');
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    content = content.replace(/queryClient\.invalidateQueries\(\{\s*queryKey:\s*([a-zA-Z]+Keys)\.(list|stages|api)\(\)\s*\}\);/g, 'queryClient.invalidateQueries({ queryKey: $1.all });');
    content = content.replace(/queryClient\.invalidateQueries\(\{\s*queryKey:\s*([a-zA-Z]+Keys)\.detail\([^)]+\)\s*\}\);/g, 'queryClient.invalidateQueries({ queryKey: $1.all });');
    
    let lines = content.split('\n');
    let newLines = [];
    let lastLine = null;
    for (let line of lines) {
        let trimmed = line.trim();
        if (trimmed.startsWith('queryClient.invalidateQueries(')) {
            if (trimmed === lastLine) {
                continue;
            }
            lastLine = trimmed;
        } else {
            lastLine = null;
        }
        newLines.push(line);
    }
    content = newLines.join('\n');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + path.basename(file));
        updatedCount++;
    }
});

console.log(`Total files updated: ${updatedCount}`);
