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
            background: "rgba(255, 255, 255, 0.9)",
            padding: "30px",
            width: "75%",
            borderRadius: "10px",
            [theme.breakpoints.down("sm")]: { width: "90%" },
          })}
        >
          <Typography variant="h1">Ize 👀: The Art of Collective Attention</Typography>
          <p>
            <strong>TL;DR</strong> Ize is a platform for collaborative, cross-tool, evolutionary
            workflows. These workflows define how collaborators get shit done via collaborative
            workflows that span across tools, organizational boundaries, and online identities.
          </p>
          <p>
            <i>Everything</i> in Ize happens via workflows, including the process to evolve
            workflows as needs change. Our goal is to establish an open standard and plug-in
            ecosystem for defining collaborative workflows across various tools.
          </p>
          <p>
            Ize unlocks new possibilities for collective attention, intelligence, and power
            dynamics. If this vision excites you, email us at{" "}
            <a href="mailto:&#x68;&#97;&#114;&#109;&#111;&#x6e;&#x40;&#x69;&#122;&#101;&#46;&#x73;&#x70;&#97;&#x63;&#101;">
              &#x68;&#97;&#114;&#109;&#111;&#x6e;&#x40;&#x69;&#122;&#101;&#46;&#x73;&#x70;&#97;&#x63;&#101;
            </a>
            .
          </p>
          <a
            href={
              "https://www.loom.com/share/f02374b8562f4334b576667de74c0d60?sid=9eeacda6-55ee-4a11-827a-1d499e3be475"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out the Ize alpha demo
          </a>
          <br />
          <hr />
          <br />
          <br />
          <p>
            We are in a collective attention crisis. The human brain isn&#39;t cut out for the
            accelerating fragmentation, information overload, and change of modern life. This is
            especially true for modern online collaboration. While early humans could once count on
            a stable set of teammates, tools, and information, online collaboration is exponentially
            more complex.{" "}
          </p>
          <ul>
            <li>
              <strong>Fragmentation:</strong> Online work is fragmented across time, teams, tools.
              Seemingly simple tasks are complex puzzle of aligning schedules, tool permissions, and
              identifying key stakeholders.{" "}
            </li>
            <li>
              <strong>Noise:</strong> Online work is a torrent of irrelevant notifications. We
              struggle to pick out what deserves our attention or get the attention of others.
            </li>
            <li>
              <strong>Futility:</strong> Online work is disempowering and disconnected. We don&#39;t
              know how to make our voices heard or how to evolve processes that inevitably go stale
              and brittle in the accelerating change of the modern world.{" "}
            </li>
          </ul>
          <p>
            This dissipation of our collective attention is a immeasurable waste of our collective
            energy. To build anything meaningful together, we need to be focus our attention on the
            same thing at the same time.
          </p>
          <p>
            If software created the crisis of collective attention, could it somehow be used to fix
            it? Our current set of online tools only seem to make the problem worse. Each new tool
            is yet another demand on our limited attentional reserves.
          </p>
          <p>
            A solution would need to reduce our attentional overhead while enabling new modes of
            collaboration. It must be able to bridge otherwise disparate online identities, groups,
            and tools into something unified and coherent. It must be able to not only simply handle
            complexity, but also be able to adapt to quickly changing circumstances.
          </p>
          <h2 id="introducing-ize-👀">Introducing Ize 👀</h2>
          <p>
            Ize is the first platform for building and evolving collaborative workflows. A{" "}
            <strong>collaborative workflow</strong> defines how a group of people harness their
            collective attention to do a particular task. For example, you might define workflows to
            approve an expense, cancel a meeting that isn&#39;t a good use of team time, run a
            sprint retro, publish a blog post, change someone&#39;s Discord permissions, prioritize
            team objectives, etc.{" "}
          </p>
          <p>
            Workflows are a language for defining any set of arbitrary collaborative processes. This
            language defines:
          </p>
          <ul>
            <li>
              <strong>Requests:</strong> Who can trigger the workflow (e.g. a set of email
              addresses, Discord Roles, or NFTs) and what information needs to be provided to
              trigger the workflow.
            </li>
            <li>
              <strong>Response:</strong> Who can respond to a request and what response is being
              asked for - a vote, ranked priorities, a free text response, etc.
            </li>
            <li>
              <strong>Result:</strong> How those responses come to a final output (e.g. a decision,
              an LLM summary, etc) and action (e.g. take an action in another platform, trigger a
              webhook, evolve a workflow).
            </li>
          </ul>
          <p>
            By making collaborative process explicit, we can signal for and filter by{" "}
            <em>relevance</em>. Ize workflows make it clear whether you are actually relevant for
            any given process, whether your input is still needed, specifically what input you are
            being asked to give, and how time-sensitive that workflow is. Being able to filter by
            relevance is a critical step out of the collective attention crisis.
          </p>
          <p>
            Explicitly defining collaborative process also introduces radical new possibilities for
            how power can flow and how collective intelligence can be harnessed. Teams can take
            action without being blocked by bottlenecks. Leaders can regain sanity with transparent,
            auditable process. Contributors can quickly find discover ways to take action and make
            their voice heard. Organizers can craft coalitions across inter/intra organizational
            boundaries.
          </p>
          <p>
            Defining collaborative process explicitly also includes the process to change process.
            With the accelerating pace of change of modern life, any collaborative process needs to
            be able to quickly adapt. Ize workflows are built for change. The process to evolve a
            workflow is, itself, a collaborative workflow. In fact, everything in Ize is a workflow.
            There is no concept of an &quot;admin&quot; in Ize. It&#39;s workflows{" "}
            <em>all the way down</em> 🐢.{" "}
          </p>
          <p>
            Because the fundamental unit of Ize is the &quot;workflow&quot; rather than an
            &quot;organization&quot;, Ize is structured closer to a mycelial network than a{" "}
            <a
              href={"https://osf.io/preprints/mediarxiv/sf432"}
              target="_blank"
              rel="noopener noreferrer"
            >
              traditional SaaS dominator hierarchy.
            </a>
            . Ize workflows can combine otherwise online identities and groups into a coherent
            process. For example, an &quot;Approve expense&quot; workflow could be triggered by a
            Discord server&#39;s @contributor role, approved by holders of a particular Hats NFT,
            and evolved by a set of email addresses.
          </p>
          <p>
            This mycelial network extends to how Ize evolves itself over the time. The vision is for
            Ize to become an open standard and plugin ecosystem for defining collaborative process.
            Teams will interact with Ize natively within their existing toolset.
          </p>
          <p>
            Ize is a paradigm shift in collaborative tooling. It is cross-tool, distributed,
            asynchronous, and evolutionary. Though it is a new category of tool, it draws
            inspiration from its predecessors. It&#39;s like a DAO tool (Snapshot, DAOHaus), but
            with task-specific, highly-flexible, evolutionary subDAOs. It&#39;s like an automation
            tool (Zapier, Pipedream), but for collaborative workflows rather than purely automated
            workflows. It like a decision/brainstorming tool (Loomio, Retrium), but cross-platform
            and with automatic execution of actions.
          </p>
          <p>
            Ize is ultimately about how we pool our collective attention to get shit done. Pooling
            our collective attention in the modern era requires bridging different online tools,
            groups, and identities into coherent workflows. The purpose of Ize is to offload this
            cognitive load to software, so that collaboration can once again feel connected,
            purposeful, and nourishing.
          </p>
          <p>...</p>
          <p>
            If this sounds interesting to you - whether you&#39;re a builder, activist, open source
            maintainer, investor, whatever - we&#39;d love to hear from you.
          </p>
          <p>
            <a href="mailto:&#x68;&#97;&#114;&#109;&#111;&#x6e;&#x40;&#x69;&#122;&#101;&#46;&#x73;&#x70;&#97;&#x63;&#101;">
              &#x68;&#97;&#114;&#109;&#111;&#x6e;&#x40;&#x69;&#122;&#101;&#46;&#x73;&#x70;&#97;&#x63;&#101;
            </a>
          </p>
          <a
            href={
              "https://www.loom.com/share/f02374b8562f4334b576667de74c0d60?sid=9eeacda6-55ee-4a11-827a-1d499e3be475"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out the Ize alpha demo
          </a>
        </Box>
      </IzeLogoBackground>
    </>
  );
};
