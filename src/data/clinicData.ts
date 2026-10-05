/**
 * Swathi Dental Clinic - Business and Clinical Content Configuration
 * Strict adherence to factual clinic information without fabricated claims.
 */

export interface DentalService {
  id: string;
  name: string;
  slug: string;
  category: 'preventive' | 'restorative' | 'surgical' | 'cosmetic' | 'orthodontics';
  shortDescription: string;
  fullDescription: string;
  suitableFor: string;
  consultationInvolves: string;
  active: boolean;
  displayOrder: number;
}

export interface DoctorProfile {
  name: string;
  title: string;
  qualifications: string;
  department: string;
  consultationHours: string;
  approach: string;
}

export interface ClinicInformation {
  name: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  phone: string;
  phoneRaw: string;
  whatsappNumber: string;
  whatsappUrl: string;
  mapsUrl: string;
  operatingHours: {
    days: string;
    timings: string;
    closed: string;
  };
}

export const CLINIC_INFO: ClinicInformation = {
  name: "Swathi Dental Clinic",
  tagline: "Multi-speciality Dental Care in Attiguppe, Bengaluru",
  addressLine1: "#90, 3rd Main Road, Binny Employees Layout",
  addressLine2: "Binny Mills Employees Colony",
  area: "Attiguppe",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560040",
  fullAddress: "#90, 3rd Main Road, Binny Employees Layout, Binny Mills Employees Colony, Attiguppe, Bengaluru, Karnataka 560040",
  phone: "+91 98441 92226",
  phoneRaw: "+919844192226",
  whatsappNumber: "919844192226",
  whatsappUrl: "https://wa.me/919844192226?text=Hello%20Swathi%20Dental%20Clinic%2C%20I%20would%20like%20to%20inquire%20about%20a%20dental%20appointment.",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Swathi+Dental+Clinic+90+3rd+Main+Road+Binny+Employees+Layout+Attiguppe+Bengaluru+Karnataka+560040",
  operatingHours: {
    days: "Monday – Saturday",
    timings: "5:00 PM – 9:00 PM",
    closed: "Sunday"
  }
};

export const DOCTOR_PROFILE: DoctorProfile = {
  name: "Dr. Jyothi Nagesh",
  title: "Dental Surgeon & Endodontist",
  qualifications: "BDS, MDS – Conservative Dentistry & Endodontics",
  department: "Conservative Dentistry & Endodontics",
  consultationHours: "Monday to Saturday, 5:00 PM – 9:00 PM",
  approach: "Focused on conservative dentistry, tooth preservation, precise clinical evaluation, and patient comfort throughout treatment."
};

export const CLINIC_SERVICES: DentalService[] = [
  {
    id: "general-dentistry",
    name: "General Dentistry",
    slug: "general-dentistry",
    category: "preventive",
    shortDescription: "Routine dental evaluations, diagnosis of oral health conditions, and preventive guidance.",
    fullDescription: "Comprehensive oral examinations evaluating teeth, gums, and oral tissues to detect early signs of decay, wear, or periodontal concerns.",
    suitableFor: "Patients seeking routine dental check-ups, early detection of oral health issues, or general oral maintenance.",
    consultationInvolves: "Visual dental examination, digital intraoral assessment if indicated, and discussion of findings with personalized hygiene advice.",
    active: true,
    displayOrder: 1
  },
  {
    id: "root-canal-treatment",
    name: "Root Canal Treatment",
    slug: "root-canal-treatment",
    category: "restorative",
    shortDescription: "Specialized endodontic therapy designed to treat infected or inflamed dental pulp and preserve natural teeth.",
    fullDescription: "Conservative endodontic procedure removing compromised dental pulp, thoroughly disinfecting root canals, and sealing them with biocompatible materials.",
    suitableFor: "Patients experiencing severe toothache, prolonged sensitivity to hot/cold, swelling around a tooth, or deep decay touching the pulp.",
    consultationInvolves: "Clinical diagnostic tests (vitality and percussion checks), radiographic assessment of root anatomy, and an explanation of the treatment stages.",
    active: true,
    displayOrder: 2
  },
  {
    id: "dental-implants",
    name: "Dental Implants",
    slug: "dental-implants",
    category: "restorative",
    shortDescription: "Fixed, long-term replacement solutions for single or multiple missing teeth.",
    fullDescription: "Titanium posts surgically placed into the jawbone to act as stable roots for crowns or bridges, restoring natural chewing function and aesthetics.",
    suitableFor: "Individuals with one or more missing teeth who have adequate bone density and healthy gum tissue.",
    consultationInvolves: "Evaluation of jawbone density, gum tissue assessment, radiographic review, and formulation of an implant restoration plan.",
    active: true,
    displayOrder: 3
  },
  {
    id: "orthodontic-treatment",
    name: "Orthodontic Treatment",
    slug: "orthodontic-treatment",
    category: "orthodontics",
    shortDescription: "Correction of misaligned teeth, spacing issues, and bite irregularities using braces or aligners.",
    fullDescription: "Targeted orthodontic guidance to align crowded or spaced teeth, improve bite relationships, and enhance both oral function and smile aesthetics.",
    suitableFor: "Children, teens, and adults with crooked teeth, gaps, overbites, underbites, or chewing difficulties.",
    consultationInvolves: "Detailed bite analysis, dental alignment review, discussion of traditional braces vs. clear aligner alternatives, and timeline estimation.",
    active: true,
    displayOrder: 4
  },
  {
    id: "crowns-bridges",
    name: "Crowns & Bridges",
    slug: "crowns-bridges",
    category: "restorative",
    shortDescription: "Custom prosthetics to protect damaged teeth or bridge the gap left by missing teeth.",
    fullDescription: "Precision-milled ceramic, zirconia, or metal-ceramic restorations engineered to reinforce structurally compromised teeth or replace adjacent missing teeth.",
    suitableFor: "Patients with broken, fractured, heavily restored, or root-canal-treated teeth needing structural protection.",
    consultationInvolves: "Assessment of tooth structure, bite relationship examination, shade matching, and discussion of material choices.",
    active: true,
    displayOrder: 5
  },
  {
    id: "scaling-polishing",
    name: "Scaling & Polishing",
    slug: "scaling-polishing",
    category: "preventive",
    shortDescription: "Professional plaque, calculus (tartar), and surface stain removal for healthy gums and fresh breath.",
    fullDescription: "Gentle ultrasonic scaling to remove hardened calculus deposits above and beneath the gumline, followed by fine prophylaxis polishing.",
    suitableFor: "Individuals due for regular 6-month hygiene maintenance, bleeding gums during brushing, or persistent bad breath.",
    consultationInvolves: "Periodontal gum check, plaque index assessment, ultrasonic cleaning, and customized home flossing and brushing recommendations.",
    active: true,
    displayOrder: 6
  },
  {
    id: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    category: "cosmetic",
    shortDescription: "Aesthetic dental solutions including composite bonding, contouring, and smile enhancements.",
    fullDescription: "Conservative aesthetic procedures designed to address chipped edges, minor gaps, tooth discolouration, and irregular shapes.",
    suitableFor: "Patients looking to improve the visual balance, symmetry, and appearance of their smile.",
    consultationInvolves: "Smile analysis, shade matching, digital photographic evaluation, and review of minimally invasive treatment options.",
    active: true,
    displayOrder: 7
  },
  {
    id: "teeth-whitening",
    name: "Teeth Whitening",
    slug: "teeth-whitening",
    category: "cosmetic",
    shortDescription: "Clinically monitored lightening of surface and intrinsic enamel discolouration.",
    fullDescription: "Professional dental bleaching formulated to safely lift coffee, tea, tobacco, and age-related enamel stains under dentist supervision.",
    suitableFor: "Individuals with dull, discoloured, or stained teeth seeking a brighter natural shade.",
    consultationInvolves: "Enamel and shade baseline assessment, sensitivity check, and determination of suitability for in-office or take-home systems.",
    active: true,
    displayOrder: 8
  },
  {
    id: "dentures",
    name: "Dentures",
    slug: "dentures",
    category: "restorative",
    shortDescription: "Custom-fitted complete and partial removable prostheses to restore chewing and speaking ability.",
    fullDescription: "Tailored prosthetics crafted from durable acrylic or cast metal frameworks to replace multiple or complete dental arches comfortably.",
    suitableFor: "Elderly patients or individuals missing significant numbers of teeth who require an affordable, removable functional replacement.",
    consultationInvolves: "Oral ridge examination, impression evaluation, jaw relation records, and discussion of partial vs complete prosthesis options.",
    active: true,
    displayOrder: 9
  },
  {
    id: "impacted-tooth-extraction",
    name: "Impacted Tooth Extraction",
    slug: "impacted-tooth-extraction",
    category: "surgical",
    shortDescription: "Safe surgical removal of impacted wisdom teeth or non-restorable severely damaged teeth.",
    fullDescription: "Gentle clinical extraction performed under local anesthesia for wisdom teeth that cannot erupt properly or teeth damaged beyond salvage.",
    suitableFor: "Patients experiencing pain, jaw stiffness, recurrent pericoronitis (gum swelling), or crowding from third molars (wisdom teeth).",
    consultationInvolves: "Radiographic analysis of tooth orientation and nerve proximity, clinical assessment of swelling, and post-procedure recovery review.",
    active: true,
    displayOrder: 10
  },
  {
    id: "other-dental-treatments",
    name: "Other Dental Treatments",
    slug: "other-dental-treatments",
    category: "preventive",
    shortDescription: "Dental emergency relief, night guards for teeth grinding, fluoride therapies, and pediatric dental care.",
    fullDescription: "A full range of personalized dental therapies addressing urgent tooth pain, bruxism (clenching), preventive sealants, and family dental care.",
    suitableFor: "Patients with acute discomfort, clenching habits, or specialized family dental care requirements.",
    consultationInvolves: "Targeted clinical diagnostic evaluation, immediate symptomatic relief plan, and personalized care schedule.",
    active: true,
    displayOrder: 11
  }
];

export const WHY_CHOOSE_FACTS = [
  {
    title: "Patient-Focused Care",
    description: "Every appointment is structured with adequate time for gentle clinical attention, calm discussion, and transparent treatment explanations.",
    icon: "HeartHandshake"
  },
  {
    title: "Comprehensive Dental Services",
    description: "From routine hygiene and root canal therapy to implants and orthodontic care, address your family's oral health in one location.",
    icon: "ShieldCheck"
  },
  {
    title: "Comfortable Clinic Experience",
    description: "A hygienic, modern, and reassuring environment designed to help both first-time and returning patients feel at ease.",
    icon: "Smile"
  },
  {
    title: "Professional Dental Consultation",
    description: "Clinical evaluation led by Dr. Jyothi Nagesh (BDS, MDS – Conservative Dentistry & Endodontics), emphasizing tooth-saving approaches.",
    icon: "Award"
  }
];

export const FAQ_ITEMS = [
  {
    question: "Do I need an appointment?",
    answer: "Yes, Swathi Dental Clinic operates primarily on an appointment-based schedule between 5:00 PM and 9:00 PM, Monday through Saturday. This ensures adequate time is reserved for each patient's thorough examination and comfortable care."
  },
  {
    question: "How can I book an appointment?",
    answer: "You can book directly using the online appointment form on this website, call the clinic at +91 98441 92226, or send a message on WhatsApp. Our clinic team will promptly confirm your scheduled visit."
  },
  {
    question: "What dental treatments are available?",
    answer: "We offer multi-speciality dental care including routine consultations, root canal treatment, dental implants, orthodontic treatment (braces/aligners), crowns and bridges, scaling and polishing, cosmetic dentistry, teeth whitening, dentures, and impacted tooth extraction."
  },
  {
    question: "Where is Swathi Dental Clinic located?",
    answer: "The clinic is located at #90, 3rd Main Road, Binny Employees Layout, Binny Mills Employees Colony, Attiguppe, Bengaluru, Karnataka 560040. It is easily accessible from Vijayanagar, Chord Road, and nearby West Bengaluru localities."
  },
  {
    question: "What are the clinic timings?",
    answer: "The clinic is open Monday through Saturday from 5:00 PM to 9:00 PM. The clinic remains closed on Sundays."
  },
  {
    question: "Can I request a specific appointment time?",
    answer: "Yes, you can select any open 30-minute consultation window within our 5:00 PM to 9:00 PM evening hours when filling out the booking form."
  },
  {
    question: "Can I reschedule my appointment?",
    answer: "Yes. If your schedule changes, please call +91 98441 92226 or send a WhatsApp message as soon as possible so we can assign an alternative available slot that suits you."
  }
];

export const CLINIC_IMAGES = {
  hero: "/src/assets/images/hero_clinic_interior_1791040098918.jpg",
  reception: "/src/assets/images/clinic_reception_area_1791040112151.jpg",
  sterileCare: "/src/assets/images/sterile_dental_care_1791040129682.jpg",
  patientComfort: "/src/assets/images/patient_comfort_smile_1791040141419.jpg"
};
