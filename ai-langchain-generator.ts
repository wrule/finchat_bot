/**
 * AI 交易信号生成器（使用 LangChain StructuredOutputParser）
 * 结合 LangChain 的优秀 prompt 设计 + Vercel AI SDK
 */

import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { aiTradingSignalSchema, type AITradingSignal } from './ai-trading-schema';
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';

dotenv.config();

/**
 * 初始化 OpenRouter 提供商
 */
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

const model = openrouter('deepseek/deepseek-v3.2');

/**
 * 创建 LangChain StructuredOutputParser
 */
const parser = StructuredOutputParser.fromZodSchema(aiTradingSignalSchema);

/**
 * 获取 LangChain 格式化指令
 * 这是 LangChain 设计的优秀提示词模板
 */
export function getLangChainFormatInstructions(): string {
  return parser.getFormatInstructions();
}

/**
 * 构建增强的 Prompt（结合 LangChain 格式化指令）
 * @param marketReport - 原始市场报告（已包含 ai-trading-prompt.md）
 * @returns 增强后的 prompt
 */
export async function buildEnhancedPrompt(marketReport: string): Promise<string> {
  // 获取 LangChain 的格式化指令
  const formatInstructions = getLangChainFormatInstructions();

  // marketReport 已经包含了 ai-trading-prompt.md 的内容
  // 我们只需要在末尾添加 LangChain 的格式化指令
  const enhancedPrompt = `
${marketReport}

---

# LangChain 结构化输出格式要求

${formatInstructions}

---

# 重要提示

1. **严格遵守上述 JSON Schema**：你的输出必须完全符合上述 JSON Schema 定义
2. **所有字段都必须填写**：不要遗漏任何 required 字段
3. **枚举值必须精确匹配**：action、confidence、type、priceType 等枚举字段必须使用指定的值
4. **数字字段使用字符串**：size 和 price 字段必须是字符串格式，例如 "0.0050" 和 "91000.0"
5. **不要有尾随逗号**：确保 JSON 格式正确，没有多余的逗号
6. **遵循字段描述**：每个字段的 description 说明了该字段的具体要求，请严格遵守

请基于上述市场数据和交易策略，进行深度分析并生成符合 JSON Schema 的交易信号。
`;

  return enhancedPrompt;
}

/**
 * 使用 LangChain + Vercel AI SDK 生成交易信号
 * @param marketReport - 市场报告
 * @returns AI 交易信号
 */
export async function generateAITradingSignalWithLangChain(marketReport: string): Promise<AITradingSignal> {
  console.log('\n🤖 正在调用 AI 分析市场数据...');
  console.log('📊 使用模型: deepseek/deepseek-r1');
  console.log('🔧 使用方法: LangChain StructuredOutputParser + Vercel AI SDK');
  
  try {
    const startTime = Date.now();
    
    // 构建增强的 prompt
    const enhancedPrompt = await buildEnhancedPrompt(marketReport);
    
    console.log('📝 Prompt 增强完成（包含 LangChain 格式化指令）');
    
    // 使用 Vercel AI SDK 的 generateObject
    const { object } = await generateObject({
      model,
      schema: aiTradingSignalSchema,
      prompt: enhancedPrompt,
      temperature: 0.7,
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ AI 响应接收成功 (耗时: ${duration}秒)`);
    console.log(`📋 信号类型: ${object.signal.action}`);
    console.log(`🎯 置信度: ${object.signal.confidence}`);
    console.log(`📝 理由: ${object.signal.reasoning.substring(0, 50)}...`);
    
    return object;
    
  } catch (error) {
    console.error('❌ AI 调用失败:', error);
    
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      if ('cause' in error) {
        console.error('错误原因:', error.cause);
      }
    }
    
    throw new Error(`AI 信号生成失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 保存 LangChain 格式化指令到文件（用于调试）
 */
export async function saveLangChainFormatInstructions(): Promise<void> {
  const instructions = getLangChainFormatInstructions();
  await fs.writeFile('langchain-format-instructions.txt', instructions, 'utf-8');
  console.log('✅ LangChain 格式化指令已保存到: langchain-format-instructions.txt');
}

