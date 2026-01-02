import 'dotenv/config';
import { WeexApiClient } from './weex';

async function openShortPosition() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 开空仓 ===\n');

  // 开空仓 0.005 BTC
  console.log('开空仓 0.001 BTC...\n');
  
  const order = await client.openPosition('0.005', 'SHORT');
  
  console.log('✅ 开仓成功！');
  console.log('订单 ID:', order.order_id);
  console.log('');

  // 等待一下让订单成交
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 查询持仓
  console.log('查询当前持仓...\n');
  
  const position = await client.getCurrentPosition();
  
  if (position) {
    console.log('持仓信息:');
    console.log('  方向:', position.side);
    console.log('  数量:', position.size, 'BTC');
    console.log('  杠杆:', position.leverage + 'x');
    console.log('  开仓价值: $' + position.open_value);
    console.log('  未实现盈亏: $' + position.unrealizePnl);
    console.log('  保证金模式:', position.margin_mode);
    console.log('  分离模式:', position.separated_mode);
  } else {
    console.log('未找到持仓');
  }
}

openShortPosition();

