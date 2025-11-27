import 'dotenv/config';
import { WeexApiClient } from './weex';

async function testAIBills() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://pro-openapi.weex.tech'
  );

  console.log('=== 测试 AI 专用账单接口 ===\n');

  // 测试 1: 获取原始完整数据
  console.log('📋 原始完整数据 (getAccountBills):');
  console.log('-----------------------------------\n');

  const rawBills = await client.getAccountBills({
    symbol: 'cmt_btcusdt',
    limit: 50
  });

  console.log('原始账单数据:');
  console.log('总记录数:', rawBills.items.length);
  console.log('是否有下一页:', rawBills.hasNextPage);
  console.log('');
  console.log('前3条记录:');
  rawBills.items.slice(0, 3).forEach((bill, index) => {
    console.log(`  ${index + 1}. ${new Date(bill.ctime).toLocaleString()}`);
    console.log(`     类型: ${bill.businessType}`);
    console.log(`     金额: ${bill.amount}`);
    console.log(`     余额: ${bill.balance}`);
    console.log(`     手续费: ${bill.fillFee || '0'}`);
    console.log('');
  });

  console.log('原始数据大小:', JSON.stringify(rawBills).length, 'bytes');
  console.log('\n-----------------------------------\n');

  // 测试 2: 获取 AI 精简数据
  console.log('🤖 AI 精简数据 (getBillsForAI):');
  console.log('-----------------------------------\n');

  const aiBills = await client.getBillsForAI('cmt_btcusdt', 50);

  console.log('AI 精简对象:');
  console.log(JSON.stringify(aiBills, null, 2));

  console.log('\n-----------------------------------\n');

  // 对比分析
  console.log('📊 数据对比分析:');
  console.log('-----------------------------------\n');

  console.log('原始数据大小:', JSON.stringify(rawBills).length, 'bytes');
  console.log('AI 数据大小:', JSON.stringify(aiBills).length, 'bytes');
  console.log('');
  
  const reduction = ((1 - JSON.stringify(aiBills).length / JSON.stringify(rawBills).length) * 100).toFixed(2);
  console.log('数据精简率:', reduction + '%');

  console.log('\n-----------------------------------\n');

  // AI 上下文示例
  console.log('💡 AI Agent 上下文示例:');
  console.log('-----------------------------------\n');

  const contextMessage = `Trading History for ${aiBills.symbol}:

Summary (Last ${aiBills.totalRecords} Records):
- Total Income: ${aiBills.summary.totalIncome} USDT 📈
- Total Expense: ${aiBills.summary.totalExpense} USDT 📉
- Net P&L: ${aiBills.summary.netPnL} USDT ${parseFloat(aiBills.summary.netPnL) >= 0 ? '✅' : '❌'}
- Total Fees: ${aiBills.summary.totalFees} USDT

Trading Activity:
- Open Positions: ${aiBills.summary.openPositions} times
- Close Positions: ${aiBills.summary.closePositions} times
- Funding Fees: ${aiBills.summary.fundingFees} times

Type Breakdown:`;

  console.log(contextMessage);

  Object.entries(aiBills.typeBreakdown).forEach(([type, data]) => {
    const amount = parseFloat(data.totalAmount);
    const emoji = amount >= 0 ? '📈' : '📉';
    console.log(`  - ${type}: ${data.count} times, Total: ${data.totalAmount} USDT ${emoji}`);
  });

  console.log('\nRecent Trades (Last 10):');
  aiBills.recentTrades.slice(0, 10).forEach((trade, index) => {
    const amount = parseFloat(trade.amount);
    const emoji = amount >= 0 ? '📈' : '📉';
    const time = new Date(trade.time).toLocaleString();
    console.log(`  ${index + 1}. ${time}`);
    console.log(`     Type: ${trade.type}`);
    console.log(`     Amount: ${trade.amount} USDT ${emoji}`);
    console.log(`     Balance: ${trade.balance} USDT`);
    console.log(`     Fee: ${trade.fee} USDT`);
  });

  console.log('\n-----------------------------------\n');

  // 交易分析
  console.log('📈 交易分析:');
  console.log('-----------------------------------\n');

  const netPnL = parseFloat(aiBills.summary.netPnL);
  const totalIncome = parseFloat(aiBills.summary.totalIncome);
  const totalExpense = parseFloat(aiBills.summary.totalExpense);
  const totalFees = parseFloat(aiBills.summary.totalFees);

  console.log('盈亏分析:');
  if (netPnL > 0) {
    console.log('  ✅ 盈利状态');
    console.log(`  净盈利: ${netPnL.toFixed(2)} USDT`);
    const roi = ((netPnL / totalExpense) * 100).toFixed(2);
    console.log(`  收益率: ${roi}%`);
  } else if (netPnL < 0) {
    console.log('  ❌ 亏损状态');
    console.log(`  净亏损: ${Math.abs(netPnL).toFixed(2)} USDT`);
    const loss = ((Math.abs(netPnL) / totalExpense) * 100).toFixed(2);
    console.log(`  亏损率: ${loss}%`);
  } else {
    console.log('  ➖ 持平状态');
  }
  console.log('');

  console.log('手续费分析:');
  const feeRatio = ((totalFees / (totalIncome + totalExpense)) * 100).toFixed(2);
  console.log(`  总手续费: ${totalFees.toFixed(2)} USDT`);
  console.log(`  手续费占比: ${feeRatio}%`);
  console.log('');

  console.log('交易频率:');
  console.log(`  开仓次数: ${aiBills.summary.openPositions}`);
  console.log(`  平仓次数: ${aiBills.summary.closePositions}`);
  console.log(`  资金费用次数: ${aiBills.summary.fundingFees}`);
  
  const winRate = aiBills.summary.closePositions > 0 
    ? ((aiBills.summary.closePositions / (aiBills.summary.openPositions + aiBills.summary.closePositions)) * 100).toFixed(2)
    : '0.00';
  console.log(`  平仓比例: ${winRate}%`);

  console.log('\n-----------------------------------');
}

testAIBills();

