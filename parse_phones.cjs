const fs = require('fs');

const html = fs.readFileSync('A:/TECHBOY-STORE/techboy-phone-guide.html', 'utf-8');

// Find all budget sections
const sectionRegex = /<button class="budget-btn[^>]*>([^<]+)<\/button>/g;
const categories = [];
let match;
while ((match = sectionRegex.exec(html)) !== null) {
    categories.push(match[1]);
}

// Find budget divs
const budgetDivsRegex = /<div class="budget-section[^>]* id="([^"]+)">([\s\S]*?)<!-- ====== (UNDER|FLAGSHIP)/g;
// actually, let's just split by `<div class="budget-section"`
const parts = html.split(/<div class="budget-section/);

const products = [];
let idCounter = 1;

for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    // Find category title: from the nav, or just map id to category.
    // Let's just extract phone cards.
    // wait, we need the category. The budget sections have ids like b10, b20...
    let category = "Unknown";
    if (part.includes('Under ₹10K') || part.includes('b10"')) category = "Under ₹10K";
    else if (part.includes('b20"')) category = "Under ₹20K";
    else if (part.includes('b30"')) category = "Under ₹30K";
    else if (part.includes('b40"')) category = "Under ₹40K";
    else if (part.includes('b50"')) category = "Under ₹50K";
    else if (part.includes('b60"')) category = "Under ₹60K";
    else if (part.includes('b1l"')) category = "Under ₹1 Lakh";
    else if (part.includes('bfl"')) category = "Flagship 1L+";

    const cardRegex = /<div class="phone-card[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    // Actually, splitting by phone-card is easier
    const cards = part.split(/<div class="phone-card[^>]*>/).slice(1);
    
    for (const card of cards) {
        // Tag
        const tagMatch = card.match(/<div class="cat-badge[^>]*>(.*?)<\/div>/);
        const tag = tagMatch ? tagMatch[1].trim() : "";

        // Brand
        const brandMatch = card.match(/<div class="phone-brand-label[^>]*>(.*?)<\/div>/);
        const brand = brandMatch ? brandMatch[1].trim() : "";

        // Name
        const nameMatch = card.match(/<div class="phone-name[^>]*>(.*?)<\/div>/);
        const namePart = nameMatch ? nameMatch[1].trim() : "";
        const name = brand ? `${brand} ${namePart}` : namePart;

        // Price
        const priceMatch = card.match(/<div class="phone-price[^>]*>~?₹([\d,]+)<\/div>/);
        let price = 0;
        if (priceMatch) {
            price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
        }

        // Specs
        const specs = [];
        const specRegex = /<div class="spec-row"><span class="spec-key">([^<]+)<\/span><span class="spec-val">([^<]+)<\/span><\/div>/g;
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

// Let's also check if there are flagship cards
const flagshipParts = html.split(/<div class="flagship-card[^>]*>/).slice(1);
for (const card of flagshipParts) {
     const tagMatch = card.match(/<div class="verdict[^>]*>(.*?)<\/div>/);
     const tag = tagMatch ? tagMatch[1].trim() : "";

     const brandMatch = card.match(/<div class="brand-pill[^>]*>(.*?)<\/div>/);
     const brand = brandMatch ? brandMatch[1].trim() : "";

     const nameMatch = card.match(/<div class="flagship-name[^>]*>(.*?)<\/div>/);
     const namePart = nameMatch ? nameMatch[1].trim() : "";
     const name = brand ? `${brand} ${namePart}` : namePart;

     const priceMatch = card.match(/<div class="flagship-price[^>]*>~?₹([\d,]+)<\/div>/);
     let price = 0;
     if (priceMatch) {
         price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
     }

     const specs = [];
     const specRegex = /<div class="f-spec"><span class="f-spec-key">([^<]+)<\/span><span class="f-spec-val">([^<]+)<\/span><\/div>/g;
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

fs.writeFileSync('A:/TECHBOY-STORE/src/data/phones.json', JSON.stringify(products, null, 2));
console.log('Parsed ' + products.length + ' phones.');
