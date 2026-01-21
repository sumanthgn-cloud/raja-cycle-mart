const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = __dirname;
const targetExt = '.html';

// Replacements
const utf8Replacements = {
    "â‚¹": "₹",
    "ðŸš²": "🚲",
    "ðŸš´": "🚴",
    "âš¡": "⚡",
    "ðŸ›’": "🛒",
    "ðŸ“²": "📲",
    "â€”": "—",
    "â€™": "’",
    "â€œ": "“",
    "â€": "”",
    "Â": "" // Non-breaking space artifact
};

const contextReplacements = {
    "Lucky Draw \\?": "Lucky Draw ✨",
    "View all \\?": "View all →",
    "Read guide \\?": "Read guide →",
    "Book inspection \\?": "Book inspection →",
    "Book this service \\?": "Book this service →",
    "View full pricing \\?": "View full pricing →",
    "Visit our shop \\?": "Visit our shop →",
    "\\? Back to Blog": "← Back to Blog",
    "approx 4.8\\?": "approx 4.8★",

    // Services
    "\\? Gear tuning": "• Gear tuning",
    "\\? Chain, freewheel": "• Chain, freewheel",
    "\\? Rear derailleur": "• Rear derailleur",
    "\\? Brake cable": "• Brake cable",
    "\\? Wheel truing": "• Wheel truing",
    "\\? Noise, slipping": "• Noise, slipping",
    "\\? Full gear-cycle": "• Full gear-cycle",

    // Checkmarks
    "\\? Expert gear": "✅ Expert gear",
    "\\? Genuine accessories": "✅ Genuine accessories",
    "\\? Honest pricing": "✅ Honest pricing",
    "\\? Same-day service": "✅ Same-day service",

    // Bullets
    "\\? Certified helmets": "• Certified helmets",
    "\\? Bells, handle": "• Bells, handle",
    "\\? Manual & foot": "• Manual & foot",
    "\\? Mobile holders": "• Mobile holders",
    "\\? Front & rear": "• Front & rear",
    "\\? Chains, freewheel": "• Chains, freewheel",
    "\\? no unnecessary": "— no unnecessary",

    // Misc
    "Tumkur \\? SS PURAM": "Tumkur — SS PURAM",
    "Tumkur \\? Trusted Experts": "Tumkur — Trusted Experts",
    "1987 \\? 3500\\+": "1987 · 3500+",
    "serviced \\? Approx": "serviced · Approx"
};

function walk(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const filepath = path.join(dir, file);
            if (file === '.gemini' || file === 'node_modules') return;

            fs.stat(filepath, (err, stats) => {
                if (err) throw err;
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile() && path.extname(filepath) === targetExt) {
                    callback(filepath);
                }
            });
        });
    });
}

// Main logic
walk(rootDir, (filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${filepath}:`, err);
            return;
        }

        let content = data;
        let modified = false;

        // 1. UTF-8 Fixes
        for (const [key, val] of Object.entries(utf8Replacements)) {
            // Check if key exists to avoid regex overhead if possible, 
            // but we need global replace.
            if (content.includes(key)) {
                // Escape key for simple string replace if needed, or split/join
                // Actually split/join is easiest for global replace of static string
                const parts = content.split(key);
                if (parts.length > 1) {
                    content = parts.join(val);
                    modified = true;
                }
            }
        }

        // 2. Context Replacements (Regex based on keys)
        for (const [pattern, val] of Object.entries(contextReplacements)) {
            const regex = new RegExp(pattern, 'g');
            if (regex.test(content)) {
                content = content.replace(regex, val);
                modified = true;
            }
        }

        // 3. Currency Fix (? followed by digit)
        const currencyRegex = /\?(\d+)/g;
        if (currencyRegex.test(content)) {
            content = content.replace(currencyRegex, '₹$1');
            modified = true;
        }

        // 4. Double check for the pesky ? in list
        // Sometimes ? appears at start of line
        // We can check for <li>? and replace with <li>• or <li>✅ based on common sense
        // But let's trust our specific mappings mostly. 
        // Let's add a generic one for unhandled cases if needed.

        if (modified) {
            fs.writeFile(filepath, content, 'utf8', (err) => {
                if (err) console.error(`Error writing ${filepath}:`, err);
                else console.log(`Repaired: ${path.relative(rootDir, filepath)}`);
            });
        }
    });
});
