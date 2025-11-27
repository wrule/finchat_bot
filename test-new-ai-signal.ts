/**
 * 测试新的 AI 信号生成器
 * 使用 Vercel AI SDK + Zod Schema
 */

import * as dotenv from 'dotenv';
import { WeexApiClient } from './weex';
import { generateAITradingSignal, validateAITradingSignal, formatTradingSignal } from './ai-signal-generator';

dotenv.config();

// 初始化 Weex 客户端
const weexClient = new WeexApiClient(
  process.env.WEEX_API_KEY || '',
  process.env.WEEX_SECRET_KEY || '',
  process.env.WEEX_PASSPHRASE || '',
  'https://pro-openapi.weex.tech'
);

async function testNewAISignal() {
  console.log('='.repeat(80));
  console.log('🧪 测试新的 AI 信号生成器');
  console.log('='.repeat(80));
  console.log('');
  
  try {
    // 1. 获取市场数据
    console.log('📊 正在获取市场数据...');
    const marketReport = await weexClient.getAITradingContextText('cmt_btcusdt', 10);
    console.log('✅ 市场数据获取成功');
    console.log(`📄 报告大小: ${(marketReport.length / 1024).toFixed(2)} KB`);
    console.log('');
    
    // 2. 调用 AI 生成信号
    console.log('🤖 调用 AI 生成交易信号...');
    console.log('使用方法: Vercel AI SDK generateObject');
    console.log('使用模型: deepseek/deepseek-r1');
    console.log('使用 Schema: Zod Schema (100% 类型安全)');
    console.log('');
    
    const signal = await generateAITradingSignal(marketReport);
    
    console.log('');
    console.log('='.repeat(80));
    console.log('✅ AI 信号生成成功！');
    console.log('='.repeat(80));
    console.log('');
    
    // 3. 验证信号
    console.log('🔍 验证信号有效性...');
    const isValid = validateAITradingSignal(signal);
    
    if (isValid) {
      console.log('✅ 信号验证通过');
    } else {
      console.log('❌ 信号验证失败');
      return;
    }
    
    console.log('');
    
    // 4. 格式化输出
    console.log(formatTradingSignal(signal));
    
    // 5. 输出 JSON
    console.log('='.repeat(80));
    console.log('📋 完整 JSON 输出');
    console.log('='.repeat(80));
    console.log(JSON.stringify(signal, null, 2));
    
  } catch (error) {
    console.error('');
    console.error('='.repeat(80));
    console.error('❌ 测试失败');
    console.error('='.repeat(80));
    console.error('');
    console.error('错误信息:', error);
    
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
  }
}

// 运行测试
testNewAISignal();

