/**
 * Mock 虚拟盘开空仓
 */

import 'dotenv/config';
import { WeexApiClientMock } from './mock/weex-mock';

async function openShortPositionMock() {
  const client = new WeexApiClientMock(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  await client.initMockStore();

  console.log('🎮'.repeat(40));
  console.log('');
  console.log('=== [MOCK] 开空仓 ===\n');

  // 开空仓 0.02 BTC
  console.log('开空仓 0.02 BTC...\n');
  
  try {
    const order = await client.openPosition('0.02', 'SHORT');
    
    console.log('✅ [MOCK] 开仓成功！');
    console.log('订单 ID:', order.order_id);
    console.log('');

    // 查询持仓
    console.log('查询当前持仓...\n');
    
    const positions = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });
    const position = positions.find(p => p.side === 'SHORT');
    
    if (position) {
      console.log('📊 持仓信息:');
      console.log('-----------------------------------');
      console.log('方向:', position.side === 'LONG' ? '多头 📈' : '空头 📉');
      console.log('数量:', position.size, 'BTC');
      console.log('开仓均价:', (position as any).entryPrice, 'USDT');
      console.log('杠杆:', position.leverage + 'x');
      console.log('开仓价值: $' + position.open_value);
      console.log('未实现盈亏: $' + position.unrealizePnl);
      console.log('保证金模式:', position.margin_mode);
      console.log('-----------------------------------\n');

      // 计算盈亏比例
      const pnl = parseFloat(position.unrealizePnl);
      const openValue = parseFloat(position.open_value);
      const pnlPercent = (pnl / openValue * 100).toFixed(4);

      console.log('💡 交易提示:');
      console.log('-----------------------------------');
      console.log('当前盈亏比例:', pnlPercent + '%', pnl >= 0 ? '📈' : '📉');
      console.log('做空策略: BTC 价格下跌时盈利 📈');
      console.log('风险提示: BTC 价格上涨时亏损 📉');
      console.log('-----------------------------------');

    } else {
      console.log('⚠️  未找到空头持仓');
    }

    // 显示统计
    console.log('\n📊 虚拟盘统计:');
    console.log('-----------------------------------');
    const stats = await client.getMockStatistics();
    console.log(`初始资金: ${stats.initialBalance.toFixed(2)} USDT`);
    console.log(`当前资金: ${stats.currentBalance.toFixed(2)} USDT`);
    console.log(`总盈亏: ${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)} USDT`);
    console.log('-----------------------------------');

  } catch (error) {
    console.error('❌ 开仓失败:', error instanceof Error ? error.message : error);
  }
}

openShortPositionMock();

