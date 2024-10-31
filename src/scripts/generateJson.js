const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Define paths
const inputFilePath = path.join(__dirname, '../data/cpc_list.tsv');
const outputFilePath = path.join(__dirname, '../data/cpcs.json');

// Function to parse website/social media URLs
const parseWebsiteArray = (data) => {
    return data.split(';').map(url => url.trim().replace(/^"|"$/g, '')).filter(url => url.length > 0);
};

// Read the TSV file
fs.readFile(inputFilePath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading TSV file:', err);
        return;
    }

    // Parse the TSV data using PapaParse
    const parsedData = Papa.parse(data, {
        delimiter: '\t',
        header: true,
        skipEmptyLines: true,
    });

    // Process parsed rows
    const jsonData = parsedData.data.map(entry => ({
        slug: entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: entry.name,
        is_charity: entry.is_charity,
        charity_num: entry.charity_num,
        charity_type: entry.charity_type,
        org_type: entry.org_type,
        affiliate_of: entry.affiliate_of,
        city: entry.city,
        province: entry.province,
        other_names: entry.other_names || '',
        website: parseWebsiteArray(entry.website_and_social_media || ''),
        sex_ed_programs: entry.sex_ed_programs || '',
        description: `${entry.name} ${
            entry.is_charity === 'Y' ? 'is a registered charity' : 'is an organization'
        } that is considered by Abortion Rights Coalition of Canada to be an anti-choice crisis pregnancy centre or religious post-abortion counselling agency`,
    }));

    // Write the JSON output
    fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return;
        }
        console.log('JSON file created successfully:', outputFilePath);
    });
});
