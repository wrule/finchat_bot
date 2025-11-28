import 'dotenv/config';
import { WeexApiClient } from './weex';

async function switchToCombinedMode() {
  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://api-contract.weex.com'
  );

  console.log('=== 切换到全仓 + 合并模式 ===\n');

  // 步骤 1: 查询当前持仓
  console.log('步骤 1: 查询当前持仓...\n');
  
  const positions = await client.getSinglePosition({ symbol: 'cmt_btcusdt' });

  if (!positions || positions.length === 0) {
    console.log('✅ 当前无持仓，可以直接切换模式\n');
  } else {
    console.log(`⚠️  当前有 ${positions.length} 个持仓，需要先平仓\n`);
    
    positions.forEach((pos, index) => {
      console.log(`持仓 ${index + 1}:`);
      console.log('  ID:', pos.id);
      console.log('  方向:', pos.side);
      console.log('  数量:', pos.size, 'BTC');
      console.log('  未实现盈亏: $' + pos.unrealizePnl);
      console.log('');
    });

    console.log('⚠️  警告：切换模式前必须先平掉所有持仓！');
    console.log('💡 提示：由于当前是分离模式，平仓需要 Position ID，但 API 不支持。');
    console.log('💡 建议：请在 Weex 网页界面手动平掉所有持仓后，再运行此脚本。\n');
    
    return;
  }

  // 步骤 2: 切换模式
  console.log('步骤 2: 切换到全仓 + 合并模式...\n');

  try {
    const result = await client.changeHoldModel({
      symbol: 'cmt_btcusdt',
      marginMode: 1,      // 全仓模式
      separatedMode: 1    // 合并模式
    });

    console.log('✅ 切换成功！');
    console.log('响应代码:', result.code);
    console.log('响应消息:', result.msg);
    console.log('请求时间:', new Date(result.requestTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('');

    console.log('📋 新模式设置:');
    console.log('  保证金模式: 全仓 (SHARED)');
    console.log('  分离模式: 合并 (COMBINED)');
    console.log('');

    console.log('✅ 现在可以使用简化接口进行交易了！');
    console.log('  - openPosition(size, side)');
    console.log('  - closePosition(size, side)');
    console.log('  - getCurrentPosition()');

  } catch (error: any) {
    console.error('❌ 切换模式失败:', error.message);
    
    if (error.message.includes('position')) {
      console.log('\n💡 提示：可能还有未平仓的持仓，请先在网页界面平掉所有持仓。');
    }
  }
}

switchToCombinedMode();

