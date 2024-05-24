interface Response {
  //   userName: string;
  response: string;
}

export const ensComments: Response[] = [
  {
    response: `Hey Spencer, as always appreciate the coordination of yourself and the metagov group. Just wanted to highlight one key number within this post, the ENS token distribution.

  Steward incentivisation is incredibly important and we want to ensure we have the highest value contributors to the project - Incentivising with a monthly USDC balance ($4k) is something we fully support, as well as getting ENS tokens in the hands of these stewards, however the current budget is proposing a huge number of ENS tokens distributed to stewards.
  
  Denominating any incentive in strict token amounts rather than a USD amount always leaves a risk of token price having massive impact on these rewards (this applies for strict onchain incentives (liquidity incentives), let alone a contributor incentive).
  
  With these current numbers, the 9 stewards receive a total of ~$2.3m dollars worth of incentives for 12 months, ~$250k each. (On top of the $48k in USDC incentives).
  
  The proposal also outlines incentives for the next ~9 months - Our thoughts would be that this timeline is too long; is there any change in token price that would change this proposal? If the ENS token was to 10x in value, would we still be comfortable giving each steward $2.5m worth of ENS tokens? Again this highlights the issue with assigning incentives in strict token numbers.
  
  Considering how much, time, DAO energy and due diligence just went into the ENS Service Provider Streams 2 that distributed a similar amount of value - Assigning that same amount to 9 individuals rather than 9 whole teams feels like a misaligned incentive.`,
  },
  {
    response:
      "It goes without saying that no discretionary monetary value should be given by the stewards to themselves (or to the developers and/or contributors for that matter). A better solution might be that the DAO delegates (not transfers!) a larger number of tokens to stewards and contributors through a special contract. Instead of giving each 5,000 $ENS (which is meaningless voting power but significant monetary value), delegate to them 50,000 $ENS tokens in pure voting power instead. Isn’t the justification for this token allocation voting power in the end? If I was given 5,000 $ENS as steward/contributor/developer, it’s not really adding to my voting power but it is good money to buy a tiny condo on the beach. Those are some really misaligned incentives.",
  },
  {
    response: `Regarding Steward ENS compensation. This is one, ironically in which we had very little input because of a proposal I passed last year that forbid Stewards on making comp decisions about themselves. The number 10k was decided by last year’s WG.

  That doesn’t mean we cannot discuss this, ENS token holders are the ultimate interpreters of our own rules, but the metagov stewards aren’t the ones who can alter it. I would suggest a social vote if you feel strongly about it.
  
  The 10k ENS number came from the fact that this is the minimum amount for posting a social vote on Snapshot. For reference to post an executable you need 100k votes and the quorum for executing is 1M votes, all of that is independent of token value.
  
  In my personal opinion vesting is how we solve the dillema between ENS vote power and token value. I believe that the correct form to distribute tokens would be to give 10k tokens to people who have done great contributions (not only stewards), vested over a period of 4 years, with immediate delegate power. So you get the 10k vote right now, but can only actually sell in small quantities over the next years. This also helps align the long term interest of the voters with the long term health of the DAO.
  
  10k doesn’t sound that much voting power but if we were to do that with say, 10-20 new people, then it would mean that as a block these people could outvote the largest ENS delegates.
  
  I am currently testing Hedgey as a solution to make that happen and at Metagov we are looking at making this a standard for contributors and for the next term os stewards.
  
  Should that apply that to the current stewards too? I am bound by my own social proposal and cannot do that, unless there is another social vote clarifying the issue.`,
  },
  {
    response:
      "This number 10k, the vesting period, steward-contributor ratio can easily be part of a social vote. Instead of stewards giving this money to themselves under discretion with arbitrary criteria, it is best to put it to vote. The result of this social vote should be formally adopted by the DAO.",
  },
  {
    response: `As the current lead metagov steward, I feel it’s important to provide some additional context to ensure a fully informed discussion around the numbers James highlighted.

  Firstly, the steward compensation and governance distribution numbers being discussed are the same figures used in the previous term. These numbers were originally set and used by last term’s Metagov stewards. They have been transparently outlined in multiple budgets and funding requests since then.
  
  Secondly, the current working group rules intentionally stipulate that these values are set by the Metagov group for the upcoming term, not the current term. This serves two crucial purposes:
  
  It helps stewards avoid the ethical conflict of determining their own compensation.
  It provides clarity to potential stewards about the role and its compensation before they nominate themselves. This transparency is essential for attracting a diverse pool of qualified candidates.
  While there may be room for discussing potential changes to the compensation structure or the process for future terms, it’s important to consider the impact of altering the advertised numbers after stewards have been elected based on those expectations.
  
  That being said, I appreciate James raising these important points and fostering a thoughtful discussion. His feedback shows the importance of regularly reviewing the processes to ensure they align with our evolving goals and values. These are the types of discussions we want to continue to have openly as we craft the DAOs bylaws via the active engagement outlined in this other post regarding the crafting of the DAO bylaws.`,
  },
  {
    response: `This is only applicable if the DAO votes to implement a standard for just rotation of stewards with a limit on consecutive and total terms held as a steward by a person(s). Otherwise this can’t be enforced in the event of at least (1) steward voted in that has; not held the position of a steward or influenced compensation in ENS DAO previously .`,
  },
  {
    response: `So it seems that the DAO definitely has interest in distributing more tokens for voting power. Controversially, at the same time the price of the token in comparison to the influence of vote is so good that the issuance of tokens will likely just result in the tokens being sold for cash rather than used to vote.

  I thought vesting was a good approach at first but since have changed my thought.
  
  I say distribute and let individuals do what they want with the token. What a recipient does with the token is a personal choice and will reflect their vested interest to this organization. In my opinion, the recipients have already vested time and interest to a point of which they will be issued / rewarded tokens. So why would we impose further vesting on their contributions?
  
  I don’t understand issuance of trust through the weight of influential vote and not at the same time be equally valued monetarily for the measurement of which issuance is decided. If that is the case, then the token is overpriced`,
  },
];
