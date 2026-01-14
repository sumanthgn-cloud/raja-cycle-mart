const fs = require('fs');
const path = require('path');

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                scanDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Look for Namma Y followed by something that isn't 'atrigalu'
            // OR just look for the bad string specifically if we know it
            // But let's be broad: Namma Y...
            const regex = /Namma Y([^a]*)trigalu/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                if (match[1] !== 'a') {
                    console.log(`Found in ${fullPath}: ${match[0]}`);
                }
            }
            // Also check for the exact bad string user reported just in case regex misses
            if (content.includes('Namma YÄ trigalu')) {
                console.log(`Explicit match in ${fullPath}`);
            }
        }
    });
}

scanDir('C:\\Users\\gnsum\\OneDrive\\Desktop\\HTML');
