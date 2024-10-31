const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const results = [];

// Function to create slugs from the organization name
const createSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Updated function to parse website and social media links with semicolon as delimiter
const parseWebsiteArray = (data) => {
    // Match content strictly within the first set of square brackets
    const matchedArray = data.match(/\[([^\]]*)\]/);
    if (!matchedArray) return []; // Return empty array if no match is found

    // Split by semicolons, trim spaces, and clean up each URL
    const urls = matchedArray[1]
        .split(';')
        .map((url) => url.trim().replace(/^"|"$/g, '')); // Remove surrounding quotes

    // Normalize URLs to add "https://" if missing
    return urls
        .filter((url) => url.length > 0) // Ensure the URL isn't empty
        .map((url) => {
            return url.startsWith('http') ? url : `https://${url}`;
        });
};


// Read CSV and parse each row
fs.createReadStream(path.join(__dirname, '../data/cpc_list.csv'))
    .pipe(csv())
    .on('data', (row) => {
        const {
            name,
            is_charity,
            charity_num,
            charity_type,
            org_type,
            affiliate_of,
            city,
            province,
            other_names,
            website_and_social_media,
            sex_ed_programs,
        } = row;

        // Prepare the JSON object for each row
        const orgObject = {
            slug: createSlug(name),
            name,
            charity_num,
            charity_type,
            org_type,
            affiliate_of: affiliate_of || "",
            city,
            province,
            other_names: other_names || "",
            website: parseWebsiteArray(website_and_social_media),
            sex_ed_programs: sex_ed_programs || "",
            description: `${name} ${
                is_charity === 'Y'
                    ? 'is a registered charity'
                    : 'is an organization'
            } that is considered by Abortion Rights Coalition of Canada to be an anti-choice crisis pregnancy centre or religious post-abortion counselling agency`,
        };

        results.push(orgObject);
    })
    .on('end', () => {
        // Write to JSON file
        fs.writeFileSync(
            path.join(__dirname, '../data/cpcs.json'),
            JSON.stringify(results, null, 2)
        );
        console.log('CSV successfully converted to JSON!');
    });
