const fs = require('fs');

const html = fs.readFileSync('A:/TECHBOY-STORE/techboy-phone-guide-v2.html', 'utf-8');

const products = [];
let idCounter = 1;

// Budget sections
const bsecs = html.split(/<div class="bsec[^>]*id="([^"]+)">/);
const categoryMap = {
    'b10': 'Under ₹10K',
    'b20': 'Under ₹20K',
    'b30': 'Under ₹30K',
    'b40': 'Under ₹40K',
    'b50': 'Under ₹50K',
    'b60': 'Under ₹60K',
    'b1l': 'Under ₹1 Lakh'
};

for (let i = 1; i < bsecs.length; i += 2) {
    const id = bsecs[i];
    const content = bsecs[i + 1];
    const category = categoryMap[id] || "Unknown";

    const cards = content.split(/<div class="pcard[^>]*>/).slice(1);
    for (const card of cards) {
        const tagMatch = card.match(/<div class="pbadge[^>]*>(.*?)<\/div>/);
        let tag = tagMatch ? tagMatch[1].trim() : "";
        
        const brandMatch = card.match(/<div class="pbrand[^>]*>(.*?)<\/div>/);
        const brand = brandMatch ? brandMatch[1].trim() : "";

        const nameMatch = card.match(/<div class="pname[^>]*>(.*?)<\/div>/);
        const namePart = nameMatch ? nameMatch[1].trim() : "";
        const name = brand ? `${brand} ${namePart}` : namePart;

        const priceMatch = card.match(/<div class="pprice[^>]*>[^₹]*₹([\d,]+)<\/div>/);
        let price = 0;
        if (priceMatch) {
            price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
        }

        const specs = [];
        const specRegex = /<div class="srow"><span class="sk">([^<]+)<\/span><span class="sv">([^<]+)<\/span><\/div>/g;
        let specMatch;
        while ((specMatch = specRegex.exec(card)) !== null) {
            specs.push(`${specMatch[1]}: ${specMatch[2]}`);
        }
        const description = specs.join(' | ');

        if (name) {
            products.push({
                id: idCounter++,
                name,
                tag,
                category,
                price,
                description
            });
        }
    }
}

// Flagship sections
const fgroups = html.split(/<div class="flag-group">/).slice(1);
for (const group of fgroups) {
    const fcards = group.split(/<div class="fcard[^>]*>/).slice(1);
    for (const card of fcards) {
        const tagMatch = card.match(/<div class="fverdict[^>]*>(.*?)<\/div>/);
        const tag = tagMatch ? tagMatch[1].trim() : "";

        const brandMatch = card.match(/<div class="fpill[^>]*>(.*?)<\/div>/);
        const brand = brandMatch ? brandMatch[1].trim() : "";

        const nameMatch = card.match(/<div class="fname[^>]*>(.*?)<\/div>/);
        const namePart = nameMatch ? nameMatch[1].trim() : "";
        const name = brand ? `${brand} ${namePart}` : namePart;

        const priceMatch = card.match(/<div class="fprice[^>]*>[^₹]*₹([\d,]+)<\/div>/);
        let price = 0;
        if (priceMatch) {
            price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
        }

        const specs = [];
        const specRegex = /<div class="fsr"><span class="fsk">([^<]+)<\/span><span class="fsv">([^<]+)<\/span><\/div>/g;
        let specMatch;
        while ((specMatch = specRegex.exec(card)) !== null) {
            specs.push(`${specMatch[1]}: ${specMatch[2]}`);
        }
        const description = specs.join(' | ');

        if (name) {
            products.push({
                id: idCounter++,
                name,
                tag,
                category: "Flagship 1L+",
                price,
                description
            });
        }
    }
}

fs.writeFileSync('A:/TECHBOY-STORE/src/data/phones.json', JSON.stringify(products, null, 2));
console.log('Parsed ' + products.length + ' phones.');
