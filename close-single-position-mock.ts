/**
 * Mock 虚拟盘平仓
 */

import 'dotenv/config';
import { WeexApiClientMock } from './mock/weex-mock';

async function closeSinglePositionMock() {
  const client = new WeexApiClientMock(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  await client.initMockStore();

  console.log('🎮'.repeat(40));
  console.log('');
  console.log('=== [MOCK] 查询并平掉单个仓位 ===\n');

  // 步骤 1: 查询当前持仓
  console.log('步骤 1: 查询当前持仓...\n');

  const positions = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });

  if (!positions || positions.length === 0) {
    console.log('❌ 当前无持仓，无需平仓');
    return;
  }

  console.log(`找到 ${positions.length} 个持仓\n`);

  // 步骤 2: 显示所有仓位并选择要平的
  if (positions.length > 1) {
    console.log('📊 当前持仓列表:\n');
    positions.forEach((pos: any, index: number) => {
      const pnlSign = parseFloat(pos.unrealizePnl) >= 0 ? '+' : '';
      console.log(`  ${index + 1}. ${pos.side === 'LONG' ? '多头📈' : '空头📉'} ${pos.size} BTC @ ${pos.entryPrice}`);
      console.log(`     盈亏: ${pnlSign}${pos.unrealizePnl} USDT (${pos.pnlPercent}%)`);
      console.log('');
    });
    console.log('💡 将平掉第一个仓位...\n');
  }

  // 步骤 3: 显示要平仓的仓位信息
  const position = positions[0];
  
  console.log('📊 将要平掉的持仓:');
  console.log('-----------------------------------');
  console.log('方向:', position.side === 'LONG' ? '多头 📈' : '空头 📉');
  console.log('数量:', position.size, 'BTC');
  console.log('开仓均价:', (position as any).entryPrice, 'USDT');
  console.log('杠杆:', position.leverage + 'x');
  console.log('开仓价值: $' + position.open_value);
  console.log('未实现盈亏: $' + position.unrealizePnl);
  
  const pnl = parseFloat(position.unrealizePnl);
  if (pnl > 0) {
    console.log('状态: 盈利 ✅');
  } else if (pnl < 0) {
    console.log('状态: 亏损 ⚠️');
  } else {
    console.log('状态: 持平 ➖');
  }
  console.log('-----------------------------------\n');

  // 步骤 4: 平仓
  console.log('步骤 2: 平掉该仓位...\n');

  try {
    const side = position.side as 'LONG' | 'SHORT';
    const size = position.size;

    console.log(`执行平仓: ${side} ${size} BTC\n`);

    const closeOrder = await client.closePosition(size, side);

    console.log('✅ [MOCK] 平仓成功！');
    console.log('订单 ID:', closeOrder.order_id);
    console.log('客户订单 ID:', closeOrder.client_oid);
    console.log('');

    // 步骤 5: 验证平仓结果
    console.log('步骤 3: 验证平仓结果...\n');

    const positionsAfter = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });

    if (!positionsAfter || positionsAfter.length === 0) {
      console.log('✅ 平仓成功，当前无持仓');
    } else if (positionsAfter.length < positions.length) {
      console.log('✅ 平仓成功，剩余持仓:');
      positionsAfter.forEach((pos: any, index: number) => {
        console.log(`  ${index + 1}. ${pos.side} ${pos.size} BTC - 盈亏: $${pos.unrealizePnl}`);
      });
    } else {
      console.log('⚠️  仍有持仓:');
      positionsAfter.forEach((pos: any, index: number) => {
        console.log(`  ${index + 1}. ${pos.side} ${pos.size} BTC - 盈亏: $${pos.unrealizePnl}`);
      });
    }

    // 显示盈亏总结
    console.log('\n-----------------------------------');
    console.log('💰 平仓盈亏总结:');
    console.log('-----------------------------------');
    console.log('平仓前未实现盈亏: $' + position.unrealizePnl);
    
    if (pnl > 0) {
      console.log('结果: 盈利 $' + pnl.toFixed(5) + ' ✅');
    } else if (pnl < 0) {
      console.log('结果: 亏损 $' + Math.abs(pnl).toFixed(5) + ' ⚠️');
    } else {
      console.log('结果: 持平 ➖');
    }
    console.log('-----------------------------------');

    // 显示统计
    console.log('\n📊 虚拟盘统计:');
    console.log('-----------------------------------');
    const stats = await client.getMockStatistics();
    console.log(`初始资金: ${stats.initialBalance.toFixed(2)} USDT`);
    console.log(`当前资金: ${stats.currentBalance.toFixed(2)} USDT`);
    console.log(`总盈亏: ${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)} USDT (${stats.pnlPercent >= 0 ? '+' : ''}${stats.pnlPercent.toFixed(2)}%)`);
    console.log(`交易次数: ${stats.tradesCount}`);
    console.log(`胜率: ${stats.winRate.toFixed(1)}%`);
    console.log('-----------------------------------');

  } catch (error) {
    console.error('❌ 平仓失败:', error instanceof Error ? error.message : error);
  }
}

closeSinglePositionMock();

