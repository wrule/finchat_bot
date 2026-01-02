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
  const targetLeverage = '30';

  console.log('=== 调整杠杆到 ' + targetLeverage + 'x ===\n');

  // 步骤 1: 查询当前持仓以获取账户当前的 margin mode
  console.log('步骤 1: 查询当前账户模式...\n');

  let currentMarginMode: 1 | 3 = 1;  // 默认全仓

  try {
    const positions = await client.getSinglePosition({ symbol });

    if (positions && positions.length > 0) {
      const pos = positions[0];
      console.log('📋 当前持仓信息:');
      console.log('  保证金模式:', pos.margin_mode);
      console.log('  当前杠杆:', pos.leverage + 'x');
      console.log('');

      // 根据持仓的 margin_mode 确定当前模式
      currentMarginMode = pos.margin_mode === 'ISOLATED' ? 3 : 1;
    } else {
      console.log('当前无持仓，默认使用全仓模式\n');
    }
  } catch (error: any) {
    console.log('⚠️  查询持仓失败:', error.message);
    console.log('将使用全仓模式\n');
  }

  // 步骤 2: 查询当前杠杆设置
  console.log('步骤 2: 查询当前杠杆设置...\n');

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

  const modeName = currentMarginMode === 1 ? '全仓' : '逐仓';
  console.log('步骤 3: 修改杠杆到 ' + targetLeverage + 'x (' + modeName + '模式)...\n');

  // 构建请求参数（杠杆值应为字符串）
  const leverageParams = {
    symbol: symbol,
    marginMode: currentMarginMode,
    longLeverage: targetLeverage,
    shortLeverage: targetLeverage,  // 全仓模式下必须与 longLeverage 相同
  };
  console.log('请求参数:', JSON.stringify(leverageParams, null, 2));
  console.log('');

  try {
    const result = await client.changeLeverage(leverageParams);

    console.log('✅ 杠杆修改成功！');
    console.log('响应代码:', result.code);
    console.log('响应消息:', result.msg);
    console.log('请求时间:', new Date(result.requestTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('');

  } catch (error: any) {
    console.error('❌ 杠杆修改失败:', error.message);
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

      const targetLev = parseFloat(targetLeverage);
      const crossLev = parseFloat(current.cross_leverage);
      const isolatedLongLev = parseFloat(current.isolated_long_leverage);

      if (currentMarginMode === 1 && crossLev === targetLev) {
        console.log('✅ 全仓杠杆已成功调整到 ' + targetLeverage + 'x！');
      } else if (currentMarginMode === 3 && isolatedLongLev === targetLev) {
        console.log('✅ 逐仓杠杆已成功调整到 ' + targetLeverage + 'x！');
      } else {
        console.log('⚠️  杠杆可能未完全调整');
      }
    }
  } catch (error: any) {
    console.log('⚠️  验证失败:', error.message);
  }
}

changeLeverage();

