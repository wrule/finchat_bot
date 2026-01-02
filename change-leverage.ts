import 'dotenv/config';
import { WeexApiClient } from './weex';

async function changeLeverage() {
  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://api-contract.weex.com'
  );

  const symbol = 'cmt_btcusdt';
  const targetLeverage = '50';

  console.log('=== 调整杠杆到 50x ===\n');

  // 步骤 1: 查询当前杠杆设置
  console.log('步骤 1: 查询当前杠杆设置...\n');

  try {
    const settings = await client.getUserSettings({ symbol });
    
    if (settings[symbol]) {
      const current = settings[symbol];
      console.log('📋 当前杠杆设置:');
      console.log('  逐仓多头杠杆:', current.isolated_long_leverage + 'x');
      console.log('  逐仓空头杠杆:', current.isolated_short_leverage + 'x');
      console.log('  全仓杠杆:', current.cross_leverage + 'x');
      console.log('');
    }
  } catch (error: any) {
    console.log('⚠️  查询当前设置失败:', error.message);
    console.log('');
  }

  // 步骤 2: 修改杠杆到 50x (全仓模式)
  console.log('步骤 2: 修改杠杆到 ' + targetLeverage + 'x (全仓模式)...\n');

  try {
    const result = await client.changeLeverage({
      symbol: symbol,
      marginMode: 1,  // 1=全仓
      longLeverage: targetLeverage,
    });

    console.log('✅ 杠杆修改成功！');
    console.log('响应代码:', result.code);
    console.log('响应消息:', result.msg);
    console.log('请求时间:', new Date(result.requestTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('');

  } catch (error: any) {
    console.error('❌ 全仓模式杠杆修改失败:', error.message);
    console.log('');
  }

  // 步骤 3: 同时修改逐仓模式杠杆
  console.log('步骤 3: 修改逐仓模式杠杆到 ' + targetLeverage + 'x...\n');

  try {
    const result = await client.changeLeverage({
      symbol: symbol,
      marginMode: 3,  // 3=逐仓
      longLeverage: targetLeverage,
      shortLeverage: targetLeverage,
    });

    console.log('✅ 逐仓杠杆修改成功！');
    console.log('响应代码:', result.code);
    console.log('响应消息:', result.msg);
    console.log('');

  } catch (error: any) {
    console.error('❌ 逐仓模式杠杆修改失败:', error.message);
    console.log('');
  }

  // 步骤 4: 验证修改结果
  console.log('步骤 4: 验证修改结果...\n');

  try {
    const settings = await client.getUserSettings({ symbol });
    
    if (settings[symbol]) {
      const current = settings[symbol];
      console.log('📋 修改后杠杆设置:');
      console.log('  逐仓多头杠杆:', current.isolated_long_leverage + 'x');
      console.log('  逐仓空头杠杆:', current.isolated_short_leverage + 'x');
      console.log('  全仓杠杆:', current.cross_leverage + 'x');
      console.log('');

      const crossLev = parseFloat(current.cross_leverage);
      if (crossLev === 50) {
        console.log('✅ 杠杆已成功调整到 50x！');
      } else {
        console.log('⚠️  杠杆可能未完全调整，当前全仓杠杆:', crossLev + 'x');
      }
    }
  } catch (error: any) {
    console.log('⚠️  验证失败:', error.message);
  }
}

changeLeverage();

