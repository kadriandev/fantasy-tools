import Anthropic from "@anthropic-ai/sdk";

const ai = new Anthropic({
  apiKey: "my_api_key",
});

export function getAnthropicClient() {
  return ai;
}
