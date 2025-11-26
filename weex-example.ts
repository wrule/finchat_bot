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
 * 主测试函数
 */
async function main() {
  try {
    // 测试获取服务器时间
    await testGetServerTime();

    // 测试获取合约信息
    await testGetContracts();

    console.log('\n✅ 所有测试完成！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
main();
