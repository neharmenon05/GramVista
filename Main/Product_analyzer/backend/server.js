const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs'); // Not strictly needed if data is inline, but good practice for larger data

const app = express();
const port = 5500; // Port for your backend server

// Middleware
app.use(cors()); // Allows your frontend to make requests to this server
app.use(bodyParser.json({ limit: '10mb' })); // To handle large image base64 strings

// Load sample analysis data (expanded for more common items)
const sampleAnalysisData = {
    'plastic-bottle': {
        productName: "Plastic Water Bottle",
        primaryMaterial: "PET (Polyethylene Terephthalate)",
        biodegradability: "Low (500+ years)",
        materials: [
            { name: "PET Plastic", percentage: 95 },
            { name: "HDPE (Cap)", percentage: 4 },
            { name: "PP (Label)", percentage: 1 }
        ],
        materialsAnalysis: "This product is primarily made from PET plastic, a petroleum-based material that is lightweight, transparent, and commonly used for single-use beverage containers. While PET is recyclable, its production has significant environmental impacts and improper disposal creates long-lasting pollution.",
        materialProperties: [
            "Non-biodegradable - takes centuries to decompose naturally",
            "Lightweight but durable material",
            "Excellent moisture barrier properties",
            "Contains no BPA but may leach other chemicals when heated"
        ],
        environmentalImpact: "Plastic bottles are a major contributor to global pollution. Over 1 million plastic bottles are sold every minute worldwide, with less than 30% being recycled. Those that end up in landfills or oceans take hundreds of years to break down into microplastics that enter the food chain.",
        decompositionTime: "450-500 years",
        recyclability: "Technically recyclable (rate: ~29%)",
        carbonFootprint: "1.5 kg CO2 per bottle (production only)",
        ecoAlternatives: "Consider these sustainable alternatives that dramatically reduce environmental impact while maintaining functionality:",
        suggestedAlternatives: [
            { name: "Stainless Steel Bottle", description: "Reusable, durable, and keeps liquids hot/cold for hours. Lasts for years with proper care.", biodegradable: false, ecoRating: 9 },
            { name: "Glass Bottle with Silicone Sleeve", description: "Chemically inert, easy to clean, and 100% recyclable. Silicone sleeve provides grip and protection.", biodegradable: false, ecoRating: 8 },
            { name: "Plant-based PLA Bottle", description: "Made from renewable resources like corn starch. Industrial composting required for breakdown.", biodegradable: true, ecoRating: 7 },
            { name: "Aluminum Water Bottle", description: "Infinitely recyclable with much higher recycling rates than plastic. Lightweight but durable.", biodegradable: false, ecoRating: 8 }
        ]
    },
    'cardboard-box': { // This category will now also cover cardboard cups
        productName: "Cardboard Product (Box/Cup)",
        primaryMaterial: "Corrugated Fiberboard / Paperboard",
        biodegradability: "High (2-3 months)",
        materials: [
            { name: "Kraft Paper/Paperboard", percentage: 90 },
            { name: "Fluting/Adhesives/Lining", percentage: 10 } // Acknowledge potential lining
        ],
        materialsAnalysis: "Cardboard and paperboard products are primarily composed of cellulose fibers from wood pulp, making them highly biodegradable and recyclable. While some items like cups may have thin plastic linings, the core material is paper-based.",
        materialProperties: [
            "Biodegradable and compostable in proper conditions",
            "High compression strength for stacking",
            "Natural insulation properties",
            "Absorbs moisture which affects structural integrity (especially cups with no lining)"
        ],
        environmentalImpact: "Cardboard has a relatively low environmental impact compared to plastic packaging. It decomposes quickly in composting facilities but can release methane in landfills if not properly disposed of. Items with plastic linings may require specialized recycling.",
        decompositionTime: "2-3 months (composted, if no lining)",
        recyclability: "Highly recyclable (rate: ~80%, if no lining)",
        carbonFootprint: "0.2 kg CO2 per item",
        ecoAlternatives: "While cardboard is already eco-friendly, consider these sustainable enhancements:",
        suggestedAlternatives: [
            { name: "Recycled Content Cardboard", description: "Contains 100% post-consumer recycled fibers, reducing virgin material use", biodegradable: true, ecoRating: 9 },
            { name: "Mushroom Packaging", description: "Grown from mycelium, fully biodegradable in weeks", biodegradable: true, ecoRating: 10 },
            { name: "Pulp Molding", description: "Made from waste paper or agricultural fibers, compostable", biodegradable: true, ecoRating: 8 },
            { name: "Reusable Coffee Cup", description: "For cups, a reusable option significantly reduces waste.", biodegradable: false, ecoRating: 10 }
        ]
    },
    'metal-can': {
        productName: "Aluminum Can",
        primaryMaterial: "Aluminum",
        biodegradability: "Non-biodegradable",
        materials: [
            { name: "Aluminum", percentage: 99 },
            { name: "Liner", percentage: 1 }
        ],
        materialsAnalysis: "Aluminum cans are infinitely recyclable without quality loss. The production is energy-intensive but recycling aluminum saves 95% of the energy needed for primary production.",
        materialProperties: [
            "Excellent barrier against light/oxygen",
            "Lightweight yet durable",
            "Highly conductive for heating/cooling",
            "Non-biodegradable but highly recyclable"
        ],
        environmentalImpact: "While mining bauxite has significant impacts, recycling aluminum has the highest rates of any material (nearly 70% in US). Improper disposal can last 200-500 years as landfill.",
        decompositionTime: "200-500 years",
        recyclability: "Highly recyclable (rate: ~69%)",
        carbonFootprint: "0.3 kg CO2 per can (50% recycled content)",
        ecoAlternatives: "More sustainable options for beverage containers:",
        suggestedAlternatives: [
            { name: "Refillable Glass Bottles", description: "Can be reused 25+ times before recycling", biodegradable: false, ecoRating: 8 },
            { name: "Plant-based Tetra Paks", description: "75% renewable materials, recyclable", biodegradable: false, ecoRating: 7 },
            { name: "Beverages in Bulk", description: "Eliminates single-use packaging entirely", biodegradable: true, ecoRating: 10 }
        ]
    },
    'glass-jar': {
        productName: "Glass Jar",
        primaryMaterial: "Soda-Lime Glass",
        biodegradability: "Non-biodegradable",
        materials: [
            { name: "Silica", percentage: 70 },
            { name: "Soda Ash", percentage: 15 },
            { name: "Limestone", percentage: 10 },
            { name: "Other", percentage: 5 }
        ],
        materialsAnalysis: "Glass is inert and non-toxic, making it ideal for food storage. While not biodegradable, it's infinitely recyclable without quality loss when properly processed.",
        materialProperties: [
            "Does not absorb flavors or odors",
            "100% impermeable to gases/liquids",
            "Thermally stable for heating/freezing",
            "Heavy compared to other packaging"
        ],
        environmentalImpact: "Glass manufacturing is energy-intensive, but recycled glass (cullet) melts at lower temperatures. Broken glass can persist for millions of years but doesn't leach chemicals.",
        decompositionTime: "1 million+ years",
        recyclability: "Fully recyclable (rate: ~33%)",
        carbonFootprint: "0.8 kg CO2 per jar (50% recycled content)",
        ecoAlternatives: "Consider these sustainable alternatives for food storage:",
        suggestedAlternatives: [
            { name: "Refillable Glass", description: "Designed for reuse before eventual recycling", biodegradable: false, ecoRating: 9 },
            { name: "Silicone Food Storage", description: "Flexible, reusable, reduces breakage", biodegradable: false, ecoRating: 7 },
            { name: "Beeswax Wraps", description: "Organic cotton infused with beeswax for storage", biodegradable: true, ecoRating: 8 }
        ]
    },
    'paper-bag': {
        productName: "Paper Bag",
        primaryMaterial: "Paper (Cellulose Fibers)",
        biodegradability: "High (2-6 weeks)",
        materials: [
            { name: "Recycled Paper Pulp", percentage: 80 },
            { name: "Virgin Wood Pulp", percentage: 15 },
            { name: "Adhesives", percentage: 5 }
        ],
        materialsAnalysis: "Paper bags are made from renewable wood resources and are highly biodegradable and recyclable. Their environmental impact is generally lower than plastic bags, especially if made from recycled content.",
        materialProperties: [
            "Biodegradable and compostable",
            "Made from renewable resources",
            "Can be recycled multiple times",
            "Less durable than plastic, susceptible to moisture"
        ],
        environmentalImpact: "Paper bags decompose relatively quickly. While their production can be energy and water intensive, they contribute less to long-term pollution than plastic. Recycling is key to minimizing their footprint.",
        decompositionTime: "2-6 weeks (composted)",
        recyclability: "Highly recyclable (rate: ~70%)",
        carbonFootprint: "0.1 kg CO2 per bag",
        ecoAlternatives: "Even more sustainable options for carrying goods:",
        suggestedAlternatives: [
            { name: "Reusable Canvas Bag", description: "Extremely durable, washable, and can be used thousands of times.", biodegradable: false, ecoRating: 10 },
            { name: "Jute Bag", description: "Made from natural plant fibers, strong, durable, and biodegradable.", biodegradable: true, ecoRating: 9 },
            { name: "Compostable Bioplastic Bag", description: "Made from plant-based polymers, designed to break down in industrial compost facilities.", biodegradable: true, ecoRating: 7 }
        ]
    },
    'plastic-bag': {
        productName: "Plastic Shopping Bag/Wrapper",
        primaryMaterial: "LDPE (Low-Density Polyethylene)",
        biodegradability: "Very Low (100-1000 years)",
        materials: [
            { name: "LDPE Plastic", percentage: 99 },
            { name: "Colorants", percentage: 1 }
        ],
        materialsAnalysis: "Plastic shopping bags and flexible wrappers (like chip bags or candy wrappers) are typically made from LDPE or similar petroleum-derived plastics. They are lightweight and cheap but are a significant source of environmental pollution due to their widespread use and slow degradation.",
        materialProperties: [
            "Non-biodegradable - persists for centuries",
            "Lightweight and flexible",
            "Can break down into microplastics",
            "Difficult to recycle due to 'film' nature or mixed materials"
        ],
        environmentalImpact: "Plastic bags and wrappers are notorious for littering landscapes, harming wildlife, and contributing to ocean pollution. They take hundreds of years to break down and often end up in landfills or as environmental waste.",
        decompositionTime: "100-1000 years",
        recyclability: "Limited (often not accepted in curbside recycling)",
        carbonFootprint: "0.05 kg CO2 per item",
        ecoAlternatives: "Crucial to switch to reusable options:",
        suggestedAlternatives: [
            { name: "Reusable Shopping Bag (Fabric)", description: "Durable, washable, and can replace thousands of single-use plastic bags.", biodegradable: false, ecoRating: 10 },
            { name: "Mesh Produce Bags", description: "Reusable bags for fruits and vegetables, eliminating small plastic bags.", biodegradable: false, ecoRating: 9 },
            { name: "Bulk Buying", description: "Reduces need for individual packaging.", biodegradable: true, ecoRating: 9 }
        ]
    },
    'organic-produce': {
        productName: "Organic Produce (e.g., Apple)",
        primaryMaterial: "Organic Matter (Plant Fibers, Water)",
        biodegradability: "Very High (Days to Weeks)",
        materials: [
            { name: "Water", percentage: 85 },
            { name: "Carbohydrates", percentage: 10 },
            { name: "Fiber", percentage: 3 },
            { name: "Vitamins/Minerals", percentage: 2 }
        ],
        materialsAnalysis: "Organic produce consists entirely of natural, biodegradable materials. When composted, it enriches soil and returns nutrients to the earth, completing a natural cycle.",
        materialProperties: [
            "100% biodegradable and compostable",
            "Nutrient-rich for soil",
            "Renewable resource",
            "Perishable, requires proper storage"
        ],
        environmentalImpact: "The environmental impact of organic produce is primarily related to its cultivation (water, land use, transportation) rather than the product itself. Proper composting avoids landfill methane emissions.",
        decompositionTime: "Days to weeks (composted)",
        recyclability: "Compostable",
        carbonFootprint: "Very low (varies by transport)",
        ecoAlternatives: "Focus on reducing waste and supporting sustainable agriculture:",
        suggestedAlternatives: [
            { name: "Composting Food Scraps", description: "Turn food waste into valuable soil amendment, reducing landfill burden.", biodegradable: true, ecoRating: 10 },
            { name: "Local & Seasonal Produce", description: "Reduces transportation emissions and supports local economies.", biodegradable: true, ecoRating: 9 },
            { name: "Grow Your Own Food", description: "Eliminates packaging and transportation entirely, ultimate sustainability.", biodegradable: true, ecoRating: 10 }
        ]
    },
    'compostable-disposable': {
        productName: "Compostable Plate/Cutlery",
        primaryMaterial: "PLA / Bagasse / Wood",
        biodegradability: "High (Industrial Composting)",
        materials: [
            { name: "Polylactic Acid (PLA)", percentage: 70 },
            { name: "Bagasse (Sugarcane Pulp)", percentage: 20 },
            { name: "Wood Fibers", percentage: 10 }
        ],
        materialsAnalysis: "These products are designed to break down in industrial composting facilities. PLA is a plant-based plastic, while bagasse and wood are natural fibers. They offer a more sustainable alternative to traditional plastics.",
        materialProperties: [
            "Biodegradable and compostable (requires specific conditions)",
            "Made from renewable resources",
            "Can be durable for single-use applications",
            "May not break down in home composts or landfills"
        ],
        environmentalImpact: "While a better alternative to conventional plastics, their environmental benefit is realized only if they are properly composted. If sent to landfills, they may not decompose or can produce methane.",
        decompositionTime: "3-6 months (industrial compost)",
        recyclability: "Not typically recyclable with conventional plastics",
        carbonFootprint: "0.02 kg CO2 per item",
        ecoAlternatives: "Reusable options are always best, but for disposables:",
        suggestedAlternatives: [
            { name: "Reusable Dinnerware", description: "The most sustainable choice for events or daily use.", biodegradable: false, ecoRating: 10 },
            { name: "Bamboo Cutlery", description: "Natural, biodegradable, and often reusable for a few uses.", biodegradable: true, ecoRating: 8 },
            { name: "Edible Cutlery/Plates", description: "Innovative solution that eliminates waste entirely.", biodegradable: true, ecoRating: 9 }
        ]
    },
    'styrofoam': {
        productName: "Styrofoam/Polystyrene Container",
        primaryMaterial: "Polystyrene (PS)",
        biodegradability: "Very Low (500+ years)",
        materials: [
            { name: "Polystyrene", percentage: 98 },
            { name: "Air", percentage: 2 }
        ],
        materialsAnalysis: "Styrofoam is a brand name for expanded polystyrene (EPS), a petroleum-based plastic. It's lightweight, inexpensive, and provides good insulation, but is extremely durable and non-biodegradable.",
        materialProperties: [
            "Non-biodegradable - persists for centuries",
            "Lightweight and bulky",
            "Excellent thermal insulation",
            "Breaks into small pieces (microplastics) easily"
        ],
        environmentalImpact: "Styrofoam is a major environmental pollutant. It's rarely recycled due to its low density and contamination issues, often ending up in landfills or as litter, where it breaks into persistent microplastics.",
        decompositionTime: "500+ years",
        recyclability: "Very limited (specialized facilities only)",
        carbonFootprint: "0.1 kg CO2 per container",
        ecoAlternatives: "Avoid entirely where possible:",
        suggestedAlternatives: [
            { name: "Reusable Food Containers", description: "Glass or stainless steel containers for takeout or storage.", biodegradable: false, ecoRating: 10 },
            { name: "Compostable Fiber Containers", description: "Made from bagasse or recycled paper, industrially compostable.", biodegradable: true, ecoRating: 8 },
            { name: "Bring Your Own Mug/Container", description: "Reduces single-use waste at cafes and restaurants.", biodegradable: false, ecoRating: 10 }
        ]
    },
    'natural-textile': {
        productName: "Natural Fiber Clothing/Textile",
        primaryMaterial: "Cotton / Linen / Wool / Hemp",
        biodegradability: "High (Months to Years)",
        materials: [
            { name: "Cellulose/Protein Fibers", percentage: 100 }
        ],
        materialsAnalysis: "Textiles made from natural fibers like cotton, linen, wool, or hemp are derived from plants or animals. They are generally biodegradable and can return nutrients to the soil at the end of their life.",
        materialProperties: [
            "Biodegradable and compostable",
            "Breathable and comfortable",
            "Renewable resource",
            "Durability varies by fiber type"
        ],
        environmentalImpact: "While biodegradable, the environmental impact can vary based on cultivation (water use, pesticides for cotton) and processing. Proper disposal through composting or donation is key.",
        decompositionTime: "Months to a few years (composted)",
        recyclability: "Recyclable (textile recycling)",
        carbonFootprint: "Varies (e.g., 2.5 kg CO2 per cotton t-shirt)",
        ecoAlternatives: "Sustainable fashion choices:",
        suggestedAlternatives: [
            { name: "Organic Cotton/Hemp", description: "Grown with less environmental impact.", biodegradable: true, ecoRating: 9 },
            { name: "Second-hand Clothing", description: "Extends product life, reduces demand for new production.", biodegradable: false, ecoRating: 10 },
            { name: "Repair & Reuse", description: "Mend clothes to prolong their lifespan.", biodegradable: false, ecoRating: 10 }
        ]
    },
    'synthetic-textile': {
        productName: "Synthetic Fiber Clothing/Textile",
        primaryMaterial: "Polyester / Nylon / Acrylic",
        biodegradability: "Very Low (20-200 years)",
        materials: [
            { name: "Petroleum-based Polymers", percentage: 100 }
        ],
        materialsAnalysis: "Synthetic textiles like polyester, nylon, and acrylic are made from petroleum-derived plastics. They are durable, water-resistant, and often cheaper, but are non-biodegradable and contribute to microplastic pollution.",
        materialProperties: [
            "Non-biodegradable - persists for decades to centuries",
            "Durable and quick-drying",
            "Sheds microplastics during washing",
            "Often made from non-renewable resources"
        ],
        environmentalImpact: "Synthetic textiles contribute to plastic pollution, especially microplastics in waterways. Their production is energy-intensive, and they do not break down naturally in the environment.",
        decompositionTime: "20-200 years",
        recyclability: "Limited (specialized textile recycling)",
        carbonFootprint: "Varies (e.g., 5.5 kg CO2 per polyester t-shirt)",
        ecoAlternatives: "Choose natural or recycled options:",
        suggestedAlternatives: [
            { name: "Recycled Polyester", description: "Made from recycled plastic bottles, reducing virgin plastic use.", biodegradable: false, ecoRating: 7 },
            { name: "Natural Fiber Alternatives", description: "Opt for cotton, wool, or hemp where possible.", biodegradable: true, ecoRating: 9 },
            { name: "Microfiber Catching Bags", description: "Wash synthetic clothes in bags that capture microfibers.", biodegradable: false, ecoRating: 6 }
        ]
    },
    'electronics': {
        productName: "Electronics / E-waste",
        primaryMaterial: "Mixed Materials (Metals, Plastics, Glass)",
        biodegradability: "Non-biodegradable (Complex)",
        materials: [
            { name: "Plastics", percentage: 40 },
            { name: "Metals (Copper, Gold, etc.)", percentage: 30 },
            { name: "Glass", percentage: 15 },
            { name: "Ceramics/Other", percentage: 15 }
        ],
        materialsAnalysis: "Electronics are complex products composed of a wide array of materials, including valuable metals, various plastics, and glass. Many components are non-biodegradable and can contain hazardous substances.",
        materialProperties: [
            "Contains valuable and rare earth metals",
            "Can contain toxic heavy metals (lead, mercury)",
            "Non-biodegradable and persistent",
            "Requires specialized dismantling and recycling"
        ],
        environmentalImpact: "E-waste is a rapidly growing waste stream. Improper disposal leads to leaching of toxic chemicals into soil and water, and loss of valuable resources. Recycling is crucial but complex.",
        decompositionTime: "Thousands of years (components)",
        recyclability: "Specialized e-waste recycling required",
        carbonFootprint: "High (production and disposal)",
        ecoAlternatives: "Reduce, reuse, recycle electronics responsibly:",
        suggestedAlternatives: [
            { name: "Repair Electronics", description: "Extend the life of devices instead of replacing them.", biodegradable: false, ecoRating: 10 },
            { name: "Donate/Sell Old Devices", description: "Give electronics a second life.", biodegradable: false, ecoRating: 9 },
            { name: "Certified E-waste Recycling", description: "Ensure proper and safe disposal/material recovery.", biodegradable: false, ecoRating: 9 }
        ]
    },
    'batteries': {
        productName: "Battery (Alkaline/Lithium-ion)",
        primaryMaterial: "Mixed Metals & Chemicals",
        biodegradability: "Non-biodegradable (Hazardous)",
        materials: [
            { name: "Metals (Zinc, Manganese, Lithium, Cobalt)", percentage: 60 },
            { name: "Electrolytes", percentage: 20 },
            { name: "Plastics/Other", percentage: 20 }
        ],
        materialsAnalysis: "Batteries are electrochemical devices containing various metals and chemicals. They are essential for modern life but can be hazardous if not disposed of properly due to corrosive and toxic contents.",
        materialProperties: [
            "Contains valuable and sometimes toxic metals",
            "Can leak corrosive chemicals",
            "Non-biodegradable and persistent",
            "Risk of fire/explosion if damaged (Lithium-ion)"
        ],
        environmentalImpact: "Improper disposal of batteries can lead to heavy metals and toxic chemicals leaching into soil and water, contaminating ecosystems. Recycling recovers valuable materials and prevents pollution.",
        decompositionTime: "Thousands of years",
        recyclability: "Specialized battery recycling required",
        carbonFootprint: "High (production and disposal)",
        ecoAlternatives: "Reduce battery consumption and recycle:",
        suggestedAlternatives: [
            { name: "Rechargeable Batteries", description: "Reduces the number of single-use batteries consumed.", biodegradable: false, ecoRating: 9 },
            { name: "Battery Recycling Programs", description: "Utilize designated drop-off points for safe disposal.", biodegradable: false, ecoRating: 10 },
            { name: "Devices with Built-in Rechargeable Batteries", description: "Reduces reliance on disposable batteries.", biodegradable: false, ecoRating: 8 }
        ]
    },
    'unknown': { // Fallback for when Ollama can't identify or map
        productName: "Unknown Product",
        primaryMaterial: "Undetermined",
        biodegradability: "Unknown",
        materials: [{ name: "Mixed Materials", percentage: 100 }],
        materialsAnalysis: "The material composition could not be determined. Please try uploading a clearer image or a different product. Ensure the item is clearly visible and distinct.",
        materialProperties: ["Cannot assess properties without identification."],
        environmentalImpact: "Environmental impact is unknown. Proper disposal depends on material type.",
        decompositionTime: "Unknown",
        recyclability: "Unknown",
        carbonFootprint: "Unknown",
        ecoAlternatives: "Please try again with a different image. For general eco-friendly practices, consider reducing consumption, reusing items, and researching local recycling guidelines.",
        suggestedAlternatives: []
    }
};

// Helper function to map Ollama's response to your sample data
function mapOllamaResponseToProductType(ollamaResponse) {
    const lowerCaseResponse = ollamaResponse.toLowerCase();

    // Primary packaging/containers
    if (lowerCaseResponse.includes('plastic bottle') || lowerCaseResponse.includes('pet bottle') || lowerCaseResponse.includes('plastic container')) {
        return 'plastic-bottle';
    }
    // Cardboard products (including cups now)
    if (lowerCaseResponse.includes('cardboard box') || lowerCaseResponse.includes('corrugated box') || lowerCaseResponse.includes('cardboard cup') || lowerCaseResponse.includes('paper cup') || lowerCaseResponse.includes('coffee cup') || lowerCaseResponse.includes('paperboard')) {
        return 'cardboard-box';
    }
    if (lowerCaseResponse.includes('metal can') || lowerCaseResponse.includes('aluminum can') || lowerCaseResponse.includes('steel can')) {
        return 'metal-can';
    }
    if (lowerCaseResponse.includes('glass jar') || lowerCaseResponse.includes('glass bottle')) {
        return 'glass-jar';
    }
    if (lowerCaseResponse.includes('paper bag') || lowerCaseResponse.includes('kraft bag') || lowerCaseResponse.includes('paper sack')) {
        return 'paper-bag';
    }
    // Flexible plastics (bags, wrappers)
    if (lowerCaseResponse.includes('plastic bag') || lowerCaseResponse.includes('shopping bag') || lowerCaseResponse.includes('ldpe bag') || lowerCaseResponse.includes('candy wrapper') || lowerCaseResponse.includes('snack food packaging') || lowerCaseResponse.includes('chip bag') || lowerCaseResponse.includes('plastic wrapper') || lowerCaseResponse.includes('foil packaging')) {
        return 'plastic-bag';
    }
    // Organic matter
    if (lowerCaseResponse.includes('vegetable') || lowerCaseResponse.includes('fruit') || lowerCaseResponse.includes('produce') || lowerCaseResponse.includes('apple') || lowerCaseResponse.includes('banana') || lowerCaseResponse.includes('food waste') || lowerCaseResponse.includes('organic matter')) {
        return 'organic-produce';
    }
    // Compostable disposables
    if (lowerCaseResponse.includes('compostable plate') || lowerCaseResponse.includes('compostable cutlery') || lowerCaseResponse.includes('bagasse') || lowerCaseResponse.includes('wooden cutlery') || lowerCaseResponse.includes('bamboo plate') || lowerCaseResponse.includes('pla plastic')) {
        return 'compostable-disposable';
    }
    // Styrofoam
    if (lowerCaseResponse.includes('styrofoam') || lowerCaseResponse.includes('polystyrene') || lowerCaseResponse.includes('foam container') || lowerCaseResponse.includes('packing peanut')) {
        return 'styrofoam';
    }
    // Textiles
    if (lowerCaseResponse.includes('cotton') || lowerCaseResponse.includes('linen') || lowerCaseResponse.includes('wool') || lowerCaseResponse.includes('hemp') || lowerCaseResponse.includes('natural fiber') || lowerCaseResponse.includes('denim')) {
        return 'natural-textile';
    }
    if (lowerCaseResponse.includes('polyester') || lowerCaseResponse.includes('nylon') || lowerCaseResponse.includes('acrylic') || lowerCaseResponse.includes('synthetic fiber') || lowerCaseResponse.includes('spandex') || lowerCaseResponse.includes('lycra')) {
        return 'synthetic-textile';
    }
    // Electronics
    if (lowerCaseResponse.includes('electronic device') || lowerCaseResponse.includes('e-waste') || lowerCaseResponse.includes('phone') || lowerCaseResponse.includes('laptop') || lowerCaseResponse.includes('computer') || lowerCaseResponse.includes('tv') || lowerCaseResponse.includes('tablet')) {
        return 'electronics';
    }
    // Batteries
    if (lowerCaseResponse.includes('battery') || lowerCaseResponse.includes('aa battery') || lowerCaseResponse.includes('aaa battery') || lowerCaseResponse.includes('lithium-ion battery') || lowerCaseResponse.includes('alkaline battery')) {
        return 'batteries';
    }

    // Default if no match
    return 'unknown';
}

// API endpoint for image analysis
app.post('/analyze-image', async (req, res) => {
    const { imageData } = req.body; // imageData is the Base64 string from the frontend

    if (!imageData) {
        return res.status(400).json({ error: 'No image data provided.' });
    }

    // Remove the data URI prefix (e.g., "data:image/png;base64,")
    const base64Image = imageData.split(',')[1];

    try {
        // Make request to Ollama API
        const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
            model: 'llava', // Or 'bakllava', depending on what you installed
            prompt: 'What is the main product or material shown in this image? Be concise and identify the primary object. For example: "a plastic bottle", "a cardboard box", "a metal can", "a glass jar", "a paper bag", "a plastic shopping bag", "an apple", "a compostable plate", "a styrofoam cup", "a cotton t-shirt", "a polyester jacket", "a smartphone", "an AA battery".', // Improved prompt
            images: [base64Image],
            stream: false // We want the full response at once
        });

        const ollamaOutput = ollamaResponse.data.response;
        console.log('Ollama Raw Output:', ollamaOutput);

        const productType = mapOllamaResponseToProductType(ollamaOutput);
        const analysisResult = sampleAnalysisData[productType] || sampleAnalysisData['unknown'];

        res.json(analysisResult);

    } catch (error) {
        console.error('Error calling Ollama API:', error.message);
        if (error.response) {
            console.error('Ollama API Response Error:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to analyze image with Ollama.', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    console.log('Make sure Ollama is running and you have the "llava" model installed.');
});
