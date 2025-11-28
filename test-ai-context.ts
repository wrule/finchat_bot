import { WeexApiClient } from './weex';
import * as dotenv from 'dotenv';

dotenv.config();

async function testAIContext() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 测试 AI 交易上下文接口 ===\n');

  try {
    // 测试 1: 获取结构化的上下文数据
    console.log('📊 测试 1: 获取结构化上下文数据');
    console.log('-----------------------------------\n');

    const context = await client.getAITradingContext('cmt_btcusdt', 30);

    console.log('\n📦 上下文数据结构:');
    console.log('-----------------------------------');
    console.log('元数据:', JSON.stringify(context.metadata, null, 2));
    console.log('\n交易历史摘要:', JSON.stringify(context.tradingHistory.summary, null, 2));
    console.log('\n市场数据 - 当前价格:', context.marketData.currentPrice);
    console.log('市场数据 - 5分钟K线:', {
      latestPrice: context.marketData.klines['5m'].latestPrice,
      priceChange24h: context.marketData.klines['5m'].priceChangePercent24h
    });
    console.log('\n账户风险:', JSON.stringify(context.accountRisk.risk, null, 2));
    console.log('\n当前持仓:', context.currentPosition.hasPosition ? 
      `有持仓 (${context.currentPosition.positions?.length}个)` : '无持仓');

    // 计算数据大小
    const contextJSON = JSON.stringify(context);
    const contextSize = contextJSON.length;
    const contextSizeKB = (contextSize / 1024).toFixed(2);
    
    console.log('\n📏 数据大小分析:');
    console.log('-----------------------------------');
    console.log(`总大小: ${contextSize} bytes (${contextSizeKB} KB)`);
    
    // 分析各部分占比
    const billsSize = JSON.stringify(context.tradingHistory).length;
    const marketSize = JSON.stringify(context.marketData).length;
    const riskSize = JSON.stringify(context.accountRisk).length;
    const positionSize = JSON.stringify(context.currentPosition).length;
    
    console.log(`  - 交易历史: ${billsSize} bytes (${(billsSize/contextSize*100).toFixed(1)}%)`);
    console.log(`  - 市场数据: ${marketSize} bytes (${(marketSize/contextSize*100).toFixed(1)}%)`);
    console.log(`  - 账户风险: ${riskSize} bytes (${(riskSize/contextSize*100).toFixed(1)}%)`);
    console.log(`  - 当前持仓: ${positionSize} bytes (${(positionSize/contextSize*100).toFixed(1)}%)`);

    console.log('\n-----------------------------------\n');

    // 测试 2: 获取格式化的文本报告
    console.log('📄 测试 2: 获取格式化文本报告');
    console.log('-----------------------------------\n');

    const textReport = await client.getAITradingContextText('cmt_btcusdt', 30);
    
    console.log(textReport);

    // 计算文本大小
    const textSize = textReport.length;
    const textSizeKB = (textSize / 1024).toFixed(2);
    
    console.log('\n📏 文本报告大小:');
    console.log('-----------------------------------');
    console.log(`大小: ${textSize} bytes (${textSizeKB} KB)`);
    console.log(`行数: ${textReport.split('\n').length} 行`);

    console.log('\n-----------------------------------');
    console.log('✅ 测试完成！');
    console.log('-----------------------------------\n');

    // 使用建议
    console.log('💡 使用建议:');
    console.log('-----------------------------------');
    console.log('1. getAITradingContext() - 返回结构化数据，适合程序处理');
    console.log('2. getAITradingContextText() - 返回格式化文本，适合直接传递给 AI');
    console.log('3. 两个方法都会并行获取数据，性能优化');
    console.log('4. 数据按照重要性排序：交易历史 > 市场数据 > 账户风险 > 持仓');
    console.log('-----------------------------------\n');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testAIContext();

