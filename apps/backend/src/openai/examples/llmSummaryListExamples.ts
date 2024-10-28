interface LlmSummaryListExample {
  question: string;
  responses: string[];
  output: {
    items: string[];
  };
}

export const llmSummaryListExamples: LlmSummaryListExample[] = [
  {
    question: "How do you gather customer feedback effectively?",
    responses: [
      "Surveys are a great way to gather feedback from a large number of customers quickly and efficiently.",
      "You can use online surveys to reach a wide audience.",
      "Customer interviews provide in-depth insights into their experiences and preferences.",
      "Social media can be a valuable feedback tool, offering real-time responses and engagement.",
      "Focus groups allow for detailed discussions and can uncover insights that surveys might miss.",
      "Online surveys are convenient and efficient, allowing customers to respond at their own pace.",
      "Interviews can give you detailed information about specific aspects of your product or service.",
      "Social media feedback is immediate and widespread, making it easy to identify trends and common issues.",
      "Focus groups offer detailed and diverse opinions, providing a well-rounded view of customer sentiments.",
    ],
    output: {
      items: ["Surveys", "Customer interviews", "Social media feedback", "Focus groups"],
    },
  },
  {
    question: "What activities should we plan for the weekend?",
    responses: [
      "We could go hiking in the nearby trails. It's a great way to enjoy nature and get some exercise.",
      "How about a movie marathon? We can watch all the latest releases and some classic favorites.",
      "A barbecue in the backyard would be fun. We can grill some delicious food and enjoy the weather.",
      "Let's visit a local museum. It's educational and interesting.",
      "We could have a game night. Board games, card games, and video games would be a blast.",
      "Hiking sounds great. We can explore new trails and enjoy the fresh air.",
      "A movie marathon would be perfect for a relaxing weekend.",
      "A barbecue would be a great way to spend time together and enjoy good food.",
      "Visiting a museum would be a nice change of pace and we can learn something new.",
    ],
    output: {
      items: ["Hiking", "Movie marathon", "Barbecue", "Museum visit", "Game night"],
    },
  },
];

//   {
//     question: "What are the benefits and challenges of starting a new business?",
//     responses: [
//       "Starting a new business can be very rewarding, especially when you see your ideas come to life and succeed in the market.",
//       "It requires a lot of hard work and dedication.",
//       "You have the freedom to implement your own ideas and strategies without any external constraints.",
//       "There is a significant financial risk involved, which can be daunting for many entrepreneurs.",
//       "It can be stressful managing all aspects of the business, from operations to marketing and finance.",
//       "The potential for high profits is a major benefit.",
//       "You need to be prepared for potential failure, as not all businesses succeed.",
//       "Hard work and dedication are essential for overcoming the numerous challenges you will face.",
//       "Financial risk is a major challenge that can affect your personal and professional life.",
//     ],
//     output: {
//       items: [
//         "Rewarding",
//         "Hard work and dedication",
//         "Freedom to implement ideas",
//         "Financial risk",
//         "Stressful management",
//         "Potential for high profits",
//       ],
//     },
//   },
