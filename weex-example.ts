import { WeexClient } from './weex';

/**
 * Weex API 使用示例
 */
async function main() {
  try {
    // 方式1: 使用默认配置（从环境变量读取）
    const client = new WeexClient();

    // 方式2: 手动指定配置
    // const client = new WeexClient({
    //   apiKey: 'your-api-key',
    //   secretKey: 'your-secret-key',
    //   baseURL: 'https://api.weex.com',
    //   timeout: 30000
    // });

    // 示例：获取账户信息
    console.log('获取账户信息...');
    const accountInfo = await client.getAccountInfo();
    console.log('账户信息:', accountInfo);

    // 示例：获取持仓信息
    console.log('\n获取持仓信息...');
    const positions = await client.getPositions();
    console.log('持仓信息:', positions);

    // 示例：获取订单列表
    console.log('\n获取订单列表...');
    const orders = await client.getOrders({ status: 'open' });
    console.log('订单列表:', orders);

    // 示例：下单
    // console.log('\n下单...');
    // const orderResult = await client.placeOrder({
    //   symbol: 'BTC-USDT',
    //   side: 'buy',
    //   type: 'limit',
    //   price: 50000,
    //   amount: 0.01
    // });
    // console.log('下单结果:', orderResult);

  } catch (error) {
    console.error('错误:', error);
  }
}

// 运行示例
if (require.main === module) {
  main();
}

