import 'dotenv/config';
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = openrouter('deepseek/deepseek-v3.2-exp');

async function main() {
  const { text } = await generateText({
    model,
    prompt: '生成一个合约交易信号，JSON格式',
  });
  console.log(text);
}

main();
