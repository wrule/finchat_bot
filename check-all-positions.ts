import 'dotenv/config';
import { WeexApiClient } from './weex';

async function checkAllPositions() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 查询所有持仓 ===\n');

  const positions = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });

  console.log('持仓数量:', positions ? positions.length : 0);
  console.log('');

  if (positions && positions.length > 0) {
    console.log('📊 所有持仓详情:\n');

    positions.forEach((pos, index) => {
      console.log(`持仓 ${index + 1}:`);
      console.log('  ID:', pos.id);
      console.log('  方向:', pos.side);
      console.log('  数量:', pos.size, 'BTC');
      console.log('  杠杆:', pos.leverage + 'x');
      console.log('  开仓价值: $' + pos.open_value);
      console.log('  未实现盈亏: $' + pos.unrealizePnl);
      console.log('  保证金模式:', pos.margin_mode);
      console.log('  分离模式:', pos.separated_mode);
      console.log('  开仓时间:', new Date(pos.created_time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('');
    });

    console.log('-----------------------------------');
    console.log('📈 汇总统计:\n');

    const longPositions = positions.filter(p => p.side === 'LONG');
    const shortPositions = positions.filter(p => p.side === 'SHORT');

    console.log('多仓数量:', longPositions.length);
    if (longPositions.length > 0) {
      const totalLongSize = longPositions.reduce((sum, p) => sum + parseFloat(p.size), 0);
      const totalLongPnl = longPositions.reduce((sum, p) => sum + parseFloat(p.unrealizePnl), 0);
      console.log('  总数量:', totalLongSize.toFixed(4), 'BTC');
      console.log('  总盈亏: $' + totalLongPnl.toFixed(5));
    }
    console.log('');

    console.log('空仓数量:', shortPositions.length);
    if (shortPositions.length > 0) {
      const totalShortSize = shortPositions.reduce((sum, p) => sum + parseFloat(p.size), 0);
      const totalShortPnl = shortPositions.reduce((sum, p) => sum + parseFloat(p.unrealizePnl), 0);
      console.log('  总数量:', totalShortSize.toFixed(4), 'BTC');
      console.log('  总盈亏: $' + totalShortPnl.toFixed(5));
    }
    console.log('');

    const totalPnl = positions.reduce((sum, p) => sum + parseFloat(p.unrealizePnl), 0);
    console.log('总盈亏: $' + totalPnl.toFixed(5), totalPnl >= 0 ? '📈' : '📉');
    console.log('-----------------------------------');

  } else {
    console.log('❌ 当前无持仓');
  }
}

checkAllPositions();

