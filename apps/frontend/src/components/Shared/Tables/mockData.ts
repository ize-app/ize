import { addMinutes } from "../../../utils/inputs";
import { UserDataProps } from "../Avatar";
import { Process } from "../../../types";

// TODO: this is just the shape of the mock data - will change when we hydrate with real data
export interface RequestProps {
  requestId: string;
  name: string;
  process: Process.default;
  creator: UserDataProps;
  respond: UserDataProps[];
  expirationDate: Date;
  decisionType: string;
  userResponse: string | null;
  inputs: RequestInput[];
  options: string[];
  responses: Response[];
  result: Result;
}

export interface Response {
  user: UserDataProps;
  selection: Selection;
}

export interface ResponseCount {
  optionId: string;
  label: string;
  count: number;
}

export interface Selection {
  optionId: string;
  optionLabel: string;
  respondedAt: Date;
}

export interface Result {
  selection: Selection | null;
  responseCount: ResponseCount[];
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
  description: string;
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

export const processMockData: Process.default[] = [
  {
    processId: "1",
    name: "Manage @moderator role [Token Engineering Commons]",
    description:
      "This is a description of how ths process works. After a decision is completed in Cults, it triggers a custom action.",
    webhookUri: "www.zapier.com",
    inputs: [
      {
        inputId: "1a",
        name: "Discord username",
        description:
          "Discord handle of the individual you want to give permissions to",
        required: true,
        type: Process.ProcessInputType.Text,
      },
      {
        inputId: "1b",
        name: "Description",
        description: "Any rationale you want to add for this request",
        required: true,
        type: Process.ProcessInputType.Text,
      },
      {
        inputId: "1c",
        name: "Number field (test)",
        description: "number field for testing",
        required: true,
        type: Process.ProcessInputType.Number,
      },
    ],
    options: ["✅", "❌"],
    decision: {
      threshold: 5,
      thresholdType: Process.ThresholdTypes.Absolute,
      requestExpirationSeconds: 86400,
      quorum: { threshold: 0, thresholdType: Process.ThresholdTypes.Absolute },
    },
    roles: {
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
      edit: {
        name: "popp",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
    },
    userRoles: {
      request: true,
      respond: true,
      edit: true,
    },
  },
  {
    processId: "2",
    name: "Remove event from shared TEC calendar",
    description:
      "This process removes event from the hello@tecommons.org shared Google Calendar.",
    webhookUri: "www.zapier.com",
    inputs: [
      {
        inputId: "2a",
        name: "gCal event ID",
        description:
          "You can find the event ID in the google calendar URL. Copy and paste everthing after '../eventId/''",
        required: true,
        type: Process.ProcessInputType.Text,
      },
      {
        inputId: "2b",
        name: "Description",
        description: "Any rationale you want to add for this request",
        required: false,
        type: Process.ProcessInputType.Text,
      },
    ],
    options: ["✅", "❌"],
    decision: {
      threshold: 0.5,
      thresholdType: Process.ThresholdTypes.Percentage,
      requestExpirationSeconds: 259200,
      quorum: { thresholdType: Process.ThresholdTypes.Absolute, threshold: 10 },
    },
    roles: {
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
      edit: {
        name: "popp",
        avatarUrl:
          "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
      },
    },
    userRoles: {
      request: true,
      respond: true,
      edit: true,
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
    requestId: "0",
    name: "Send award to winner of the 9/12 annual TEC Hackathon in Miami",
    process: processMockData[0],
    creator: {
      name: "popp",
      avatarUrl:
        "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
    },
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
    responses: [
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "abc",
          optionLabel: "✅",
          respondedAt: new Date(),
        },
      },
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "def",
          optionLabel: "❌",
          respondedAt: new Date(),
        },
      },
    ],
    result: {
      selection: {
        optionId: "abc",
        optionLabel: "✅",
        respondedAt: new Date(),
      },
      responseCount: [
        { optionId: "abc", label: "✅", count: 5 },
        { optionId: "def", label: "❌", count: 2 },
      ],
    },
  },
  {
    requestId: "1",
    name: "Give @tsully the @moderator role",
    process: processMockData[0],
    creator: {
      name: "tsully",
      avatarUrl:
        "https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png?size=128",
    },
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
    responses: [
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "abc",
          optionLabel: "✅",
          respondedAt: new Date(),
        },
      },
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "def",
          optionLabel: "❌",
          respondedAt: new Date(),
        },
      },
    ],
    result: {
      selection: {
        optionId: "abc",
        optionLabel: "✅",
        respondedAt: new Date(),
      },
      responseCount: [
        { optionId: "abc", label: "✅", count: 5 },
        { optionId: "def", label: "❌", count: 2 },
      ],
    },
  },
  {
    requestId: "2",
    name: "Cancel next week's team stand-up meeting for more focus time",
    process: processMockData[1],
    creator: {
      name: "fake user",
      avatarUrl: "",
    },

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
    responses: [
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "abc",
          optionLabel: "✅",
          respondedAt: new Date(),
        },
      },
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "def",
          optionLabel: "❌",
          respondedAt: new Date(),
        },
      },
    ],
    result: {
      selection: {
        optionId: "abc",
        optionLabel: "✅",
        respondedAt: new Date(),
      },
      responseCount: [
        { optionId: "abc", label: "✅", count: 5 },
        { optionId: "def", label: "❌", count: 2 },
      ],
    },
  },
  {
    requestId: "3",
    name: "Add Delphi veToken article to curated resources",
    process: processMockData[1],
    creator: {
      name: "Trey Anastasio",
      avatarUrl: "",
    },

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
    responses: [
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "abc",
          optionLabel: "✅",
          respondedAt: new Date(),
        },
      },
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "def",
          optionLabel: "❌",
          respondedAt: new Date(),
        },
      },
    ],
    result: {
      selection: {
        optionId: "abc",
        optionLabel: "✅",
        respondedAt: new Date(),
      },
      responseCount: [
        { optionId: "abc", label: "✅", count: 5 },
        { optionId: "def", label: "❌", count: 2 },
      ],
    },
  },
  {
    requestId: "4",
    name: "Add Delphi veToken article to curated resources",
    process: processMockData[1],
    creator: {
      name: "Trey Anastasio",
      avatarUrl: "",
    },
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
    responses: [
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "abc",
          optionLabel: "✅",
          respondedAt: new Date(),
        },
      },
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "def",
          optionLabel: "❌",
          respondedAt: new Date(),
        },
      },
    ],
    result: {
      selection: {
        optionId: "abc",
        optionLabel: "✅",
        respondedAt: new Date(),
      },
      responseCount: [
        { optionId: "abc", label: "✅", count: 5 },
        { optionId: "def", label: "❌", count: 2 },
      ],
    },
  },
  {
    requestId: "",
    name: "Add Delphi veToken article to curated resources",
    process: processMockData[0],
    creator: {
      name: "Trey Anastasio",
      avatarUrl: "",
    },
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
    responses: [
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "abc",
          optionLabel: "✅",
          respondedAt: new Date(),
        },
      },
      {
        user: {
          avatarUrl:
            "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
          name: "popp",
        },
        selection: {
          optionId: "def",
          optionLabel: "❌",
          respondedAt: new Date(),
        },
      },
    ],
    result: {
      selection: {
        optionId: "abc",
        optionLabel: "✅",
        respondedAt: new Date(),
      },
      responseCount: [
        { optionId: "abc", label: "✅", count: 5 },
        { optionId: "def", label: "❌", count: 2 },
      ],
    },
  },
];
