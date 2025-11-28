import 'dotenv/config';
import { WeexApiClient } from './weex';

async function testAIOrderBook() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 测试 AI 专用订单簿接口 ===\n');

  // 测试 1: 获取原始完整数据
  console.log('📋 原始完整数据 (getOrderBookDepth):');
  console.log('-----------------------------------\n');

  const rawOrderBook = await client.getOrderBookDepth({
    symbol: 'cmt_btcusdt',
    limit: 15
  });

  console.log('原始订单簿数据:');
  console.log('买单（前3档）:');
  rawOrderBook.bids.slice(0, 3).forEach((bid, index) => {
    console.log(`  ${index + 1}. 价格: ${bid[0]}, 数量: ${bid[1]}`);
  });
  console.log('卖单（前3档）:');
  rawOrderBook.asks.slice(0, 3).forEach((ask, index) => {
    console.log(`  ${index + 1}. 价格: ${ask[0]}, 数量: ${ask[1]}`);
  });
  console.log('');
  console.log('买单总档位:', rawOrderBook.bids.length);
  console.log('卖单总档位:', rawOrderBook.asks.length);
  console.log('时间戳:', rawOrderBook.timestamp);
  console.log('');

  console.log('原始数据大小:', JSON.stringify(rawOrderBook).length, 'bytes');
  console.log('\n-----------------------------------\n');

  // 测试 2: 获取 AI 精简数据
  console.log('🤖 AI 精简数据 (getOrderBookForAI):');
  console.log('-----------------------------------\n');

  const aiOrderBook = await client.getOrderBookForAI('cmt_btcusdt', 10);

  console.log('AI 精简对象:');
  console.log(JSON.stringify(aiOrderBook, null, 2));

  console.log('\n-----------------------------------\n');

  // 对比分析
  console.log('📊 数据对比分析:');
  console.log('-----------------------------------\n');

  console.log('原始数据大小:', JSON.stringify(rawOrderBook).length, 'bytes');
  console.log('AI 数据大小:', JSON.stringify(aiOrderBook).length, 'bytes');
  console.log('');
  
  const reduction = ((1 - JSON.stringify(aiOrderBook).length / JSON.stringify(rawOrderBook).length) * 100).toFixed(2);
  console.log('数据精简率:', reduction + '%');

  console.log('\n-----------------------------------\n');

  // AI 上下文示例
  console.log('💡 AI Agent 上下文示例:');
  console.log('-----------------------------------\n');

  const contextMessage = `Order Book for ${aiOrderBook.symbol}:
- Best Bid: $${aiOrderBook.bestBid}
- Best Ask: $${aiOrderBook.bestAsk}
- Spread: $${aiOrderBook.spread} (${aiOrderBook.spreadPercent}%)
- Total Bid Volume: ${aiOrderBook.totalBidVolume} BTC
- Total Ask Volume: ${aiOrderBook.totalAskVolume} BTC
- Bid/Ask Ratio: ${aiOrderBook.bidAskRatio} ${parseFloat(aiOrderBook.bidAskRatio) > 1 ? '(Bullish 📈)' : '(Bearish 📉)'}

Top 5 Bids (Buy Orders):`;

  console.log(contextMessage);

  aiOrderBook.bidDepth.slice(0, 5).forEach((bid, index) => {
    console.log(`  ${index + 1}. $${bid.price} - ${bid.amount} BTC (Total: ${bid.total} BTC)`);
  });

  console.log('\nTop 5 Asks (Sell Orders):');
  aiOrderBook.askDepth.slice(0, 5).forEach((ask, index) => {
    console.log(`  ${index + 1}. $${ask.price} - ${ask.amount} BTC (Total: ${ask.total} BTC)`);
  });

  console.log('\n-----------------------------------\n');

  // 市场分析
  console.log('📈 市场深度分析:');
  console.log('-----------------------------------\n');

  const ratio = parseFloat(aiOrderBook.bidAskRatio);
  const spreadPct = parseFloat(aiOrderBook.spreadPercent);

  console.log('买卖压力分析:');
  if (ratio > 1.2) {
    console.log('  ✅ 买盘强势 (Bid/Ask > 1.2) - 可能上涨');
  } else if (ratio < 0.8) {
    console.log('  ⚠️  卖盘强势 (Bid/Ask < 0.8) - 可能下跌');
  } else {
    console.log('  ➖ 买卖平衡 (0.8 < Bid/Ask < 1.2) - 盘整');
  }
  console.log('');

  console.log('流动性分析:');
  if (spreadPct < 0.01) {
    console.log('  ✅ 价差极小 (<0.01%) - 流动性极好');
  } else if (spreadPct < 0.05) {
    console.log('  ✅ 价差较小 (<0.05%) - 流动性良好');
  } else if (spreadPct < 0.1) {
    console.log('  ⚠️  价差中等 (<0.1%) - 流动性一般');
  } else {
    console.log('  ❌ 价差较大 (>0.1%) - 流动性较差');
  }
  console.log('');

  console.log('订单簿深度:');
  console.log(`  买单总量: ${aiOrderBook.totalBidVolume} BTC`);
  console.log(`  卖单总量: ${aiOrderBook.totalAskVolume} BTC`);
  console.log(`  总深度: ${(parseFloat(aiOrderBook.totalBidVolume) + parseFloat(aiOrderBook.totalAskVolume)).toFixed(4)} BTC`);

  console.log('\n-----------------------------------');
}

testAIOrderBook();

