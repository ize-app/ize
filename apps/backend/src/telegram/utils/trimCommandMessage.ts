// remove first word (command) from prompt and all trailing leading spaces
export const trimCommandMessage = (prompt: string) => prompt.replace(/^\s*\S+\s*/, "").trim();
