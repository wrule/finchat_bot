import 'dotenv/config';
import { WeexApiClient } from './weex';

async function closeSinglePosition() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 查询并平掉单个仓位 ===\n');

  // 步骤 1: 查询当前持仓
  console.log('步骤 1: 查询当前持仓...\n');

  const positions = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });

  if (!positions || positions.length === 0) {
    console.log('❌ 当前无持仓，无需平仓');
    return;
  }

  console.log(`找到 ${positions.length} 个持仓\n`);

  // 步骤 2: 检查是否只有一个仓位
  if (positions.length > 1) {
    console.log('⚠️  当前有多个持仓，脚本只处理单个持仓的情况\n');
    console.log('持仓列表:');
    positions.forEach((pos, index) => {
      console.log(`  ${index + 1}. ${pos.side} ${pos.size} BTC - 盈亏: $${pos.unrealizePnl}`);
    });
    console.log('\n💡 提示: 请手动选择要平掉的仓位');
    return;
  }

  // 步骤 3: 显示仓位信息
  const position = positions[0];
  
  console.log('📊 当前持仓信息:');
  console.log('-----------------------------------');
  console.log('方向:', position.side === 'LONG' ? '多头 📈' : '空头 📉');
  console.log('数量:', position.size, 'BTC');
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
    const side = position.side === 'LONG' ? 'LONG' : 'SHORT';
    const size = position.size;

    console.log(`执行平仓: ${side} ${size} BTC\n`);

    const closeOrder = await client.closePosition(size, side);

    console.log('✅ 平仓成功！');
    console.log('订单 ID:', closeOrder.order_id);
    console.log('客户订单 ID:', closeOrder.client_oid);
    console.log('');

    // 等待订单成交
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 步骤 5: 验证平仓结果
    console.log('步骤 3: 验证平仓结果...\n');

    const positionsAfter = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });

    if (!positionsAfter || positionsAfter.length === 0) {
      console.log('✅ 平仓成功，当前无持仓');
    } else {
      console.log('⚠️  仍有持仓:');
      positionsAfter.forEach((pos, index) => {
        console.log(`  ${index + 1}. ${pos.side} ${pos.size} BTC - 盈亏: $${pos.unrealizePnl}`);
      });
    }

    // 显示盈亏总结
    console.log('\n-----------------------------------');
    console.log('💰 平仓盈亏总结:');
    console.log('-----------------------------------');
    console.log('平仓前盈亏: $' + position.unrealizePnl);
    console.log('开仓手续费: $' + position.open_fee);
    
    if (pnl > 0) {
      console.log('结果: 盈利 $' + pnl.toFixed(5) + ' ✅');
    } else if (pnl < 0) {
      console.log('结果: 亏损 $' + Math.abs(pnl).toFixed(5) + ' ⚠️');
    } else {
      console.log('结果: 持平 ➖');
    }
    console.log('-----------------------------------');

  } catch (error: any) {
    console.error('❌ 平仓失败:', error.message);
    
    if (error.message.includes('insufficient')) {
      console.log('\n💡 提示: 可能是持仓数量不足或已被部分平仓');
    }
  }
}

closeSinglePosition();

