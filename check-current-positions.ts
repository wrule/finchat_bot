import 'dotenv/config';
import { WeexApiClient } from './weex';

async function checkCurrentPositions() {
  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  console.log('查询 BTC/USDT 当前持仓...\n');

  const positions = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });

  if (!positions || positions.length === 0) {
    console.log('✅ 当前无持仓');
  } else {
    console.log(`持仓数量: ${positions.length}\n`);
    
    positions.forEach((pos, index) => {
      console.log(`持仓 ${index + 1}:`);
      console.log('  方向:', pos.side);
      console.log('  数量:', pos.size, 'BTC');
      console.log('  杠杆:', pos.leverage + 'x');
      console.log('  开仓价值: $' + pos.open_value);
      console.log('  未实现盈亏: $' + pos.unrealizePnl);
      console.log('  保证金模式:', pos.margin_mode);
      console.log('  分离模式:', pos.separated_mode);
      console.log('');
    });
  }
}

checkCurrentPositions();

