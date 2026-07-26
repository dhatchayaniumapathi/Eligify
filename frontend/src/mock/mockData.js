// Mock Data Store for Eligify Frontend Development

export const MOCK_USER_PROFILE = {
  id: "usr_101",
  full_name: "Ananya Sharma",
  email: "ananya.sharma@example.com",
  age: 24,
  gender: "Female",
  category: "General",
  annual_income: 150000,
  state: "Madhya Pradesh",
  district: "Bhopal",
  occupation: "Unemployed",
  disability: false,
  education: "Graduate",
  phone: "+91 98765 43210",
  verified: true,
};

export const MOCK_SCHEMES = [
  {
    scheme_id: "SCH012",
    scheme_name: "Chief Minister Ladli Behna Yojana",
    ministry: "Department of Women and Child Development",
    state: "Madhya Pradesh",
    min_age: 21,
    max_age: 60,
    gender: "Female",
    category: "All",
    max_income: 250000,
    occupation: "All",
    disability_required: false,
    education: "All",
    benefits: "Monthly assistance of Rs. 1,250 directly transferred to bank account.",
    required_documents: ["Aadhaar Card", "Samagra ID", "Bank Account Details", "Mobile Number"],
    application_link: "https://cmladlibehna.mp.gov.in/",
    description: "Madhya Pradesh flagship initiative to enhance economic self-reliance, health, and nutritional status of women.",
    category_tag: "Women & Child",
    confidence: 1.0,
    eligible: true,
    matched_conditions: [
      "[Age Check]: Age (24 yrs) is within eligible range (21-60 yrs).",
      "[Gender Check]: Gender 'Female' matches target requirement.",
      "[Category Check]: Category requirement 'All' is open to all social categories.",
      "[Income Check]: Annual income (Rs. 150,000) is within maximum ceiling of Rs. 250,000.",
      "[State Jurisdiction Check]: State 'Madhya Pradesh' matches scheme jurisdiction.",
      "[Occupation Check]: Occupation requirement 'All' is open to all professions.",
      "[Disability Check]: No disability prerequisite required.",
      "[Education Check]: Education requirement 'All' is open to all."
    ],
    failed_conditions: [],
    explanation: "You qualify 100% for 'Chief Minister Ladli Behna Yojana'! All 8/8 eligibility criteria were satisfied successfully."
  },
  {
    scheme_id: "SCH002",
    scheme_name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    ministry: "Ministry of Women and Child Development",
    state: "All",
    min_age: 19,
    max_age: 45,
    gender: "Female",
    category: "All",
    max_income: 800000,
    occupation: "All",
    disability_required: false,
    education: "All",
    benefits: "Cash incentive of Rs. 5,000 in two installments for pregnant & lactating mothers.",
    required_documents: ["Aadhaar Card", "MCP Card", "Bank Passbook", "Mother ID"],
    application_link: "https://pmmvy.wcd.gov.in/",
    description: "Maternity benefit program providing cash incentives for first living child to improve health and nutrition.",
    category_tag: "Healthcare",
    confidence: 1.0,
    eligible: true,
    matched_conditions: [
      "[Age Check]: Age (24 yrs) is within eligible range (19-45 yrs).",
      "[Gender Check]: Gender 'Female' matches target requirement.",
      "[Income Check]: Annual income (Rs. 150,000) is within maximum ceiling of Rs. 800,000.",
      "[State Jurisdiction Check]: Applicable Pan-India."
    ],
    failed_conditions: [],
    explanation: "You qualify for 'PMMVY'! All eligibility requirements are met."
  },
  {
    scheme_id: "SCH005",
    scheme_name: "Prime Minister Employment Generation Programme (PMEGP)",
    ministry: "Ministry of Micro Small and Medium Enterprises",
    state: "All",
    min_age: 18,
    max_age: 99,
    gender: "All",
    category: "All",
    max_income: 0,
    occupation: "Unemployed",
    disability_required: false,
    education: "8th Pass",
    benefits: "Subsidy up to 35% on project cost for setting up micro-enterprises in manufacturing or services.",
    required_documents: ["Aadhaar Card", "Project Report", "Educational Qualification Certificate", "Bank Account"],
    application_link: "https://www.kviconline.gov.in/pmegp/",
    description: "Credit-linked subsidy scheme aimed at generating self-employment opportunities through micro-enterprises.",
    category_tag: "Employment & Business",
    confidence: 1.0,
    eligible: true,
    matched_conditions: [
      "[Age Check]: Age (24 yrs) is within eligible range.",
      "[Occupation Check]: Unemployed status matches target requirement.",
      "[Education Check]: Education 'Graduate' meets requirement '8th Pass'."
    ],
    failed_conditions: [],
    explanation: "You qualify for PMEGP to receive up to 35% project subsidy for self-employment enterprises."
  },
  {
    scheme_id: "SCH007",
    scheme_name: "Ayushman Bharat PM Jan Arogya Yojana (PM-JAY)",
    ministry: "Ministry of Health and Family Welfare",
    state: "All",
    min_age: 0,
    max_age: 99,
    gender: "All",
    category: "All",
    max_income: 250000,
    occupation: "All",
    disability_required: false,
    education: "All",
    benefits: "Health coverage up to Rs. 5 Lakh per family per year for hospitalization across 27,000+ empanelled hospitals.",
    required_documents: ["Aadhaar Card", "Ration Card / Family ID"],
    application_link: "https://pmjay.gov.in/",
    description: "World's largest health insurance scheme providing cashless hospitalisation cover to vulnerable families.",
    category_tag: "Healthcare",
    confidence: 1.0,
    eligible: true,
    matched_conditions: [
      "[Income Check]: Income (Rs. 150,000) is below Rs. 250,000 max ceiling.",
      "[State Jurisdiction Check]: Applicable Pan-India."
    ],
    failed_conditions: [],
    explanation: "You qualify for Rs. 5 Lakh family health coverage under Ayushman Bharat."
  },
  {
    scheme_id: "SCH001",
    scheme_name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    state: "All",
    min_age: 18,
    max_age: 99,
    gender: "All",
    category: "All",
    max_income: 0,
    occupation: "Farmer",
    disability_required: false,
    education: "All",
    benefits: "Financial benefit of Rs. 6,000 per year in three equal installments of Rs. 2,000.",
    required_documents: ["Aadhaar Card", "Land Ownership Record (Khata/Khasra)", "Bank Passbook"],
    application_link: "https://pmkisan.gov.in/",
    description: "Central sector scheme to supplement financial needs of landholding farmer families.",
    category_tag: "Agriculture",
    confidence: 0.75,
    eligible: false,
    matched_conditions: [
      "[Age Check]: Age (24 yrs) is within eligible range.",
      "[State Jurisdiction Check]: Applicable Pan-India."
    ],
    failed_conditions: [
      "[Occupation Check]: User occupation 'Unemployed' does not match target occupation 'Farmer'."
    ],
    explanation: "Not eligible: Requires primary occupation to be 'Farmer'."
  }
];

export const MOCK_OCR_RESULT = {
  document_type: "Aadhaar Card",
  is_verified: true,
  match_score: 1.0,
  matched_fields: ["gender", "state", "annual_income", "category"],
  mismatched_fields: [],
  extracted_fields: {
    aadhaar_number: { field_name: "aadhaar_number", field_value: "XXXX-XXXX-4321", confidence: 0.96 },
    name: { field_name: "name", field_value: "Ananya Sharma", confidence: 0.94 },
    dob: { field_name: "dob", field_value: "15/08/1998", confidence: 0.92 },
    gender: { field_name: "gender", field_value: "Female", confidence: 0.95 },
    state: { field_name: "state", field_value: "Madhya Pradesh", confidence: 0.91 },
    category: { field_name: "category", field_value: "General", confidence: 0.89 },
    annual_income: { field_name: "annual_income", field_value: "150000", confidence: 0.90 }
  },
  summary: "Document verified successfully. 4/4 claimed profile attributes match official document records."
};

export const MOCK_RECENT_ACTIVITIES = [
  { id: 1, action: "Profile Updated", detail: "Annual income updated to Rs. 1,50,000", timestamp: "2 hours ago", icon: "UserCheck" },
  { id: 2, action: "Eligibility Checked", detail: "Found 4 fully matched schemes for Madhya Pradesh", timestamp: "Yesterday", icon: "Sparkles" },
  { id: 3, action: "Document Uploaded", detail: "Aadhaar Card verified with 100% match score", timestamp: "3 days ago", icon: "FileCheck" },
  { id: 4, action: "Scheme Saved", detail: "Bookmarked Chief Minister Ladli Behna Yojana", timestamp: "5 days ago", icon: "Bookmark" }
];
