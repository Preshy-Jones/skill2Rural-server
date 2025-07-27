import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const answerMapping = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
};

interface Course {
  title: string;
  description: string;
  objectives: string[];
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
  video_url: string;
  duration: number;
  thumbnail_image?: string;
}

// Admin user data
const adminData = {
  name: "Admin User",
  email: "admin@skill2rural.com",
  password: "Admin@123",
  status: "ACTIVE" as const,
  profile_photo: null,
};

const courses: Course[] = [
  {
    title: "DESIGN THINKING",
    description:
      "Design thinking is a human centered approach to problem solving. It starts with the users in mind and ends with a solution designed specially to meet their needs. The core of design thinking is empathy. All other key factors needed to make design thinking work include; team work, iteration and curiosity, as well as testing the solution.",
    objectives: [
      "Know and understand what design thinking really is",
      "Understand the five (5) stages of design thinking",
      "Understand why the question(s) 'why, who and how' is necessary in design thinking",
      "Understand why the empathy stage is very important in design thinking",
      "Work out a practical solution to a problem using design thinking",
    ],
    questions: [
      {
        question: "What is design thinking?",
        options: [
          "Design thinking is the ability to come up with captivating art designs",
          "Design thinking is the scientific approach to problem solving",
          "Design thinking is a human-centered approach to problem solving that starts with the users in mind and ends with a solution designed specially to meet their needs",
          "Design thinking is a branch of arts that deals with problem solving",
        ],
        answer: "C",
      },
      {
        question: "The following are the five stages of design thinking except",
        options: [
          "Empathy",
          "Define",
          "Ideation",
          "Prototype",
          "Communication",
          "Test",
        ],
        answer: "E",
      },
      {
        question:
          "Empathy is a ‐—------------------ into what —------------ feel",
        options: [
          "Step, citizens",
          "Peep, children",
          "Guess, people",
          "Journey, people",
        ],
        answer: "D",
      },
      {
        question: "In design thinking, are complex ideas good enough?",
        options: ["Yes", "No", "I'm not sure"],
        answer: "B",
      },
      {
        question: "What is the main goal of prototyping",
        options: [
          "To see if our solution is tangible and testable",
          "To make sure that our solution is beautiful",
          "To enhance our solution",
          "None of the above",
        ],
        answer: "A",
      },
    ],
    video_url:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/courses/design+thinking.mp4",
    duration: 1029,
    thumbnail_image:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/thumbnails-temp/design-thinking.svg",
  },
  {
    title: "SERVANT LEADERSHIP",
    description:
      "Servant leadership is all about serving first as a leader. It is the desire and willingness to serve others first that drives a servant leader to seek leadership positions.",
    objectives: [
      "Understand the definition of servant leadership",
      "Know the role of a servant leader",
      "Know who a leader is",
      "Know the qualities of a good servant leader",
      "Know the principles of servant leadership",
    ],
    questions: [
      {
        question: "A servant leader is a _____________",
        options: [
          "People-oriented person",
          "Strong-willed person",
          "Nelson Mandela follower",
          "Goal getter",
        ],
        answer: "A",
      },
      {
        question:
          "_____________ is the most important thing for a servant leader",
        options: [
          "Charisma",
          "Trust",
          "Willingness to serve",
          "The leadership staff",
        ],
        answer: "C",
      },
      {
        question:
          "“If you care for the people so much and long enough, success is definitely inevitable”. Do you agree with this statement as pertaining to a servant leader?",
        options: ["Yes", "No"],
        answer: "A",
      },
      {
        question:
          "The following are the principles of servant leadership except",
        options: ["Empathy", "Foresight", "Community builder", "Dictator"],
        answer: "D",
      },
      {
        question:
          "A community builder ensures that he/she builds a relationship with his followers and helps them grow.",
        options: ["Yes", "No", "I'm not sure"],
        answer: "A",
      },
    ],
    video_url:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/courses/servant+leadership.mp4",
    duration: 629,
    thumbnail_image:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/thumbnails-temp/servant-leadership.svg",
  },
  {
    title: "VISION BOARDING",
    description:
      "Vision boarding is made up of two keywords, vision and boarding. Vision boarding entails mapping out the future to see how it will look. This will help work a clear path towards achieving these goals.",
    objectives: [
      "Understand the key concepts in vision boarding",
      "Understand the meaning of a vision board",
      "Understand the need for a vision board",
      "Map out a personal vision board",
    ],
    questions: [
      {
        question: "What is vision?",
        options: [
          "Something that makes no sense",
          "Something that you want to happen to you, or something you want to do at a particular time",
          "Something that doesn't worth thinking about",
          "Something that helps one see clearly",
        ],
        answer: "B",
      },
      {
        question: "What is a vision board?",
        options: [
          "It is a physical representation of your goals",
          "It is the act of drawing a plan",
          "It is a imaginative representation of your goals",
          "It entails strategy",
        ],
        answer: "A",
      },
      {
        question: "Why do you need a vision board?",
        options: [
          "To clarify your goals",
          "For motivation",
          "To remind us of the things we need to achieve",
          "All of the above",
        ],
        answer: "D",
      },
      {
        question: "What are the steps involved in creating a vision board",
        options: [
          "Set SMART goals",
          "Make plans to achieve these goals",
          "Attach pictures to help you visualize where you are headed",
          "Attach quotes for motivation",
          "All of the above",
        ],
        answer: "E",
      },
      {
        question: "What are the types of vision boards?",
        options: [
          "Digital vision board",
          "Physical vision board",
          "None of the above",
          "All of the above",
        ],
        answer: "D",
      },
    ],
    video_url:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/courses/VISION+BOARD.mp4",
    duration: 393,
    thumbnail_image:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/thumbnails-temp/vision-boarding.svg",
  },
  {
    title: "SUSTAINABLE DEVELOPMENT GOALS (SDGS)",
    description:
      "The 17 interrelated Sustainable Development Goals is what the whole world is currently working towards achieving. These goals drive development making the world a much better place.",
    objectives: [
      "Understand and know the 17 Sustainable Development Goals",
      "Think of the solutions to some of the problems in their community in line with the SDGS.",
    ],
    questions: [
      {
        question: "How many Sustainable Development Goals do we have?",
        options: ["8", "20", "17", "15"],
        answer: "C",
      },
      {
        question:
          "__________ and ____________ is the number 1 and 2 SDGS respectively",
        options: [
          "No poverty, zero hunger",
          "Good health and well being, quality education",
          "Gender equality, clean water and sanitation",
          "Affordable and clean energy, decent work and economic growth",
        ],
        answer: "A",
      },
      {
        question: "Which of these goals will better be solved by agriculture?",
        options: [
          "Clean water and sanitation",
          "Gender equality",
          "Zero hunger",
          "Industry, innovation and infrastructure",
        ],
        answer: "C",
      },
      {
        question: "Are the SDGS interrelated?",
        options: ["Yes", "No", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question: "___________ is SDG 12",
        options: [
          "Responsible consumption and production",
          "Affordable and clean energy",
          "Peace, justice and strong institutions",
          "Life on land",
        ],
        answer: "A",
      },
    ],
    video_url:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/courses/sdg.mp4",
    duration: 1538,
    thumbnail_image:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/thumbnails-temp/sdgs.svg",
  },
  {
    title: "MONEY MANAGEMENT",
    description:
      "Money management whether personal or corporate is very important in growing our finances and wealth. To grow wealth, the mindset is very important.",
    objectives: [
      "Understand the concept of money",
      "Understand the indicator of wealth",
      "Understand the concepts of assets and liabilities",
      "Know the three buckets of money management",
    ],
    questions: [
      {
        question:
          "Money is anything generally accepted as a medium of exchange or as settlement of credit",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question: "Wealth is a mindset",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question:
          "An asset is anything that puts money in your hand while a liability is anything that takes money away from your hands.",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question: "The three buckets of money management include",
        options: [
          "Savings, investment, spending",
          "Savings, assets, dividend",
          "Investment, stocks, bonds",
          "Spending, shares, hedge fund",
        ],
        answer: "A",
      },
      {
        question: "Spending on knowledge is considered _______",
        options: [
          "A liability",
          "An investment",
          "An asset",
          "None of the above",
        ],
        answer: "A",
      },
    ],
    video_url:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/courses/EP+1+MONEY+MANAGEMENT.mp4",
    duration: 1331,
    thumbnail_image:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/thumbnails-temp/money-management.svg",
  },
  {
    title: "SOCIAL ENTREPRENEURSHIP",
    description:
      "Social entrepreneurship has to do with making money while impacting lives. It has to do with solving problems with our ideas, businesses etc. It is in solving the many problems that plagues society, a social entrepreneur finds money. The ultimate goal of a social entrepreneur is to impact lives.",
    objectives: [
      "Understand the concept of social entrepreneurship",
      "Know who a social entrepreneur is",
      "Understand the place of innovation in social entrepreneurship",
      "Know the steps in starting a social enterprise",
    ],
    questions: [
      {
        question:
          "Social entrepreneurship is derived from two words. Social means _____ while entrepreneurship means _______",
        options: [
          "Society, business",
          "Society, job",
          "Outgoing, business",
          "Environment, job",
        ],
        answer: "A",
      },
      {
        question:
          "Social entrepreneurship can be defined as business built for the sole purpose of making our society better.",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question: "As young persons, we have to be ________",
        options: [
          "Outgoing",
          "Innovative",
          "Entrepreneurs",
          "Problem starters",
        ],
        answer: "B",
      },
      {
        question:
          "The following are steps in starting a social enterprise except",
        options: [
          "Identify a problem in your society",
          "Do your research to know the cause of the problem",
          "Create your mission statement",
          "Build a team",
          "None of the above",
        ],
        answer: "E",
      },
      {
        question:
          "The money a social entrepreneur makes from impacting lives is used to _____",
        options: [
          "Sustain their initiative",
          "Build their investment portfolio",
          "Dash out to friends and family",
          "None of the above",
        ],
        answer: "A",
      },
      {
        question:
          "The following are the cues on creating a good social enterprise except",
        options: ["Where", "Who", "What", "Why", "How", "When"],
        answer: "B",
      },
    ],
    video_url:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/courses/SOCIAL+ENTREPRENEURSHIP.mp4",
    duration: 1056,
    thumbnail_image:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/thumbnails-temp/social-enterpreneurship.svg",
  },
  {
    title: "STORYTELLING FOR CHANGE",
    description:
      "Storytelling makes the invisible visible. Storytelling helps tell the world about the good that you are doing in your own little corner.",
    objectives: [
      "Know the importance of storytelling",
      "The challenges of storytelling",
      "Know how to tell your story using the ABT method",
    ],
    questions: [
      {
        question: "Stories help people see into your world",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question: "Storytelling grabs people's attention",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question:
          "Storytelling has the ability to elicit any emotion the storyteller wants from you",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question: "The following are the challenges of storytelling except",
        options: [
          "Sharing my story means I am proud",
          "Sharing a story without coherence",
          "None of the above",
          "All of the above",
        ],
        answer: "C",
      },
      {
        question: "ABT is an acronym for",
        options: [
          "At, Better, Time",
          "And, But, Therefore",
          "And, Better, Time",
          "At, But, Therefore",
        ],
        answer: "B",
      },
      {
        question: "Your stories should be short, precise and methodological",
        options: ["True", "False", "I'm not sure", "I don't know"],
        answer: "A",
      },
      {
        question: "The And in the ABT method of storytelling is _________",
        options: [
          "The first paragraph of the story",
          "A new idea in the story",
          "The introduction of the story",
          "The end of the story",
        ],
        answer: "C",
      },
      {
        question: "The B in the ABT method of storytelling is ________",
        options: [
          "The introduction of the story",
          "The introduction of the conflict",
          "The end of the story",
          "The second paragraph of the story",
        ],
        answer: "B",
      },
      {
        question: "The T in the ABT method of storytelling is _________",
        options: [
          "The action/ reaction to the conflict",
          "The end of the conflict",
          "The third paragraph of the story",
          "None of the above",
        ],
        answer: "A",
      },
    ],
    video_url:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/courses/storytelling+for+change.mp4",
    duration: 1515,
    thumbnail_image:
      "https://skill2rural.s3.eu-north-1.amazonaws.com/thumbnails-temp/story-telling.svg",
  },
];
const prisma = new PrismaClient();
async function main() {
  console.log("Seeding database");

  // Seed admin user
  console.log("Seeding admin user...");
  const hashedPassword = await bcrypt.hash(adminData.password, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminData.email },
    update: {},
    create: {
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      status: adminData.status,
      profile_photo: adminData.profile_photo,
    },
  });

  console.log(`Admin user created/updated: ${admin.email}`);

  // // Seed courses and questions
  // console.log("Seeding courses and questions...");

  // const coursesData = await Promise.all(
  //   courses.map(async (course) => {
  //     const courseData = await prisma.course.create({
  //       data: {
  //         title: course.title,
  //         description: course.description,
  //         objectives: course.objectives,
  //         video_url: course.video_url,
  //         duration: course.duration,
  //         thumbnail_image: course.thumbnail_image,
  //       },
  //     });

  //     await Promise.all(
  //       course.questions.map(async (question) => {
  //         await prisma.courseQuestion.create({
  //           data: {
  //             question: question.question,
  //             options: question.options,
  //             answer: answerMapping[question.answer],
  //             point: 5,
  //             course: {
  //               connect: {
  //                 id: courseData.id,
  //               },
  //             },
  //           },
  //         });
  //       }),
  //     );
  //     return courseData;
  //   }),
  // );

  // console.log(`Created ${coursesData.length} courses with questions`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// console.log(convertTimeToSeconds("9:56"));
