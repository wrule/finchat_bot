import 'dotenv/config';
import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = openrouter('deepseek/deepseek-v3.2-exp');

const tradingSignalSchema = z.object({
  symbol: z.string().describe('交易对符号，例如 BTC/USDT'),
  action: z.enum(['buy', 'sell', 'hold']).describe('交易动作：买入、卖出或持有'),
  price: z.number().describe('建议交易价格'),
  quantity: z.number().describe('建议交易数量'),
  stopLoss: z.number().optional().describe('止损价格'),
  takeProfit: z.number().optional().describe('止盈价格'),
  confidence: z.number().min(0).max(100).describe('信号置信度 (0-100)'),
  reason: z.string().describe('交易信号的理由'),
  timestamp: z.string().describe('信号生成时间'),
});

async function main() {
  const prompt = '生成一个合约交易信号，包含交易对、动作、价格、数量、止损止盈和置信度等信息';

  const { object } = await generateObject({
    model,
    schema: tradingSignalSchema,
    prompt,
  });

  console.log('生成的交易信号：');
  console.log(JSON.stringify(object, null, 2));
}

main();
