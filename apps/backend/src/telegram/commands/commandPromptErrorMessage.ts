import { FlowConfigGeneration } from "@/core/flow/generateFlowArgs/generateNonreusableFlowConfig/generateNonreusableFlowConfig";

type CommandErrorMessages = Record<keyof typeof FlowConfigGeneration, string>;

export const commandPromptErrorMessage: CommandErrorMessages = {
  [FlowConfigGeneration.Synthesize]:
    "Add a prompt to the command. For example:\n<i>/synthesize What's the vibe?</i> \n\nChat members will respond to this question and then AI will summarize the responses into a summary.",
  [FlowConfigGeneration.Ideate]:
    "Add a prompt to the command. For example:\n<i>/ideate Where should we go for the next team retreat?</i> \n\nChat members will respond to this question and then AI will summarize the responses into a list of unique ideas.",
  [FlowConfigGeneration.LetAiDecide]:
    "Add a prompt to the command. For example:\n<i>/let_ai_decide What feature should we build next?</i> \n\nChat members will respond to this question with their opinion and rationale. The AI will then take these ideas and decide the best option.",
  [FlowConfigGeneration.CocreatePoll]:
    "Add a prompt to the command. For example:\n<i>/cocreate_poll What should our top agenda item be for this meeting?</i> \n\nChat members will respond to this question with their ideas. AI will then create a poll with the unique list of ideas",
};
