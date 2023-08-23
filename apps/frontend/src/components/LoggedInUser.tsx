import { useContext } from "react";
import { CurrentUserContext } from "../contexts/current_user_context";
import { FragmentType, useFragment } from "../graphql/generated";
import { DiscordDataPartsFragmentDoc } from "../graphql/generated/graphql";

export const LoggedInUser: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  if (user == null) return null;

  const discordDataData = user?.discordData as FragmentType<typeof DiscordDataPartsFragmentDoc>;
  // eslint-disable-next-line react-hooks/rules-of-hooks -- not actually a hook
  const discordData = useFragment(DiscordDataPartsFragmentDoc, discordDataData);

  if (discordData == null) return null;

  return <div>Logged in as: {discordData.username}</div>;
};
