import { WeexApiClient } from './weex';
import * as dotenv from 'dotenv';

dotenv.config();

async function testSimpleAPI() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 测试简化接口 ===\n');

  // 步骤 1: 查询初始持仓
  console.log('步骤 1: 查询初始持仓');
  const initialPosition = await client.getCurrentPosition();
  if (initialPosition) {
    console.log('  当前持仓:', initialPosition.side, initialPosition.size, 'BTC');
  } else {
    console.log('  当前无持仓');
  }
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 步骤 2: 开多仓
  console.log('步骤 2: 开多仓 0.001 BTC');
  const openLong = await client.openPosition('0.001', 'LONG');
  console.log('  订单 ID:', openLong.order_id);
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // 步骤 3: 查询持仓
  console.log('步骤 3: 查询持仓');
  const positionAfterLong = await client.getCurrentPosition();
  if (positionAfterLong) {
    console.log('  方向:', positionAfterLong.side);
    console.log('  数量:', positionAfterLong.size, 'BTC');
    console.log('  未实现盈亏: $' + positionAfterLong.unrealizePnl);
  } else {
    console.log('  当前无持仓');
  }
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 步骤 4: 平多仓
  console.log('步骤 4: 平多仓 0.001 BTC');
  const closeLong = await client.closePosition('0.001', 'LONG');
  console.log('  订单 ID:', closeLong.order_id);
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // 步骤 5: 查询持仓
  console.log('步骤 5: 查询持仓');
  const positionAfterCloseLong = await client.getCurrentPosition();
  if (positionAfterCloseLong) {
    console.log('  方向:', positionAfterCloseLong.side);
    console.log('  数量:', positionAfterCloseLong.size, 'BTC');
  } else {
    console.log('  当前无持仓');
  }
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 步骤 6: 开空仓
  console.log('步骤 6: 开空仓 0.001 BTC');
  const openShort = await client.openPosition('0.001', 'SHORT');
  console.log('  订单 ID:', openShort.order_id);
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // 步骤 7: 查询持仓
  console.log('步骤 7: 查询持仓');
  const positionAfterShort = await client.getCurrentPosition();
  if (positionAfterShort) {
    console.log('  方向:', positionAfterShort.side);
    console.log('  数量:', positionAfterShort.size, 'BTC');
    console.log('  未实现盈亏: $' + positionAfterShort.unrealizePnl);
  } else {
    console.log('  当前无持仓');
  }
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 步骤 8: 平空仓
  console.log('步骤 8: 平空仓 0.001 BTC');
  const closeShort = await client.closePosition('0.001', 'SHORT');
  console.log('  订单 ID:', closeShort.order_id);
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // 步骤 9: 查询最终持仓
  console.log('步骤 9: 查询最终持仓');
  const finalPosition = await client.getCurrentPosition();
  if (finalPosition) {
    console.log('  方向:', finalPosition.side);
    console.log('  数量:', finalPosition.size, 'BTC');
  } else {
    console.log('  当前无持仓');
  }
  console.log('');

  console.log('✅ 测试完成！');
}

testSimpleAPI();

