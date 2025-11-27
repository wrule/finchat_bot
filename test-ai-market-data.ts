import 'dotenv/config';
import { WeexApiClient } from './weex';

async function testAIMarketData() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://pro-openapi.weex.tech'
  );

  console.log('=== 测试 AI 专用市场数据汇总接口 ===\n');

  const startTime = Date.now();

  // 获取完整市场数据
  const marketData = await client.getMarketDataForAI('cmt_btcusdt');

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n📊 市场数据汇总:');
  console.log('-----------------------------------\n');

  console.log('基本信息:');
  console.log('  交易对:', marketData.symbol);
  console.log('  当前价格: $' + marketData.currentPrice);
  console.log('  数据时间:', marketData.timestamp);
  console.log('  获取耗时:', duration + 's');
  console.log('');

  console.log('K线数据:');
  console.log('  15分钟:', marketData.klines['15m'].count, '条');
  console.log('    - 最新价格: $' + marketData.klines['15m'].latestPrice);
  console.log('    - 24h涨跌:', marketData.klines['15m'].priceChangePercent24h + '%');
  console.log('    - 24h最高: $' + marketData.klines['15m'].high24h);
  console.log('    - 24h最低: $' + marketData.klines['15m'].low24h);
  console.log('');

  console.log('  1小时:', marketData.klines['1h'].count, '条');
  console.log('    - 最新价格: $' + marketData.klines['1h'].latestPrice);
  console.log('    - 24h涨跌:', marketData.klines['1h'].priceChangePercent24h + '%');
  console.log('    - 24h最高: $' + marketData.klines['1h'].high24h);
  console.log('    - 24h最低: $' + marketData.klines['1h'].low24h);
  console.log('');

  console.log('  4小时:', marketData.klines['4h'].count, '条');
  console.log('    - 最新价格: $' + marketData.klines['4h'].latestPrice);
  console.log('    - 24h涨跌:', marketData.klines['4h'].priceChangePercent24h + '%');
  console.log('    - 24h最高: $' + marketData.klines['4h'].high24h);
  console.log('    - 24h最低: $' + marketData.klines['4h'].low24h);
  console.log('');

  console.log('订单簿数据:');
  console.log('  最优买价: $' + marketData.orderBook.bestBid);
  console.log('  最优卖价: $' + marketData.orderBook.bestAsk);
  console.log('  价差:', marketData.orderBook.spread, '(' + marketData.orderBook.spreadPercent + '%)');
  console.log('  买单总量:', marketData.orderBook.totalBidVolume, 'BTC');
  console.log('  卖单总量:', marketData.orderBook.totalAskVolume, 'BTC');
  console.log('  买卖比:', marketData.orderBook.bidAskRatio);
  console.log('');

  console.log('-----------------------------------\n');

  // 数据大小分析
  console.log('📈 数据大小分析:');
  console.log('-----------------------------------\n');

  const totalSize = JSON.stringify(marketData).length;
  const kline15mSize = JSON.stringify(marketData.klines['15m']).length;
  const kline1hSize = JSON.stringify(marketData.klines['1h']).length;
  const kline4hSize = JSON.stringify(marketData.klines['4h']).length;
  const orderBookSize = JSON.stringify(marketData.orderBook).length;

  console.log('总数据大小:', totalSize, 'bytes');
  console.log('  - 15分钟K线:', kline15mSize, 'bytes', `(${(kline15mSize/totalSize*100).toFixed(1)}%)`);
  console.log('  - 1小时K线:', kline1hSize, 'bytes', `(${(kline1hSize/totalSize*100).toFixed(1)}%)`);
  console.log('  - 4小时K线:', kline4hSize, 'bytes', `(${(kline4hSize/totalSize*100).toFixed(1)}%)`);
  console.log('  - 订单簿:', orderBookSize, 'bytes', `(${(orderBookSize/totalSize*100).toFixed(1)}%)`);
  console.log('');

  console.log('-----------------------------------\n');

  // AI 上下文示例
  console.log('💡 AI Agent 上下文示例:');
  console.log('-----------------------------------\n');

  const ratio = parseFloat(marketData.orderBook.bidAskRatio);
  const sentiment = ratio > 1.2 ? 'Bullish 📈' : (ratio < 0.8 ? 'Bearish 📉' : 'Neutral ➖');

  const contextMessage = `Market Analysis for ${marketData.symbol}:

Current Price: $${marketData.currentPrice}
Market Sentiment: ${sentiment} (Bid/Ask Ratio: ${marketData.orderBook.bidAskRatio})

Multi-Timeframe Analysis:
- 15m: ${marketData.klines['15m'].priceChangePercent24h}% (${parseFloat(marketData.klines['15m'].priceChangePercent24h) > 0 ? '📈' : '📉'})
- 1h:  ${marketData.klines['1h'].priceChangePercent24h}% (${parseFloat(marketData.klines['1h'].priceChangePercent24h) > 0 ? '📈' : '📉'})
- 4h:  ${marketData.klines['4h'].priceChangePercent24h}% (${parseFloat(marketData.klines['4h'].priceChangePercent24h) > 0 ? '📈' : '📉'})

Order Book:
- Spread: ${marketData.orderBook.spreadPercent}% (Liquidity: ${parseFloat(marketData.orderBook.spreadPercent) < 0.01 ? 'Excellent ✅' : 'Good'})
- Bid Volume: ${marketData.orderBook.totalBidVolume} BTC
- Ask Volume: ${marketData.orderBook.totalAskVolume} BTC

Recent Price Action (15m):`;

  console.log(contextMessage);

  marketData.klines['15m'].candles.slice(-5).forEach((candle, index) => {
    const change = ((parseFloat(candle.close) - parseFloat(candle.open)) / parseFloat(candle.open) * 100).toFixed(2);
    const direction = parseFloat(change) >= 0 ? '📈' : '📉';
    console.log(`  ${index + 1}. ${candle.time.substring(11, 16)} - Close: $${candle.close} ${direction}${change}%`);
  });

  console.log('\n-----------------------------------\n');

  // 保存完整数据到文件（可选）
  console.log('💾 数据已准备好，可用于 AI 分析');
  console.log('数据包含:');
  console.log('  - 3个时间周期的K线数据 (15m, 1h, 4h)');
  console.log('  - 每个周期100条K线');
  console.log('  - 订单簿前10档深度');
  console.log('  - 总计', totalSize, 'bytes');

  console.log('\n-----------------------------------');
}

testAIMarketData();

