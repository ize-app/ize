import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import Head from "@/layout/Head";
import { IzeLogoBackground } from "@/layout/IzeLogoBackground";

export const About = () => {
  return (
    <>
      <Head title={"About"} description={"Ize 👀: The Art of Collective Attention"} />

      <IzeLogoBackground>
        <Box
          sx={(theme) => ({
            //   display: "flex",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   backgroundColor: "white",
            background: "rgba(255, 255, 255, 0.95)",
            padding: "60px",
            width: "75%",
            borderRadius: "10px",
            [theme.breakpoints.down("sm")]: { width: "90%", padding: "36px" },
          })}
        >
          <Typography variant="h1">Ize: The Collaboration Engine</Typography>
          <p>
            The human brain isn&#39;t cut out for modern online collaboration. Whereas our ancestors
            collaborated in a single time and place, modern collaboration is spread across the
            boundaries of teams, time and tools.{" "}
          </p>
          <p>
            Our attention is spread too thin, and this breaks both our ability to facilitate and
            participate in online collaboration. We are burnt out and bottlenecked, our collective
            energies are being scattered in a flurry of irrelevant notifications.{" "}
          </p>
          <p>
            The limits of online collaboration is an immeasurable waste of human energy, but it also
            severely limits our ability to build new power structures and modes of harnessing
            collective wisdom. We feel these limits across all online communities, whether they be
            activist networks, remote startups, or democracies.
          </p>
          <p>
            How do we build collaboration tools that understand our most precious
            resource—attention? The answer isn’t another one-size-fits-all platform that tries to do
            everything poorly. It’s about weaving together disconnected teams, tools, and workflows
            in a way that actually frees up our mental space and lets us focus on what matters.
          </p>
          <h1 id="introducing-ize">Introducing Ize 👀</h1>
          <p>
            Ize is a collaboration engine. It dramatically reduces the cognitive load of online
            collaboration via two complementary parts.{" "}
          </p>
          <ol>
            <li>
              <strong>Facilitation</strong>: An open source language and ecosystem for defining and
              automating complex collaborative process across teams, time, and tools.{" "}
            </li>
            <li>
              <strong>Participation</strong>: Infrastructure to get people&#39;s attention on
              collaborative process when it matters most.{" "}
            </li>
          </ol>
          <p>Let&#39;s dive into both:</p>
          <h2 id="facilitation">Facilitation</h2>
          <p>
            Ize is an open source language and plug-in ecosystem for automating the facilitation of
            collaborative process. Through automation, we can make complex interactions between
            time, teams, and tools trivial to facilitate.{" "}
          </p>
          <p>
            The key to seeing how this automation could be possible is observing that collaboration
            has a common form. &quot;Collaboration&quot; could mean making decisions, synthesizing
            opinions, giving someone access to shared resources (money, permissions), etc. The
            common form is:
          </p>
          <ol>
            <li>A collaborative process is triggered by a team or individual.</li>
            <li>
              Participants respond—this could be a vote, a free-form input, ranked choice, etc
            </li>
            <li>
              The responses are aggregated into a result, such as a decision or an AI summary.
            </li>
            <li>
              An action is triggered, like approving an expense, posting a tweet, or starting a new
              step in the process.
            </li>
          </ol>
          <p>
            In Ize, this common form of facilitated collaboration is defined via the language of{" "}
            <em>flows</em>. Flows describe a reusable collaborative process works that can span
            teams, time, and tools. A flow could define, for example:
          </p>
          <ul>
            <li>
              How a DAO&#39;s NFT holders and an activist group&#39;s Telegram channel can have a
              shared AI-assisted sensemaking process
            </li>
            <li>
              How a team can approve reimbursements from a shared expense account without needing to
              rely on their manager.
            </li>
            <li>How members of a Discord server can elects and chooses moderators</li>
          </ul>
          <p>
            By having a common language for defining collaborative flows, collaboration can be
            automated. In the same way a <a href="https://about.gitlab.com/topics/ci-cd/">CI/CD</a>{" "}
            workflow can automate complicated process for deploying code, we can do the same thing
            with collaborative flows.{" "}
          </p>
          <p>
            Flows are both an open source process language and a plug-in ecosystem for building new
            kinds of collaborative process. Exotic sensemaking processes like{" "}
            <a href="https://en.wikipedia.org/wiki/Quadratic_voting">quadratic voting</a>,
            canvas-based brainstorming, or reputation-based compensation will simply be modules in
            the Ize ecosystem.{" "}
          </p>
          <p>
            By explicitly defining process via flows, Ize makes it legible both what happened in the
            past and how process can change in the future.{" "}
          </p>
          <p>
            Ize flows are built to evolve as needs change. The process to evolve a flow is, itself,
            a collaborative flow Everything in Ize happens via collaborative flows. There is no
            concept of an &quot;admin&quot; in Ize. It&#39;s flows <em>all the way down</em> 🐢.
          </p>
          <h2 id="participation">Participation</h2>
          <p>
            But automating collaborative process is only valuable if you can get the relevant people
            to pay attention to it when it counts. Considering how fragmented our individual
            attention is, focusing collective attention is an exceptionally difficult to task.{" "}
          </p>
          <p>
            Ize flows are, in essence, a standardized language for requesting each other&#39;s
            attention. An open standard for requesting attention gives us full control over how
            these requests are filtered, prioritized, and consumed.{" "}
          </p>
          <p>
            In Ize, it is trivial to filter out requests for attention where you are not explicitly
            being asked for input, requests that have expired, or requests that already have an
            outcome and no longer need attention.{" "}
          </p>
          <p>
            Individuals and teams are in full control of what they choose to pay attention to, or{" "}
            <em>watch</em> in Ize terminology 👀. The process of teams deciding what they want to
            pay attention to and how they want to receive notifications is itself defined through
            Ize flows. <em>Everything</em> in Ize happens through collaborative flows.{" "}
          </p>
          <p>
            Individuals and teams to consume requests for attention wherever they prefer. Instead of
            being yet another tool to monitor, the vision of Ize is to live as infrastructure in the
            background. Individuals might choose to interact with Ize via SMS or a Discord bot,
            whereas a team might choose to primarily interact with Ize via Telegram, Slack, or
            embedded into Notion. Other applications will use Ize as the collaborative
            infrastructure that runs under the hood of their app.
          </p>
          <h1 id="harnessing-our-collective-energy">Harnessing our Collective Energy</h1>
          <p>
            Ize drastically reduces the mental overhead of both facilitating and participating in
            online collaboration. Ize&#39;s generalized language of collaboration allows complex
            collaboration across teams, time and tools to be automated. This language creates a
            standard for how we request each other&#39;s attention, which allows individuals and
            teams to be full control of how they spend this limited resource.{" "}
          </p>
          <p>
            As a collaboration engine, Ize allows us to harness our collective energies. It helps us
            unblock each other, enable new modes of collaboration, and ultimately build something
            much bigger than ourselves.
          </p>
          <p>...</p>
          <p>
            If this sounds interesting to you - whether you&#39;re a builder, activist, open source
            maintainer, investor, whatever - we&#39;d love to hear from you.
          </p>
          <p>
            <a href="mailto:harmon@ize.space">harmon@ize.space</a>
          </p>
        </Box>
      </IzeLogoBackground>
    </>
  );
};
