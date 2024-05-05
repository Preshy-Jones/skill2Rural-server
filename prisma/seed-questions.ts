import { PrismaClient } from "@prisma/client";

const questions = [
  {
    question: "What is design thinking?",
    answer: 2,
    point: 4,
    options: [
      "Design thinking is the ability to come up with captivating art designs",
      "Design thinking is the scientific approach to problem solving",
      "Design thinking is a human-centered approach to problem solving that starts with the users in mind and ends with a solution designed specially to meet their needs",
      "Design thinking is a branch of arts that deals with problem solving",
    ],
  },
  {
    question: "The following are the five stages of design thinking except",
    answer: 5,
    point: 3,
    options: [
      "Empathy",
      "Define",
      "Ideation",
      "Prototype",
      "Communication",
      "Test",
    ],
  },
  {
    question: "Empathy is a ________ into what ________ feel",
    answer: 3,
    point: 2,
    options: [
      "Step, citizens",
      "Peep, children",
      "Guess, people",
      "Journey, people",
    ],
  },
  {
    question: "In design thinking, are complex ideas good enough?",
    answer: 1,
    point: 5,
    options: ["Yes", "No", "I'm not sure"],
  },
  {
    question: "What is the main goal of prototyping?",
    answer: 0,
    point: 1,
    options: [
      "To see if our solution is tangible and testable",
      "To make sure that our solution is beautiful",
      "To enhance our solution",
      "None of the above",
    ],
  },
  {
    question: "A servant leader is a _____________",
    answer: 0,
    point: 3,
    options: [
      "People-oriented person",
      "Strong-willed person",
      "Nelson Mandela follower",
      "Goal getter",
    ],
  },
  {
    question: "_____________ is the most important thing for a servant leader",
    answer: 1,
    point: 4,
    options: [
      "Charisma",
      "Trust",
      "Willingness to serve",
      "The leadership staff",
    ],
  },
  {
    question:
      "“If you care for the people so much and long enough, success is definitely inevitable”. Do you agree with this statement as pertaining to a servant leader?",
    answer: 0,
    point: 2,
    options: ["Yes", "No"],
  },
  {
    question: "The following are the principles of servant leadership except",
    answer: 3,
    point: 1,
    options: ["Empathy", "Foresight", "Community builder", "Dictator"],
  },
  {
    question:
      "A community builder ensures that he/she builds a relationship with his followers and helps them grow.",
    answer: 0,
    point: 5,
    options: ["Yes", "No", "I'm not sure"],
  },
  {
    question: "What is vision?",
    answer: 3,
    point: 2,
    options: [
      "Something that makes no sense",
      "Something that you want to happen to you, or something you want to do at a particular time",
      "Something that doesn't worth thinking about",
      "Something that helps one see clearly",
    ],
  },
  {
    question: "What is a vision board?",
    answer: 0,
    point: 1,
    options: [
      "It is a physical representation of your goals",
      "It is the act of drawing a plan",
      "It is an imaginative representation of your goals",
      "It entails strategy",
    ],
  },
  {
    question: "Why do you need a vision board?",
    answer: 3,
    point: 4,
    options: [
      "To clarify your goals",
      "For motivation",
      "To remind us of the things we need to achieve",
      "All of the above",
    ],
  },
  {
    question: "What are the steps involved in creating a vision board?",
    answer: 4,
    point: 5,
    options: [
      "Set SMART goals",
      "Make plans to achieve these goals",
      "Attach pictures to help you visualize where you are headed",
      "Attach quotes for motivation",
      "All of the above",
    ],
  },
  {
    question: "What are the types of vision boards?",
    answer: 3,
    point: 3,
    options: [
      "Digital vision board",
      "Physical vision board",
      "None of the above",
      "All of the above",
    ],
  },
  {
    question: "Stories help people see into your world",
    answer: 0,
    point: 2,
    options: ["True", "False", "I'm not sure", "I don't know"],
  },
  {
    question: "Storytelling grabs people's attention",
    answer: 0,
    point: 4,
    options: ["True", "False", "I'm not sure", "I don't know"],
  },
  {
    question:
      "Storytelling has the ability to elicit any emotion the storyteller wants from you",
    answer: 0,
    point: 3,
    options: ["True", "False", "I'm not sure", "I don't know"],
  },
  {
    question: "The following are the challenges of storytelling except",
    answer: 2,
    point: 1,
    options: [
      "Sharing my story means I am proud",
      "Sharing a story without coherence",
      "None of the above",
      "All of the above",
    ],
  },
  {
    question: "ABT is an acronym for",
    answer: 1,
    point: 5,
    options: [
      "At, Better, Time",
      "And, But, Therefore",
      "And, Better, Time",
      "At, But, Therefore",
    ],
  },
  {
    question: "Your stories should be short, precise and methodological",
    answer: 0,
    point: 3,
    options: ["True", "False", "I'm not sure", "I don't know"],
  },
  {
    question: "The And in the ABT method of storytelling is _________",
    answer: 2,
    point: 2,
    options: [
      "The second paragraph of the story",
      "A new idea in the story",
      "The introduction of the story",
      "The end of the story",
    ],
  },
  {
    question: "The B in the ABT method of storytelling is ________",
    answer: 1,
    point: 4,
    options: [
      "The introduction of the story",
      "The introduction of the conflict",
      "The end of the story",
      "The second paragraph of the story",
    ],
  },
  {
    question: "The T in the ABT method of storytelling is _________",
    answer: 0,
    point: 1,
    options: [
      "The action/ reaction to the conflict",
      "The end of the conflict",
      "The third paragraph of the story",
      "None of the above",
    ],
  },
];

const prisma = new PrismaClient();
async function main() {
  //seed dummy questions randomly

  //get all courses
  const courses = await prisma.course.findMany();

  // for each course, add random questions between ranges 5-10
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const number_of_questions = Math.floor(Math.random() * 6) + 5;
    for (let j = 0; j < number_of_questions; j++) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      await prisma.courseQuestion.create({
        data: {
          question: randomQuestion.question,
          answer: randomQuestion.answer,
          point: randomQuestion.point,
          options: {
            set: randomQuestion.options,
          },
          course: {
            connect: {
              id: course.id,
            },
          },
        },
      });
    }
  }
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
