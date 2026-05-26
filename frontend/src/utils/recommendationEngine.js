import { calculateValueScore } from './specsParser';

/**
 * Smart recommendation matching engine for TechBoy Store.
 * Scores devices based on user priorities and outputs the top 3 recommendations.
 */
export const runRecommendationEngine = (phones, { budget, mainUsage, gamingPriority, cameraPriority, batteryPriority, brand }) => {
    if (!phones || phones.length === 0) return [];

    let scoredPhones = phones.map(phone => {
        let score = 0;
        let reasons = [];
        
        // 1. Budget Filter
        // Strictly filter out devices that are way over budget.
        // We allow up to 6% stretch over budget, but penalize the score.
        if (phone.price <= budget) {
            score += 80; // Large bonus for being under budget
        } else if (phone.price <= budget * 1.06) {
            score += 20; // Minimal budget match score
            reasons.push("Excellent value that is slightly above your budget");
        } else {
            score -= 1000; // Disqualify
        }

        // 2. Brand Check
        if (brand && phone.name.toLowerCase().includes(brand.toLowerCase())) {
            score += 50;
            reasons.push(`Matches your preferred brand (${brand})`);
        }

        // 3. Extract Tags and Specs
        const tag = (phone.tag || '').toLowerCase();
        const desc = (phone.description || '').toLowerCase();

        // 4. Rate individual specifications
        // A. Gaming Capability (1 - 10)
        let gamingCap = 5.0;
        if (tag.includes('gaming')) gamingCap = 9.8;
        else if (desc.includes('snapdragon 8') || desc.includes('apple a18') || desc.includes('apple a17') || desc.includes('dimensity 9')) gamingCap = 9.2;
        else if (desc.includes('snapdragon 7') || desc.includes('dimensity 8') || desc.includes('144hz')) gamingCap = 8.0;
        else if (desc.includes('120hz')) gamingCap = 7.2;
        else if (desc.includes('helio g99') || desc.includes('dimensity 6')) gamingCap = 6.2;
        
        // B. Camera Capability (1 - 10)
        let cameraCap = 5.0;
        if (tag.includes('camera') || tag.includes('beast')) cameraCap = 9.8;
        else if (desc.includes('ois') && (desc.includes('50mp') || desc.includes('108mp') || desc.includes('48mp'))) cameraCap = 8.8;
        else if (desc.includes('telephoto') || desc.includes('periscope') || desc.includes('optical zoom')) cameraCap = 9.2;
        else if (desc.includes('50mp') || desc.includes('108mp') || desc.includes('200mp')) cameraCap = 7.8;
        else if (phone.price > 60000) cameraCap = 8.5;

        // C. Battery Capability (1 - 10)
        let batteryCap = 5.0;
        const mahMatch = desc.match(/(\d+)mah/);
        if (mahMatch) {
            const mah = parseInt(mahMatch[1]);
            if (mah >= 6000) batteryCap = 9.6;
            else if (mah >= 5500) batteryCap = 8.8;
            else if (mah >= 5000) batteryCap = 8.0;
            else if (mah >= 4500) batteryCap = 7.0;
        }
        
        const wattMatch = desc.match(/(\d+)w/);
        if (wattMatch) {
            const watt = parseInt(wattMatch[1]);
            if (watt >= 100) batteryCap += 0.8;
            else if (watt >= 67) batteryCap += 0.4;
            else if (watt >= 33) batteryCap += 0.1;
        }
        batteryCap = Math.min(10.0, batteryCap);

        // 5. User Priority Weights (1 - 4)
        const gWeight = gamingPriority || 1;
        const cWeight = cameraPriority || 1;
        const bWeight = batteryPriority || 1;

        score += (gamingCap * gWeight * 5);
        score += (cameraCap * cWeight * 5);
        score += (batteryCap * bWeight * 5);

        // 6. Main Usage Boosts
        if (mainUsage === 'gaming') {
            score += (gamingCap * 10);
            if (gamingCap >= 8.5) {
                reasons.push("Outstanding gaming processor & cooling");
            } else {
                reasons.push("Strongest gaming performance in this price segment");
            }
        } else if (mainUsage === 'camera') {
            score += (cameraCap * 10);
            if (cameraCap >= 8.5) {
                reasons.push("Advanced camera sensor with optical stabilization");
            } else {
                reasons.push("Highly rated optics for photography");
            }
        } else if (mainUsage === 'battery') {
            score += (batteryCap * 10);
            if (batteryCap >= 8.5) {
                reasons.push("Exceptional screen-on time and ultra-fast charging");
            } else {
                reasons.push("Extended battery stamina for continuous usage");
            }
        } else if (mainUsage === 'performance') {
            score += (gamingCap * 6 + cameraCap * 4);
            reasons.push("Flagship-level processing speeds and multitasking");
        } else if (mainUsage === 'daily') {
            score += 20;
            reasons.push("Extremely fluid user interface and software longevity");
        }

        // Add Value Score factor
        const valueScoreNum = parseFloat(calculateValueScore(phone));
        score += (valueScoreNum * 4);

        // Structure clean explainable AI recommendation text
        let explanation = "";
        if (reasons.length > 0) {
            // Combine reasons nicely
            explanation = reasons.slice(0, 2).join(" with ");
        } else {
            // Custom fallbacks
            if (mainUsage === 'gaming') explanation = "Excellent gaming performance in this price range";
            else if (mainUsage === 'camera') explanation = "Best camera value under your budget";
            else if (mainUsage === 'battery') explanation = "Strong battery optimization and longevity";
            else explanation = "Highly optimized specifications for your budget segment";
        }

        // Clean up capitalization and trailing periods
        explanation = explanation.trim();
        if (explanation.endsWith('.')) explanation = explanation.slice(0, -1);
        explanation = explanation.charAt(0).toUpperCase() + explanation.slice(1) + ".";

        return {
            ...phone,
            matchScore: score,
            matchReason: explanation,
            valueScore: valueScoreNum.toFixed(1)
        };
    });

    // Remove disqualified phones and sort descending
    return scoredPhones
        .filter(p => p.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
};
