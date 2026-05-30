const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = [
    'AnimationEngine.jsx',
    'AuthDropdown.jsx',
    'ComparisonModal.jsx',
    'FilterSidebar.jsx',
    'HowItWorks.jsx',
    'IntroScreen.jsx',
    'Navbar.jsx',
    'TechAdvisorModal.jsx',
    'TechBoyTrends.jsx',
    'WatchlistModal.jsx'
];

for (const file of files) {
    const p = path.join(dir, file);
    let c = fs.readFileSync(p, 'utf8');
    
    // Replace import { motion, ... } with import { m, ... }
    // We use a regex that captures what's before and after `motion` inside the curly braces.
    c = c.replace(/import\s*\{([^}]*)\bmotion\b([^}]*)\}\s*from\s*'framer-motion'/, "import {$1m$2} from 'framer-motion'");
    
    // Replace <motion. and </motion.
    c = c.replace(/<motion\./g, '<m.');
    c = c.replace(/<\/motion\./g, '</m.');
    
    fs.writeFileSync(p, c);
    console.log(`Fixed ${file}`);
}
