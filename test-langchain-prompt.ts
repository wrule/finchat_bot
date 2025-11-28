/**
 * 测试 LangChain StructuredOutputParser 生成的格式化指令
 */

import * as dotenv from 'dotenv';
import { 
  getLangChainFormatInstructions, 
  saveLangChainFormatInstructions,
  buildEnhancedPrompt,
  generateAITradingSignalWithLangChain
} from './ai-langchain-generator';
import { WeexApiClient } from './weex';
import { validateAITradingSignal, formatTradingSignal } from './ai-signal-generator';

dotenv.config();

// 初始化 Weex 客户端
const weexClient = new WeexApiClient(
  process.env.WEEX_API_KEY || '',
  process.env.WEEX_SECRET_KEY || '',
  process.env.WEEX_PASSPHRASE || '',
  'https://api-contract.weex.com'
);

async function testLangChainPrompt() {
  console.log('='.repeat(80));
  console.log('🧪 测试 LangChain StructuredOutputParser');
  console.log('='.repeat(80));
  console.log('');
  
  try {
    // 1. 查看 LangChain 生成的格式化指令
    console.log('📝 步骤 1: 查看 LangChain 格式化指令');
    console.log('-'.repeat(80));
    
    const formatInstructions = getLangChainFormatInstructions();
    console.log(formatInstructions);
    console.log('');
    
    // 保存到文件
    await saveLangChainFormatInstructions();
    console.log('');
    
    // 2. 获取市场数据
    console.log('📊 步骤 2: 获取市场数据');
    console.log('-'.repeat(80));
    const marketReport = await weexClient.getAITradingContextText('cmt_btcusdt', 10);
    console.log(`✅ 市场数据获取成功 (${(marketReport.length / 1024).toFixed(2)} KB)`);
    console.log('');
    
    // 3. 构建增强的 Prompt
    console.log('🔧 步骤 3: 构建增强的 Prompt');
    console.log('-'.repeat(80));
    const enhancedPrompt = await buildEnhancedPrompt(marketReport);
    console.log(`✅ Prompt 构建完成 (${(enhancedPrompt.length / 1024).toFixed(2)} KB)`);
    console.log('');
    
    // 保存增强的 Prompt 到文件
    const fs = await import('fs/promises');
    await fs.writeFile('enhanced-prompt.txt', enhancedPrompt, 'utf-8');
    console.log('💾 增强的 Prompt 已保存到: enhanced-prompt.txt');
    console.log('');
    
    // 4. 调用 AI 生成信号
    console.log('🤖 步骤 4: 调用 AI 生成交易信号');
    console.log('-'.repeat(80));
    
    const signal = await generateAITradingSignalWithLangChain(marketReport);
    
    console.log('');
    console.log('='.repeat(80));
    console.log('✅ AI 信号生成成功！');
    console.log('='.repeat(80));
    console.log('');
    
    // 5. 验证信号
    console.log('🔍 步骤 5: 验证信号有效性');
    console.log('-'.repeat(80));
    const isValid = validateAITradingSignal(signal);
    
    if (isValid) {
      console.log('✅ 信号验证通过');
    } else {
      console.log('❌ 信号验证失败');
      return;
    }
    
    console.log('');
    
    // 6. 格式化输出
    console.log(formatTradingSignal(signal));
    
    // 7. 输出 JSON
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
testLangChainPrompt();

