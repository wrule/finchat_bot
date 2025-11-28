import 'dotenv/config';
import { WeexApiClient } from './weex';

async function checkPnL() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 查询持仓盈亏 ===\n');

  const position = await client.getCurrentPosition();

  if (!position) {
    console.log('❌ 当前无持仓');
    return;
  }

  console.log('📊 持仓信息:');
  console.log('-----------------------------------');
  console.log('方向:', position.side === 'LONG' ? '多头 📈' : '空头 📉');
  console.log('数量:', position.size, 'BTC');
  console.log('杠杆:', position.leverage + 'x');
  console.log('');

  console.log('💰 盈亏情况:');
  console.log('-----------------------------------');
  console.log('开仓价值: $' + position.open_value);
  console.log('未实现盈亏: $' + position.unrealizePnl);
  
  const pnl = parseFloat(position.unrealizePnl);
  const openValue = parseFloat(position.open_value);
  const pnlPercent = (pnl / openValue * 100).toFixed(4);
  
  console.log('盈亏比例:', pnlPercent + '%', pnl >= 0 ? '📈' : '📉');
  console.log('');

  console.log('📈 其他信息:');
  console.log('-----------------------------------');
  console.log('开仓手续费: $' + position.open_fee);
  console.log('资金费用: $' + position.funding_fee);
  console.log('预估强平价: $' + position.liquidatePrice);
  console.log('保证金模式:', position.margin_mode);
  console.log('分离模式:', position.separated_mode);
  console.log('-----------------------------------');

  if (pnl > 0) {
    console.log('\n✅ 当前盈利 $' + pnl.toFixed(5));
  } else if (pnl < 0) {
    console.log('\n⚠️  当前亏损 $' + Math.abs(pnl).toFixed(5));
  } else {
    console.log('\n➖ 当前持平');
  }
}

checkPnL();

