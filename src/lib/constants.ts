// Services available for providers
export const AVAILABLE_SERVICES = [
  { 
    key: 'cleaning', 
    label: 'House Cleaning', 
    description: 'Residential & commercial cleaning services',
    icon: '🧹',
    details: 'Deep cleaning, regular maintenance, move-in/out cleaning, post-construction cleanup',
    avgRate: '$45-65/hr',
    keywords: ['clean', 'maid', 'housekeeping', 'janitorial', 'sanitize', 'tidy', 'spring cleaning', 'dusting', 'vacuuming', 'mopping']
  },
  { 
    key: 'landscaping', 
    label: 'Landscaping', 
    description: 'Yard maintenance & garden design',
    icon: '🌿',
    details: 'Lawn care, garden design, tree trimming, seasonal cleanup, irrigation',
    avgRate: '$50-75/hr',
    keywords: ['lawn', 'garden', 'yard', 'grass', 'mowing', 'trimming', 'pruning', 'hedge', 'tree', 'mulch', 'weeding', 'outdoor']
  },
  { 
    key: 'handyman', 
    label: 'Handyman', 
    description: 'General repairs & home maintenance',
    icon: '🔨',
    details: 'Minor repairs, assembly, drywall, fixture installation, general maintenance',
    avgRate: '$60-80/hr',
    keywords: ['repair', 'fix', 'maintenance', 'assembly', 'furniture', 'door', 'cabinet', 'shelf', 'mount', 'install', 'patch']
  },
  { 
    key: 'plumbing', 
    label: 'Plumbing', 
    description: 'Plumbing repairs & installation',
    icon: '🚰',
    details: 'Leak repairs, fixture installation, drain cleaning, water heater service',
    avgRate: '$75-95/hr',
    keywords: ['leak', 'drain', 'pipe', 'toilet', 'sink', 'faucet', 'water heater', 'shower', 'bathtub', 'clog', 'sewer']
  },
  { 
    key: 'electrical', 
    label: 'Electrical', 
    description: 'Licensed electrical work & repairs',
    icon: '⚡',
    details: 'Wiring, lighting, panel upgrades, outlet installation, troubleshooting',
    avgRate: '$80-100/hr',
    keywords: ['electrician', 'wiring', 'outlet', 'switch', 'breaker', 'panel', 'light', 'fixture', 'ceiling fan', 'power']
  },
  { 
    key: 'painting', 
    label: 'Painting', 
    description: 'Interior & exterior painting',
    icon: '🎨',
    details: 'Residential painting, cabinet refinishing, deck staining, wallpaper removal',
    avgRate: '$50-70/hr',
    keywords: ['paint', 'painter', 'wall', 'ceiling', 'trim', 'stain', 'refinish', 'wallpaper', 'color', 'brush', 'roller']
  },
  { 
    key: 'flooring', 
    label: 'Flooring', 
    description: 'Flooring installation & repair',
    icon: '🪵',
    details: 'Hardwood, laminate, tile, vinyl installation and repair services',
    avgRate: '$60-85/hr'
  },
  { 
    key: 'hvac', 
    label: 'HVAC', 
    description: 'Heating, cooling & ventilation',
    icon: '❄️',
    details: 'Furnace service, AC repair, duct cleaning, thermostat installation',
    avgRate: '$80-100/hr'
  },
  { 
    key: 'roofing', 
    label: 'Roofing', 
    description: 'Roof repairs & installation',
    icon: '🏠',
    details: 'Roof inspection, leak repair, shingle replacement, gutter installation',
    avgRate: '$70-95/hr'
  },
  { 
    key: 'carpentry', 
    label: 'Carpentry', 
    description: 'Custom woodwork & carpentry',
    icon: '🪚',
    details: 'Custom furniture, framing, deck building, trim work, cabinetry',
    avgRate: '$65-90/hr'
  },
  { 
    key: 'moving', 
    label: 'Moving Services', 
    description: 'Professional moving & packing',
    icon: '📦',
    details: 'Residential moves, packing services, furniture assembly, storage solutions',
    avgRate: '$40-60/hr'
  },
  { 
    key: 'pest_control', 
    label: 'Pest Control', 
    description: 'Pest inspection & removal',
    icon: '🐛',
    details: 'Inspection, treatment, prevention, wildlife removal, eco-friendly options',
    avgRate: '$70-90/hr'
  },
  { 
    key: 'appliance_repair', 
    label: 'Appliance Repair', 
    description: 'Home appliance repairs',
    icon: '🔧',
    details: 'Refrigerators, washers, dryers, ovens, dishwashers, microwaves',
    avgRate: '$75-95/hr'
  },
  { 
    key: 'window_cleaning', 
    label: 'Window Cleaning', 
    description: 'Residential & commercial windows',
    icon: '🪟',
    details: 'Interior/exterior windows, high-rise cleaning, gutter cleaning, pressure washing',
    avgRate: '$45-65/hr'
  },
  { 
    key: 'beauty', 
    label: 'Beauty Services', 
    description: 'Mobile beauty & wellness',
    icon: '💅',
    details: 'Hair styling, makeup, nails, massage, aesthetics, mobile services',
    avgRate: '$50-80/hr'
  },
  { 
    key: 'fitness', 
    label: 'Personal Training', 
    description: 'Fitness coaching & training',
    icon: '💪',
    details: 'One-on-one training, group classes, nutrition coaching, online sessions',
    avgRate: '$60-90/hr'
  },
  { 
    key: 'pool_maintenance', 
    label: 'Pool Maintenance', 
    description: 'Pool cleaning & maintenance',
    icon: '🏊',
    details: 'Chemical balancing, cleaning, equipment repair, winterizing, hot tub service',
    avgRate: '$55-75/hr'
  },
  { 
    key: 'junk_removal', 
    label: 'Junk Removal', 
    description: 'Hauling & disposal services',
    icon: '🚚',
    details: 'Estate cleanouts, furniture removal, appliance disposal, recycling',
    avgRate: '$50-70/hr'
  },
  { 
    key: 'locksmith', 
    label: 'Locksmith', 
    description: 'Lock installation & emergency services',
    icon: '🔑',
    details: 'Lock changes, rekeying, emergency lockouts, security systems',
    avgRate: '$65-90/hr'
  },
  { 
    key: 'garage_door', 
    label: 'Garage Door Repair', 
    description: 'Garage door installation & repair',
    icon: '🚪',
    details: 'Spring replacement, opener repair, track alignment, installation',
    avgRate: '$70-90/hr'
  },
  { 
    key: 'drywall', 
    label: 'Drywall', 
    description: 'Drywall installation & repair',
    icon: '🧱',
    details: 'Patching, texturing, hanging, taping, mudding, finishing',
    avgRate: '$55-75/hr'
  },
  { 
    key: 'tile_work', 
    label: 'Tile Installation', 
    description: 'Tile & stone installation',
    icon: '⬜',
    details: 'Bathroom tile, kitchen backsplash, floor tile, shower installation',
    avgRate: '$60-85/hr'
  },
  { 
    key: 'concrete', 
    label: 'Concrete Work', 
    description: 'Concrete installation & repair',
    icon: '🏗️',
    details: 'Driveways, patios, sidewalks, foundations, stamped concrete',
    avgRate: '$65-90/hr'
  },
  { 
    key: 'fence_installation', 
    label: 'Fence Installation', 
    description: 'Fence building & repair',
    icon: '🚧',
    details: 'Wood, vinyl, chain-link fences, gate installation, repair',
    avgRate: '$50-75/hr'
  },
  { 
    key: 'deck_building', 
    label: 'Deck Building', 
    description: 'Deck construction & repair',
    icon: '🛠️',
    details: 'New deck construction, repairs, staining, sealing, railing installation',
    avgRate: '$60-85/hr'
  },
  { 
    key: 'snow_removal', 
    label: 'Snow Removal', 
    description: 'Snow plowing & shoveling',
    icon: '❄️',
    details: 'Driveway clearing, walkway shoveling, salting, de-icing',
    avgRate: '$40-60/hr'
  },
  { 
    key: 'gutter_cleaning', 
    label: 'Gutter Cleaning', 
    description: 'Gutter cleaning & maintenance',
    icon: '🌧️',
    details: 'Gutter cleaning, repairs, guard installation, downspout service',
    avgRate: '$45-65/hr'
  },
  { 
    key: 'chimney_sweep', 
    label: 'Chimney Services', 
    description: 'Chimney cleaning & inspection',
    icon: '🔥',
    details: 'Chimney sweeping, inspection, cap installation, fireplace cleaning',
    avgRate: '$60-85/hr'
  },
  { 
    key: 'power_washing', 
    label: 'Pressure Washing', 
    description: 'Exterior cleaning services',
    icon: '💦',
    details: 'House washing, driveway cleaning, deck washing, concrete cleaning',
    avgRate: '$50-70/hr',
    keywords: ['pressure wash', 'power wash', 'wash', 'clean', 'driveway', 'siding', 'deck', 'patio', 'concrete', 'exterior']
  },
  { 
    key: 'pet_care', 
    label: 'Pet Care', 
    description: 'Pet sitting & dog walking',
    icon: '🐕',
    details: 'Dog walking, pet sitting, boarding, grooming, training',
    avgRate: '$30-50/hr'
  },
  { 
    key: 'tutoring', 
    label: 'Tutoring', 
    description: 'Academic & skill tutoring',
    icon: '📚',
    details: 'Math, science, languages, music lessons, test prep, homework help',
    avgRate: '$40-70/hr'
  },
  { 
    key: 'car_detailing', 
    label: 'Auto Detailing', 
    description: 'Mobile car cleaning & detailing',
    icon: '🚗',
    details: 'Interior/exterior detailing, waxing, ceramic coating, headlight restoration',
    avgRate: '$50-80/hr'
  },
  { 
    key: 'interior_design', 
    label: 'Interior Design', 
    description: 'Home staging & design',
    icon: '🖼️',
    details: 'Interior design consultation, home staging, color consulting, space planning',
    avgRate: '$60-100/hr'
  },
  { 
    key: 'organizing', 
    label: 'Home Organizing', 
    description: 'Professional organizing services',
    icon: '📋',
    details: 'Closet organization, decluttering, storage solutions, home office setup',
    avgRate: '$45-70/hr'
  },
] as const;

// Application steps
export const APPLICATION_STEPS = [
  { number: 1, title: 'Basics', description: 'Tell us about yourself' },
  { number: 2, title: 'Services', description: 'What can you offer?' },
  { number: 3, title: 'Availability', description: 'When are you available?' },
  { number: 4, title: 'Documents', description: 'Upload your documents' },
  { number: 5, title: 'Compliance', description: 'Background & insurance' },
] as const;

// Document types
export const DOCUMENT_TYPES = [
  'government_id',
  'driver_license',
  'insurance_certificate',
  'background_check',
  'trade_license',
  'certification',
  'profile_photo',
] as const;
