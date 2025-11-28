import 'dotenv/config';
import { WeexApiClient } from './weex';

async function testAIPosition() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 测试 AI 专用持仓接口 ===\n');

  // 测试 1: 获取原始完整数据
  console.log('📋 原始完整数据 (getCurrentPosition):');
  console.log('-----------------------------------\n');

  const fullPosition = await client.getCurrentPosition();

  if (fullPosition) {
    console.log('完整持仓对象:');
    console.log(JSON.stringify(fullPosition, null, 2));
  } else {
    console.log('当前无持仓');
  }

  console.log('\n-----------------------------------\n');

  // 测试 2: 获取 AI 精简数据
  console.log('🤖 AI 精简数据 (getPositionForAI):');
  console.log('-----------------------------------\n');

  const aiPosition = await client.getPositionForAI('cmt_btcusdt');

  console.log('AI 精简对象:');
  console.log(JSON.stringify(aiPosition, null, 2));

  console.log('\n-----------------------------------\n');

  // 对比分析
  console.log('📊 数据对比分析:');
  console.log('-----------------------------------\n');

  if (fullPosition) {
    console.log('原始数据字段数:', Object.keys(fullPosition).length);
    console.log('AI 数据字段数:', aiPosition ? Object.keys(aiPosition).length : 0);
    console.log('');
    console.log('原始数据大小:', JSON.stringify(fullPosition).length, 'bytes');
    console.log('AI 数据大小:', JSON.stringify(aiPosition).length, 'bytes');
    console.log('');
    
    const reduction = ((1 - JSON.stringify(aiPosition).length / JSON.stringify(fullPosition).length) * 100).toFixed(2);
    console.log('数据精简率:', reduction + '%');
  }

  console.log('\n-----------------------------------\n');

  // AI 上下文示例
  console.log('💡 AI Agent 上下文示例:');
  console.log('-----------------------------------\n');

  if (aiPosition && aiPosition.hasPosition && aiPosition.positions) {
    let contextMessage = `Current Positions Summary:
- Symbol: ${aiPosition.symbol}
- Total Positions: ${aiPosition.positions.length}
- Total PnL: $${aiPosition.totalPnl}
- Net Position: ${aiPosition.netPosition?.side} ${aiPosition.netPosition?.size} BTC

Individual Positions:`;

    aiPosition.positions.forEach((pos, index) => {
      contextMessage += `
${index + 1}. ${pos.side} Position:
   - Size: ${pos.size} BTC
   - Leverage: ${pos.leverage}x
   - PnL: $${pos.unrealizedPnl} (${pos.pnlPercent}%)`;
    });

    console.log(contextMessage);
  } else {
    console.log('No position currently held.');
  }

  console.log('\n-----------------------------------');
}

testAIPosition();

