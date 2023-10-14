import { addMinutes } from "../../../utils/inputs";
import { UserDataProps } from "../Avatar";

// TODO: this is just the shape of the mock data - will change when we hydrate with real data
export interface RequestProps {
  requestId: string;
  name: string;
  process: ProcessProps;
  creator: UserDataProps[];
  respond: UserDataProps[];
  expirationDate: Date;
  decisionType: string;
  userResponse: string | null;
  inputs: RequestInput[];
  options: string[];
}

export interface RequestInput {
  property: string;
  value: string | number;
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

export interface GroupProps {
  groupId: string;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  type: "Discord server" | "Discord role";
  memberCount: number;
  parentGroup?: GroupProps;
}

export const processMockData: ProcessProps[] = [
  {
    processId: "1",
    name: "Manage @moderator role [Token Engineering Commons]",
    rights: {
      request: [
        {
          name: "@core-team",
          avatarUrl: "",
          parent: {
            name: "Token Engineering Commons",
            avatarUrl:
              "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
          },
        },
        {
          name: "@admin",
          avatarUrl: "",
          parent: {
            name: "Token Engineering Commons",
            avatarUrl:
              "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
          },
        },
        {
          name: "@dev",
          avatarUrl: "",
          parent: {
            name: "Token Engineering Commons",
            avatarUrl:
              "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
          },
        },
      ],
      respond: [
        {
          name: "@core-team",
          avatarUrl: "",
          parent: {
            name: "Token Engineering Commons",
            avatarUrl:
              "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
          },
        },
        {
          name: "tsully",
          avatarUrl:
            "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
        },
        {
          name: "popp",
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
        },
        {
          name: "David Feinerman",
          avatarUrl: "",
        },
      ],
      edit: [
        {
          name: "popp",
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
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
    processId: "2",
    name: "Manage @admin role [Token Engineering Commons]",
    rights: {
      request: [
        {
          name: "@admin",
          avatarUrl: "",
          parent: {
            name: "Token Engineering Commons",
            avatarUrl:
              "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
          },
        },
      ],
      respond: [
        {
          name: "@admin",
          avatarUrl: "",
          parent: {
            name: "Token Engineering Commons",
            avatarUrl:
              "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
          },
        },
      ],
      edit: [
        {
          name: "popp",
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
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

export const groupMockData: GroupProps[] = [
  {
    groupId: "1",
    name: "Token Engineering Commons",
    bannerUrl: "/test-banner.webp",
    avatarUrl:
      "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
    type: "Discord server",
    memberCount: 120,
  },
  {
    groupId: "2",
    name: "@core-team",
    type: "Discord role",
    avatarUrl: "",
    bannerUrl: "/test-banner.webp",
    memberCount: 23,
    parentGroup: {
      groupId: "1",
      name: "Token Engineering Commons",
      bannerUrl: "/test-banner.webp",
      avatarUrl:
        "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
      type: "Discord server",
      memberCount: 120,
    },
  },
  {
    groupId: "3",
    name: "@test-team",
    type: "Discord role",
    bannerUrl: "/test-banner.webp",
    avatarUrl: "",
    memberCount: 23,
    parentGroup: {
      groupId: "1",
      name: "Token Engineering Commons",
      bannerUrl: "/test-banner.webp",
      avatarUrl:
        "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
      type: "Discord server",
      memberCount: 120,
    },
  },
];

export const requestMockData: RequestProps[] = [
  {
    requestId: "1",
    name: "Send award to winner of the 9/12 annual TEC Hackathon in Miami",
    process: processMockData[0],
    creator: [
      {
        name: "popp",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
    ],
    respond: [
      {
        name: "@core-team",
        avatarUrl: "",
      },
    ],
    expirationDate: addMinutes(new Date(), 30),
    decisionType: "Threshold",
    userResponse: null,
    inputs: [
      { property: "Eth address", value: "0x..123abc123def" },
      { property: "Email", value: "tyler@cults.app" },
      { property: "Eth amount", value: 4 },
    ],
    options: ["✅", "❌"],
  },
  {
    requestId: "2",
    name: "Give @tsully the @moderator role",
    process: processMockData[0],
    creator: [
      {
        name: "tsully",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    respond: [
      {
        name: "@core-team",
        avatarUrl: "",
      },
    ],
    expirationDate: addMinutes(new Date(), 180),
    decisionType: "Threshold",
    userResponse: null,
    inputs: [
      { property: "Eth address", value: "0x..123abc123def" },
      { property: "Email", value: "tyler@cults.app" },
      { property: "Eth amount", value: 4 },
    ],
    options: [
      "This is a long option. Trying to see how what long text looks like. Gonna keep typing until there are an adequate number of words.",
      "Yet again trying to fill space. This one can be a little bit shorter though.",
      "✅",
      "❌",
    ],
  },
  {
    requestId: "3",
    name: "Cancel next week's team stand-up meeting for more focus time",
    process: processMockData[1],
    creator: [
      {
        name: "fake user",
        avatarUrl: "",
      },
    ],
    respond: [
      {
        name: "popp",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "tsully",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), 60 * 48),
    decisionType: "Threshold",
    userResponse: null,
    inputs: [
      { property: "Eth address", value: "0x..123abc123def" },
      { property: "Email", value: "tyler@cults.app" },
      { property: "Eth amount", value: 4 },
    ],
    options: [
      "This is a long option. Trying to see how what long text looks like. Gonna keep typing until there are an adequate number of words.",
      "Yet again trying to fill space. This one can be a little bit shorter though.",
    ],
  },
  {
    requestId: "4",
    name: "Add Delphi veToken article to curated resources",
    process: processMockData[1],
    creator: [
      {
        name: "Trey Anastasio",
        avatarUrl: "",
      },
    ],
    respond: [
      {
        name: "popp",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "tsully",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), -60 * 72),
    decisionType: "Threshold",
    userResponse: "✅ Yes",
    inputs: [
      { property: "Eth address", value: "0x..123abc123def" },
      { property: "Email", value: "tyler@cults.app" },
      { property: "Eth amount", value: 4 },
    ],
    options: ["✅", "❌"],
  },
  {
    requestId: "5",
    name: "Add Delphi veToken article to curated resources",
    process: processMockData[1],
    creator: [
      {
        name: "Trey Anastasio",
        avatarUrl: "",
      },
    ],
    respond: [
      {
        name: "popp",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "tsully",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), 60 * 6),
    decisionType: "Threshold",
    userResponse: "✅ Yes",
    inputs: [
      { property: "Eth address", value: "0x..123abc123def" },
      { property: "Email", value: "tyler@cults.app" },
      { property: "Eth amount", value: 4 },
    ],
    options: ["✅", "❌"],
  },
  {
    requestId: "6",
    name: "Add Delphi veToken article to curated resources",
    process: processMockData[0],
    creator: [
      {
        name: "Trey Anastasio",
        avatarUrl: "",
      },
    ],
    respond: [
      {
        name: "popp",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "t sully",
        avatarUrl: "",
      },
      {
        name: "tsully",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
      },
    ],
    expirationDate: addMinutes(new Date(), -60 * 6),
    decisionType: "Threshold",
    userResponse: null,
    inputs: [
      { property: "Eth address", value: "0x..123abc123def" },
      { property: "Email", value: "tyler@cults.app" },
      { property: "Eth amount", value: 4 },
    ],
    options: ["✅", "❌"],
  },
];
