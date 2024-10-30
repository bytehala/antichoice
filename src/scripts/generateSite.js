const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Load CPC data from JSON file
const data = require('../data/cpcs.json');
const outputDir = path.join(__dirname, '../../output');

// Ensure output directories exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(path.join(outputDir, 'cpc'))) {
    fs.mkdirSync(path.join(outputDir, 'cpc'));
}

// Generate the main index page using ejs.renderFile
ejs.renderFile(
    path.join(__dirname, '../templates/root.ejs'),
    { cpcs: data },
    { views: path.join(__dirname, '../templates') }, // Ensures partials are found
    (err, indexHtml) => {
        if (err) {
            console.error('Error rendering index page:', err);
            return;
        }
        fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
        console.log('Index page generated successfully');
    }
);

// Generate individual CPC pages
data.forEach(cpc => {
    ejs.renderFile(
        path.join(__dirname, '../templates/cpc-page.ejs'),
        { cpc },
        { views: path.join(__dirname, '../templates') },
        (err, cpcHtml) => {
            if (err) {
                console.error(`Error rendering page for ${cpc.slug}:`, err);
                return;
            }
            fs.writeFileSync(path.join(outputDir, 'cpc', `${cpc.slug}.html`), cpcHtml);
            console.log(`Page generated for ${cpc.slug}`);
        }
    );
});
