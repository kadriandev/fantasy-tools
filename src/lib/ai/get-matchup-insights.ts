import { getAnthropicClient } from "./ai";

export async function getMatchupInsight(team: string[], opponent: string[]) {
  const anthropic = getAnthropicClient();
  return anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1000,
    temperature: 0,
    system:
      "You are a seasoned fantasy sports player, especially knowledgeable in nba head to head leagues on yahoo. We are managing a team with the goal of being the #1 fantasy player this season.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `I have a fantasy team with the following roster: ${team.join(",")}. My week's
                  matchup this week has this roster:${opponent.join(",")}. Based on this team, can
                  you tell me what categories I should focus and punt, and give me some trade
                  suggestions for improving my team. Also give me some tips for this week's matchup.
                  Structure the response as valid json. Use abbreviations for the category names. 
                  Make sure json always returns in the following format:
                  {"strong_categories":[],"weak_categories":[],"suggested_punt_categories":[],
                  "weekly_matchup_tips":[],"trade_suggestions":[{"trade_away": [], "target_players": [],
                  "reasoning": ""}],"waiver_wire_targets": [], "drop_candidates": []}`,
          },
        ],
      },
    ],
  });
}
