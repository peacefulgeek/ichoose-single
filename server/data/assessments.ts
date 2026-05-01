/**
 * Self-assessments for I Choose Single. Each one is a short, no-account, in-page
 * scoring quiz the reader runs against their own week. Output is encouragement plus
 * an internal link to the most relevant essay. The set is designed to feel like a
 * field-guide a thoughtful editor would hand you, not a personality test.
 *
 * Each assessment has 5 to 7 statements, scored on a 1 to 5 Likert scale, with
 * three score bands (low / mid / high) and tailored takeaway copy.
 *
 * Schema markup: each assessment is exposed as a Quiz JSON-LD entity on /assessments.
 */

export type AssessmentItem = {
  id: string;
  prompt: string;
};

export type AssessmentBand = {
  min: number;
  max: number;
  label: string;
  takeaway: string;
  linkSlug: string; // internal article slug
  linkAnchor: string;
};

export type Assessment = {
  slug: string;
  title: string;
  intro: string;
  why: string;
  items: AssessmentItem[];
  bands: AssessmentBand[];
};

export const ASSESSMENTS: Assessment[] = [
  {
    slug: "am-i-actually-single-by-design",
    title: "Am I actually single by design, or single by default?",
    intro:
      "Five honest statements. Score each 1 (rarely) to 5 (most weeks). Add the numbers up at the end.",
    why: "The difference matters. Default singlehood feels like waiting. Designed singlehood feels like a life. The same calendar can hold either one, and most of us drift between them across a year. This assessment helps you locate where you are this month.",
    items: [
      { id: "q1", prompt: "I make plans for my weekends without first checking who might rescue them." },
      { id: "q2", prompt: "When something good happens, I let myself feel it before reaching for someone to tell." },
      { id: "q3", prompt: "I have at least three relationships in my life I'm investing in like a partnership." },
      { id: "q4", prompt: "I would describe my home as a place I built for me, not a placeholder for a future household." },
      { id: "q5", prompt: "When I imagine my next five years, the picture has shape and color even without a partner in it." },
    ],
    bands: [
      {
        min: 5, max: 12,
        label: "Mostly default, and that's okay",
        takeaway:
          "You're holding the shape of singlehood without quite filling it in yet. That's a normal stage. The work this season is small, specific, and concrete: one weekend designed for you, one ritual you keep, one friend you treat like a person you chose.",
        linkSlug: "the-quiet-power-of-choosing-yourself-first",
        linkAnchor: "Start here: the quiet power of choosing yourself first",
      },
      {
        min: 13, max: 19,
        label: "Drifting toward design",
        takeaway:
          "The architecture is forming. You're investing, you're noticing, you're occasionally letting good moments belong to you instead of to a future witness. The next move is repetition. Pick the two practices that gave you the highest scores and run them on purpose for a month.",
        linkSlug: "morning-rituals-that-make-a-studio-apartment-feel-like-a-home",
        linkAnchor: "Morning rituals that anchor a solo home",
      },
      {
        min: 20, max: 25,
        label: "Single by design",
        takeaway:
          "You've built a life that doesn't need rescue. The risk at this stage is forgetting how rare and chosen this is. Tell someone what you've built. Mentor someone two steps behind you. The community of design-minded singles is small and quiet and grateful for company.",
        linkSlug: "what-i-tell-my-married-friends-when-they-ask-if-im-lonely",
        linkAnchor: "What I tell my married friends when they ask if I'm lonely",
      },
    ],
  },
  {
    slug: "is-my-home-a-life-or-a-waiting-room",
    title: "Is my home a life, or a waiting room?",
    intro: "Six statements about your space. Score 1 (not yet) to 5 (lived in fully).",
    why: "A home that's been waiting for someone tells the body to keep waiting too. A home that's been chosen tells the body it's safe to land.",
    items: [
      { id: "q1", prompt: "I have art on my walls that I picked, not inherited or hung by accident." },
      { id: "q2", prompt: "There's a chair or corner where I read on purpose at least once a week." },
      { id: "q3", prompt: "My kitchen has the tools I'd want even if no one ever cooked here but me." },
      { id: "q4", prompt: "My bed is made for me, not styled for an imagined viewer." },
      { id: "q5", prompt: "When I walk in after a long day, the apartment feels like a person greeting me." },
      { id: "q6", prompt: "I've hosted at least one quiet meal here that I cooked for myself." },
    ],
    bands: [
      {
        min: 6, max: 14,
        label: "Waiting room",
        takeaway:
          "The space is honest. It's been a placeholder. Begin with one room or one corner. A reading chair, a real lamp, a pot you'd use weekly even if no one ever joined you. The shift starts with one object that's clearly for you.",
        linkSlug: "how-a-single-woman-redesigns-her-apartment-to-feel-like-a-sanctuary",
        linkAnchor: "How to redesign a solo apartment into a sanctuary",
      },
      {
        min: 15, max: 22,
        label: "In progress",
        takeaway:
          "You've claimed parts of the home. The work now is consistency. Pick the room with the lowest score and design one weekend ritual that lives there. Sundays in the kitchen. Saturdays in the reading chair. Repetition makes a room yours.",
        linkSlug: "morning-rituals-that-make-a-studio-apartment-feel-like-a-home",
        linkAnchor: "Morning rituals for a studio apartment",
      },
      {
        min: 23, max: 30,
        label: "A real home",
        takeaway:
          "Your space has stopped waiting. Protect it. The next risk is letting the world erode the rituals that built this feeling. Hold the line on the small things.",
        linkSlug: "why-solo-sundays-became-my-most-sacred-day-of-the-week",
        linkAnchor: "Why solo Sundays are sacred",
      },
    ],
  },
  {
    slug: "how-deep-is-my-friendship-bench",
    title: "How deep is my friendship bench?",
    intro: "Five statements. Score 1 (not really) to 5 (consistently).",
    why: "Designed singlehood survives because friendship is treated as infrastructure, not entertainment. This assessment asks how built-out your bench actually is right now.",
    items: [
      { id: "q1", prompt: "I have at least three friends I would call without rehearsing what to say." },
      { id: "q2", prompt: "I drive across town, change plans, or send the article that made me think of someone." },
      { id: "q3", prompt: "I remember birthdays without an app reminding me." },
      { id: "q4", prompt: "I have shown up at a funeral, a hospital, or a hard week for a friend in the last two years." },
      { id: "q5", prompt: "I have at least one friendship I'd describe as a chosen partnership." },
    ],
    bands: [
      {
        min: 5, max: 12,
        label: "Bench is thin",
        takeaway:
          "This is the most common shape, and the easiest to change. Pick one friend this week and treat them with the energy you would give a date. Plan it. Show up. Follow up.",
        linkSlug: "what-friendship-becomes-when-you-stop-treating-it-like-a-backup-plan",
        linkAnchor: "What friendship becomes when you stop treating it like a backup plan",
      },
      {
        min: 13, max: 19,
        label: "Building a bench",
        takeaway:
          "You have a few real ones. The next move is to deepen rather than widen. Designed singles often try to add friends when the assignment is to invest harder in the three they already have.",
        linkSlug: "what-friendship-becomes-when-you-stop-treating-it-like-a-backup-plan",
        linkAnchor: "Investing in the three you already have",
      },
      {
        min: 20, max: 25,
        label: "A genuine bench",
        takeaway:
          "You've built the kind of friendship infrastructure most marriages quietly run on. Notice it. Name it to the people you've built it with. They've been doing the work too.",
        linkSlug: "what-i-tell-my-married-friends-when-they-ask-if-im-lonely",
        linkAnchor: "Why my married friends ask me about loneliness",
      },
    ],
  },
  {
    slug: "am-i-using-money-like-someone-who-plans-to-stay-single",
    title: "Am I using money like someone who plans to stay single?",
    intro: "Six statements about your financial setup. Score 1 (not yet) to 5 (handled).",
    why: "Designed singlehood has a financial shape. Solo planners need different defaults than two-income households. This is a pragmatic check, not a guilt trip.",
    items: [
      { id: "q1", prompt: "I have an emergency fund covering three to six months of solo expenses." },
      { id: "q2", prompt: "My retirement contributions are sized for a household of one, not optimistically." },
      { id: "q3", prompt: "I have disability insurance, or I've consciously decided I don't need it." },
      { id: "q4", prompt: "I know who my beneficiaries are and they reflect my actual life." },
      { id: "q5", prompt: "I've had a real conversation with someone about long-term care without a partner." },
      { id: "q6", prompt: "I budget for joy expenses, not just survival expenses." },
    ],
    bands: [
      {
        min: 6, max: 14,
        label: "Solo plan still pending",
        takeaway:
          "You're not behind. You're early. Pick one of the questions you scored lowest on and make it your project for the next 90 days. Solo finance is built one decision at a time.",
        linkSlug: "solo-finance-rituals-that-dont-require-a-spouse-to-plan-with",
        linkAnchor: "Solo finance rituals you can run without a spouse",
      },
      {
        min: 15, max: 22,
        label: "Most of it is handled",
        takeaway:
          "You've got the bones. The next layer is naming the people in your plan. Beneficiaries, executors, the friend who has the spare key. Solo finance is also solo logistics.",
        linkSlug: "the-single-womans-case-for-building-wealth-on-her-own-terms",
        linkAnchor: "Building wealth on your own terms",
      },
      {
        min: 23, max: 30,
        label: "Solo by design, financially",
        takeaway:
          "You've built the financial architecture of a designed single life. The work now is review, not construction. Once a year, sit with it. Make sure the plan still describes the person you're becoming.",
        linkSlug: "the-quiet-math-of-solo-homeownership-in-your-thirties",
        linkAnchor: "The quiet math of solo homeownership",
      },
    ],
  },
  {
    slug: "is-my-calendar-a-life-or-a-leftover",
    title: "Is my calendar a life, or a leftover?",
    intro: "Five statements. Score 1 (no) to 5 (yes, this is real).",
    why: "Time is the most honest portrait of priorities. The calendar tells the truth even when the inner monologue lies about it.",
    items: [
      { id: "q1", prompt: "There are recurring blocks on my calendar that exist entirely for me." },
      { id: "q2", prompt: "I plan one solo Saturday a month with the same care I'd plan a date." },
      { id: "q3", prompt: "I take real time off, not just sick time." },
      { id: "q4", prompt: "I cancel plans that aren't right for me without elaborate excuses." },
      { id: "q5", prompt: "When I look at next month, I can find at least three things I'm looking forward to that don't involve other people." },
    ],
    bands: [
      {
        min: 5, max: 12,
        label: "Leftover calendar",
        takeaway:
          "The week is being shaped by other people's gravity. Begin with one block. Saturday morning, three hours, on the calendar with a name. Reading. Walking. The studio. Whatever it is. Watch the rest of the week reorganize.",
        linkSlug: "what-happens-to-your-calendar-when-you-take-your-single-life-seriously",
        linkAnchor: "What happens to your calendar when you take your solo life seriously",
      },
      {
        min: 13, max: 19,
        label: "Calendar is forming",
        takeaway:
          "Some of the week is yours now. Add one more block this month and protect it like a meeting with someone you respect.",
        linkSlug: "the-ritual-slowness-of-a-solo-saturday-morning",
        linkAnchor: "The ritual slowness of a solo Saturday morning",
      },
      {
        min: 20, max: 25,
        label: "A life-shaped calendar",
        takeaway:
          "Your week reflects you. Notice the cost of every yes that erodes those blocks. The work at this stage is mostly defense.",
        linkSlug: "the-single-womans-field-guide-to-saying-no-without-a-sorry",
        linkAnchor: "Saying no without a sorry",
      },
    ],
  },
  {
    slug: "where-am-i-on-the-relationship-escalator",
    title: "Where am I on the relationship escalator?",
    intro: "Five statements. Score 1 (still riding) to 5 (firmly off).",
    why: "The escalator metaphor isn't anti-partnership. It's anti-autopilot. This is a check on whether your love life is being lived on purpose or on a script.",
    items: [
      { id: "q1", prompt: "I can name what I want from connection without using the word 'serious'." },
      { id: "q2", prompt: "I can imagine a long-term life with someone that doesn't include living together." },
      { id: "q3", prompt: "I've turned down a relationship that fit the script but didn't fit me." },
      { id: "q4", prompt: "My closest friendships are not lower in priority than a romantic partner would be." },
      { id: "q5", prompt: "If a partner showed up tomorrow, my life wouldn't reorganize around them by default." },
    ],
    bands: [
      {
        min: 5, max: 12,
        label: "Still riding",
        takeaway: "The escalator is invisible until you step off. Begin by naming what you actually want, in language that doesn't borrow from anyone else's life.",
        linkSlug: "stepping-off-the-relationship-escalator-without-apologizing",
        linkAnchor: "Stepping off the relationship escalator",
      },
      {
        min: 13, max: 19,
        label: "Stepping off",
        takeaway: "You've started. The next move is to make the language about your love life specific and your own. Define the relationship shape you actually want, in three sentences.",
        linkSlug: "dating-on-your-own-terms-after-a-decade-of-performing",
        linkAnchor: "Dating on your own terms",
      },
      {
        min: 20, max: 25,
        label: "Firmly off",
        takeaway: "You're living a relational life on purpose. The work at this stage is to be visible about it. Other people are looking for this exit, and your life is a map.",
        linkSlug: "what-i-tell-my-married-friends-when-they-ask-if-im-lonely",
        linkAnchor: "What I tell my married friends",
      },
    ],
  },
  {
    slug: "how-rested-am-i-actually",
    title: "How rested am I, actually?",
    intro: "Six statements. Score 1 (rarely true) to 5 (mostly true).",
    why: "Designed singlehood costs energy. The plot twist is that it also returns energy, but only if rest is built in. This is the rest audit.",
    items: [
      { id: "q1", prompt: "I sleep at least seven hours most nights." },
      { id: "q2", prompt: "I have one weeknight a week with nothing scheduled." },
      { id: "q3", prompt: "I take real lunch breaks, not desk lunches." },
      { id: "q4", prompt: "I have a wind-down ritual that doesn't involve a screen." },
      { id: "q5", prompt: "I let myself be bored for at least an hour a week." },
      { id: "q6", prompt: "I leave my phone in another room for part of the day." },
    ],
    bands: [
      {
        min: 6, max: 14,
        label: "Running thin",
        takeaway: "Solo lives that under-rest collapse into urgency. Choose one rest practice and run it for two weeks before adding anything else.",
        linkSlug: "morning-rituals-that-make-a-studio-apartment-feel-like-a-home",
        linkAnchor: "Morning rituals that make solo living feel restorative",
      },
      {
        min: 15, max: 22,
        label: "Mostly rested",
        takeaway: "You're sustainable. The next layer is making rest non-negotiable when life surges.",
        linkSlug: "the-ritual-slowness-of-a-solo-saturday-morning",
        linkAnchor: "The ritual slowness of a solo Saturday",
      },
      {
        min: 23, max: 30,
        label: "Rested by design",
        takeaway: "You treat rest like infrastructure. Tell other people what you do. Most of them are quietly unraveling.",
        linkSlug: "why-solo-sundays-became-my-most-sacred-day-of-the-week",
        linkAnchor: "Why solo Sundays became sacred",
      },
    ],
  },
  {
    slug: "is-my-no-strong-enough-yet",
    title: "Is my no strong enough yet?",
    intro: "Five statements. Score 1 (rarely) to 5 (consistently).",
    why: "Designed singlehood lives or dies by the strength of the no. This is a quick audit of how clean your refusals are.",
    items: [
      { id: "q1", prompt: "I can decline an invitation without inventing a reason." },
      { id: "q2", prompt: "I can leave a dinner when I'm done without performing reluctance." },
      { id: "q3", prompt: "I do not over-explain when I cancel." },
      { id: "q4", prompt: "I let no be a complete sentence." },
      { id: "q5", prompt: "I notice when my yes is automatic, and I pause before giving it." },
    ],
    bands: [
      {
        min: 5, max: 12,
        label: "No is still negotiated",
        takeaway: "Most of us were trained out of clean refusal. Begin by trimming the apology off the next no you give. One small reduction, not a personality overhaul.",
        linkSlug: "the-single-womans-field-guide-to-saying-no-without-a-sorry",
        linkAnchor: "How to say no without a sorry",
      },
      {
        min: 13, max: 19,
        label: "Cleaner refusal",
        takeaway: "You're trimming the explanations. Notice which relationships still pull more elaboration out of you and ask whether that's about them or about you.",
        linkSlug: "the-single-womans-field-guide-to-saying-no-without-a-sorry",
        linkAnchor: "When to refuse without elaboration",
      },
      {
        min: 20, max: 25,
        label: "Clean no",
        takeaway: "Your refusals are kind and complete. That's the work. People around you are quietly learning from it.",
        linkSlug: "why-the-holidays-hit-different-when-youre-single-by-design",
        linkAnchor: "Why holidays test the strength of your no",
      },
    ],
  },
  {
    slug: "am-i-letting-myself-be-witnessed",
    title: "Am I letting myself be witnessed?",
    intro: "Five statements. Score 1 (no) to 5 (yes, often).",
    why: "Designed singlehood can drift into self-sufficient isolation. The fix is not partnership. It's witness. This assessment asks whether you're letting your life be seen.",
    items: [
      { id: "q1", prompt: "I tell at least one friend the small good things, not just the big ones." },
      { id: "q2", prompt: "When I'm struggling, I name it to a person, not just my journal." },
      { id: "q3", prompt: "I've been honestly seen, not advised, in the last month." },
      { id: "q4", prompt: "I let people watch me try things I'm not yet good at." },
      { id: "q5", prompt: "I have at least one person who knows my real day-to-day." },
    ],
    bands: [
      {
        min: 5, max: 12,
        label: "Mostly hidden",
        takeaway: "Solo lives can quietly become opaque. Pick one friend this week and tell them something small and real you would normally keep to yourself.",
        linkSlug: "what-friendship-becomes-when-you-stop-treating-it-like-a-backup-plan",
        linkAnchor: "Letting friendship hold what partnership used to",
      },
      {
        min: 13, max: 19,
        label: "Partly visible",
        takeaway: "You're being witnessed, but the texture is still curated. The next move is texture, not volume. Tell less polished stories.",
        linkSlug: "the-truth-about-self-partnering-no-one-posted-on-instagram",
        linkAnchor: "The unposted truth about self-partnering",
      },
      {
        min: 20, max: 25,
        label: "Genuinely witnessed",
        takeaway: "Your real life is held by real people. That's rare. Do it for someone else this month.",
        linkSlug: "what-i-tell-my-married-friends-when-they-ask-if-im-lonely",
        linkAnchor: "What I tell my married friends",
      },
    ],
  },
  {
    slug: "is-my-body-included-in-this-life",
    title: "Is my body included in this life?",
    intro: "Six statements. Score 1 (rarely) to 5 (mostly).",
    why: "A designed solo life that disowns the body breaks down quietly. This is a check on whether your body is along for the design or being left in the parking lot.",
    items: [
      { id: "q1", prompt: "I move my body in a way I enjoy at least three times a week." },
      { id: "q2", prompt: "I eat real meals, not just refueling sessions." },
      { id: "q3", prompt: "I touch and am touched by people I trust, even non-romantically." },
      { id: "q4", prompt: "I get sunlight on my face most days." },
      { id: "q5", prompt: "I notice when my body is asking for rest, water, or quiet, and I respond." },
      { id: "q6", prompt: "I dress for the person I actually am, not the person I'm trying to convince." },
    ],
    bands: [
      {
        min: 6, max: 14,
        label: "Body is on hold",
        takeaway: "The body is patient but it's keeping score. Choose one practice and run it for two weeks before adding another.",
        linkSlug: "solo-cooking-without-the-diet-culture-voice-in-your-head",
        linkAnchor: "Solo cooking without the diet-culture voice",
      },
      {
        min: 15, max: 22,
        label: "Body is partly included",
        takeaway: "You're listening intermittently. Pick the lowest-scoring item and treat it like a real project for a month.",
        linkSlug: "morning-rituals-that-make-a-studio-apartment-feel-like-a-home",
        linkAnchor: "Body-anchored morning rituals",
      },
      {
        min: 23, max: 30,
        label: "Body is in the design",
        takeaway: "Your body is part of the architecture. Protect this. Solo lives that include the body have far more capacity than they look like they should.",
        linkSlug: "why-solo-sundays-became-my-most-sacred-day-of-the-week",
        linkAnchor: "Why solo Sundays anchor the body",
      },
    ],
  },
  {
    slug: "what-season-am-i-in",
    title: "What season am I in, really?",
    intro: "Six statements. Choose the one that's most true and weight from 1 (least like me) to 5 (this is me right now).",
    why: "Designed singlehood is not a single state. It moves through seasons. This is a seasonal locator, not a verdict.",
    items: [
      { id: "q1", prompt: "Spring: I'm building things, scheduling things, the energy is forward." },
      { id: "q2", prompt: "Summer: I'm in the middle of a life I love and it's easy to take for granted." },
      { id: "q3", prompt: "Late summer: I'm noticing what isn't working anymore." },
      { id: "q4", prompt: "Autumn: I'm letting go of projects, people, and habits that don't fit." },
      { id: "q5", prompt: "Winter: I'm quiet, I'm tired, and I'm not failing, I'm fallow." },
      { id: "q6", prompt: "Early spring: something new is starting, but it's still mostly underground." },
    ],
    bands: [
      {
        min: 6, max: 14,
        label: "Quieter season",
        takeaway: "Match your output to the season. Winter and late autumn are not failures of design. They are the design's exhale.",
        linkSlug: "why-i-stopped-calling-myself-lonely-and-started-calling-it-spacious",
        linkAnchor: "Naming a fallow season as spacious, not lonely",
      },
      {
        min: 15, max: 22,
        label: "Transitional",
        takeaway: "You're between rooms. The work is to let the in-between count, not to rush through it.",
        linkSlug: "the-truth-about-self-partnering-no-one-posted-on-instagram",
        linkAnchor: "The unposted middle of self-partnering",
      },
      {
        min: 23, max: 30,
        label: "Active season",
        takeaway: "You're building. The risk is forgetting that summer doesn't last and that the design has to be sustainable across seasons, not just this one.",
        linkSlug: "what-happens-to-your-calendar-when-you-take-your-single-life-seriously",
        linkAnchor: "How to design a calendar that survives every season",
      },
    ],
  },
];
