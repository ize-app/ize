export const AddToServer = () => {
  return (
    <a
      target="_blank"
      href={
        // This url is similar to the oauth url in server.ts but adds a bot a server that the user has permissions to add the bot to
        // permissions=8 means the bot will have admin permissions on the server
        // scope=bot means the bot will be added to the server
        // the client id is the id of the bot/app
        // TODO: Put client ID in to a .env file
        "https://discord.com/api/oauth2/authorize?client_id=1129641431057825844&permissions=8&scope=bot"
      }
    >
      Add Cults To Your Server
    </a>
  );
};
