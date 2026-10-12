"""
Thalir Agronomic Disease Knowledge Base
Contains disease details, symptoms, severity, and actionable management strategies
based on the standard PlantVillage dataset and expert agricultural guidelines.
"""

DISEASE_KNOWLEDGE_BASE = {
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease_name": "Early Blight",
        "scientific_name": "Alternaria solani",
        "status": "Diseased",
        "severity": "Moderate",
        "symptoms": [
            "Concentric ring spots ('bullseye' pattern) on lower leaves",
            "Yellowing around brown foliage lesions",
            "Defoliation starting from the base of the plant"
        ],
        "causes": "High humidity, warm temperatures (24-29°C), and wet leaf surfaces.",
        "organic_remedies": [
            "Apply copper octanoate or bio-fungicides containing Bacillus subtilis.",
            "Prune infected lower leaves to improve air circulation.",
            "Mulch heavily around base to prevent soil splash onto foliage."
        ],
        "chemical_remedies": [
            "Spray Chlorothalonil or Mancozeb fungicide every 7-10 days during risk periods.",
            "Apply Azoxystrobin at early onset of dark concentric spots."
        ],
        "preventive_measures": [
            "Practice 3-year crop rotation with non-solanaceous crops.",
            "Use drip irrigation instead of overhead watering to keep leaves dry.",
            "Plant resistant tomato cultivars."
        ]
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease_name": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "status": "Diseased",
        "severity": "Critical",
        "symptoms": [
            "Large, dark water-soaked spots on leaves with pale green borders",
            "White velvety fungal mold growth on underside of leaves in moist weather",
            "Rapid brown collapse of entire foliage and brown firm spots on fruits"
        ],
        "causes": "Cool, rainy, wet conditions with high relative humidity (>90%).",
        "organic_remedies": [
            "Immediately isolate and destroy infected plant foliage.",
            "Apply fixed copper fungicides before rain events.",
            "Spray potassium bicarbonate solution to reduce spore spread."
        ],
        "chemical_remedies": [
            "Apply systemic fungicides such as Mefenoxam or Metalaxyl mixed with Mancozeb.",
            "Apply Dimethomorph or Cyazofamid for emergency blight control."
        ],
        "preventive_measures": [
            "Destroy volunteer tomato and potato plants nearby.",
            "Ensure proper spacing between plants for rapid drying.",
            "Monitor local late blight warnings during wet spells."
        ]
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease_name": "Bacterial Spot",
        "scientific_name": "Xanthomonas perforans",
        "status": "Diseased",
        "severity": "High",
        "symptoms": [
            "Small dark brown to black spots with yellow halos on leaves",
            "Leaves turn yellow, dry up, and drop prematurely",
            "Raised dark scab-like spots on immature green tomatoes"
        ],
        "causes": "Warm, wet weather and wind-driven rain spreading bacterial spores.",
        "organic_remedies": [
            "Apply liquid copper hydroxide mixed with Mancozeb/organic adjuvant.",
            "Remove heavily infected branches immediately.",
            "Use certified pathogen-free seeds and seedlings."
        ],
        "chemical_remedies": [
            "Spray copper-based bactericides combined with Mancozeb to delay resistance.",
            "Apply Streptomycin sulfate spray if approved for agricultural use in region."
        ],
        "preventive_measures": [
            "Avoid handling foliage while plants are wet.",
            "Sanitize tools and stakes with 10% bleach solution between uses."
        ]
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease_name": "Leaf Mold",
        "scientific_name": "Passalora fulva",
        "status": "Diseased",
        "severity": "Moderate",
        "symptoms": [
            "Pale green to yellow spots on upper surface of older leaves",
            "Olive-green to dark brown velvety fungal growth underneath leaves",
            "Leaves curl, wither, and drop off"
        ],
        "causes": "High relative humidity (>85%) and poor ventilation, especially in greenhouses.",
        "organic_remedies": [
            "Increase greenhouse ventilation with exhaust fans.",
            "Apply neem oil or sulfur-based organic sprays."
        ],
        "chemical_remedies": [
            "Spray Difenoconazole or Pyraclostrobin.",
            "Apply Chlorothalonil every 7-14 days."
        ],
        "preventive_measures": [
            "Maintain humidity below 85% with adequate spacing and ventilation.",
            "Prune sucker branches to open leaf canopy."
        ]
    },
    "Tomato___Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "disease_name": "Tomato Yellow Leaf Curl",
        "scientific_name": "Begomovirus (TYLCV)",
        "status": "Diseased",
        "severity": "Critical",
        "symptoms": [
            "Severe leaf curling upward and inward",
            "Yellowing (chlorosis) between leaf veins and stunted growth",
            "Flower dropping and severe fruit production reduction"
        ],
        "causes": "Vectored by Silverleaf Whiteflies (Bemisia tabaci).",
        "organic_remedies": [
            "Install yellow sticky traps to catch whiteflies.",
            "Spray insecticidal soap or neem oil to suppress whitefly vectors.",
            "Cover young seedlings with fine insect mesh net."
        ],
        "chemical_remedies": [
            "Apply Imidacloprid or Thiamethoxam systemic insecticides for whitefly vector control."
        ],
        "preventive_measures": [
            "Plant TYLCV-resistant hybrid tomato varieties.",
            "Refrain from planting near old infested crops."
        ]
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease_name": "Healthy Foliage",
        "scientific_name": "Solanum lycopersicum",
        "status": "Healthy",
        "severity": "None",
        "symptoms": [
            "Vibrant green, sturdy foliage with uniform color",
            "No visible lesions, spots, or pest damage",
            "Normal flowering and fruit set"
        ],
        "causes": "Optimal nutrients, balanced soil moisture, and good sunlight.",
        "organic_remedies": [
            "Continue organic compost feeding.",
            "Maintain balanced watering schedule."
        ],
        "chemical_remedies": [
            "No chemical intervention required."
        ],
        "preventive_measures": [
            "Maintain routine monitoring of leaf undersides for early pest presence.",
            "Ensure steady soil moisture (40-60%) and adequate airflow."
        ]
    },

    "Potato___Early_blight": {
        "crop": "Potato",
        "disease_name": "Potato Early Blight",
        "scientific_name": "Alternaria solani",
        "status": "Diseased",
        "severity": "Moderate",
        "symptoms": [
            "Dark target-like ring spots on mature lower leaves",
            "Yellowing tissue surrounding lesions leading to leaf death",
            "Sunken dark lesions on potato tubers"
        ],
        "causes": "Fungal spores surviving in crop debris, activated by wet-dry weather cycles.",
        "organic_remedies": [
            "Apply copper soap fungicide at early signs.",
            "Remove infected foliage prior to harvest."
        ],
        "chemical_remedies": [
            "Apply Chlorothalonil, Mancozeb, or Propiconazole at 7-day intervals."
        ],
        "preventive_measures": [
            "Maintain high plant vigor with balanced nitrogen fertilization.",
            "Avoid overhead irrigation."
        ]
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease_name": "Potato Late Blight",
        "scientific_name": "Phytophthora infestans",
        "status": "Diseased",
        "severity": "Critical",
        "symptoms": [
            "Irregular water-soaked leaf spots turning purplish-black",
            "White mold growth on leaf undersides in wet morning dew",
            "Tuber rot with reddish-brown dry rot decay"
        ],
        "causes": "High humidity and mild temperature (15-22°C).",
        "organic_remedies": [
            "Destroy affected vines 2 weeks before harvest to protect tubers.",
            "Apply copper sulfate spray."
        ],
        "chemical_remedies": [
            "Spray Cyazofamid, Fluazinam, or Cymoxanil."
        ],
        "preventive_measures": [
            "Use certified disease-free seed tubers.",
            "Hill up soil well around potato rows to shield tubers from spores."
        ]
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease_name": "Healthy Potato",
        "scientific_name": "Solanum tuberosum",
        "status": "Healthy",
        "severity": "None",
        "symptoms": [
            "Vigorous green leaves and stems",
            "No stem lesions or leaf yellowing"
        ],
        "causes": "Healthy soil conditions and proper hill maintenance.",
        "organic_remedies": ["Maintain organic mulching."],
        "chemical_remedies": ["None required."],
        "preventive_measures": ["Keep soil moisture consistent (45-65%)."]
    },

    "Corn_(maize)___Common_rust": {
        "crop": "Corn (Maize)",
        "disease_name": "Common Rust",
        "scientific_name": "Puccinia sorghi",
        "status": "Diseased",
        "severity": "Moderate",
        "symptoms": [
            "Oval to elongate cinnamon-brown pustules on both upper and lower leaf surfaces",
            "Pustules rupture releasing powdery rust spores",
            "Yellowing and leaf death under heavy infestation"
        ],
        "causes": "Wind-borne spores transported under cool, humid conditions (16-25°C).",
        "organic_remedies": [
            "Apply sulfur dust or neem oil at first sign of pustules."
        ],
        "chemical_remedies": [
            "Apply Azoxystrobin, Pyraclostrobin, or Propiconazole if rust appears before silking."
        ],
        "preventive_measures": [
            "Plant rust-resistant corn hybrids.",
            "Plant early to avoid peak spore dispersal periods."
        ]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn (Maize)",
        "disease_name": "Northern Corn Leaf Blight",
        "scientific_name": "Exserohilum turcicum",
        "status": "Diseased",
        "severity": "High",
        "symptoms": [
            "Long elliptical grayish-green to tan lesions (2 to 15 cm long) on leaves",
            "Dark grayish fuzzy fungal spores visible inside mature lesions",
            "Premature drying and foliage burning appearance"
        ],
        "causes": "High humidity and moderate temperatures (18-27°C) with persistent leaf wetness.",
        "organic_remedies": [
            "Remove infected residue after harvest.",
            "Apply bio-fungicides containing Trichoderma species."
        ],
        "chemical_remedies": [
            "Spray Strobilurin or Triazole fungicides at VT (tasseling) stage."
        ],
        "preventive_measures": [
            "Rotate crops with soybeans or alfalfa.",
            "Deep plow crop residue to decompose fungal overwintering structures."
        ]
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn (Maize)",
        "disease_name": "Healthy Corn",
        "scientific_name": "Zea mays",
        "status": "Healthy",
        "severity": "None",
        "symptoms": [
            "Deep green wide leaf blades with clean margins",
            "Strong stalk and healthy silk/ear development"
        ],
        "causes": "Balanced soil fertility and optimal sunlight.",
        "organic_remedies": ["Maintain balanced nitrogen feeding."],
        "chemical_remedies": ["None required."],
        "preventive_measures": ["Ensure adequate field drainage."]
    },

    "Apple___Apple_scab": {
        "crop": "Apple",
        "disease_name": "Apple Scab",
        "scientific_name": "Venturia inaequalis",
        "status": "Diseased",
        "severity": "High",
        "symptoms": [
            "Olive-green to velvety brown velvety spots on leaves and fruit",
            "Deformed, corky scabbed patches on developing apples",
            "Premature defoliation in midsummer"
        ],
        "causes": "Spring rains dispersing fungal spores from leaf litter.",
        "organic_remedies": [
            "Rake and burn fallen apple leaves in autumn.",
            "Apply liquid lime-sulfur spray during bud break."
        ],
        "chemical_remedies": [
            "Apply Myclobutanil, Captan, or Difenoconazole from green tip through petal fall."
        ],
        "preventive_measures": [
            "Prune trees to open canopy to sunlight and air circulation.",
            "Plant scab-resistant cultivars (e.g. Liberty, Enterprise)."
        ]
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease_name": "Healthy Apple",
        "scientific_name": "Malus domestica",
        "status": "Healthy",
        "severity": "None",
        "symptoms": [
            "Smooth green leaves with crisp edges",
            "Clean blemish-free fruit skin"
        ],
        "causes": "Proper orchard ventilation and spring spray maintenance.",
        "organic_remedies": ["Maintain dormant oil sprays in winter."],
        "chemical_remedies": ["None required."],
        "preventive_measures": ["Maintain tree pruning schedule."]
    },

    "Grape___Black_rot": {
        "crop": "Grape",
        "disease_name": "Grape Black Rot",
        "scientific_name": "Guignardia bidwellii",
        "status": "Diseased",
        "severity": "Critical",
        "symptoms": [
            "Small reddish-brown circular spots on leaves",
            "Infected berries turn brown, shrivel, and transform into hard black mummies",
            "Black pimple-like fruiting bodies on lesions"
        ],
        "causes": "Warm, wet weather during bloom and fruit set.",
        "organic_remedies": [
            "Prune out and destroy mummified berries and infected canes.",
            "Apply copper-sulfur sprays starting early spring."
        ],
        "chemical_remedies": [
            "Spray Myclobutanil, Mancozeb, or Tebuconazole from pre-bloom until early summer."
        ],
        "preventive_measures": [
            "Keep canopy open for sunlight penetration.",
            "Destroy wild grapevines in nearby hedgerows."
        ]
    },
    "Grape___healthy": {
        "crop": "Grape",
        "disease_name": "Healthy Grape",
        "scientific_name": "Vitis vinifera",
        "status": "Healthy",
        "severity": "None",
        "symptoms": [
            "Lush lobed leaves with vibrant green coloration",
            "Healthy fruit clusters without shriveling"
        ],
        "causes": "Proper canopy management and dry microclimate.",
        "organic_remedies": ["Prune excess foliage."],
        "chemical_remedies": ["None required."],
        "preventive_measures": ["Regular leaf pulling around grape bunches."]
    }
}


def get_disease_info(disease_key: str) -> dict:
    """Retrieve full disease details from knowledge base with fallback for unknown keys."""
    if disease_key in DISEASE_KNOWLEDGE_BASE:
        return DISEASE_KNOWLEDGE_BASE[disease_key]

    # Smart fallback parser for generic keys
    clean_key = disease_key.replace("___", " - ").replace("_", " ")
    parts = disease_key.split("___")
    crop = parts[0].replace("_", " ") if len(parts) > 0 else "Crop"
    disease_name = parts[1].replace("_", " ") if len(parts) > 1 else "Condition"

    is_healthy = "healthy" in disease_key.lower()

    return {
        "crop": crop,
        "disease_name": disease_name,
        "scientific_name": f"{crop} pathogen",
        "status": "Healthy" if is_healthy else "Diseased",
        "severity": "None" if is_healthy else "Moderate",
        "symptoms": [
            "Leaf tissue inspection complete",
            "Characteristic spots or discoloration analyzed"
        ] if not is_healthy else ["Uniform leaf surface and healthy chlorophyl levels."],
        "causes": "Environmental moisture and thermal factors." if not is_healthy else "Optimal growing environment.",
        "organic_remedies": [
            "Prune affected plant parts.",
            "Apply neem oil or organic bio-pesticide."
        ] if not is_healthy else ["Maintain organic compost feeding."],
        "chemical_remedies": [
            "Apply broad-spectrum copper fungicide if condition spreads."
        ] if not is_healthy else ["No chemical application needed."],
        "preventive_measures": [
            "Avoid leaf wetness during evening.",
            "Ensure proper soil drainage and plant spacing."
        ]
    }
