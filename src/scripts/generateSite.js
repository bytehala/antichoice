const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Load CPC data from JSON file
const data = require('../data/cpcs.json');
const outputDir = path.join(__dirname, '../../docs');

// Ensure output directories exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(path.join(outputDir, 'cpc'))) {
    fs.mkdirSync(path.join(outputDir, 'cpc'));
}

// Copy JSON data to the output directory
fs.copyFileSync(
    path.join(__dirname, '../data/cpcs.json'),
    path.join(outputDir, 'cpcs.json')
);
console.log('JSON data copied to output directory.');

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

// Generate the full list page using ejs.renderFile
ejs.renderFile(
    path.join(__dirname, '../templates/full_list.ejs'),
    { cpcs: data },
    { views: path.join(__dirname, '../templates') }, // Ensures partials are found
    (err, indexHtml) => {
        if (err) {
            console.error('Error rendering full list page:', err);
            return;
        }
        fs.writeFileSync(path.join(outputDir, 'full_list.html'), indexHtml);
        console.log('full_list page generated successfully');
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
            fs.writeFileSync(path.join(outputDir, `${cpc.slug}.html`), cpcHtml);
            console.log(`Page generated for ${cpc.slug}`);
        }
    );
});

// Render static pages (about and support)
const staticPages = ['about', 'support'];

staticPages.forEach(page => {
    ejs.renderFile(
        path.join(__dirname, `../templates/static/${page}.ejs`),
        {},
        { views: path.join(__dirname, '../templates') },
        (err, staticHtml) => {
            if (err) {
                console.error(`Error rendering ${page} page:`, err);
                return;
            }
            fs.writeFileSync(path.join(outputDir, `${page}.html`), staticHtml);
            console.log(`${page.charAt(0).toUpperCase() + page.slice(1)} page generated successfully`);
        }
    );
});
