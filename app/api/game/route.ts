import { NextResponse } from 'next/server';

// Sample dataset
const destinations = [
  {
    "city": "Paris",
    "country": "France",
    "clues": [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art."
    ],
    "fun_fact": [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
    ],
    "trivia": [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia."
    ]
  },
  {
    "city": "Tokyo",
    "country": "Japan",
    "clues": [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming."
    ],
    "fun_fact": [
      "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
      "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
    ],
    "trivia": [
      "The city has over 160,000 restaurants, more than any other city in the world.",
      "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies."
    ]
  },
  {
    "city": "New York",
    "country": "USA",
    "clues": [
      "Home to a green statue gifted by France in the 1800s.",
      "Nicknamed 'The Big Apple' and known for its Broadway theaters."
    ],
    "fun_fact": [
      "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
      "Times Square was once called Longacre Square before being renamed in 1904."
    ],
    "trivia": [
      "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
      "The Empire State Building has its own zip code: 10118."
    ]
  }
];

// Additional cities for options
const additionalCities = [
  { city: "London", country: "United Kingdom" },
  { city: "Rome", country: "Italy" },
  { city: "Sydney", country: "Australia" },
  { city: "Cairo", country: "Egypt" },
  { city: "Rio de Janeiro", country: "Brazil" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Dubai", country: "UAE" },
  { city: "Berlin", country: "Germany" },
  { city: "Moscow", country: "Russia" },
  { city: "Amsterdam", country: "Netherlands" }
];

// Get random items from array
function getRandomItems(array: any[], count: number) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get random item from array
function getRandomItem(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export async function POST(request: Request) {
  try {
    const { userId, completedCities = [] } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Filter out completed cities
    const availableCities = destinations.filter(
      dest => !completedCities.includes(dest.city)
    );
    
    if (availableCities.length === 0) {
      return NextResponse.json(
        { gameComplete: true, message: 'You have completed all destinations!' },
        { status: 200 }
      );
    }
    
    // Select a random city from available cities
    const selectedDestination = getRandomItem(availableCities);
    
    // Get 2 random clues
    const clues = getRandomItems(selectedDestination.clues, 2);
    
    // Get 3 random incorrect options
    const otherCities = [
      ...destinations.filter(d => d.city !== selectedDestination.city),
      ...additionalCities
    ];
    const incorrectOptions = getRandomItems(otherCities, 3).map(c => ({
      city: c.city,
      country: c.country
    }));
    
    // Add correct option and shuffle
    const options = [
      { city: selectedDestination.city, country: selectedDestination.country },
      ...incorrectOptions
    ].sort(() => 0.5 - Math.random());
    
    return NextResponse.json({
      id: selectedDestination.city,
      clues,
      options
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, cityId, isCorrect } = await request.json();
    
    if (!userId || !cityId) {
      return NextResponse.json(
        { error: 'User ID and city ID are required' },
        { status: 400 }
      );
    }
    
    const city = destinations.find(d => d.city === cityId);
    
    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }
    
    // Get random fact or trivia
    const factType = Math.random() > 0.5 ? 'fun_fact' : 'trivia';
    const fact = getRandomItem(city[factType as keyof typeof city] as string[]);
    
    return NextResponse.json({
      isCorrect,
      city: city.city,
      country: city.country,
      factType,
      fact
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}