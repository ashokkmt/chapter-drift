import { Chapter } from "@/types/owasp";

// Mock OWASP Chapter Data - Replace with API calls
export const mockChapters: Chapter[] = [
  // North America
  {
    id: "owasp-san-francisco",
    name: "San Francisco",
    region: "North America",
    popularity: 95,
    description: "The San Francisco chapter is one of the most active OWASP chapters, hosting monthly meetings and workshops on application security.",
    url: "https://owasp.org/www-chapter-san-francisco/",
    leaders: ["Alice Johnson", "Bob Smith"],
    meetingInfo: "Monthly on first Thursday at 6:00 PM PST",
    socialMedia: {
      twitter: "https://twitter.com/owaspsf",
      linkedin: "https://linkedin.com/company/owasp-sf",
    },
  },
  {
    id: "owasp-new-york",
    name: "New York",
    region: "North America",
    popularity: 88,
    description: "NYC chapter focused on building a strong security community in the tri-state area.",
    url: "https://owasp.org/www-chapter-new-york/",
    leaders: ["Carol Davis"],
    meetingInfo: "Bi-monthly on second Tuesday at 6:30 PM EST",
  },
  {
    id: "owasp-austin",
    name: "Austin",
    region: "North America",
    popularity: 72,
    description: "Austin chapter promoting security awareness in the tech hub of Texas.",
    leaders: ["David Wilson"],
    meetingInfo: "Monthly meetings at various tech venues",
  },
  {
    id: "owasp-seattle",
    name: "Seattle",
    region: "North America",
    popularity: 78,
    description: "Seattle chapter connecting security professionals in the Pacific Northwest.",
    leaders: ["Eve Martinez"],
  },
  {
    id: "owasp-boston",
    name: "Boston",
    region: "North America",
    popularity: 81,
    description: "Boston chapter serving the security community in New England.",
    leaders: ["Frank Brown"],
  },
  
  // Europe
  {
    id: "owasp-london",
    name: "London",
    region: "Europe",
    popularity: 92,
    description: "The London chapter is one of Europe's largest, hosting regular events and training sessions.",
    url: "https://owasp.org/www-chapter-london/",
    leaders: ["George Taylor", "Helen White"],
    meetingInfo: "Monthly on third Wednesday at 6:00 PM GMT",
  },
  {
    id: "owasp-amsterdam",
    name: "Amsterdam",
    region: "Europe",
    popularity: 85,
    description: "Amsterdam chapter bringing together Dutch security professionals.",
    leaders: ["Ian van der Berg"],
  },
  {
    id: "owasp-berlin",
    name: "Berlin",
    region: "Europe",
    popularity: 79,
    description: "Berlin chapter focused on application security research and education.",
    leaders: ["Julia Schmidt"],
  },
  {
    id: "owasp-paris",
    name: "Paris",
    region: "Europe",
    popularity: 76,
    description: "Paris chapter serving the French security community.",
    leaders: ["Karl Dubois"],
  },
  {
    id: "owasp-barcelona",
    name: "Barcelona",
    region: "Europe",
    popularity: 71,
    description: "Barcelona chapter promoting security in Southern Europe.",
  },
  
  // Asia Pacific
  {
    id: "owasp-tokyo",
    name: "Tokyo",
    region: "Asia Pacific",
    popularity: 87,
    description: "Tokyo chapter leading security initiatives in Japan.",
    leaders: ["Lisa Tanaka"],
    meetingInfo: "Monthly meetings in Japanese and English",
  },
  {
    id: "owasp-singapore",
    name: "Singapore",
    region: "Asia Pacific",
    popularity: 90,
    description: "Singapore chapter connecting APAC security professionals.",
    leaders: ["Michael Tan", "Nancy Lee"],
  },
  {
    id: "owasp-sydney",
    name: "Sydney",
    region: "Asia Pacific",
    popularity: 83,
    description: "Sydney chapter serving the Australian security community.",
    leaders: ["Oliver Chen"],
  },
  {
    id: "owasp-bangalore",
    name: "Bangalore",
    region: "Asia Pacific",
    popularity: 86,
    description: "Bangalore chapter supporting India's growing tech security sector.",
    leaders: ["Priya Sharma"],
  },
  {
    id: "owasp-seoul",
    name: "Seoul",
    region: "Asia Pacific",
    popularity: 74,
    description: "Seoul chapter promoting security in South Korea.",
  },
  
  // Latin America
  {
    id: "owasp-sao-paulo",
    name: "São Paulo",
    region: "Latin America",
    popularity: 77,
    description: "São Paulo chapter leading security initiatives in Brazil.",
    leaders: ["Quinn Silva"],
  },
  {
    id: "owasp-mexico-city",
    name: "Mexico City",
    region: "Latin America",
    popularity: 69,
    description: "Mexico City chapter serving the Mexican security community.",
  },
  {
    id: "owasp-buenos-aires",
    name: "Buenos Aires",
    region: "Latin America",
    popularity: 65,
    description: "Buenos Aires chapter promoting security in Argentina.",
  },
  
  // Middle East & Africa
  {
    id: "owasp-dubai",
    name: "Dubai",
    region: "Middle East & Africa",
    popularity: 80,
    description: "Dubai chapter connecting security professionals in the UAE.",
    leaders: ["Rachel Al-Rashid"],
  },
  {
    id: "owasp-tel-aviv",
    name: "Tel Aviv",
    region: "Middle East & Africa",
    popularity: 84,
    description: "Tel Aviv chapter leveraging Israel's cybersecurity ecosystem.",
    leaders: ["Sam Cohen"],
  },
  {
    id: "owasp-cape-town",
    name: "Cape Town",
    region: "Middle East & Africa",
    popularity: 67,
    description: "Cape Town chapter serving the South African security community.",
  },
  
  // Additional North America Chapters
  {
    id: "owasp-toronto",
    name: "Toronto",
    region: "North America",
    popularity: 82,
    description: "Toronto chapter serving Canada's largest tech hub.",
    leaders: ["Tom Anderson"],
  },
  {
    id: "owasp-chicago",
    name: "Chicago",
    region: "North America",
    popularity: 75,
    description: "Chicago chapter connecting Midwest security professionals.",
  },
  {
    id: "owasp-denver",
    name: "Denver",
    region: "North America",
    popularity: 68,
    description: "Denver chapter promoting security in the Rocky Mountain region.",
  },
  {
    id: "owasp-vancouver",
    name: "Vancouver",
    region: "North America",
    popularity: 73,
    description: "Vancouver chapter serving Western Canada.",
  },
  {
    id: "owasp-atlanta",
    name: "Atlanta",
    region: "North America",
    popularity: 70,
    description: "Atlanta chapter connecting security professionals in the Southeast.",
  },
  
  // Additional Europe Chapters
  {
    id: "owasp-madrid",
    name: "Madrid",
    region: "Europe",
    popularity: 74,
    description: "Madrid chapter promoting security across Spain.",
    leaders: ["Maria Garcia"],
  },
  {
    id: "owasp-stockholm",
    name: "Stockholm",
    region: "Europe",
    popularity: 77,
    description: "Stockholm chapter serving the Nordic security community.",
  },
  {
    id: "owasp-dublin",
    name: "Dublin",
    region: "Europe",
    popularity: 72,
    description: "Dublin chapter connecting Irish security professionals.",
  },
  {
    id: "owasp-munich",
    name: "Munich",
    region: "Europe",
    popularity: 75,
    description: "Munich chapter promoting security in Southern Germany.",
  },
  {
    id: "owasp-zurich",
    name: "Zurich",
    region: "Europe",
    popularity: 76,
    description: "Zurich chapter serving the Swiss security community.",
  },
  
  // Additional Asia Pacific Chapters
  {
    id: "owasp-mumbai",
    name: "Mumbai",
    region: "Asia Pacific",
    popularity: 85,
    description: "Mumbai chapter connecting security professionals in Western India.",
    leaders: ["Raj Patel"],
  },
  {
    id: "owasp-delhi",
    name: "Delhi",
    region: "Asia Pacific",
    popularity: 83,
    description: "Delhi chapter serving India's capital region.",
  },
  {
    id: "owasp-hong-kong",
    name: "Hong Kong",
    region: "Asia Pacific",
    popularity: 88,
    description: "Hong Kong chapter connecting APAC financial security professionals.",
  },
  {
    id: "owasp-melbourne",
    name: "Melbourne",
    region: "Asia Pacific",
    popularity: 80,
    description: "Melbourne chapter serving Southern Australia.",
  },
  {
    id: "owasp-jakarta",
    name: "Jakarta",
    region: "Asia Pacific",
    popularity: 71,
    description: "Jakarta chapter promoting security in Indonesia.",
  },
  
  // Additional Latin America Chapters
  {
    id: "owasp-santiago",
    name: "Santiago",
    region: "Latin America",
    popularity: 66,
    description: "Santiago chapter serving the Chilean security community.",
  },
  {
    id: "owasp-bogota",
    name: "Bogotá",
    region: "Latin America",
    popularity: 64,
    description: "Bogotá chapter promoting security in Colombia.",
  },
  {
    id: "owasp-lima",
    name: "Lima",
    region: "Latin America",
    popularity: 62,
    description: "Lima chapter serving the Peruvian security community.",
  },
  
  // Additional Middle East & Africa Chapters
  {
    id: "owasp-cairo",
    name: "Cairo",
    region: "Middle East & Africa",
    popularity: 69,
    description: "Cairo chapter promoting security in Egypt and North Africa.",
  },
  {
    id: "owasp-johannesburg",
    name: "Johannesburg",
    region: "Middle East & Africa",
    popularity: 70,
    description: "Johannesburg chapter serving South Africa's business hub.",
  },
  {
    id: "owasp-riyadh",
    name: "Riyadh",
    region: "Middle East & Africa",
    popularity: 73,
    description: "Riyadh chapter connecting security professionals in Saudi Arabia.",
  },
];

// Function to fetch chapters from API (placeholder)
export async function fetchChapters(): Promise<Chapter[]> {
  // TODO: Replace with actual OWASP NEST API call
  // Example: const response = await fetch('https://api.owasp.org/chapters/list');
  // return response.json();
  
  // For now, return mock data
  return Promise.resolve(mockChapters);
}
