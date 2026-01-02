/**
 * AI 交易信号生成器
 * 使用 Vercel AI SDK + Zod Schema 确保 100% JSON 解析成功
 */

import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { aiTradingSignalSchema, type AITradingSignal } from './ai-trading-schema';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 初始化 OpenRouter 提供商
 */
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

/**
 * 使用 DeepSeek-R1 模型
 */
const model = openrouter('deepseek/deepseek-v3.2');

/**
 * 生成 AI 交易信号
 * @param marketReport - 完整的市场报告文本（包含 AI Prompt）
 * @returns AI 交易信号对象
 */
export async function generateAITradingSignal(marketReport: string): Promise<AITradingSignal> {
  console.log('\n🤖 正在调用 AI 分析市场数据...');
  console.log('📊 使用模型: deepseek/deepseek-r1');
  console.log('🔧 使用方法: Vercel AI SDK generateObject');
  
  try {
    const startTime = Date.now();
    
    // 使用 generateObject 确保返回结构化的 JSON
    const { object } = await generateObject({
      model,
      schema: aiTradingSignalSchema,
      prompt: marketReport,
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
    
    // 提供更详细的错误信息
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
 * 验证交易信号是否有效
 * @param signal - 交易信号对象
 * @returns 是否有效
 */
export function validateAITradingSignal(signal: AITradingSignal): boolean {
  try {
    // 使用 Zod Schema 验证
    aiTradingSignalSchema.parse(signal);
    
    // 额外的业务逻辑验证
    if (signal.execution.hasOrder && signal.execution.orders.length === 0) {
      console.warn('⚠️  警告: hasOrder 为 true 但 orders 数组为空');
      return false;
    }
    
    if (!signal.execution.hasOrder && signal.execution.orders.length > 0) {
      console.warn('⚠️  警告: hasOrder 为 false 但 orders 数组不为空');
      return false;
    }
    
    // 检查订单数量是否合理
    if (signal.execution.hasOrder) {
      for (const order of signal.execution.orders) {
        const size = parseFloat(order.size);
        if (isNaN(size) || size <= 0) {
          console.warn(`⚠️  警告: 订单数量无效: ${order.size}`);
          return false;
        }
        
        // 检查价格是否合理（市价单除外）
        if (order.priceType === 'LIMIT') {
          const price = parseFloat(order.price);
          if (isNaN(price) || price <= 0) {
            console.warn(`⚠️  警告: 订单价格无效: ${order.price}`);
            return false;
          }
        }
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ 信号验证失败:', error);
    return false;
  }
}

/**
 * 格式化交易信号为可读文本
 * @param signal - 交易信号对象
 * @returns 格式化的文本
 */
export function formatTradingSignal(signal: AITradingSignal): string {
  const lines: string[] = [];
  
  lines.push('='.repeat(80));
  lines.push('📊 AI 交易信号分析');
  lines.push('='.repeat(80));
  lines.push('');
  
  lines.push('市场分析:');
  lines.push(`  趋势: ${signal.analysis.marketTrend}`);
  lines.push(`  持仓: ${signal.analysis.positionStatus}`);
  lines.push(`  风险: ${signal.analysis.riskAssessment}`);
  lines.push('');
  
  lines.push('交易信号:');
  lines.push(`  操作: ${signal.signal.action}`);
  lines.push(`  置信度: ${signal.signal.confidence}`);
  lines.push(`  理由: ${signal.signal.reasoning}`);
  lines.push('');
  
  lines.push(`风险提示: ${signal.riskWarning}`);
  lines.push('');
  
  if (signal.execution.hasOrder && signal.execution.orders.length > 0) {
    lines.push('执行订单:');
    signal.execution.orders.forEach((order, index) => {
      lines.push(`  订单 ${index + 1}:`);
      lines.push(`    类型: ${order.typeDescription}`);
      lines.push(`    数量: ${order.size} BTC`);
      lines.push(`    价格类型: ${order.priceType}`);
      lines.push(`    价格: ${order.price} USDT`);
      lines.push(`    理由: ${order.reasoning}`);
      lines.push('');
    });
  } else {
    lines.push('执行计划: 观望，无需执行订单');
    lines.push('');
  }
  
  return lines.join('\n');
}

