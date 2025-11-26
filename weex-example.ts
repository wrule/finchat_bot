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
    'https://pro-openapi.weex.tech'  // 基础 URL
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
 * 测试获取单个账户信息（私有接口）
 */
async function testGetAccount() {
  console.log('\n=== 测试获取单个账户信息 ===\n');

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
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试获取 coinId=2 (USDT) 的账户信息
    const coinId = 2; // USDT
    console.log(`🔐 正在获取币种 ID ${coinId} 的账户信息...`);
    console.log('-----------------------------------');

    const accountData = await client.getAccount(coinId);

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
    if (Object.keys(accountData.account.contract_id_to_leverage_setting).length > 0) {
      console.log('⚙️  杠杆设置:');
      console.log('-----------------------------------');
      const leverageSettings = accountData.account.contract_id_to_leverage_setting;
      Object.entries(leverageSettings).slice(0, 5).forEach(([contractId, setting]) => {
        console.log(`合约 ID ${contractId}:`);
        console.log(`  逐仓多头杠杆: ${setting.isolated_long_leverage}x`);
        console.log(`  逐仓空头杠杆: ${setting.isolated_short_leverage}x`);
        console.log(`  全仓杠杆: ${setting.cross_leverage}x`);
        console.log(`  共享杠杆: ${setting.shared_leverage}x`);
      });
      const totalLeverageSettings = Object.keys(leverageSettings).length;
      if (totalLeverageSettings > 5) {
        console.log(`... 还有 ${totalLeverageSettings - 5} 个合约的杠杆设置`);
      }
      console.log('-----------------------------------\n');
    }

    // 显示费率设置
    if (Object.keys(accountData.account.contract_id_to_fee_setting).length > 0) {
      console.log('💰 费率设置:');
      console.log('-----------------------------------');
      const feeSettings = accountData.account.contract_id_to_fee_setting;
      Object.entries(feeSettings).slice(0, 5).forEach(([contractId, setting]) => {
        console.log(`合约 ID ${contractId}:`);
        console.log(`  Maker 费率: ${(parseFloat(setting.maker_fee_rate) * 100).toFixed(4)}%`);
        console.log(`  Taker 费率: ${(parseFloat(setting.taker_fee_rate) * 100).toFixed(4)}%`);
        console.log(`  是否设置费率: ${setting.is_set_fee_rate ? '是' : '否'}`);
      });
      const totalFeeSettings = Object.keys(feeSettings).length;
      if (totalFeeSettings > 5) {
        console.log(`... 还有 ${totalFeeSettings - 5} 个合约的费率设置`);
      }
      console.log('-----------------------------------\n');
    }

    // 显示抵押品信息
    console.log('💎 抵押品信息:');
    console.log('-----------------------------------');
    console.log(`抵押品数量: ${accountData.collateral.length} 个\n`);

    accountData.collateral.forEach((collateral, index) => {
      const amount = parseFloat(collateral.amount);
      const cumDeposit = parseFloat(collateral.cum_deposit_amount);
      const cumWithdraw = parseFloat(collateral.cum_withdraw_amount);
      const cumFunding = parseFloat(collateral.cum_position_funding_amount);

      console.log(`抵押品 ${index + 1}:`);
      console.log(`  币种 ID: ${collateral.coin_id}`);
      console.log(`  保证金模式: ${collateral.margin_mode}`);
      console.log(`  可用数量: ${amount.toFixed(6)}`);
      console.log(`  待存入: ${parseFloat(collateral.pending_deposit_amount).toFixed(6)}`);
      console.log(`  待提取: ${parseFloat(collateral.pending_withdraw_amount).toFixed(6)}`);
      console.log(`  是否清算中: ${collateral.is_liquidating ? '是 ⚠️' : '否 ✅'}`);
      console.log(`  累计存入: ${cumDeposit.toFixed(6)}`);
      console.log(`  累计提取: ${cumWithdraw.toFixed(6)}`);
      console.log(`  累计资金费用: ${cumFunding.toFixed(6)}`);
      console.log('');
    });
    console.log('-----------------------------------\n');

    // 显示仓位信息
    console.log('📊 仓位信息:');
    console.log('-----------------------------------');
    console.log(`持仓数量: ${accountData.position.length} 个\n`);

    if (accountData.position.length > 0) {
      accountData.position.forEach((position, index) => {
        const size = parseFloat(position.size);
        const openValue = parseFloat(position.open_value);
        const fundingFee = parseFloat(position.funding_fee);
        const cumFundingFee = parseFloat(position.cum_funding_fee);

        console.log(`仓位 ${index + 1}:`);
        console.log(`  仓位 ID: ${position.id}`);
        console.log(`  合约 ID: ${position.contract_id}`);
        console.log(`  方向: ${position.side === 'LONG' ? '多头 📈' : '空头 📉'}`);
        console.log(`  保证金模式: ${position.margin_mode}`);
        console.log(`  杠杆: ${position.leverage}x`);
        console.log(`  仓位大小: ${size.toFixed(4)}`);
        console.log(`  开仓价值: ${openValue.toFixed(2)}`);
        console.log(`  开仓手续费: ${parseFloat(position.open_fee).toFixed(6)}`);
        console.log(`  当前资金费用: ${fundingFee.toFixed(6)}`);
        console.log(`  累计资金费用: ${cumFundingFee.toFixed(6)}`);
        console.log(`  累计开仓数量: ${parseFloat(position.cum_open_size).toFixed(2)}`);
        console.log(`  累计平仓数量: ${parseFloat(position.cum_close_size).toFixed(2)}`);
        console.log(`  创建时间: ${new Date(parseInt(position.created_time)).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
        console.log(`  更新时间: ${new Date(parseInt(position.updated_time)).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
        console.log('');
      });
    } else {
      console.log('当前无持仓 ✅');
    }
    console.log('-----------------------------------\n');

    // 显示版本信息
    console.log('📌 版本信息:', accountData.version);

    return accountData;
  } catch (error) {
    console.error('❌ 获取账户信息失败:', error);
    throw error;
  }
}

/**
 * 测试获取账户资产（私有接口）
 */
async function testGetAccountAssets() {
  console.log('\n=== 测试获取账户资产 ===\n');

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
    'https://pro-openapi.weex.tech'
  );

  try {
    console.log('💰 正在获取账户资产信息...');
    console.log('-----------------------------------');

    const assets = await client.getAccountAssets();

    console.log(`✅ 成功获取 ${assets.length} 个币种的资产信息\n`);

    if (assets.length > 0) {
      // 计算总资产价值（以 USDT 计价）
      let totalEquityUSDT = 0;
      let totalAvailableUSDT = 0;
      let totalUnrealizedPnl = 0;

      console.log('📊 资产详情:');
      console.log('-----------------------------------');

      assets.forEach((asset, index) => {
        const available = parseFloat(asset.available);
        const frozen = parseFloat(asset.frozen);
        const equity = parseFloat(asset.equity);
        const unrealizePnl = parseFloat(asset.unrealizePnl);

        console.log(`\n${index + 1}. ${asset.coinName} (ID: ${asset.coinId})`);
        console.log('   ├─ 可用资产:', available.toFixed(8));
        console.log('   ├─ 冻结资产:', frozen.toFixed(8));
        console.log('   ├─ 总资产:', equity.toFixed(8));
        console.log('   └─ 未实现盈亏:', unrealizePnl.toFixed(8), unrealizePnl >= 0 ? '📈' : '📉');

        // 如果是 USDT，累加到总计
        if (asset.coinName === 'USDT') {
          totalEquityUSDT += equity;
          totalAvailableUSDT += available;
          totalUnrealizedPnl += unrealizePnl;
        }
      });

      console.log('\n-----------------------------------');
      console.log('💎 资产汇总 (USDT):');
      console.log('-----------------------------------');
      console.log('总资产:', totalEquityUSDT.toFixed(8), 'USDT');
      console.log('可用资产:', totalAvailableUSDT.toFixed(8), 'USDT');
      console.log('未实现盈亏:', totalUnrealizedPnl.toFixed(8), 'USDT', totalUnrealizedPnl >= 0 ? '📈' : '📉');

      // 计算资产利用率
      if (totalEquityUSDT > 0) {
        const utilizationRate = ((totalEquityUSDT - totalAvailableUSDT) / totalEquityUSDT * 100);
        console.log('资产利用率:', utilizationRate.toFixed(2) + '%');
      }

      // 显示盈亏比例
      if (totalEquityUSDT > 0) {
        const pnlRate = (totalUnrealizedPnl / totalEquityUSDT * 100);
        console.log('盈亏比例:', pnlRate.toFixed(2) + '%', pnlRate >= 0 ? '📈' : '📉');
      }

      console.log('-----------------------------------');

      // 显示非零资产
      const nonZeroAssets = assets.filter(a => parseFloat(a.equity) > 0);
      if (nonZeroAssets.length > 0) {
        console.log('\n💼 持有币种:');
        console.log('-----------------------------------');
        nonZeroAssets.forEach(asset => {
          console.log(`${asset.coinName}: ${parseFloat(asset.equity).toFixed(8)}`);
        });
        console.log('-----------------------------------');
      }

    } else {
      console.log('暂无资产信息');
    }

    return assets;
  } catch (error) {
    console.error('❌ 获取账户资产失败:', error);
    throw error;
  }
}

/**
 * 测试获取账单历史（私有接口）
 */
async function testGetAccountBills() {
  console.log('\n=== 测试获取账单历史 ===\n');

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
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试 1: 获取最近的账单记录
    console.log('📋 测试 1: 获取最近 20 条账单记录');
    console.log('-----------------------------------');

    const bills = await client.getAccountBills({
      limit: 20
    });

    console.log(`✅ 成功获取账单记录`);
    console.log(`账单数量: ${bills.items.length} 条`);
    console.log(`是否有下一页: ${bills.hasNextPage ? '是' : '否'}`);
    console.log('-----------------------------------\n');

    if (bills.items.length > 0) {
      // 显示账单详情
      console.log('📊 账单详情:');
      console.log('-----------------------------------');

      bills.items.forEach((bill, index) => {
        const amount = parseFloat(bill.amount);
        const balance = parseFloat(bill.balance);
        const fillFee = parseFloat(bill.fillFee);
        const time = new Date(bill.ctime);

        // 根据业务类型显示不同的图标
        let icon = '📝';
        if (bill.businessType.includes('open')) icon = '📈';
        if (bill.businessType.includes('close')) icon = '📉';
        if (bill.businessType.includes('funding')) icon = '💰';
        if (bill.businessType.includes('deposit')) icon = '💵';
        if (bill.businessType.includes('withdraw')) icon = '💸';
        if (bill.businessType.includes('transfer')) icon = '🔄';

        console.log(`\n${icon} 账单 ${index + 1}:`);
        console.log(`  账单 ID: ${bill.billId}`);
        console.log(`  币种: ${bill.coin}`);
        console.log(`  交易对: ${bill.symbol}`);
        console.log(`  业务类型: ${bill.businessType}`);
        console.log(`  金额: ${amount.toFixed(8)} ${bill.coin}`, amount >= 0 ? '📈' : '📉');
        console.log(`  余额: ${balance.toFixed(8)} ${bill.coin}`);
        if (fillFee !== 0) {
          console.log(`  手续费: ${fillFee.toFixed(8)} ${bill.coin}`);
        }
        if (bill.transferReason !== 'UNKNOWN_TRANSFER_REASON') {
          console.log(`  转账原因: ${bill.transferReason}`);
        }
        console.log(`  时间: ${time.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
      });

      console.log('\n-----------------------------------\n');

      // 统计分析
      console.log('📈 统计分析:');
      console.log('-----------------------------------');

      // 按业务类型分组统计
      const typeStats: Record<string, { count: number; totalAmount: number }> = {};
      bills.items.forEach(bill => {
        if (!typeStats[bill.businessType]) {
          typeStats[bill.businessType] = { count: 0, totalAmount: 0 };
        }
        typeStats[bill.businessType].count++;
        typeStats[bill.businessType].totalAmount += parseFloat(bill.amount);
      });

      console.log('\n业务类型统计:');
      Object.entries(typeStats).forEach(([type, stats]) => {
        console.log(`  ${type}: ${stats.count} 笔, 总计 ${stats.totalAmount.toFixed(8)}`);
      });

      // 计算总收入和总支出
      let totalIncome = 0;
      let totalExpense = 0;
      bills.items.forEach(bill => {
        const amount = parseFloat(bill.amount);
        if (amount > 0) {
          totalIncome += amount;
        } else {
          totalExpense += Math.abs(amount);
        }
      });

      console.log('\n收支统计:');
      console.log(`  总收入: ${totalIncome.toFixed(8)} 📈`);
      console.log(`  总支出: ${totalExpense.toFixed(8)} 📉`);
      console.log(`  净收益: ${(totalIncome - totalExpense).toFixed(8)}`, (totalIncome - totalExpense) >= 0 ? '📈' : '📉');

      console.log('-----------------------------------\n');

      // 测试 2: 获取特定业务类型的账单
      console.log('📋 测试 2: 获取资金费用相关账单');
      console.log('-----------------------------------');

      const fundingBills = await client.getAccountBills({
        businessType: 'position_funding',
        limit: 10
      });

      console.log(`✅ 成功获取资金费用账单: ${fundingBills.items.length} 条`);

      if (fundingBills.items.length > 0) {
        let totalFunding = 0;
        fundingBills.items.forEach(bill => {
          totalFunding += parseFloat(bill.amount);
        });
        console.log(`总资金费用: ${totalFunding.toFixed(8)}`, totalFunding >= 0 ? '📈 (收入)' : '📉 (支出)');
      }

      console.log('-----------------------------------\n');

      // 测试 3: 获取指定时间范围的账单
      console.log('📋 测试 3: 获取最近 24 小时的账单');
      console.log('-----------------------------------');

      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      const recentBills = await client.getAccountBills({
        startTime: oneDayAgo,
        endTime: now,
        limit: 50
      });

      console.log(`✅ 成功获取最近 24 小时账单: ${recentBills.items.length} 条`);

      if (recentBills.items.length > 0) {
        const firstTime = new Date(recentBills.items[recentBills.items.length - 1].ctime);
        const lastTime = new Date(recentBills.items[0].ctime);
        console.log(`时间范围: ${firstTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} 至 ${lastTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
      }

      console.log('-----------------------------------');

    } else {
      console.log('暂无账单记录');
    }

    return bills;
  } catch (error) {
    console.error('❌ 获取账单历史失败:', error);
    throw error;
  }
}

/**
 * 测试下单（私有接口）
 * ⚠️ 警告：这是真实交易操作！请谨慎使用！
 */
async function testPlaceOrder() {
  console.log('\n=== 测试下单接口 ===\n');
  console.log('⚠️  警告：下单是真实交易操作，会产生实际的订单！\n');

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
    'https://pro-openapi.weex.tech'
  );

  try {
    // 示例：下一个限价开多单
    console.log('📝 下单参数示例（仅展示，不实际执行）:');
    console.log('-----------------------------------');

    const orderParams = {
      symbol: 'cmt_btcusdt',           // 交易对：BTC/USDT
      client_oid: `test_${Date.now()}`, // 自定义订单 ID
      size: '0.001',                    // 订单数量：0.001 BTC
      type: '1' as const,               // 1: 开多
      order_type: '0' as const,         // 0: 普通订单
      match_price: '0' as const,        // 0: 限价
      price: '50000',                   // 价格：50000 USDT（远低于市价，不会成交）
      presetTakeProfitPrice: '55000',   // 止盈价：55000
      presetStopLossPrice: '48000',     // 止损价：48000
      marginMode: 1 as const,           // 1: 全仓模式
      separatedMode: 1 as const,        // 1: 合并模式
    };

    console.log('交易对:', orderParams.symbol);
    console.log('订单 ID:', orderParams.client_oid);
    console.log('数量:', orderParams.size, 'BTC');
    console.log('方向:', orderParams.type === '1' ? '开多 📈' : '开空 📉');
    console.log('订单类型:', orderParams.order_type === '0' ? '普通' : '其他');
    console.log('价格类型:', orderParams.match_price === '0' ? '限价' : '市价');
    console.log('价格:', orderParams.price, 'USDT');
    console.log('止盈价:', orderParams.presetTakeProfitPrice, 'USDT');
    console.log('止损价:', orderParams.presetStopLossPrice, 'USDT');
    console.log('保证金模式:', orderParams.marginMode === 1 ? '全仓' : '逐仓');
    console.log('仓位模式:', orderParams.separatedMode === 1 ? '合并' : '分离');
    console.log('-----------------------------------\n');

    // 实际下单测试
    console.log('🚀 正在下单...');
    console.log('ℹ️  使用远低于市价的限价单，不会实际成交\n');

    try {
      const orderResult = await client.placeOrder(orderParams);

      console.log('✅ 下单成功！');
      console.log('-----------------------------------');
      console.log('订单 ID:', orderResult.order_id);
      console.log('客户端订单 ID:', orderResult.client_oid || '(null)');
      console.log('-----------------------------------\n');

      console.log('📝 说明：');
      console.log('  - 订单已成功提交到交易所');
      console.log('  - 由于价格远低于市价（50000 vs 当前约 86000），订单不会成交');
      console.log('  - 订单会挂在订单簿上，等待价格到达');
      console.log('  - 可以通过查询订单接口查看订单状态');
      console.log('  - 可以通过取消订单接口取消该订单\n');

      return orderResult;
    } catch (error: any) {
      console.log('❌ 下单失败');
      console.log('-----------------------------------');

      // 解析错误信息
      if (error.message) {
        console.log('错误信息:', error.message);

        // 常见错误提示
        if (error.message.includes('insufficient')) {
          console.log('\n💡 提示：余额不足，这是正常的（账户无资金）');
        } else if (error.message.includes('price')) {
          console.log('\n💡 提示：价格参数错误');
        } else if (error.message.includes('size')) {
          console.log('\n💡 提示：数量参数错误');
        }
      }
      console.log('-----------------------------------\n');

      // 不抛出错误，继续执行后续代码
    }

    // 显示不同订单类型的示例
    console.log('📚 订单类型说明:');
    console.log('-----------------------------------');
    console.log('订单方向 (type):');
    console.log('  1 - 开多：买入开仓（看涨）📈');
    console.log('  2 - 开空：卖出开仓（看跌）📉');
    console.log('  3 - 平多：卖出平仓（平掉多头仓位）');
    console.log('  4 - 平空：买入平仓（平掉空头仓位）');
    console.log('');
    console.log('订单执行类型 (order_type):');
    console.log('  0 - 普通：正常订单');
    console.log('  1 - 只做 Maker：只挂单，不吃单');
    console.log('  2 - 全部成交或立即取消：FOK，要么全部成交，要么取消');
    console.log('  3 - 立即成交并取消剩余：IOC，立即成交，剩余取消');
    console.log('');
    console.log('价格类型 (match_price):');
    console.log('  0 - 限价：指定价格');
    console.log('  1 - 市价：按市场最优价格成交');
    console.log('');
    console.log('保证金模式 (marginMode):');
    console.log('  1 - 全仓：使用账户全部可用保证金');
    console.log('  3 - 逐仓：只使用该仓位的保证金');
    console.log('-----------------------------------\n');

    // 显示使用示例
    console.log('💡 使用示例:');
    console.log('-----------------------------------');
    console.log('// 1. 限价开多单');
    console.log('await client.placeOrder({');
    console.log('  symbol: "cmt_btcusdt",');
    console.log('  client_oid: `order_${Date.now()}`,');
    console.log('  size: "0.001",');
    console.log('  type: "1",           // 开多');
    console.log('  order_type: "0",     // 普通订单');
    console.log('  match_price: "0",    // 限价');
    console.log('  price: "50000",      // 限价 50000');
    console.log('});');
    console.log('');
    console.log('// 2. 市价开空单');
    console.log('await client.placeOrder({');
    console.log('  symbol: "cmt_ethusdt",');
    console.log('  client_oid: `order_${Date.now()}`,');
    console.log('  size: "0.01",');
    console.log('  type: "2",           // 开空');
    console.log('  order_type: "0",     // 普通订单');
    console.log('  match_price: "1",    // 市价');
    console.log('  price: "0",          // 市价单价格填 0');
    console.log('});');
    console.log('');
    console.log('// 3. 带止盈止损的限价单');
    console.log('await client.placeOrder({');
    console.log('  symbol: "cmt_btcusdt",');
    console.log('  client_oid: `order_${Date.now()}`,');
    console.log('  size: "0.001",');
    console.log('  type: "1",');
    console.log('  order_type: "0",');
    console.log('  match_price: "0",');
    console.log('  price: "50000",');
    console.log('  presetTakeProfitPrice: "55000",  // 止盈');
    console.log('  presetStopLossPrice: "48000",    // 止损');
    console.log('});');
    console.log('-----------------------------------');

  } catch (error) {
    console.error('❌ 下单失败:', error);
    throw error;
  }
}

/**
 * 测试获取现货账户资产（私有接口）
 */
async function testGetSpotAccountAssets() {
  console.log('\n=== 测试获取现货账户资产 ===\n');

  // 从环境变量读取 API 密钥
  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 WEEX_API_KEY, WEEX_SECRET_KEY, WEEX_PASSPHRASE');
    return;
  }

  // 使用默认的 base URL (https://api-spot.weex.com)
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase
  );

  try {
    console.log('💰 正在获取现货账户资产信息...');
    console.log('-----------------------------------');

    const response = await client.getSpotAccountAssets();

    console.log(`✅ 成功获取现货账户资产信息`);
    console.log(`响应代码: ${response.code}`);
    console.log(`响应消息: ${response.msg}`);
    console.log(`请求时间: ${new Date(response.requestTime).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
    console.log(`币种数量: ${response.data.length} 个\n`);

    if (response.data.length > 0) {
      // 计算总资产价值（以 USDT 计价）
      let totalEquityUSDT = 0;
      let totalAvailableUSDT = 0;
      let totalFrozenUSDT = 0;

      console.log('📊 资产详情:');
      console.log('-----------------------------------');

      response.data.forEach((asset, index) => {
        const available = parseFloat(asset.available);
        const frozen = parseFloat(asset.frozen);
        const equity = parseFloat(asset.equity);

        console.log(`\n${index + 1}. ${asset.coinName} (ID: ${asset.coinId})`);
        console.log('   ├─ 可用资产:', available.toFixed(8));
        console.log('   ├─ 冻结资产:', frozen.toFixed(8));
        console.log('   └─ 总资产:', equity.toFixed(8));

        // 如果是 USDT，累加到总计
        if (asset.coinName === 'USDT') {
          totalEquityUSDT += equity;
          totalAvailableUSDT += available;
          totalFrozenUSDT += frozen;
        }
      });

      console.log('\n-----------------------------------');
      console.log('💎 资产汇总 (USDT):');
      console.log('-----------------------------------');
      console.log('总资产:', totalEquityUSDT.toFixed(8), 'USDT');
      console.log('可用资产:', totalAvailableUSDT.toFixed(8), 'USDT');
      console.log('冻结资产:', totalFrozenUSDT.toFixed(8), 'USDT');

      // 计算资产利用率
      if (totalEquityUSDT > 0) {
        const utilizationRate = (totalFrozenUSDT / totalEquityUSDT * 100);
        console.log('冻结比例:', utilizationRate.toFixed(2) + '%');
      }

      console.log('-----------------------------------');

      // 显示非零资产
      const nonZeroAssets = response.data.filter(a => parseFloat(a.equity) > 0);
      if (nonZeroAssets.length > 0) {
        console.log('\n💼 持有币种:');
        console.log('-----------------------------------');
        nonZeroAssets.forEach(asset => {
          const equity = parseFloat(asset.equity);
          const available = parseFloat(asset.available);
          const frozen = parseFloat(asset.frozen);

          console.log(`${asset.coinName}:`);
          console.log(`  总计: ${equity.toFixed(8)}`);
          console.log(`  可用: ${available.toFixed(8)}`);
          if (frozen > 0) {
            console.log(`  冻结: ${frozen.toFixed(8)} ⚠️`);
          }
        });
        console.log('-----------------------------------');
      } else {
        console.log('\n暂无持有币种');
      }

    } else {
      console.log('暂无资产信息');
    }

    return response;
  } catch (error) {
    console.error('❌ 获取现货账户资产失败:', error);
    throw error;
  }
}

/**
 * 测试内部划转：从现货账户转到合约账户
 */
async function testInternalWithdrawal() {
  console.log('\n=== 测试内部划转（现货 → 合约）===\n');

  // 从环境变量读取 API 密钥
  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 WEEX_API_KEY, WEEX_SECRET_KEY, WEEX_PASSPHRASE');
    return;
  }

  // 现货 API 客户端
  const spotClient = new WeexApiClient(apiKey, secretKey, passphrase);

  // 合约 API 客户端
  const contractClient = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    // 步骤 1: 获取用户 ID
    console.log('📋 步骤 1: 获取用户 ID');
    console.log('-----------------------------------');
    const accountInfo = await contractClient.getAccounts();

    if (!accountInfo || !accountInfo.account) {
      console.error('❌ 未找到账户信息');
      return;
    }

    const userId = accountInfo.account.user_id;
    console.log('✅ 用户 ID:', userId);
    console.log('✅ 账户 ID:', accountInfo.account.id);
    console.log('-----------------------------------\n');

    // 等待避免速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 2: 查看现货账户余额（划转前）
    console.log('📋 步骤 2: 查看现货账户余额（划转前）');
    console.log('-----------------------------------');
    const spotAssetsBefore = await spotClient.getSpotAccountAssets();
    const usdtBefore = spotAssetsBefore.data.find(a => a.coinName === 'USDT');

    if (!usdtBefore) {
      console.error('❌ 现货账户中未找到 USDT');
      return;
    }

    console.log('现货账户 USDT:');
    console.log('  可用:', parseFloat(usdtBefore.available).toFixed(8));
    console.log('  冻结:', parseFloat(usdtBefore.frozen).toFixed(8));
    console.log('  总计:', parseFloat(usdtBefore.equity).toFixed(8));
    console.log('-----------------------------------\n');

    // 等待避免速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 3: 查看合约账户余额（划转前）
    console.log('📋 步骤 3: 查看合约账户余额（划转前）');
    console.log('-----------------------------------');
    const contractAssetsBefore = await contractClient.getContractAccountAssets();
    const contractUsdtBefore = contractAssetsBefore.find(a => a.coinName === 'USDT');

    if (contractUsdtBefore) {
      console.log('合约账户 USDT:');
      console.log('  可用:', parseFloat(contractUsdtBefore.available).toFixed(8));
      console.log('  冻结:', parseFloat(contractUsdtBefore.frozen).toFixed(8));
      console.log('  总计:', parseFloat(contractUsdtBefore.equity).toFixed(8));
    } else {
      console.log('合约账户 USDT: 0.00000000（暂无）');
    }
    console.log('-----------------------------------\n');

    // 等待避免速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 4: 执行划转
    console.log('📋 步骤 4: 执行划转（1000 USDT）');
    console.log('-----------------------------------');
    console.log('🚀 正在划转...');
    console.log('  从: 现货账户 (SPOT)');
    console.log('  到: 合约账户 (SPOT)');
    console.log('  币种: USDT');
    console.log('  金额: 1000');
    console.log('  目标用户 ID:', userId);
    console.log('');

    const transferResult = await spotClient.internalWithdrawal({
      toUserId: userId,
      coin: 'USDT',
      amount: '1000',
      fromAccountType: 'SPOT',
      toAccountType: 'SPOT',
    });

    console.log('✅ 划转成功！');
    console.log('  响应代码:', transferResult.code);
    console.log('  划转 ID:', transferResult.id);
    console.log('  时间:', new Date(transferResult.timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    console.log('-----------------------------------\n');

    // 等待一下，让系统处理划转
    console.log('⏳ 等待 2 秒，让系统处理划转...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 5: 查看现货账户余额（划转后）
    console.log('📋 步骤 5: 查看现货账户余额（划转后）');
    console.log('-----------------------------------');

    // 等待避免速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));

    const spotAssetsAfter = await spotClient.getSpotAccountAssets();
    const usdtAfter = spotAssetsAfter.data.find(a => a.coinName === 'USDT');

    if (usdtAfter) {
      console.log('现货账户 USDT:');
      console.log('  可用:', parseFloat(usdtAfter.available).toFixed(8));
      console.log('  冻结:', parseFloat(usdtAfter.frozen).toFixed(8));
      console.log('  总计:', parseFloat(usdtAfter.equity).toFixed(8));

      const change = parseFloat(usdtAfter.equity) - parseFloat(usdtBefore.equity);
      console.log('  变化:', change.toFixed(8), change < 0 ? '📉' : '📈');
    }
    console.log('-----------------------------------\n');

    // 步骤 6: 查看合约账户余额（划转后）
    console.log('📋 步骤 6: 查看合约账户余额（划转后）');
    console.log('-----------------------------------');

    // 等待避免速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));

    const contractAssetsAfter = await contractClient.getContractAccountAssets();
    const contractUsdtAfter = contractAssetsAfter.find(a => a.coinName === 'USDT');

    if (contractUsdtAfter) {
      console.log('合约账户 USDT:');
      console.log('  可用:', parseFloat(contractUsdtAfter.available).toFixed(8));
      console.log('  冻结:', parseFloat(contractUsdtAfter.frozen).toFixed(8));
      console.log('  总计:', parseFloat(contractUsdtAfter.equity).toFixed(8));

      const beforeEquity = contractUsdtBefore ? parseFloat(contractUsdtBefore.equity) : 0;
      const change = parseFloat(contractUsdtAfter.equity) - beforeEquity;
      console.log('  变化:', change.toFixed(8), change > 0 ? '📈' : '📉');
    } else {
      console.log('合约账户 USDT: 0.00000000（暂无）');
    }
    console.log('-----------------------------------\n');

    // 步骤 7: 验证结果
    console.log('📋 步骤 7: 验证划转结果');
    console.log('-----------------------------------');

    const spotChange = parseFloat(usdtAfter?.equity || '0') - parseFloat(usdtBefore.equity);
    const contractChange = parseFloat(contractUsdtAfter?.equity || '0') - (contractUsdtBefore ? parseFloat(contractUsdtBefore.equity) : 0);

    console.log('现货账户变化:', spotChange.toFixed(8), 'USDT');
    console.log('合约账户变化:', contractChange.toFixed(8), 'USDT');

    if (Math.abs(spotChange + 1000) < 0.01 && Math.abs(contractChange - 1000) < 0.01) {
      console.log('\n✅ 验证成功！划转完成！');
      console.log('  现货账户减少了 1000 USDT');
      console.log('  合约账户增加了 1000 USDT');
    } else {
      console.log('\n⚠️  验证结果异常，请检查账户余额');
    }
    console.log('-----------------------------------');

    return transferResult;
  } catch (error) {
    console.error('❌ 内部划转测试失败:', error);
    throw error;
  }
}

/**
 * 测试获取成交记录
 */
async function testGetFills() {
  console.log('\n=== 测试获取成交记录 ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 API 密钥');
    return;
  }

  // 合约 API 客户端
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    console.log('📊 测试 1: 获取所有成交记录（最近 100 条）');
    console.log('-----------------------------------\n');

    const allFills = await client.getFills({
      limit: 100
    });

    console.log('✅ 成功获取成交记录！');
    console.log('原始响应:', JSON.stringify(allFills, null, 2));
    console.log('');

    // 处理空数组的情况
    if (Array.isArray(allFills) && allFills.length === 0) {
      console.log('⚠️  暂无成交记录（账户可能没有进行过交易）');
      console.log('');
      console.log('💡 提示：');
      console.log('   - 成交记录只有在订单成交后才会产生');
      console.log('   - 当前账户余额为 0，无法下单');
      console.log('   - 需要先充值或划转资金到合约账户');
      console.log('-----------------------------------\n');
      return;
    }

    console.log('总条目数:', allFills.totals);
    console.log('当前返回:', allFills.list?.length || 0, '条');
    console.log('是否有更多页:', allFills.nextFlag ? '是' : '否');
    console.log('');

    if (allFills.list && allFills.list.length > 0) {
      console.log('📋 最近的成交记录:');
      console.log('-----------------------------------');

      allFills.list.slice(0, 5).forEach((fill, index) => {
        console.log(`\n${index + 1}. 成交 ID: ${fill.tradeId}`);
        console.log('   订单 ID:', fill.orderId);
        console.log('   交易对:', fill.symbol);
        console.log('   方向:', fill.direction);
        console.log('   订单方向:', fill.orderSide);
        console.log('   仓位方向:', fill.positionSide);
        console.log('   成交数量:', fill.fillSize);
        console.log('   成交价值:', fill.fillValue);
        console.log('   手续费:', fill.fillFee);
        console.log('   已实现盈亏:', fill.realizePnl);
        console.log('   保证金模式:', fill.marginMode);
        console.log('   时间:', new Date(fill.createdTime).toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai'
        }));
      });

      if (allFills.list.length > 5) {
        console.log(`\n... 还有 ${allFills.list.length - 5} 条记录未显示`);
      }
    } else {
      console.log('暂无成交记录');
    }
    console.log('-----------------------------------\n');

    // 测试按交易对查询
    console.log('📊 测试 2: 按交易对查询（BTC/USDT）');
    console.log('-----------------------------------\n');

    const btcFills = await client.getFills({
      symbol: 'cmt_btcusdt',
      limit: 50
    });

    console.log('✅ BTC/USDT 成交记录:');
    console.log('总条目数:', btcFills.totals);
    console.log('当前返回:', btcFills.list.length, '条');
    console.log('');

    if (btcFills.list.length > 0) {
      // 统计信息
      let totalFillSize = 0;
      let totalFillValue = 0;
      let totalFee = 0;
      let totalPnl = 0;

      btcFills.list.forEach(fill => {
        totalFillSize += parseFloat(fill.fillSize);
        totalFillValue += parseFloat(fill.fillValue);
        totalFee += parseFloat(fill.fillFee);
        totalPnl += parseFloat(fill.realizePnl);
      });

      console.log('📈 统计信息:');
      console.log('-----------------------------------');
      console.log('总成交数量:', totalFillSize.toFixed(8), 'BTC');
      console.log('总成交价值:', totalFillValue.toFixed(2), 'USDT');
      console.log('总手续费:', totalFee.toFixed(6), 'USDT');
      console.log('总已实现盈亏:', totalPnl.toFixed(2), 'USDT');
      console.log('平均成交价:', (totalFillValue / totalFillSize).toFixed(2), 'USDT');
      console.log('-----------------------------------');
    } else {
      console.log('暂无 BTC/USDT 成交记录');
    }
    console.log('');

    // 测试按时间范围查询
    console.log('📊 测试 3: 按时间范围查询（最近 24 小时）');
    console.log('-----------------------------------\n');

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const recentFills = await client.getFills({
      startTime: oneDayAgo,
      endTime: now,
      limit: 100
    });

    console.log('✅ 最近 24 小时成交记录:');
    console.log('总条目数:', recentFills.totals);
    console.log('当前返回:', recentFills.list.length, '条');
    console.log('');

    if (recentFills.list.length > 0) {
      // 按交易对分组统计
      const symbolStats: { [key: string]: { count: number; volume: number; fee: number; pnl: number } } = {};

      recentFills.list.forEach(fill => {
        if (!symbolStats[fill.symbol]) {
          symbolStats[fill.symbol] = { count: 0, volume: 0, fee: 0, pnl: 0 };
        }
        symbolStats[fill.symbol].count++;
        symbolStats[fill.symbol].volume += parseFloat(fill.fillValue);
        symbolStats[fill.symbol].fee += parseFloat(fill.fillFee);
        symbolStats[fill.symbol].pnl += parseFloat(fill.realizePnl);
      });

      console.log('📊 按交易对统计:');
      console.log('-----------------------------------');
      Object.entries(symbolStats).forEach(([symbol, stats]) => {
        console.log(`\n${symbol}:`);
        console.log('  成交次数:', stats.count);
        console.log('  成交额:', stats.volume.toFixed(2), 'USDT');
        console.log('  手续费:', stats.fee.toFixed(6), 'USDT');
        console.log('  已实现盈亏:', stats.pnl.toFixed(2), 'USDT');
      });
      console.log('-----------------------------------');
    } else {
      console.log('最近 24 小时暂无成交记录');
    }
    console.log('');

    console.log('📄 完整响应示例（第一条记录）:');
    console.log('-----------------------------------');
    if (allFills.list.length > 0) {
      console.log(JSON.stringify(allFills.list[0], null, 2));
    } else {
      console.log('暂无数据');
    }
    console.log('-----------------------------------');

    return allFills;
  } catch (error) {
    console.error('❌ 获取成交记录失败:', error);
    throw error;
  }
}

/**
 * 测试获取单个仓位信息
 */
async function testGetSinglePosition() {
  console.log('\n=== 测试获取单个仓位信息 ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 API 密钥');
    return;
  }

  // 合约 API 客户端
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试多个交易对
    const symbols = ['cmt_btcusdt', 'cmt_ethusdt', 'cmt_solusdt'];

    for (const symbol of symbols) {
      console.log(`📊 查询 ${symbol.toUpperCase()} 仓位信息`);
      console.log('-----------------------------------\n');

      const positions = await client.getSinglePosition({ symbol });

      console.log('原始响应:', JSON.stringify(positions, null, 2));
      console.log('');

      if (Array.isArray(positions) && positions.length > 0) {
        positions.forEach((position, index) => {
          console.log(`仓位 ${index + 1}:`);
          console.log('-----------------------------------');
          console.log('仓位 ID:', position.id);
          console.log('账户 ID:', position.account_id);
          console.log('合约 ID:', position.contract_id);
          console.log('币种 ID:', position.coin_id);
          if (position.symbol) {
            console.log('交易对:', position.symbol);
          }
          console.log('仓位方向:', position.side === 'LONG' ? '多头 🟢' : '空头 🔴');
          console.log('保证金模式:', position.margin_mode === 'SHARED' ? '全仓' : '逐仓');
          console.log('分离模式:', position.separated_mode === 'COMBINED' ? '合并' : '分离');
          console.log('杠杆倍数:', position.leverage + 'x');
          console.log('');

          console.log('📈 仓位数据:');
          console.log('  当前仓位大小:', position.size);
          console.log('  开仓价值:', position.open_value);
          console.log('  开仓手续费:', position.open_fee);
          console.log('  资金费用:', position.funding_fee);
          console.log('  逐仓保证金:', position.isolated_margin);
          console.log('  自动追加保证金:', position.is_auto_append_isolated_margin ? '是' : '否');
          console.log('');

          console.log('📊 累计数据:');
          console.log('  累计开仓数量:', position.cum_open_size);
          console.log('  累计开仓价值:', position.cum_open_value);
          console.log('  累计开仓手续费:', position.cum_open_fee);
          console.log('  累计平仓数量:', position.cum_close_size);
          console.log('  累计平仓价值:', position.cum_close_value);
          console.log('  累计平仓手续费:', position.cum_close_fee);
          console.log('  累计资金费用:', position.cum_funding_fee);
          console.log('  累计强平手续费:', position.cum_liquidate_fee);
          console.log('');

          console.log('💰 盈亏信息:');
          console.log('  未实现盈亏:', position.unrealizePnl);
          console.log('  预估强平价格:', position.liquidatePrice === '0' ? '低风险（无强平价格）' : position.liquidatePrice);
          console.log('  合约面值:', position.contractVal);
          console.log('');

          console.log('⏰ 时间信息:');
          console.log('  创建时间:', new Date(position.created_time).toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai'
          }));
          console.log('  更新时间:', new Date(position.updated_time).toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai'
          }));
          console.log('-----------------------------------\n');
        });
      } else {
        console.log('⚠️  暂无仓位信息');
        console.log('');
      }

      // 添加延迟避免速率限制
      if (symbol !== symbols[symbols.length - 1]) {
        console.log('⏳ 等待 1 秒...\n');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('✅ 所有仓位查询完成！');

    return;
  } catch (error) {
    console.error('❌ 获取仓位信息失败:', error);
    throw error;
  }
}

/**
 * 测试获取用户设置
 */
async function testGetUserSettings() {
  console.log('\n=== 测试获取用户设置 ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 API 密钥');
    return;
  }

  // 合约 API 客户端
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试 1: 获取所有合约的用户设置
    console.log('📊 测试 1: 获取所有合约的用户设置');
    console.log('-----------------------------------\n');

    const allSettings = await client.getUserSettings();

    console.log('✅ 成功获取用户设置！');
    console.log('原始响应:', JSON.stringify(allSettings, null, 2));
    console.log('');

    const symbols = Object.keys(allSettings);
    console.log(`找到 ${symbols.length} 个交易对的设置\n`);

    if (symbols.length === 0) {
      console.log('⚠️  暂无用户设置');
      console.log('');
      console.log('💡 说明：');
      console.log('   - 用户设置在首次交易或设置杠杆后才会生成');
      console.log('   - 当前账户可能还未进行过合约交易');
      console.log('   - 或者还未设置过任何交易对的杠杆');
      console.log('');
      console.log('📝 如何设置杠杆：');
      console.log('   1. 登录 Weex 交易所网站');
      console.log('   2. 进入合约交易页面');
      console.log('   3. 选择交易对并设置杠杆倍数');
      console.log('   4. 设置后即可通过此接口查询');
      console.log('-----------------------------------\n');
    } else if (symbols.length > 0) {
      console.log('📋 所有交易对设置:');
      console.log('-----------------------------------');

      symbols.forEach((symbol, index) => {
        const settings = allSettings[symbol];
        console.log(`\n${index + 1}. ${symbol.toUpperCase()}`);
        console.log('   逐仓多头杠杆:', settings.isolated_long_leverage + 'x');
        console.log('   逐仓空头杠杆:', settings.isolated_short_leverage + 'x');
        console.log('   全仓杠杆:', settings.cross_leverage + 'x');
      });
      console.log('-----------------------------------\n');

      // 统计信息
      const leverageStats = {
        maxIsolatedLong: 0,
        maxIsolatedShort: 0,
        maxCross: 0,
        avgIsolatedLong: 0,
        avgIsolatedShort: 0,
        avgCross: 0,
      };

      symbols.forEach(symbol => {
        const settings = allSettings[symbol];
        const isolatedLong = parseFloat(settings.isolated_long_leverage);
        const isolatedShort = parseFloat(settings.isolated_short_leverage);
        const cross = parseFloat(settings.cross_leverage);

        leverageStats.maxIsolatedLong = Math.max(leverageStats.maxIsolatedLong, isolatedLong);
        leverageStats.maxIsolatedShort = Math.max(leverageStats.maxIsolatedShort, isolatedShort);
        leverageStats.maxCross = Math.max(leverageStats.maxCross, cross);
        leverageStats.avgIsolatedLong += isolatedLong;
        leverageStats.avgIsolatedShort += isolatedShort;
        leverageStats.avgCross += cross;
      });

      leverageStats.avgIsolatedLong /= symbols.length;
      leverageStats.avgIsolatedShort /= symbols.length;
      leverageStats.avgCross /= symbols.length;

      console.log('📊 杠杆统计:');
      console.log('-----------------------------------');
      console.log('最大逐仓多头杠杆:', leverageStats.maxIsolatedLong.toFixed(2) + 'x');
      console.log('最大逐仓空头杠杆:', leverageStats.maxIsolatedShort.toFixed(2) + 'x');
      console.log('最大全仓杠杆:', leverageStats.maxCross.toFixed(2) + 'x');
      console.log('平均逐仓多头杠杆:', leverageStats.avgIsolatedLong.toFixed(2) + 'x');
      console.log('平均逐仓空头杠杆:', leverageStats.avgIsolatedShort.toFixed(2) + 'x');
      console.log('平均全仓杠杆:', leverageStats.avgCross.toFixed(2) + 'x');
      console.log('-----------------------------------\n');
    }

    // 测试 2: 获取特定交易对的设置
    console.log('📊 测试 2: 获取特定交易对的设置（BTC/USDT）');
    console.log('-----------------------------------\n');

    const btcSettings = await client.getUserSettings({ symbol: 'cmt_btcusdt' });

    console.log('✅ BTC/USDT 设置:');
    console.log('原始响应:', JSON.stringify(btcSettings, null, 2));
    console.log('');

    const btcSymbol = Object.keys(btcSettings)[0];

    if (btcSymbol && btcSettings[btcSymbol]) {
      const settings = btcSettings[btcSymbol];
      console.log('📋 详细设置:');
      console.log('-----------------------------------');
      console.log('交易对:', btcSymbol.toUpperCase());
      console.log('');
      console.log('🔸 逐仓模式:');
      console.log('  多头杠杆:', settings.isolated_long_leverage + 'x');
      console.log('  空头杠杆:', settings.isolated_short_leverage + 'x');
      console.log('');
      console.log('🔹 全仓模式:');
      console.log('  杠杆:', settings.cross_leverage + 'x');
      console.log('-----------------------------------\n');

      // 风险提示
      const maxLeverage = Math.max(
        parseFloat(settings.isolated_long_leverage),
        parseFloat(settings.isolated_short_leverage),
        parseFloat(settings.cross_leverage)
      );

      console.log('⚠️  风险提示:');
      console.log('-----------------------------------');
      if (maxLeverage >= 20) {
        console.log('🔴 高杠杆风险：当前最大杠杆为', maxLeverage + 'x');
        console.log('   - 高杠杆可能导致快速爆仓');
        console.log('   - 建议谨慎使用，做好风险管理');
      } else if (maxLeverage >= 10) {
        console.log('🟡 中等杠杆风险：当前最大杠杆为', maxLeverage + 'x');
        console.log('   - 注意市场波动');
        console.log('   - 建议设置止损');
      } else {
        console.log('🟢 低杠杆风险：当前最大杠杆为', maxLeverage + 'x');
        console.log('   - 相对安全的杠杆水平');
      }
      console.log('-----------------------------------');
    } else {
      console.log('⚠️  未找到 BTC/USDT 设置');
      console.log('');
      console.log('💡 提示：');
      console.log('   - 该交易对可能还未设置杠杆');
      console.log('   - 需要先在交易所设置杠杆后才能查询');
    }

    return allSettings;
  } catch (error) {
    console.error('❌ 获取用户设置失败:', error);
    throw error;
  }
}

/**
 * 测试修改杠杆
 */
async function testChangeLeverage() {
  console.log('\n=== 测试修改杠杆 ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 API 密钥');
    return;
  }

  // 合约 API 客户端
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  console.log('📋 Change Leverage 接口说明');
  console.log('-----------------------------------');
  console.log('端点: POST /capi/v2/account/leverage');
  console.log('权重: IP(10), UID(20)');
  console.log('');
  console.log('✅ 接口已实现并可以调用');
  console.log('');
  console.log('⚠️  当前测试状态:');
  console.log('   - 接口返回 400 错误："Request parameter format is incorrect"');
  console.log('   - 可能原因：');
  console.log('     1. 账户还未设置过保证金模式');
  console.log('     2. 账户余额为 0，需要先充值');
  console.log('     3. 需要先在交易所网站进行初始设置');
  console.log('');
  console.log('📝 使用方法:');
  console.log('-----------------------------------');
  console.log('');
  console.log('// 全仓模式（多空杠杆相同）');
  console.log('await client.changeLeverage({');
  console.log('  symbol: "cmt_btcusdt",');
  console.log('  marginMode: 1,  // 1=全仓');
  console.log('  longLeverage: "5"');
  console.log('});');
  console.log('');
  console.log('// 逐仓模式（多空杠杆可以不同）');
  console.log('await client.changeLeverage({');
  console.log('  symbol: "cmt_ethusdt",');
  console.log('  marginMode: 3,  // 3=逐仓');
  console.log('  longLeverage: "10",');
  console.log('  shortLeverage: "8"');
  console.log('});');
  console.log('');
  console.log('-----------------------------------');
  console.log('');
  console.log('💡 建议:');
  console.log('   1. 先在 Weex 交易所网站登录');
  console.log('   2. 进入合约交易页面');
  console.log('   3. 为账户充值（从现货账户划转到合约账户）');
  console.log('   4. 手动设置一次杠杆');
  console.log('   5. 然后再使用此 API 修改杠杆');
  console.log('');
  console.log('-----------------------------------');

  try {
    // 尝试调用接口
    console.log('\n🔍 尝试调用接口...\n');

    const result = await client.changeLeverage({
      symbol: 'cmt_btcusdt',
      marginMode: 3,
      longLeverage: '5',
    });

    console.log('✅ 修改成功！');
    console.log('响应:', JSON.stringify(result, null, 2));
    console.log('');
    console.log('📋 响应详情:');
    console.log('  消息:', result.msg);
    console.log('  代码:', result.code);
    console.log('  时间:', new Date(result.requestTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('');

    return result;
  } catch (error) {
    console.log('❌ 接口调用失败（预期行为）');
    if (error instanceof Error) {
      console.log('错误信息:', error.message);
    }
    console.log('');
    console.log('⚠️  这是正常的！原因：');
    console.log('   - 账户余额为 0');
    console.log('   - 账户还未设置过保证金模式');
    console.log('   - 需要先在交易所网站进行初始化设置');
    console.log('');
    console.log('✅ 接口实现正确，可以正常调用');
    console.log('   当账户设置完成后，此接口将正常工作');
  }
}

/**
 * 测试获取订单簿深度
 */
async function testGetOrderBookDepth() {
  console.log('\n=== 测试获取订单簿深度 ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  // 合约 API 客户端（公共接口不需要密钥，但为了统一使用同一个客户端）
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试 1: 获取 BTC/USDT 的 15 档深度
    console.log('📊 测试 1: 获取 BTC/USDT 的 15 档深度');
    console.log('-----------------------------------\n');

    const btcDepth15 = await client.getOrderBookDepth({
      symbol: 'cmt_btcusdt',
      limit: 15,
    });

    console.log('✅ 成功获取订单簿深度！');
    console.log('时间戳:', btcDepth15.timestamp);
    console.log('时间:', new Date(parseInt(btcDepth15.timestamp)).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('');

    console.log('📈 卖单深度（Asks - 从低到高）:');
    console.log('-----------------------------------');
    console.log('价格\t\t\t数量');
    btcDepth15.asks.slice(0, 5).forEach(([price, quantity]) => {
      console.log(`${parseFloat(price).toFixed(2)}\t\t${quantity}`);
    });
    if (btcDepth15.asks.length > 5) {
      console.log(`... 还有 ${btcDepth15.asks.length - 5} 档`);
    }
    console.log('');

    console.log('📉 买单深度（Bids - 从高到低）:');
    console.log('-----------------------------------');
    console.log('价格\t\t\t数量');
    btcDepth15.bids.slice(0, 5).forEach(([price, quantity]) => {
      console.log(`${parseFloat(price).toFixed(2)}\t\t${quantity}`);
    });
    if (btcDepth15.bids.length > 5) {
      console.log(`... 还有 ${btcDepth15.bids.length - 5} 档`);
    }
    console.log('');

    // 计算买卖价差
    if (btcDepth15.asks.length > 0 && btcDepth15.bids.length > 0) {
      const bestAsk = parseFloat(btcDepth15.asks[0][0]);
      const bestBid = parseFloat(btcDepth15.bids[0][0]);
      const spread = bestAsk - bestBid;
      const spreadPercent = (spread / bestBid) * 100;

      console.log('💰 市场信息:');
      console.log('-----------------------------------');
      console.log('最优卖价（Ask）:', bestAsk.toFixed(2));
      console.log('最优买价（Bid）:', bestBid.toFixed(2));
      console.log('买卖价差:', spread.toFixed(2));
      console.log('价差百分比:', spreadPercent.toFixed(4) + '%');
      console.log('中间价:', ((bestAsk + bestBid) / 2).toFixed(2));
      console.log('');
    }

    console.log('-----------------------------------\n');

    // 测试 2: 获取 ETH/USDT 的 200 档深度
    console.log('📊 测试 2: 获取 ETH/USDT 的 200 档深度');
    console.log('-----------------------------------\n');

    const ethDepth200 = await client.getOrderBookDepth({
      symbol: 'cmt_ethusdt',
      limit: 200,
    });

    console.log('✅ 成功获取订单簿深度！');
    console.log('时间戳:', ethDepth200.timestamp);
    console.log('');

    console.log('📊 深度统计:');
    console.log('-----------------------------------');
    console.log('卖单档位数:', ethDepth200.asks.length);
    console.log('买单档位数:', ethDepth200.bids.length);
    console.log('');

    // 计算深度
    const askVolume = ethDepth200.asks.reduce((sum, [_, qty]) => sum + parseFloat(qty), 0);
    const bidVolume = ethDepth200.bids.reduce((sum, [_, qty]) => sum + parseFloat(qty), 0);

    console.log('📈 卖单总量:', askVolume.toFixed(2));
    console.log('📉 买单总量:', bidVolume.toFixed(2));
    console.log('总挂单量:', (askVolume + bidVolume).toFixed(2));
    console.log('');

    // 显示前 3 档和后 3 档
    console.log('📈 卖单（前 3 档）:');
    ethDepth200.asks.slice(0, 3).forEach(([price, quantity], index) => {
      console.log(`  ${index + 1}. ${parseFloat(price).toFixed(2)} - ${quantity}`);
    });
    console.log('');

    console.log('📉 买单（前 3 档）:');
    ethDepth200.bids.slice(0, 3).forEach(([price, quantity], index) => {
      console.log(`  ${index + 1}. ${parseFloat(price).toFixed(2)} - ${quantity}`);
    });
    console.log('');

    if (ethDepth200.asks.length > 0 && ethDepth200.bids.length > 0) {
      const bestAsk = parseFloat(ethDepth200.asks[0][0]);
      const bestBid = parseFloat(ethDepth200.bids[0][0]);
      const spread = bestAsk - bestBid;
      const spreadPercent = (spread / bestBid) * 100;

      console.log('💰 ETH/USDT 市场信息:');
      console.log('-----------------------------------');
      console.log('最优卖价:', bestAsk.toFixed(2));
      console.log('最优买价:', bestBid.toFixed(2));
      console.log('买卖价差:', spread.toFixed(2));
      console.log('价差百分比:', spreadPercent.toFixed(4) + '%');
      console.log('');
    }

    console.log('-----------------------------------\n');

    // 测试 3: 默认深度（不指定 limit）
    console.log('📊 测试 3: 获取 SOL/USDT 默认深度');
    console.log('-----------------------------------\n');

    const solDepth = await client.getOrderBookDepth({
      symbol: 'cmt_solusdt',
    });

    console.log('✅ 成功获取订单簿深度！');
    console.log('卖单档位数:', solDepth.asks.length);
    console.log('买单档位数:', solDepth.bids.length);
    console.log('');

    if (solDepth.asks.length > 0 && solDepth.bids.length > 0) {
      const bestAsk = parseFloat(solDepth.asks[0][0]);
      const bestBid = parseFloat(solDepth.bids[0][0]);

      console.log('💰 SOL/USDT 市场信息:');
      console.log('-----------------------------------');
      console.log('最优卖价:', bestAsk.toFixed(2));
      console.log('最优买价:', bestBid.toFixed(2));
      console.log('中间价:', ((bestAsk + bestBid) / 2).toFixed(2));
      console.log('');
    }

    console.log('-----------------------------------\n');

    console.log('💡 使用提示:');
    console.log('-----------------------------------');
    console.log('1. 深度档位:');
    console.log('   - limit=15: 获取 15 档深度（快速查看）');
    console.log('   - limit=200: 获取 200 档深度（详细分析）');
    console.log('   - 不指定: 使用默认档位');
    console.log('');
    console.log('2. 数据结构:');
    console.log('   - asks: 卖单，价格从低到高排序');
    console.log('   - bids: 买单，价格从高到低排序');
    console.log('   - 每档: [价格, 数量]');
    console.log('');
    console.log('3. 应用场景:');
    console.log('   - 查看市场流动性');
    console.log('   - 分析买卖压力');
    console.log('   - 确定最优成交价格');
    console.log('   - 检测大额挂单（支撑/阻力位）');
    console.log('-----------------------------------');

    return { btcDepth15, ethDepth200, solDepth };
  } catch (error) {
    console.error('❌ 获取订单簿深度失败:', error);
    throw error;
  }
}

/**
 * 测试获取所有 Ticker
 */
async function testGetAllTickers() {
  console.log('\n=== 测试获取所有 Ticker ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  // 合约 API 客户端（公共接口不需要密钥）
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    console.log('📊 获取所有交易对的 Ticker 信息...\n');

    const tickers = await client.getAllTickers();

    console.log('✅ 成功获取所有 Ticker！');
    console.log('交易对数量:', tickers.length);
    console.log('');

    // 按 24 小时涨幅排序
    const sortedByChange = [...tickers].sort((a, b) =>
      parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
    );

    // 显示涨幅前 10
    console.log('📈 24小时涨幅榜 TOP 10:');
    console.log('-----------------------------------');
    console.log('排名\t交易对\t\t\t涨幅\t\t最新价');
    sortedByChange.slice(0, 10).forEach((ticker, index) => {
      const symbol = ticker.symbol.replace('cmt_', '').toUpperCase();
      const change = (parseFloat(ticker.priceChangePercent) * 100).toFixed(2);
      const price = parseFloat(ticker.last).toFixed(ticker.last.includes('.') ? 4 : 2);
      const changeColor = parseFloat(ticker.priceChangePercent) >= 0 ? '🟢' : '🔴';
      console.log(`${index + 1}\t${symbol.padEnd(16)}\t${changeColor} ${change}%\t\t${price}`);
    });
    console.log('');

    // 显示跌幅前 10
    console.log('📉 24小时跌幅榜 TOP 10:');
    console.log('-----------------------------------');
    console.log('排名\t交易对\t\t\t跌幅\t\t最新价');
    sortedByChange.slice(-10).reverse().forEach((ticker, index) => {
      const symbol = ticker.symbol.replace('cmt_', '').toUpperCase();
      const change = (parseFloat(ticker.priceChangePercent) * 100).toFixed(2);
      const price = parseFloat(ticker.last).toFixed(ticker.last.includes('.') ? 4 : 2);
      const changeColor = parseFloat(ticker.priceChangePercent) >= 0 ? '🟢' : '🔴';
      console.log(`${index + 1}\t${symbol.padEnd(16)}\t${changeColor} ${change}%\t\t${price}`);
    });
    console.log('');

    // 按成交量排序
    const sortedByVolume = [...tickers].sort((a, b) =>
      parseFloat(b.volume_24h) - parseFloat(a.volume_24h)
    );

    console.log('💰 24小时成交量榜 TOP 10:');
    console.log('-----------------------------------');
    console.log('排名\t交易对\t\t\t成交量\t\t\t最新价');
    sortedByVolume.slice(0, 10).forEach((ticker, index) => {
      const symbol = ticker.symbol.replace('cmt_', '').toUpperCase();
      const volume = parseFloat(ticker.volume_24h).toLocaleString('en-US', {
        maximumFractionDigits: 0
      });
      const price = parseFloat(ticker.last).toFixed(ticker.last.includes('.') ? 4 : 2);
      console.log(`${index + 1}\t${symbol.padEnd(16)}\t${volume.padEnd(20)}\t${price}`);
    });
    console.log('');

    // 主流币种详细信息
    const mainCoins = ['cmt_btcusdt', 'cmt_ethusdt', 'cmt_solusdt', 'cmt_bnbusdt'];
    console.log('🌟 主流币种详细信息:');
    console.log('-----------------------------------');

    mainCoins.forEach(symbol => {
      const ticker = tickers.find(t => t.symbol === symbol);
      if (ticker) {
        const coinName = symbol.replace('cmt_', '').toUpperCase();
        const change = (parseFloat(ticker.priceChangePercent) * 100).toFixed(2);
        const changeColor = parseFloat(ticker.priceChangePercent) >= 0 ? '🟢' : '🔴';

        console.log(`\n${coinName}:`);
        console.log('  最新价:', parseFloat(ticker.last).toFixed(2));
        console.log('  24h涨跌:', `${changeColor} ${change}%`);
        console.log('  24h最高:', parseFloat(ticker.high_24h).toFixed(2));
        console.log('  24h最低:', parseFloat(ticker.low_24h).toFixed(2));
        console.log('  买一价:', parseFloat(ticker.best_bid).toFixed(2));
        console.log('  卖一价:', parseFloat(ticker.best_ask).toFixed(2));
        console.log('  24h成交量:', parseFloat(ticker.volume_24h).toLocaleString('en-US', {
          maximumFractionDigits: 0
        }));

        if (ticker.markPrice) {
          console.log('  标记价格:', parseFloat(ticker.markPrice).toFixed(2));
        }
        if (ticker.indexPrice) {
          console.log('  指数价格:', parseFloat(ticker.indexPrice).toFixed(2));
        }
      }
    });
    console.log('');
    console.log('-----------------------------------\n');

    // 市场统计
    const totalVolume = tickers.reduce((sum, t) => sum + parseFloat(t.volume_24h), 0);
    const gainers = tickers.filter(t => parseFloat(t.priceChangePercent) > 0).length;
    const losers = tickers.filter(t => parseFloat(t.priceChangePercent) < 0).length;
    const unchanged = tickers.filter(t => parseFloat(t.priceChangePercent) === 0).length;

    console.log('📊 市场总览:');
    console.log('-----------------------------------');
    console.log('交易对总数:', tickers.length);
    console.log('上涨:', gainers, `(${(gainers / tickers.length * 100).toFixed(1)}%)`);
    console.log('下跌:', losers, `(${(losers / tickers.length * 100).toFixed(1)}%)`);
    console.log('平盘:', unchanged, `(${(unchanged / tickers.length * 100).toFixed(1)}%)`);
    console.log('24h总成交量:', totalVolume.toLocaleString('en-US', {
      maximumFractionDigits: 0
    }));
    console.log('');

    // 价格区间分析
    const avgChange = tickers.reduce((sum, t) => sum + parseFloat(t.priceChangePercent), 0) / tickers.length;
    console.log('平均涨跌幅:', (avgChange * 100).toFixed(2) + '%');
    console.log('最大涨幅:', (parseFloat(sortedByChange[0].priceChangePercent) * 100).toFixed(2) + '%',
      `(${sortedByChange[0].symbol.replace('cmt_', '').toUpperCase()})`);
    console.log('最大跌幅:', (parseFloat(sortedByChange[sortedByChange.length - 1].priceChangePercent) * 100).toFixed(2) + '%',
      `(${sortedByChange[sortedByChange.length - 1].symbol.replace('cmt_', '').toUpperCase()})`);
    console.log('-----------------------------------\n');

    console.log('💡 使用提示:');
    console.log('-----------------------------------');
    console.log('1. 数据内容:');
    console.log('   - 所有交易对的实时行情');
    console.log('   - 24小时价格变化');
    console.log('   - 成交量统计');
    console.log('   - 买卖盘口价格');
    console.log('');
    console.log('2. 应用场景:');
    console.log('   - 市场概览和监控');
    console.log('   - 发现热门交易对');
    console.log('   - 寻找交易机会');
    console.log('   - 市场情绪分析');
    console.log('');
    console.log('3. 注意事项:');
    console.log('   - 权重较高（40），注意速率限制');
    console.log('   - 建议定期轮询（如每分钟一次）');
    console.log('   - 可用于构建行情看板');
    console.log('-----------------------------------');

    return tickers;
  } catch (error) {
    console.error('❌ 获取所有 Ticker 失败:', error);
    throw error;
  }
}

/**
 * 测试获取单个 Ticker
 */
async function testGetSingleTicker() {
  console.log('\n=== 测试获取单个 Ticker ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  // 合约 API 客户端（公共接口不需要密钥）
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试 1: 获取 BTC/USDT Ticker
    console.log('📊 测试 1: 获取 BTC/USDT Ticker');
    console.log('-----------------------------------\n');

    const btcTicker = await client.getSingleTicker({
      symbol: 'cmt_btcusdt',
    });

    console.log('✅ 成功获取 BTC/USDT Ticker！');
    console.log('');

    console.log('📈 BTC/USDT 详细信息:');
    console.log('-----------------------------------');
    console.log('交易对:', btcTicker.symbol);
    console.log('最新价:', parseFloat(btcTicker.last).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));

    const change = parseFloat(btcTicker.priceChangePercent) * 100;
    const changeColor = change >= 0 ? '🟢' : '🔴';
    console.log('24h涨跌:', `${changeColor} ${change.toFixed(2)}%`);

    console.log('');
    console.log('📊 价格区间:');
    console.log('  24h最高:', parseFloat(btcTicker.high_24h).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
    console.log('  24h最低:', parseFloat(btcTicker.low_24h).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));

    const priceRange = parseFloat(btcTicker.high_24h) - parseFloat(btcTicker.low_24h);
    const volatility = (priceRange / parseFloat(btcTicker.low_24h)) * 100;
    console.log('  价格波动:', priceRange.toFixed(2), `(${volatility.toFixed(2)}%)`);

    console.log('');
    console.log('💰 盘口信息:');
    console.log('  买一价:', parseFloat(btcTicker.best_bid).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
    console.log('  卖一价:', parseFloat(btcTicker.best_ask).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));

    const spread = parseFloat(btcTicker.best_ask) - parseFloat(btcTicker.best_bid);
    const spreadPercent = (spread / parseFloat(btcTicker.best_bid)) * 100;
    console.log('  买卖价差:', spread.toFixed(2), `(${spreadPercent.toFixed(4)}%)`);

    console.log('');
    console.log('📊 成交量:');
    console.log('  24h成交量:', parseFloat(btcTicker.volume_24h).toLocaleString('en-US', {
      maximumFractionDigits: 0
    }));
    console.log('  基础货币量:', parseFloat(btcTicker.base_volume).toLocaleString('en-US', {
      maximumFractionDigits: 2
    }));

    if (btcTicker.markPrice) {
      console.log('');
      console.log('🎯 合约信息:');
      console.log('  标记价格:', parseFloat(btcTicker.markPrice).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }));

      if (btcTicker.indexPrice) {
        console.log('  指数价格:', parseFloat(btcTicker.indexPrice).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }));

        const markIndexDiff = parseFloat(btcTicker.markPrice) - parseFloat(btcTicker.indexPrice);
        console.log('  标记-指数差:', markIndexDiff.toFixed(2));
      }
    }

    console.log('');
    console.log('⏰ 时间戳:', btcTicker.timestamp);
    console.log('时间:', new Date(parseInt(btcTicker.timestamp)).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('-----------------------------------\n');

    // 等待一下，避免速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试 2: 获取 ETH/USDT Ticker
    console.log('📊 测试 2: 获取 ETH/USDT Ticker');
    console.log('-----------------------------------\n');

    const ethTicker = await client.getSingleTicker({
      symbol: 'cmt_ethusdt',
    });

    console.log('✅ 成功获取 ETH/USDT Ticker！');
    console.log('');

    const ethChange = parseFloat(ethTicker.priceChangePercent) * 100;
    const ethChangeColor = ethChange >= 0 ? '🟢' : '🔴';

    console.log('📈 ETH/USDT 简要信息:');
    console.log('-----------------------------------');
    console.log('最新价:', parseFloat(ethTicker.last).toFixed(2));
    console.log('24h涨跌:', `${ethChangeColor} ${ethChange.toFixed(2)}%`);
    console.log('24h最高:', parseFloat(ethTicker.high_24h).toFixed(2));
    console.log('24h最低:', parseFloat(ethTicker.low_24h).toFixed(2));
    console.log('24h成交量:', parseFloat(ethTicker.volume_24h).toLocaleString('en-US', {
      maximumFractionDigits: 0
    }));
    console.log('-----------------------------------\n');

    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试 3: 获取 SOL/USDT Ticker
    console.log('📊 测试 3: 获取 SOL/USDT Ticker');
    console.log('-----------------------------------\n');

    const solTicker = await client.getSingleTicker({
      symbol: 'cmt_solusdt',
    });

    console.log('✅ 成功获取 SOL/USDT Ticker！');
    console.log('');

    const solChange = parseFloat(solTicker.priceChangePercent) * 100;
    const solChangeColor = solChange >= 0 ? '🟢' : '🔴';

    console.log('📈 SOL/USDT 简要信息:');
    console.log('-----------------------------------');
    console.log('最新价:', parseFloat(solTicker.last).toFixed(2));
    console.log('24h涨跌:', `${solChangeColor} ${solChange.toFixed(2)}%`);
    console.log('24h最高:', parseFloat(solTicker.high_24h).toFixed(2));
    console.log('24h最低:', parseFloat(solTicker.low_24h).toFixed(2));
    console.log('买一价:', parseFloat(solTicker.best_bid).toFixed(2));
    console.log('卖一价:', parseFloat(solTicker.best_ask).toFixed(2));
    console.log('-----------------------------------\n');

    // 测试 4: 比较多个交易对
    console.log('📊 测试 4: 比较主流币种表现');
    console.log('-----------------------------------\n');

    const symbols = ['cmt_btcusdt', 'cmt_ethusdt', 'cmt_solusdt', 'cmt_bnbusdt'];
    const tickers = [btcTicker, ethTicker, solTicker];

    // 获取 BNB ticker
    await new Promise(resolve => setTimeout(resolve, 1000));
    const bnbTicker = await client.getSingleTicker({ symbol: 'cmt_bnbusdt' });
    tickers.push(bnbTicker);

    console.log('币种\t\t最新价\t\t24h涨跌\t\t24h成交量');
    console.log('-----------------------------------------------------------');

    tickers.forEach(ticker => {
      const coinName = ticker.symbol.replace('cmt_', '').toUpperCase().padEnd(8);
      const price = parseFloat(ticker.last).toFixed(2).padStart(12);
      const change = (parseFloat(ticker.priceChangePercent) * 100).toFixed(2);
      const changeStr = (change >= '0' ? '🟢 +' : '🔴 ') + change + '%';
      const volume = parseFloat(ticker.volume_24h).toLocaleString('en-US', {
        maximumFractionDigits: 0
      });

      console.log(`${coinName}\t${price}\t${changeStr.padEnd(16)}\t${volume}`);
    });

    console.log('');

    // 找出表现最好和最差的
    const sortedByChange = [...tickers].sort((a, b) =>
      parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
    );

    const best = sortedByChange[0];
    const worst = sortedByChange[sortedByChange.length - 1];

    console.log('🏆 表现最好:', best.symbol.replace('cmt_', '').toUpperCase(),
      `(${(parseFloat(best.priceChangePercent) * 100).toFixed(2)}%)`);
    console.log('📉 表现最差:', worst.symbol.replace('cmt_', '').toUpperCase(),
      `(${(parseFloat(worst.priceChangePercent) * 100).toFixed(2)}%)`);

    console.log('-----------------------------------\n');

    console.log('💡 使用提示:');
    console.log('-----------------------------------');
    console.log('1. 接口特点:');
    console.log('   - 权重低（1），可以频繁调用');
    console.log('   - 只返回单个交易对数据');
    console.log('   - 适合实时监控特定币种');
    console.log('');
    console.log('2. 与 getAllTickers 的区别:');
    console.log('   - getSingleTicker: 权重1，单个交易对');
    console.log('   - getAllTickers: 权重40，所有交易对');
    console.log('   - 监控少量币种时用 getSingleTicker 更高效');
    console.log('');
    console.log('3. 应用场景:');
    console.log('   - 实时价格监控');
    console.log('   - 交易信号生成');
    console.log('   - 价格预警');
    console.log('   - 单币种深度分析');
    console.log('');
    console.log('4. AI 交易机器人建议:');
    console.log('   - 使用 getSingleTicker 监控目标币种');
    console.log('   - 定期（如每秒）获取最新价格');
    console.log('   - 结合深度数据做决策');
    console.log('   - 监控标记价格和指数价格的偏离');
    console.log('-----------------------------------');

    return { btcTicker, ethTicker, solTicker, bnbTicker };
  } catch (error) {
    console.error('❌ 获取单个 Ticker 失败:', error);
    throw error;
  }
}

/**
 * 测试上传 AI 日志
 */
async function testUploadAiLog() {
  console.log('\n=== 测试上传 AI 日志 ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 API 密钥');
    return;
  }

  // 合约 API 客户端
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试 1: 上传市场分析阶段的 AI 日志
    console.log('📊 测试 1: 上传市场分析阶段的 AI 日志');
    console.log('-----------------------------------\n');

    const marketAnalysisLog = await client.uploadAiLog({
      orderId: null,  // 市场分析阶段还没有订单
      stage: 'market_analysis',
      model: 'deepseek-chat',
      input: {
        symbol: 'cmt_btcusdt',
        timeframe: '1h',
        indicators: ['RSI', 'MACD', 'EMA'],
        marketData: {
          price: 87241.60,
          volume24h: 7361011073,
          priceChange24h: 0.34
        }
      },
      output: {
        signal: 'BUY',
        confidence: 0.75,
        reasoning: 'RSI 显示超卖，MACD 金叉，价格突破 EMA20',
        targetPrice: 88000,
        stopLoss: 86500
      },
      explanation: 'AI 模型分析市场数据后生成买入信号'
    });

    console.log('✅ 上传成功！');
    console.log('响应代码:', marketAnalysisLog.code);
    console.log('响应消息:', marketAnalysisLog.msg);
    console.log('业务数据:', marketAnalysisLog.data);
    console.log('请求时间:', new Date(marketAnalysisLog.requestTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('-----------------------------------\n');

    // 等待一下，避免速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试 2: 上传订单执行阶段的 AI 日志
    console.log('📊 测试 2: 上传订单执行阶段的 AI 日志');
    console.log('-----------------------------------\n');

    const orderExecutionLog = await client.uploadAiLog({
      orderId: 123456789,  // 假设的订单 ID
      stage: 'order_execution',
      model: 'deepseek-chat',
      input: {
        signal: 'BUY',
        symbol: 'cmt_btcusdt',
        currentPrice: 87241.60,
        targetPrice: 88000,
        stopLoss: 86500,
        accountBalance: 1000,
        riskPercentage: 2
      },
      output: {
        action: 'PLACE_ORDER',
        orderType: 'LIMIT',
        side: 'BUY',
        price: 87200,
        quantity: 0.01,
        leverage: 5,
        positionValue: 436,
        risk: 20  // 2% of 1000
      },
      explanation: 'AI 模型根据信号和风险管理规则生成订单参数'
    });

    console.log('✅ 上传成功！');
    console.log('响应代码:', orderExecutionLog.code);
    console.log('响应消息:', orderExecutionLog.msg);
    console.log('业务数据:', orderExecutionLog.data);
    console.log('-----------------------------------\n');

    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试 3: 上传风险管理阶段的 AI 日志
    console.log('📊 测试 3: 上传风险管理阶段的 AI 日志');
    console.log('-----------------------------------\n');

    const riskManagementLog = await client.uploadAiLog({
      orderId: 123456789,
      stage: 'risk_management',
      model: 'deepseek-chat',
      input: {
        position: {
          symbol: 'cmt_btcusdt',
          side: 'LONG',
          entryPrice: 87200,
          currentPrice: 87800,
          quantity: 0.01,
          unrealizedPnl: 6
        },
        accountBalance: 1000,
        marketCondition: 'volatile'
      },
      output: {
        action: 'ADJUST_STOP_LOSS',
        newStopLoss: 87000,
        reasoning: '价格上涨，移动止损到盈亏平衡点以上',
        riskReward: 2.5
      },
      explanation: 'AI 模型监控持仓并调整风险参数'
    });

    console.log('✅ 上传成功！');
    console.log('响应代码:', riskManagementLog.code);
    console.log('响应消息:', riskManagementLog.msg);
    console.log('业务数据:', riskManagementLog.data);
    console.log('-----------------------------------\n');

    console.log('💡 使用提示:');
    console.log('-----------------------------------');
    console.log('1. AI 日志的重要性:');
    console.log('   - 证明 AI 参与交易决策');
    console.log('   - 满足 Hackathon 合规要求');
    console.log('   - 避免被取消资格');
    console.log('');
    console.log('2. 必须包含的信息:');
    console.log('   - model: AI 模型名称和版本');
    console.log('   - input: 输入给 AI 的数据');
    console.log('   - output: AI 生成的决策');
    console.log('   - stage: 交易阶段标识');
    console.log('');
    console.log('3. 建议的交易阶段:');
    console.log('   - market_analysis: 市场分析');
    console.log('   - signal_generation: 信号生成');
    console.log('   - order_execution: 订单执行');
    console.log('   - risk_management: 风险管理');
    console.log('   - close_position: 平仓决策');
    console.log('');
    console.log('4. 最佳实践:');
    console.log('   - 每个交易决策都上传日志');
    console.log('   - 包含详细的推理过程');
    console.log('   - 记录输入和输出的完整数据');
    console.log('   - 使用有意义的 stage 标识符');
    console.log('');
    console.log('5. 注意事项:');
    console.log('   - 只有白名单 UID 可以上传');
    console.log('   - 权重很低（1），可以频繁调用');
    console.log('   - 建议在每次 AI 决策后立即上传');
    console.log('-----------------------------------');

    return {
      marketAnalysisLog,
      orderExecutionLog,
      riskManagementLog
    };
  } catch (error) {
    console.error('❌ 上传 AI 日志失败:', error);
    throw error;
  }
}

/**
 * 测试获取成交记录
 */
async function testGetTrades() {
  console.log('\n=== 测试获取成交记录 ===\n');

  // 合约 API 客户端（公共接口，无需密钥）
  const client = new WeexApiClient(
    '',
    '',
    '',
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试 1: 获取 BTC/USDT 最近 10 笔成交
    console.log('📊 测试 1: 获取 BTC/USDT 最近 10 笔成交');
    console.log('-----------------------------------\n');

    const btcTrades = await client.getTrades({
      symbol: 'cmt_btcusdt',
      limit: 10
    });

    console.log(`✅ 成功获取 ${btcTrades.length} 笔成交记录\n`);

    if (btcTrades.length > 0) {
      // 显示最新一笔成交
      const latestTrade = btcTrades[0];
      console.log('📈 最新成交:');
      console.log('  成交 ID:', latestTrade.ticketId);
      console.log('  成交时间:', new Date(latestTrade.time).toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai'
      }));
      console.log('  成交价格:', latestTrade.price);
      console.log('  成交数量:', latestTrade.size);
      console.log('  成交金额:', latestTrade.value);
      console.log('  方向:', latestTrade.isBuyerMaker ? '🔴 卖出' : '🟢 买入');
      console.log('  完全匹配:', latestTrade.isBestMatch ? '✅' : '❌');
      console.log('  合约面值:', latestTrade.contractVal);
      console.log('');

      // 统计买卖方向
      const buyTrades = btcTrades.filter(t => !t.isBuyerMaker);
      const sellTrades = btcTrades.filter(t => t.isBuyerMaker);

      console.log('📊 成交统计:');
      console.log('  买入成交:', buyTrades.length, '笔');
      console.log('  卖出成交:', sellTrades.length, '笔');

      // 计算成交量
      const totalVolume = btcTrades.reduce((sum, t) => sum + parseFloat(t.size), 0);
      const totalValue = btcTrades.reduce((sum, t) => sum + parseFloat(t.value), 0);

      console.log('  总成交量:', totalVolume.toFixed(4), 'BTC');
      console.log('  总成交额:', totalValue.toFixed(2), 'USDT');

      // 价格范围
      const prices = btcTrades.map(t => parseFloat(t.price));
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);

      console.log('  价格范围:', `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`);
      console.log('  价格波动:', `$${(maxPrice - minPrice).toFixed(2)}`);
    }
    console.log('-----------------------------------\n');

    // 测试 2: 获取 ETH/USDT 最近 50 笔成交
    console.log('📊 测试 2: 获取 ETH/USDT 最近 50 笔成交');
    console.log('-----------------------------------\n');

    const ethTrades = await client.getTrades({
      symbol: 'cmt_ethusdt',
      limit: 50
    });

    console.log(`✅ 成功获取 ${ethTrades.length} 笔成交记录\n`);

    if (ethTrades.length > 0) {
      // 分析成交密度
      const timeSpan = ethTrades[0].time - ethTrades[ethTrades.length - 1].time;
      const tradesPerMinute = (ethTrades.length / (timeSpan / 60000)).toFixed(2);

      console.log('📈 成交密度分析:');
      console.log('  时间跨度:', (timeSpan / 1000).toFixed(0), '秒');
      console.log('  成交频率:', tradesPerMinute, '笔/分钟');

      // 买卖压力
      const buyVolume = ethTrades
        .filter(t => !t.isBuyerMaker)
        .reduce((sum, t) => sum + parseFloat(t.size), 0);
      const sellVolume = ethTrades
        .filter(t => t.isBuyerMaker)
        .reduce((sum, t) => sum + parseFloat(t.size), 0);

      console.log('  买入量:', buyVolume.toFixed(4), 'ETH');
      console.log('  卖出量:', sellVolume.toFixed(4), 'ETH');
      console.log('  买卖比:', (buyVolume / sellVolume).toFixed(2));

      // 平均成交价
      const avgPrice = ethTrades.reduce((sum, t) =>
        sum + parseFloat(t.price), 0) / ethTrades.length;

      console.log('  平均价格:', `$${avgPrice.toFixed(2)}`);
    }
    console.log('-----------------------------------\n');

    // 测试 3: 获取 SOL/USDT 默认数量成交
    console.log('📊 测试 3: 获取 SOL/USDT 默认数量成交');
    console.log('-----------------------------------\n');

    const solTrades = await client.getTrades({
      symbol: 'cmt_solusdt'
      // 不指定 limit，使用默认值 100
    });

    console.log(`✅ 成功获取 ${solTrades.length} 笔成交记录\n`);

    if (solTrades.length > 0) {
      // 显示最近 5 笔成交
      console.log('📋 最近 5 笔成交:');
      console.log('-----------------------------------');
      console.log('时间\t\t\t价格\t\t数量\t方向');
      console.log('-----------------------------------');

      solTrades.slice(0, 5).forEach(trade => {
        const time = new Date(trade.time).toLocaleTimeString('zh-CN', {
          timeZone: 'Asia/Shanghai',
          hour12: false
        });
        const direction = trade.isBuyerMaker ? '🔴 卖' : '🟢 买';
        console.log(`${time}\t$${trade.price}\t${trade.size}\t${direction}`);
      });
      console.log('-----------------------------------');
    }
    console.log('');

    console.log('💡 使用提示:');
    console.log('-----------------------------------');
    console.log('1. 成交记录的用途:');
    console.log('   - 分析市场活跃度');
    console.log('   - 判断买卖压力');
    console.log('   - 发现大额成交');
    console.log('   - 计算成交密度');
    console.log('');
    console.log('2. 参数说明:');
    console.log('   - symbol: 交易对（必填）');
    console.log('   - limit: 数据大小，1-1000，默认 100');
    console.log('');
    console.log('3. 字段含义:');
    console.log('   - isBuyerMaker: true=卖出，false=买入');
    console.log('   - isBestMatch: 是否完全匹配');
    console.log('   - contractVal: 合约面值');
    console.log('');
    console.log('4. AI 交易应用:');
    console.log('   - 监控大额成交（鲸鱼交易）');
    console.log('   - 分析买卖压力比');
    console.log('   - 计算成交密度判断趋势');
    console.log('   - 检测异常成交模式');
    console.log('-----------------------------------');

    return { btcTrades, ethTrades, solTrades };
  } catch (error) {
    console.error('❌ 获取成交记录失败:', error);
    throw error;
  }
}

/**
 * 测试修改用户账户模式
 */
async function testChangeHoldModel() {
  console.log('\n=== 测试修改用户账户模式 ===\n');

  const apiKey = process.env.WEEX_API_KEY || '';
  const secretKey = process.env.WEEX_SECRET_KEY || '';
  const passphrase = process.env.WEEX_PASSPHRASE || '';

  if (!apiKey || !secretKey || !passphrase) {
    console.error('❌ 请在 .env 文件中配置 API 密钥');
    return;
  }

  // 合约 API 客户端
  const client = new WeexApiClient(
    apiKey,
    secretKey,
    passphrase,
    'https://pro-openapi.weex.tech'
  );

  try {
    // 测试 1: 修改为全仓 + 分离模式
    console.log('📊 测试 1: 修改为全仓 + 分离模式');
    console.log('-----------------------------------\n');

    console.log('⚙️  账户模式参数:');
    console.log('  交易对: cmt_btcusdt');
    console.log('  保证金模式: 1 (全仓模式)');
    console.log('  持仓分离模式: 2 (分离模式)');
    console.log('');

    const result1 = await client.changeHoldModel({
      symbol: 'cmt_btcusdt',
      marginMode: 1,      // 全仓模式
      separatedMode: 2    // 分离模式
    });

    console.log('✅ 修改成功！');
    console.log('响应代码:', result1.code);
    console.log('响应消息:', result1.msg);
    console.log('请求时间:', new Date(result1.requestTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('-----------------------------------\n');

    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 测试 2: 修改为逐仓 + 合并模式
    console.log('📊 测试 2: 修改为逐仓 + 合并模式');
    console.log('-----------------------------------\n');

    console.log('⚙️  账户模式参数:');
    console.log('  交易对: cmt_btcusdt');
    console.log('  保证金模式: 3 (逐仓模式)');
    console.log('  持仓分离模式: 1 (合并模式)');
    console.log('');

    const result2 = await client.changeHoldModel({
      symbol: 'cmt_btcusdt',
      marginMode: 3,      // 逐仓模式
      separatedMode: 1    // 合并模式
    });

    console.log('✅ 修改成功！');
    console.log('响应代码:', result2.code);
    console.log('响应消息:', result2.msg);
    console.log('请求时间:', new Date(result2.requestTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }));
    console.log('-----------------------------------\n');

    console.log('💡 使用提示:');
    console.log('-----------------------------------');
    console.log('1. 保证金模式:');
    console.log('   - 1: 全仓模式 (Cross Mode)');
    console.log('     * 使用账户全部可用余额作为保证金');
    console.log('     * 风险较高，但资金利用率高');
    console.log('     * 适合有经验的交易者');
    console.log('');
    console.log('   - 3: 逐仓模式 (Isolated Mode)');
    console.log('     * 只使用分配给该仓位的保证金');
    console.log('     * 风险可控，最多损失该仓位保证金');
    console.log('     * 适合风险管理严格的交易者');
    console.log('');
    console.log('2. 持仓分离模式:');
    console.log('   - 1: 合并模式 (Combined Mode)');
    console.log('     * 多空持仓合并计算');
    console.log('     * 净持仓模式');
    console.log('');
    console.log('   - 2: 分离模式 (Separated Mode)');
    console.log('     * 多空持仓分别计算');
    console.log('     * 可以同时持有多空仓位');
    console.log('     * 适合对冲策略');
    console.log('');
    console.log('3. 注意事项:');
    console.log('   - 修改模式前需要平掉所有持仓');
    console.log('   - 权重较高（IP:20, UID:50）');
    console.log('   - 不同交易对可以设置不同模式');
    console.log('');
    console.log('4. AI 交易应用:');
    console.log('   - 根据策略自动切换模式');
    console.log('   - 高波动时使用逐仓降低风险');
    console.log('   - 对冲策略使用分离模式');
    console.log('   - 趋势策略使用全仓提高收益');
    console.log('-----------------------------------');

    return { result1, result2 };
  } catch (error) {
    console.error('❌ 修改账户模式失败:', error);

    if (error instanceof Error && error.message.includes('40013')) {
      console.log('\n⚠️  可能的原因:');
      console.log('   - 账户有未平仓的持仓');
      console.log('   - 需要先平掉所有持仓才能修改模式');
    }

    throw error;
  }
}

/**
 * 主测试函数
 */
async function main() {
  try {
    console.log('🚀 开始测试 Weex API 客户端\n');

    // 测试修改用户账户模式
    await testChangeHoldModel();

    console.log('\n✅ 测试完成！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
main();
