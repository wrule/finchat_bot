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
 * 主测试函数
 */
async function main() {
  try {
    console.log('🚀 开始测试 Weex API 客户端\n');

    // 测试获取现货账户资产
    await testGetSpotAccountAssets();

    console.log('\n✅ 测试完成！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
main();
