import 'dotenv/config';
import { WeexApiClient } from './weex';

async function testAIKline() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 测试 AI 专用 K线接口 ===\n');

  // 测试 1: 获取原始完整数据
  console.log('📋 原始完整数据 (getCandles):');
  console.log('-----------------------------------\n');

  const rawKlines = await client.getCandles({
    symbol: 'cmt_btcusdt',
    granularity: '1h',
    limit: 24  // 最近24小时
  });

  console.log('原始K线数据（前3条）:');
  rawKlines.slice(0, 3).forEach((candle, index) => {
    console.log(`K线 ${index + 1}:`, candle);
  });
  console.log('...');
  console.log('总数量:', rawKlines.length);
  console.log('');

  console.log('原始数据大小:', JSON.stringify(rawKlines).length, 'bytes');
  console.log('\n-----------------------------------\n');

  // 测试 2: 获取 AI 精简数据
  console.log('🤖 AI 精简数据 (getKlineForAI):');
  console.log('-----------------------------------\n');

  const aiKline = await client.getKlineForAI('cmt_btcusdt', '1h', 24);

  console.log('AI 精简对象:');
  console.log(JSON.stringify(aiKline, null, 2));

  console.log('\n-----------------------------------\n');

  // 对比分析
  console.log('📊 数据对比分析:');
  console.log('-----------------------------------\n');

  console.log('原始数据大小:', JSON.stringify(rawKlines).length, 'bytes');
  console.log('AI 数据大小:', JSON.stringify(aiKline).length, 'bytes');
  console.log('');
  
  const reduction = ((1 - JSON.stringify(aiKline).length / JSON.stringify(rawKlines).length) * 100).toFixed(2);
  console.log('数据精简率:', reduction + '%');

  console.log('\n-----------------------------------\n');

  // AI 上下文示例
  console.log('💡 AI Agent 上下文示例:');
  console.log('-----------------------------------\n');

  const contextMessage = `Market Data for ${aiKline.symbol}:
- Timeframe: ${aiKline.granularity}
- Latest Price: $${aiKline.latestPrice}
- 24h Change: $${aiKline.priceChange24h} (${aiKline.priceChangePercent24h}%)
- 24h High: $${aiKline.high24h}
- 24h Low: $${aiKline.low24h}
- Data Points: ${aiKline.count} candles

Recent Price Action (last 5 candles):`;

  console.log(contextMessage);

  aiKline.candles.slice(-5).forEach((candle, index) => {
    const change = ((parseFloat(candle.close) - parseFloat(candle.open)) / parseFloat(candle.open) * 100).toFixed(2);
    const direction = parseFloat(change) >= 0 ? '📈' : '📉';
    console.log(`  ${index + 1}. ${candle.time.substring(11, 16)} - O:$${candle.open} H:$${candle.high} L:$${candle.low} C:$${candle.close} ${direction}${change}%`);
  });

  console.log('\n-----------------------------------\n');

  // 测试不同时间周期
  console.log('🔄 测试不同时间周期:');
  console.log('-----------------------------------\n');

  const timeframes = ['5m', '15m', '1h', '4h', '1d'] as const;

  for (const tf of timeframes) {
    const data = await client.getKlineForAI('cmt_btcusdt', tf, 10);
    console.log(`${tf.padEnd(4)} - Latest: $${data.latestPrice}, 24h: ${data.priceChangePercent24h}%, Count: ${data.count}`);
  }

  console.log('\n-----------------------------------');
}

testAIKline();

