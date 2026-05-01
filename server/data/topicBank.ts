/**
 * Topic bank for Single by Design. Behavioral, specific, story-rich angles.
 * The cron rotates through these; duplicates are avoided by slug.
 */
export interface Topic {
  title: string;
  category: string;
  tags: string[];
}

export const TOPIC_BANK: Topic[] = [
  { title: "The Quiet Power of Choosing Yourself First", category: "self-partnering", tags: ["self-partnering", "morning-rituals", "single-women"] },
  { title: "Why Solo Sundays Became My Most Sacred Day of the Week", category: "solo-living", tags: ["solo-living", "morning-rituals", "self-care"] },
  { title: "Stepping Off the Relationship Escalator Without Apologizing", category: "relationship-escalator", tags: ["relationship-escalator", "intentional-singlehood", "single-women"] },
  { title: "The Single Person's Guide to Cooking for One Without the Pity", category: "solo-living", tags: ["solo-living", "single-cooking", "kitchen", "single-living"] },
  { title: "How a Single Woman Redesigns Her Apartment to Feel Like a Sanctuary", category: "solo-living", tags: ["solo-living", "single-women", "home", "self-care"] },
  { title: "What Friendship Becomes When You Stop Treating It Like a Backup Plan", category: "intentional-singlehood", tags: ["intentional-singlehood", "friendship", "single-women", "single-men"] },
  { title: "The Art of Solo Travel for People Who Used to Wait for a Plus One", category: "solo-travel", tags: ["solo-travel", "intentional-singlehood", "single-women"] },
  { title: "Solo Finance Rituals That Don't Require a Spouse to Plan With", category: "solo-finance", tags: ["solo-finance", "solo-living", "money"] },
  { title: "Single Parents Who Stopped Waiting for the Cavalry", category: "single-parents", tags: ["single-parents", "intentional-singlehood", "self-partnering"] },
  { title: "Dating on Your Own Terms After a Decade of Performing", category: "dating-on-your-terms", tags: ["dating-on-your-terms", "intentional-singlehood", "single-women"] },
  { title: "The Single Man's Quiet Revolution at Forty", category: "single-men", tags: ["single-men", "intentional-singlehood", "self-partnering"] },
  { title: "Why I Stopped Calling Myself Lonely and Started Calling It Spacious", category: "self-partnering", tags: ["self-partnering", "intentional-singlehood", "single-women"] },
  { title: "Morning Rituals That Make a Studio Apartment Feel Like a Home", category: "solo-living", tags: ["solo-living", "morning-rituals", "single-living"] },
  { title: "The Truth About Self-Partnering No One Posted on Instagram", category: "self-partnering", tags: ["self-partnering", "single-women", "spiritual"] },
  { title: "Building a Solo Travel Habit on a Real-Person Budget", category: "solo-travel", tags: ["solo-travel", "solo-finance", "intentional-singlehood"] },
  { title: "What Happens to Your Calendar When You Take Your Single Life Seriously", category: "intentional-singlehood", tags: ["intentional-singlehood", "boundaries", "single-women"] },
  { title: "The Single Woman's Field Guide to Saying No Without a Sorry", category: "single-women", tags: ["single-women", "boundaries", "self-partnering"] },
  { title: "Solo Cooking Without the Diet-Culture Voice in Your Head", category: "solo-living", tags: ["solo-living", "single-cooking", "self-care"] },
  { title: "Why the Holidays Hit Different When You're Single by Design", category: "intentional-singlehood", tags: ["intentional-singlehood", "single-women", "single-men", "holidays"] },
  { title: "The Quiet Math of Solo Homeownership in Your Thirties", category: "solo-finance", tags: ["solo-finance", "solo-living", "single-women"] },
  { title: "Conscious Uncoupling for People Who Won't Be Marrying Again", category: "relationship-escalator", tags: ["relationship-escalator", "divorce", "self-partnering"] },
  { title: "Single by Design at Fifty: The Decade That Surprised Me", category: "intentional-singlehood", tags: ["intentional-singlehood", "single-women", "self-partnering"] },
  { title: "Why a Cast Iron Skillet Became My Most Romantic Possession", category: "solo-living", tags: ["solo-living", "single-cooking", "self-care", "single-living"] },
  { title: "What I Tell My Married Friends When They Ask If I'm Lonely", category: "intentional-singlehood", tags: ["intentional-singlehood", "single-women", "friendship"] },
  { title: "The Ritual Slowness of a Solo Saturday Morning", category: "solo-living", tags: ["solo-living", "morning-rituals", "self-care"] },
  { title: "Solo Holidays Without the Performance of Tradition", category: "solo-living", tags: ["solo-living", "intentional-singlehood", "holidays"] },
  { title: "The Slow Goodbye to the Story That You're Behind", category: "self-partnering", tags: ["self-partnering", "intentional-singlehood", "single-women"] },
  { title: "Why I Started Reading Books Like My Future Depended On It", category: "self-partnering", tags: ["self-partnering", "books", "single-women", "single-men"] },
  { title: "The Single Person's Permission Slip for an Ordinary Tuesday", category: "intentional-singlehood", tags: ["intentional-singlehood", "single-living", "self-care"] },
  { title: "What a Year of Solo Sundays Taught Me About Being Loved", category: "self-partnering", tags: ["self-partnering", "single-women", "morning-rituals"] },
  { title: "How to Throw Yourself a Birthday Dinner When You're Single by Design", category: "intentional-singlehood", tags: ["intentional-singlehood", "single-living", "self-care"] },
  { title: "The Single Woman's Case for Building Wealth on Her Own Terms", category: "solo-finance", tags: ["solo-finance", "single-women", "intentional-singlehood"] },
  { title: "Sleeping Alone, On Purpose, and Liking It Most Nights", category: "solo-living", tags: ["solo-living", "self-care", "intentional-singlehood"] },
  { title: "Why Single Men in Their Fifties Are Quietly Reinventing Their Lives", category: "single-men", tags: ["single-men", "intentional-singlehood", "self-partnering"] },
  { title: "Single Parents Who Refuse to Apologize for Their Family Shape", category: "single-parents", tags: ["single-parents", "intentional-singlehood", "single-women"] },
  { title: "The Solo Traveler's Practice of Eating Alone Without Hiding", category: "solo-travel", tags: ["solo-travel", "single-women", "intentional-singlehood"] },
  { title: "Dating Apps as a Spiritual Practice for People Who Aren't in a Hurry", category: "dating-on-your-terms", tags: ["dating-on-your-terms", "single-women", "self-partnering"] },
  { title: "The Quiet Authority of Owning a Home as a Single Adult", category: "solo-finance", tags: ["solo-finance", "solo-living", "single-women"] },
  { title: "What Solo Travel Teaches You That No Couples Trip Ever Will", category: "solo-travel", tags: ["solo-travel", "intentional-singlehood", "single-men"] },
  { title: "Why I Built a Friendship Calendar Like Other People Build a Marriage", category: "intentional-singlehood", tags: ["intentional-singlehood", "friendship", "single-women"] },
  { title: "The Slow Magic of a Single Person's Sunday Reset", category: "solo-living", tags: ["solo-living", "morning-rituals", "self-care"] },
  { title: "How Single Women Build a Vacation Habit That Doesn't Wait for Anyone", category: "solo-travel", tags: ["solo-travel", "single-women", "intentional-singlehood"] },
  { title: "The Honest Joys of Being Single Through Your Forties", category: "intentional-singlehood", tags: ["intentional-singlehood", "single-women", "self-partnering"] },
];
