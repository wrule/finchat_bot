import 'dotenv/config';
import { WeexApiClient } from './weex';

async function testAIRisk() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://pro-openapi.weex.tech'
  );

  console.log('=== 测试 AI 专用账户风险接口 ===\n');

  // 获取账户风险信息
  const riskInfo = await client.getAccountRiskForAI('cmt_btcusdt');

  console.log('🤖 AI 精简数据 (getAccountRiskForAI):');
  console.log('-----------------------------------\n');

  console.log('完整对象:');
  console.log(JSON.stringify(riskInfo, null, 2));

  console.log('\n-----------------------------------\n');

  // 数据大小分析
  console.log('📊 数据大小分析:');
  console.log('-----------------------------------\n');

  const dataSize = JSON.stringify(riskInfo).length;
  console.log('数据大小:', dataSize, 'bytes');

  console.log('\n-----------------------------------\n');

  // AI 上下文示例
  console.log('💡 AI Agent 上下文示例:');
  console.log('-----------------------------------\n');

  const riskEmoji = {
    'LOW': '✅',
    'MEDIUM': '⚠️',
    'HIGH': '🔴',
    'CRITICAL': '🚨'
  }[riskInfo.risk.level] || '❓';

  const contextMessage = `Account Risk Analysis for ${riskInfo.symbol}:

Balance:
- Total Balance: ${riskInfo.balance.total} USDT
- Available: ${riskInfo.balance.available} USDT
- Frozen (Used Margin): ${riskInfo.balance.frozen} USDT

Leverage:
- Current Leverage: ${riskInfo.leverage.current}x
- Margin Mode: ${riskInfo.leverage.mode}

Margin Status:
- Used Margin: ${riskInfo.margin.used} USDT
- Available Margin: ${riskInfo.margin.available} USDT
- Margin Ratio: ${riskInfo.margin.ratio}%

Risk Assessment:
- Risk Level: ${riskInfo.risk.level} ${riskEmoji}
- Actual Leverage Ratio: ${riskInfo.risk.leverageRatio}x
- Margin Usage Ratio: ${riskInfo.risk.marginRatio}%

Positions:
- Active Positions: ${riskInfo.positions.count}
- Total Position Value: ${riskInfo.positions.totalValue} USDT
- Total Unrealized P&L: ${riskInfo.positions.totalUnrealizedPnl} USDT ${parseFloat(riskInfo.positions.totalUnrealizedPnl) >= 0 ? '📈' : '📉'}`;

  console.log(contextMessage);

  console.log('\n-----------------------------------\n');

  // 风险分析
  console.log('📈 风险分析:');
  console.log('-----------------------------------\n');

  const marginRatio = parseFloat(riskInfo.risk.marginRatio);
  const leverageRatio = parseFloat(riskInfo.risk.leverageRatio);

  console.log('风险等级:', riskInfo.risk.level, riskEmoji);
  console.log('');

  console.log('保证金分析:');
  console.log(`  已使用: ${riskInfo.margin.used} USDT (${marginRatio}%)`);
  console.log(`  可用: ${riskInfo.margin.available} USDT (${(100 - marginRatio).toFixed(2)}%)`);
  if (marginRatio > 80) {
    console.log('  🚨 警告: 保证金使用率过高，接近强平风险！');
  } else if (marginRatio > 60) {
    console.log('  🔴 注意: 保证金使用率较高，建议降低仓位');
  } else if (marginRatio > 40) {
    console.log('  ⚠️  提示: 保证金使用率中等，注意风险控制');
  } else {
    console.log('  ✅ 保证金使用率健康');
  }
  console.log('');

  console.log('杠杆分析:');
  console.log(`  设置杠杆: ${riskInfo.leverage.current}x`);
  console.log(`  实际杠杆: ${leverageRatio}x`);
  if (leverageRatio > 15) {
    console.log('  🚨 警告: 实际杠杆率极高，风险极大！');
  } else if (leverageRatio > 10) {
    console.log('  🔴 注意: 实际杠杆率较高，建议降低');
  } else if (leverageRatio > 5) {
    console.log('  ⚠️  提示: 实际杠杆率中等，注意风险');
  } else {
    console.log('  ✅ 实际杠杆率健康');
  }
  console.log('');



  console.log('持仓分析:');
  console.log(`  持仓数量: ${riskInfo.positions.count}`);
  console.log(`  持仓价值: ${riskInfo.positions.totalValue} USDT`);
  console.log(`  未实现盈亏: ${riskInfo.positions.totalUnrealizedPnl} USDT`);
  const totalValue = parseFloat(riskInfo.positions.totalValue);
  const pnlRatio = totalValue > 0
    ? ((parseFloat(riskInfo.positions.totalUnrealizedPnl) / totalValue) * 100).toFixed(2)
    : '0.00';
  console.log(`  盈亏比例: ${pnlRatio}%`);

  console.log('\n-----------------------------------\n');

  // 建议
  console.log('💡 AI 交易建议:');
  console.log('-----------------------------------\n');

  if (riskInfo.risk.level === 'CRITICAL') {
    console.log('🚨 紧急建议:');
    console.log('  1. 立即减仓或平仓，降低风险');
    console.log('  2. 增加保证金，避免强平');
    console.log('  3. 暂停开新仓位');
  } else if (riskInfo.risk.level === 'HIGH') {
    console.log('🔴 高风险建议:');
    console.log('  1. 考虑减少部分仓位');
    console.log('  2. 降低杠杆倍数');
    console.log('  3. 谨慎开新仓位');
  } else if (riskInfo.risk.level === 'MEDIUM') {
    console.log('⚠️  中等风险建议:');
    console.log('  1. 保持当前仓位，注意风险');
    console.log('  2. 设置止损止盈');
    console.log('  3. 适度开新仓位');
  } else {
    console.log('✅ 低风险建议:');
    console.log('  1. 风险可控，可以正常交易');
    console.log('  2. 可以适当增加仓位');
    console.log('  3. 保持风险监控');
  }

  console.log('\n-----------------------------------');
}

testAIRisk();

