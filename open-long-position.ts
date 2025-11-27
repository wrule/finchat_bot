import 'dotenv/config';
import { WeexApiClient } from './weex';

async function openLongPosition() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://pro-openapi.weex.tech'
  );

  console.log('=== 开多仓 ===\n');

  // 开多仓 0.005 BTC
  console.log('开多仓 0.005 BTC...\n');
  
  const order = await client.openPosition('0.005', 'LONG');
  
  console.log('✅ 开仓成功！');
  console.log('订单 ID:', order.order_id);
  console.log('客户订单 ID:', order.client_oid);
  console.log('');

  // 等待一下让订单成交
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 查询持仓
  console.log('查询当前持仓...\n');
  
  const position = await client.getCurrentPosition();
  
  if (position) {
    console.log('📊 持仓信息:');
    console.log('-----------------------------------');
    console.log('方向:', position.side === 'LONG' ? '多头 📈' : '空头 📉');
    console.log('数量:', position.size, 'BTC');
    console.log('杠杆:', position.leverage + 'x');
    console.log('开仓价值: $' + position.open_value);
    console.log('未实现盈亏: $' + position.unrealizePnl);
    console.log('保证金模式:', position.margin_mode);
    console.log('分离模式:', position.separated_mode);
    console.log('预估强平价: $' + position.liquidatePrice);
    console.log('-----------------------------------\n');

    // 计算盈亏比例
    const pnl = parseFloat(position.unrealizePnl);
    const openValue = parseFloat(position.open_value);
    const pnlPercent = (pnl / openValue * 100).toFixed(4);

    console.log('💡 交易提示:');
    console.log('-----------------------------------');
    console.log('当前盈亏比例:', pnlPercent + '%', pnl >= 0 ? '📈' : '📉');
    
    if (position.side === 'LONG') {
      console.log('做多策略: BTC 价格上涨时盈利 📈');
      console.log('风险提示: BTC 价格下跌时亏损 📉');
    }
    
    console.log('强平风险: 价格跌至 $' + position.liquidatePrice + ' 时会被强平');
    console.log('-----------------------------------');

  } else {
    console.log('⚠️  未找到持仓，可能订单未成交或已被平仓');
  }
}

openLongPosition();

