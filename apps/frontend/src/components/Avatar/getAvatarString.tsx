const findFirstLetter = (name: string): string => {
  const firstOccurence = name.search("[a-zA-Z]");
  if (firstOccurence === -1) return name[0];
  else return name[firstOccurence];
};

export const getAvatarString = (name: string) => {
  return `${findFirstLetter(name.split(" ")[0])}${
    name.split(" ").length > 1 ? findFirstLetter(name.split(" ")[1]) : ""
  }`;
};
