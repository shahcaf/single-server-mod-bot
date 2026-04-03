const fs = require('fs');
const path = require('path');

const modDir = path.join(__dirname, '../src/commands/moderation');
const genDir = path.join(__dirname, '../src/commands/general');
const dirs = [modDir, genDir];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Replace any existing color with Onyx & Gold #D4AF37
        const newContent = content.replace(/\.setColor\(.*?\)/g, ".setColor('#D4AF37')");
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }

        // Prepend » to embeds to give it that terminal vibe
        const newWarning = content.replace(/⚠️ (.*?)(`|\})/g, "» ⚠️ $1$2");
        if (newWarning !== content) {
            content = newWarning;
            modified = true;
        }

        // Change { name: 'User', value: ...} to have generic Onyx format
        // This is a basic catch-all for remaining unstyled modules
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated aesthetic for ${file}`);
        }
    });
});
