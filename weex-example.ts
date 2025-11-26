import 'dotenv/config';
import { WeexApiClient } from './weex';

/**
 * 测试获取服务器时间
 */
async function testGetServerTime() {
  console.log('=== 测试获取服务器时间 ===\n');

  // 初始化客户端（公共接口不需要 API 密钥）
  const client = new WeexApiClient(
    '', // API Key（公共接口不需要）
    '', // Secret Key
    '', // Access Passphrase
    'https://api-contract.weex.com'  // 基础 URL
  );

  try {
    const serverTime = await client.getServerTime();

    console.log('✅ 成功获取服务器时间:');
    console.log('-----------------------------------');
    console.log('Epoch (秒):', serverTime.epoch);
    console.log('ISO 格式:', serverTime.iso);
    console.log('时间戳 (毫秒):', serverTime.timestamp);
    console.log('-----------------------------------');

    // 转换为本地时间显示
    const localTime = new Date(serverTime.timestamp);
    console.log('本地时间:', localTime.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }));

    // 计算本地时间与服务器时间的差异
    const localTimestamp = Date.now();
    const timeDiff = localTimestamp - serverTime.timestamp;
    console.log('本地与服务器时间差:', timeDiff, 'ms');

    return serverTime;
  } catch (error) {
    console.error('❌ 获取服务器时间失败:', error);
    throw error;
  }
}

/**
 * 测试获取合约信息
 */
async function testGetContracts() {
  console.log('\n=== 测试获取合约信息 ===\n');

  const client = new WeexApiClient(
    '',
    '',
    '',
    'https://api-contract.weex.com'
  );

  try {
    // 测试 1: 获取指定交易对的合约信息
    console.log('📊 测试 1: 获取 BTC/USDT 合约信息');
    console.log('-----------------------------------');
    const btcContract = await client.getContracts('cmt_btcusdt');

    if (btcContract && btcContract.length > 0) {
      const contract = btcContract[0];
      console.log('✅ 成功获取合约信息:');
      console.log('交易对:', contract.symbol);
      console.log('标的:', contract.underlying_index);
      console.log('计价货币:', contract.quote_currency);
      console.log('保证金币种:', contract.coin);
      console.log('是否 USDT-M:', contract.forwardContractFlag ? '是' : '否');
      console.log('最小杠杆:', contract.minLeverage + 'x');
      console.log('最大杠杆:', contract.maxLeverage + 'x');
      console.log('价格精度:', contract.tick_size);
      console.log('数量精度:', contract.size_increment);
      console.log('Maker 费率:', (parseFloat(contract.makerFeeRate) * 100).toFixed(2) + '%');
      console.log('Taker 费率:', (parseFloat(contract.takerFeeRate) * 100).toFixed(2) + '%');
      console.log('最小下单量:', contract.minOrderSize);
      console.log('最大下单量:', contract.maxOrderSize);
      console.log('最大持仓量:', contract.maxPositionSize);
      console.log('结算时间:', contract.delivery.join(', '));
      console.log('-----------------------------------\n');
    }

    // 测试 2: 获取 ETH/USDT 合约信息
    console.log('📊 测试 2: 获取 ETH/USDT 合约信息');
    console.log('-----------------------------------');
    const ethContract = await client.getContracts('cmt_ethusdt');

    if (ethContract && ethContract.length > 0) {
      const contract = ethContract[0];
      console.log('✅ 成功获取合约信息:');
      console.log('交易对:', contract.symbol);
      console.log('标的:', contract.underlying_index);
      console.log('最大杠杆:', contract.maxLeverage + 'x');
      console.log('Maker 费率:', (parseFloat(contract.makerFeeRate) * 100).toFixed(2) + '%');
      console.log('Taker 费率:', (parseFloat(contract.takerFeeRate) * 100).toFixed(2) + '%');
      console.log('-----------------------------------\n');
    }

    // 测试 3: 获取所有合约信息（不传参数）
    console.log('📊 测试 3: 获取所有合约信息');
    console.log('-----------------------------------');
    const allContracts = await client.getContracts();
    console.log(`✅ 成功获取 ${allContracts.length} 个合约信息`);

    // 显示前 5 个合约的基本信息
    console.log('\n前 5 个合约:');
    allContracts.slice(0, 5).forEach((contract, index) => {
      console.log(`${index + 1}. ${contract.symbol} - ${contract.underlying_index}/${contract.quote_currency} (杠杆: ${contract.minLeverage}-${contract.maxLeverage}x)`);
    });
    console.log('-----------------------------------');

    return allContracts;
  } catch (error) {
    console.error('❌ 获取合约信息失败:', error);
    throw error;
  }
}

/**
 * 测试获取K线数据
 */
async function testGetCandles() {
  console.log('\n=== 测试获取K线数据 ===\n');

  const client = new WeexApiClient(
    '',
    '',
    '',
    'https://api-contract.weex.com'
  );

  try {
    // 测试 1: 获取最近的K线数据（1分钟）
    console.log('📈 测试 1: 获取 BTC/USDT 最近 10 根 1 分钟K线');
    console.log('-----------------------------------');
    const candles1m = await client.getCandlesFormatted({
      symbol: 'cmt_btcusdt',
      granularity: '1m',
      limit: 10
    });

    console.log(`✅ 成功获取 ${candles1m.length} 根K线数据`);
    if (candles1m.length > 0) {
      const latest = candles1m[candles1m.length - 1];
      const latestTime = new Date(latest.time);
      console.log('\n最新K线:');
      console.log('时间:', latestTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('开盘价:', latest.open);
      console.log('最高价:', latest.high);
      console.log('最低价:', latest.low);
      console.log('收盘价:', latest.close);
      console.log('成交量:', latest.volume);
      console.log('成交额:', latest.turnover);

      // 计算涨跌幅
      const change = ((parseFloat(latest.close) - parseFloat(latest.open)) / parseFloat(latest.open) * 100).toFixed(2);
      console.log('涨跌幅:', change + '%', change >= '0' ? '📈' : '📉');
    }
    console.log('-----------------------------------\n');

    // 测试 2: 获取不同周期的K线数据
    console.log('📈 测试 2: 获取 ETH/USDT 不同周期K线');
    console.log('-----------------------------------');

    const granularities: Array<{ period: '5m' | '15m' | '1h' | '1d', name: string }> = [
      { period: '5m', name: '5分钟' },
      { period: '15m', name: '15分钟' },
      { period: '1h', name: '1小时' },
      { period: '1d', name: '1天' }
    ];

    for (const { period, name } of granularities) {
      const candles = await client.getCandlesFormatted({
        symbol: 'cmt_ethusdt',
        granularity: period,
        limit: 5
      });

      if (candles.length > 0) {
        const latest = candles[candles.length - 1];
        const change = ((parseFloat(latest.close) - parseFloat(latest.open)) / parseFloat(latest.open) * 100).toFixed(2);
        console.log(`${name}K线: 收盘价 ${latest.close}, 涨跌 ${change}%`);
      }
    }
    console.log('-----------------------------------\n');

    // 测试 3: 获取指定时间范围的K线数据
    console.log('📈 测试 3: 获取指定时间范围的K线数据');
    console.log('-----------------------------------');

    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000; // 1小时前

    const candlesRange = await client.getCandlesFormatted({
      symbol: 'cmt_btcusdt',
      granularity: '5m',
      startTime: oneHourAgo,
      endTime: now
    });

    console.log(`✅ 获取过去 1 小时的 5 分钟K线: ${candlesRange.length} 根`);

    if (candlesRange.length > 0) {
      const firstCandle = candlesRange[0];
      const lastCandle = candlesRange[candlesRange.length - 1];

      console.log('\n时间范围:');
      console.log('开始:', new Date(firstCandle.time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('结束:', new Date(lastCandle.time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));

      // 计算这段时间的总体涨跌
      const totalChange = ((parseFloat(lastCandle.close) - parseFloat(firstCandle.open)) / parseFloat(firstCandle.open) * 100).toFixed(2);
      console.log('\n期间涨跌幅:', totalChange + '%', totalChange >= '0' ? '📈' : '📉');
      console.log('期间最高价:', Math.max(...candlesRange.map(c => parseFloat(c.high))).toFixed(2));
      console.log('期间最低价:', Math.min(...candlesRange.map(c => parseFloat(c.low))).toFixed(2));
    }
    console.log('-----------------------------------\n');

    // 测试 4: 获取原始格式的K线数据
    console.log('📈 测试 4: 获取原始格式K线数据');
    console.log('-----------------------------------');
    const rawCandles = await client.getCandles({
      symbol: 'cmt_btcusdt',
      granularity: '1m',
      limit: 3
    });

    console.log(`✅ 获取 ${rawCandles.length} 根原始格式K线`);
    console.log('\n原始数据格式示例:');
    rawCandles.forEach((candle, index) => {
      console.log(`K线 ${index + 1}:`, candle);
    });
    console.log('-----------------------------------');

    return candles1m;
  } catch (error) {
    console.error('❌ 获取K线数据失败:', error);
    throw error;
  }
}

/**
 * 测试获取 BTC/USDT 15分钟K线（至少100根）
 */
async function testBTC15MinCandles() {
  console.log('\n=== 测试获取 BTC/USDT 15分钟K线（100根） ===\n');

  const client = new WeexApiClient(
    '',
    '',
    '',
    'https://api-contract.weex.com'
  );

  try {
    console.log('📈 正在获取 BTC/USDT 15分钟K线数据...');
    console.log('-----------------------------------');

    const candles = await client.getCandlesFormatted({
      symbol: 'cmt_btcusdt',
      granularity: '15m',
      limit: 100
    });

    console.log(`✅ 成功获取 ${candles.length} 根 15分钟K线数据\n`);

    if (candles.length > 0) {
      // 第一根K线
      const firstCandle = candles[0];
      const firstTime = new Date(firstCandle.time);
      console.log('📊 第一根K线:');
      console.log('  时间:', firstTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('  开盘价:', firstCandle.open);
      console.log('  最高价:', firstCandle.high);
      console.log('  最低价:', firstCandle.low);
      console.log('  收盘价:', firstCandle.close);
      console.log('  成交量:', firstCandle.volume);

      // 最后一根K线（最新）
      const lastCandle = candles[candles.length - 1];
      const lastTime = new Date(lastCandle.time);
      console.log('\n📊 最后一根K线（最新）:');
      console.log('  时间:', lastTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('  开盘价:', lastCandle.open);
      console.log('  最高价:', lastCandle.high);
      console.log('  最低价:', lastCandle.low);
      console.log('  收盘价:', lastCandle.close);
      console.log('  成交量:', lastCandle.volume);

      // 计算统计数据
      const prices = candles.map(c => parseFloat(c.close));
      const highPrices = candles.map(c => parseFloat(c.high));
      const lowPrices = candles.map(c => parseFloat(c.low));
      const volumes = candles.map(c => parseFloat(c.volume));

      const maxPrice = Math.max(...highPrices);
      const minPrice = Math.min(...lowPrices);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const totalVolume = volumes.reduce((a, b) => a + b, 0);

      // 计算整体涨跌幅
      const totalChange = ((parseFloat(lastCandle.close) - parseFloat(firstCandle.open)) / parseFloat(firstCandle.open) * 100);

      console.log('\n📈 统计数据:');
      console.log('-----------------------------------');
      console.log('时间跨度:', firstTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }), '至', lastTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('K线数量:', candles.length, '根');
      console.log('最高价:', maxPrice.toFixed(2), 'USDT');
      console.log('最低价:', minPrice.toFixed(2), 'USDT');
      console.log('平均价:', avgPrice.toFixed(2), 'USDT');
      console.log('总成交量:', totalVolume.toFixed(4), 'BTC');
      console.log('整体涨跌幅:', totalChange.toFixed(2) + '%', totalChange >= 0 ? '📈' : '📉');
      console.log('价格波动:', ((maxPrice - minPrice) / minPrice * 100).toFixed(2) + '%');

      // 显示最近 5 根K线的详细信息
      console.log('\n📊 最近 5 根K线详情:');
      console.log('-----------------------------------');
      const recentCandles = candles.slice(-5);
      recentCandles.forEach((candle, index) => {
        const time = new Date(candle.time);
        const change = ((parseFloat(candle.close) - parseFloat(candle.open)) / parseFloat(candle.open) * 100).toFixed(2);
        const emoji = parseFloat(change) >= 0 ? '📈' : '📉';
        console.log(`${index + 1}. ${time.toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit' })} | O:${candle.open} H:${candle.high} L:${candle.low} C:${candle.close} | ${change}% ${emoji}`);
      });

      console.log('-----------------------------------');
    }

    return candles;
  } catch (error) {
    console.error('❌ 获取K线数据失败:', error);
    throw error;
  }
}

/**
 * 测试获取账户列表（私有接口）
 */
async function testGetAccounts() {
  console.log('\n=== 测试获取账户列表 ===\n');

  // 从环境变量读取 API 密钥
  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 WEEX_API_KEY, WEEX_SECRET_KEY, WEEX_PASSPHRASE');
    return;
  }

  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://api-contract.weex.com'
  );

  try {
    console.log('🔐 正在获取账户信息...');
    console.log('-----------------------------------');

    const accountData = await client.getAccounts();

    console.log('✅ 成功获取账户信息\n');

    // 显示账户基本信息
    console.log('📋 账户基本信息:');
    console.log('-----------------------------------');
    console.log('账户 ID:', accountData.account.id);
    console.log('用户 ID:', accountData.account.user_id);
    console.log('客户账户 ID:', accountData.account.client_account_id);
    console.log('账户状态:', accountData.account.status);
    console.log('是否系统账户:', accountData.account.is_system_account ? '是' : '否');
    console.log('每分钟订单限制:', accountData.account.create_order_rate_limit_per_minute);
    console.log('创建时间:', new Date(parseInt(accountData.account.created_time)).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    console.log('更新时间:', new Date(parseInt(accountData.account.updated_time)).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    console.log('-----------------------------------\n');

    // 显示杠杆设置
    console.log('⚙️  杠杆设置:');
    console.log('-----------------------------------');
    const leverageSettings = accountData.account.contract_id_to_leverage_setting;
    Object.entries(leverageSettings).forEach(([contractId, setting]) => {
      console.log(`合约 ID ${contractId}:`);
      console.log(`  逐仓多头杠杆: ${setting.isolated_long_leverage}x`);
      console.log(`  逐仓空头杠杆: ${setting.isolated_short_leverage}x`);
      console.log(`  全仓杠杆: ${setting.cross_leverage}x`);
      console.log(`  共享杠杆: ${setting.shared_leverage}x`);
    });
    console.log('-----------------------------------\n');

    // 显示费率设置
    console.log('💰 费率设置:');
    console.log('-----------------------------------');
    const feeSettings = accountData.account.contract_id_to_fee_setting;
    Object.entries(feeSettings).forEach(([contractId, setting]) => {
      console.log(`合约 ID ${contractId}:`);
      console.log(`  Maker 费率: ${(parseFloat(setting.maker_fee_rate) * 100).toFixed(4)}%`);
      console.log(`  Taker 费率: ${(parseFloat(setting.taker_fee_rate) * 100).toFixed(4)}%`);
      console.log(`  是否设置费率: ${setting.is_set_fee_rate ? '是' : '否'}`);
    });
    console.log('-----------------------------------\n');

    // 显示抵押品信息
    console.log('💎 抵押品信息:');
    console.log('-----------------------------------');
    console.log(`抵押品数量: ${accountData.collateral.length} 个\n`);

    accountData.collateral.forEach((collateral, index) => {
      console.log(`抵押品 ${index + 1}:`);
      console.log(`  币种 ID: ${collateral.coin_id}`);
      console.log(`  保证金模式: ${collateral.margin_mode}`);
      console.log(`  可用数量: ${parseFloat(collateral.amount).toFixed(6)}`);
      console.log(`  待存入: ${parseFloat(collateral.pending_deposit_amount).toFixed(6)}`);
      console.log(`  待提取: ${parseFloat(collateral.pending_withdraw_amount).toFixed(6)}`);
      console.log(`  是否清算中: ${collateral.is_liquidating ? '是' : '否'}`);
      console.log(`  累计存入: ${parseFloat(collateral.cum_deposit_amount).toFixed(6)}`);
      console.log(`  累计提取: ${parseFloat(collateral.cum_withdraw_amount).toFixed(6)}`);
      console.log(`  累计资金费用: ${parseFloat(collateral.cum_position_funding_amount).toFixed(6)}`);
      console.log('');
    });
    console.log('-----------------------------------\n');

    // 显示仓位信息
    console.log('📊 仓位信息:');
    console.log('-----------------------------------');
    console.log(`持仓数量: ${accountData.position.length} 个\n`);

    if (accountData.position.length > 0) {
      accountData.position.forEach((position, index) => {
        console.log(`仓位 ${index + 1}:`);
        console.log(`  仓位 ID: ${position.id}`);
        console.log(`  合约 ID: ${position.contract_id}`);
        console.log(`  方向: ${position.side === 'LONG' ? '多头 📈' : '空头 📉'}`);
        console.log(`  保证金模式: ${position.margin_mode}`);
        console.log(`  杠杆: ${position.leverage}x`);
        console.log(`  仓位大小: ${parseFloat(position.size).toFixed(4)}`);
        console.log(`  开仓价值: ${parseFloat(position.open_value).toFixed(2)}`);
        console.log(`  开仓手续费: ${parseFloat(position.open_fee).toFixed(6)}`);
        console.log(`  资金费用: ${parseFloat(position.funding_fee).toFixed(6)}`);
        console.log(`  累计开仓数量: ${parseFloat(position.cum_open_size).toFixed(2)}`);
        console.log(`  累计平仓数量: ${parseFloat(position.cum_close_size).toFixed(2)}`);
        console.log(`  累计资金费用: ${parseFloat(position.cum_funding_fee).toFixed(6)}`);
        console.log(`  创建时间: ${new Date(parseInt(position.created_time)).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
        console.log(`  更新时间: ${new Date(parseInt(position.updated_time)).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
        console.log('');
      });
    } else {
      console.log('当前无持仓');
    }
    console.log('-----------------------------------\n');

    // 显示版本信息
    console.log('📌 版本信息:', accountData.version);

    return accountData;
  } catch (error) {
    console.error('❌ 获取账户列表失败:', error);
    throw error;
  }
}

/**
 * 主测试函数
 */
async function main() {
  try {
    console.log('🚀 开始测试 Weex API 客户端\n');

    // 测试获取账户列表
    console.log('📝 注意：如果账户未开通合约交易，会返回业务错误');
    console.log('这是正常的，说明 API 签名和请求都是正确的\n');

    try {
      await testGetAccounts();
    } catch (error: any) {
      if (error.message.includes('40753')) {
        console.log('\n⚠️  账户合约交易功能未开通');
        console.log('错误代码: 40753');
        console.log('说明: API 签名验证通过，但账户需要开通合约交易功能');
        console.log('\n✅ 接口实现正确！签名认证成功！');
      } else {
        throw error;
      }
    }

    console.log('\n✅ 测试完成！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
main();
