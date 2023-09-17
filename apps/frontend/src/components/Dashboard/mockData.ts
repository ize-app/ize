import { addMinutes } from "../../utils/inputs";
import { UserDataProps } from "../shared/Avatar";

// TODO: this is just the shape of the mock data - will change when we hydrate with real data
export interface RequestProps {
  requestId: string;
  process: string;
  request: string;
  creator: UserDataProps[];
  respond: UserDataProps[];
  expirationDate: Date;
  decisionType: string;
  userResponse: string | null;
}

interface RightsProps {
  request: UserDataProps[];
  respond: UserDataProps[];
  edit: UserDataProps[];
}

interface UserRightsProps {
  request: boolean;
  respond: boolean;
  edit: boolean;
}

export interface ProcessProps {
  processId: string;
  name: string;
  rights: RightsProps;
  userRights: UserRightsProps;
}

export const requestMockData: RequestProps[] = [
  {
    requestId: "1",
    request: "Send award to winner of the 9/12 annual TEC Hackathon in Miami",
    process: "Send ETH from TEC treasury",
    creator: [
      {
        name: "popp",
        url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
    ],
    respond: [
      {
        name: "@core-team",
        url: "",
      },
    ],
    expirationDate: addMinutes(new Date(), 30),
    decisionType: "Threshold",
    userResponse: null,
  },
  {
    requestId: "2",
    request: "Give @tsully the @moderator role",
    process: "Manage @moderator role [Token Engineering Commons]",
    creator: [
      {
        name: "tsully",
        url: "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    respond: [
      {
        name: "@core-team",
        url: "",
      },
    ],
    expirationDate: addMinutes(new Date(), 180),
    decisionType: "Threshold",
    userResponse: null,
  },
  {
    requestId: "3",
    request: "Cancel next week's team stand-up meeting for more focus time",
    process: "Update TEC shared calendar",
    creator: [
      {
        name: "fake user",
        url: "",
      },
    ],
    respond: [
      {
        name: "popp",
        url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "tsully",
        url: "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), 60 * 48),
    decisionType: "Threshold",
    userResponse: null,
  },
  {
    requestId: "4",
    request: "Add Delphi veToken article to curated resources",
    process: "Flag library resource as curated",
    creator: [
      {
        name: "Trey Anastasio",
        url: "",
      },
    ],
    respond: [
      {
        name: "popp",
        url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "tsully",
        url: "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), -60 * 72),
    decisionType: "Threshold",
    userResponse: "✅ Yes",
  },
  {
    requestId: "5",
    request: "Add Delphi veToken article to curated resources",
    process: "Flag library resource as curated",
    creator: [
      {
        name: "Trey Anastasio",
        url: "",
      },
    ],
    respond: [
      {
        name: "popp",
        url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "tsully",
        url: "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), 60 * 6),
    decisionType: "Threshold",
    userResponse: "✅ Yes",
  },
  {
    requestId: "6",
    request: "Add Delphi veToken article to curated resources",
    process: "Flag library resource as curated",
    creator: [
      {
        name: "Trey Anastasio",
        url: "",
      },
    ],
    respond: [
      {
        name: "popp",
        url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "t sully",
        url: "",
      },
      {
        name: "tsully",
        url: "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), -60 * 6),
    decisionType: "Threshold",
    userResponse: null,
  },
];

export const processMockData: ProcessProps[] = [
  {
    processId: "1",
    name: "Manage @moderator role [Token Engineering Commons]",
    rights: {
      request: [
        { name: "@core-team", url: "" },
        { name: "@admin", url: "" },
      ],
      respond: [
        { name: "@core-team", url: "" },
        {
          name: "tsully",
          url: "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
        },
        {
          name: "popp",
          url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
        },
        {
          name: "David Feinerman",
          url: "",
        },
      ],
      edit: [
        {
          name: "popp",
          url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
        },
      ],
    },
    userRights: {
      request: true,
      respond: true,
      edit: true,
    },
  },
  {
    processId: "1",
    name: "Manage @admin role [Token Engineering Commons]",
    rights: {
      request: [{ name: "@admin", url: "" }],
      respond: [{ name: "@admin", url: "" }],
      edit: [
        {
          name: "popp",
          url: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
        },
      ],
    },
    userRights: {
      request: false,
      respond: false,
      edit: false,
    },
  },
];
