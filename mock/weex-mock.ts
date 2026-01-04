/**
 * Weex API Mock 客户端
 * 继承真实客户端，覆盖交易相关方法，市场数据使用真实接口
 */

import { WeexApiClient, SinglePosition, PlaceOrderResponse, ContractAccountAsset, BillsResponse } from '../weex';
import { MockStore, getMockStore } from './mock-store';

/**
 * Mock 版本的 Weex API 客户端
 * - 市场数据：使用真实 API
 * - 账户/持仓/交易：使用 Mock 数据
 */
export class WeexApiClientMock extends WeexApiClient {
  private mockStore: MockStore | null = null;
  private lastPrice: string = '0';

  constructor(
    apiKey: string,
    secretKey: string,
    accessPassphrase: string,
    baseUrl: string = 'https://api-contract.weex.com'
  ) {
    super(apiKey, secretKey, accessPassphrase, baseUrl);
  }

  /**
   * 初始化 Mock 存储
   */
  async initMockStore(): Promise<void> {
    if (!this.mockStore) {
      this.mockStore = await getMockStore();
    }
  }

  /**
   * 获取当前价格（从真实 API）
   */
  private async fetchCurrentPrice(): Promise<string> {
    try {
      const ticker = await this.getSingleTicker({ symbol: 'cmt_btcusdt' });
      this.lastPrice = ticker.last;
      return ticker.last;
    } catch (error) {
      console.warn('⚠️  获取价格失败，使用缓存价格:', this.lastPrice);
      return this.lastPrice;
    }
  }

  /**
   * 覆盖：获取合约账户资产
   */
  async getContractAccountAssets(): Promise<ContractAccountAsset[]> {
    await this.initMockStore();
    const balance = this.mockStore!.getBalance();
    const currentPrice = await this.fetchCurrentPrice();
    const { totalPnl } = this.mockStore!.calculateUnrealizedPnl(currentPrice);

    return [{
      coinId: 2,
      coinName: 'USDT',
      available: balance.available.toFixed(5),
      frozen: balance.frozen.toFixed(5),
      equity: (balance.total + totalPnl).toFixed(5),
      unrealizePnl: totalPnl.toFixed(5)
    }] as ContractAccountAsset[];
  }

  /**
   * 覆盖：获取持仓
   */
  async getSinglePosition(_params: { symbol: string }): Promise<SinglePosition[]> {
    await this.initMockStore();
    const currentPrice = await this.fetchCurrentPrice();
    const { positions } = this.mockStore!.calculateUnrealizedPnl(currentPrice);

    return positions.map(pos => ({
      id: pos.id,
      symbol: pos.symbol,
      side: pos.side,
      size: pos.size,
      leverage: pos.leverage,
      open_value: pos.open_value,
      unrealizePnl: pos.unrealizePnl,
      margin_mode: pos.margin_mode,
      separated_mode: pos.separated_mode,
      created_time: pos.created_time,
      open_fee: pos.open_fee,
      liquidatePrice: '0', // Mock 不计算强平价
      entryPrice: pos.entryPrice
    })) as unknown as SinglePosition[];
  }

  /**
   * 覆盖：下单
   */
  async placeOrder(params: {
    symbol: string;
    client_oid: string;
    size: string;
    type: string;  // 1-开多, 2-开空, 3-平多, 4-平空
    order_type: string;
    match_price: string;
    price: string;
    marginMode?: number;
    separatedMode?: number;
  }): Promise<PlaceOrderResponse> {
    await this.initMockStore();
    const currentPrice = await this.fetchCurrentPrice();

    const orderType = params.type;
    const size = params.size;

    console.log(`\n🎮 [MOCK] 执行订单: type=${orderType}, size=${size}, price=${currentPrice}`);

    let result: { order_id: string; client_oid: string; pnl?: number };

    switch (orderType) {
      case '1': // 开多
        result = await this.mockStore!.openPosition('LONG', size, currentPrice);
        console.log(`🎮 [MOCK] 开多仓成功: ${size} BTC @ ${currentPrice}`);
        break;
      case '2': // 开空
        result = await this.mockStore!.openPosition('SHORT', size, currentPrice);
        console.log(`🎮 [MOCK] 开空仓成功: ${size} BTC @ ${currentPrice}`);
        break;
      case '3': // 平多
        result = await this.mockStore!.closePosition('LONG', size, currentPrice);
        console.log(`🎮 [MOCK] 平多仓成功: ${size} BTC @ ${currentPrice}, 盈亏: ${result.pnl?.toFixed(2)} USDT`);
        break;
      case '4': // 平空
        result = await this.mockStore!.closePosition('SHORT', size, currentPrice);
        console.log(`🎮 [MOCK] 平空仓成功: ${size} BTC @ ${currentPrice}, 盈亏: ${result.pnl?.toFixed(2)} USDT`);
        break;
      default:
        throw new Error(`未知订单类型: ${orderType}`);
    }

    return {
      order_id: result.order_id,
      client_oid: result.client_oid
    } as PlaceOrderResponse;
  }

  /**
   * 覆盖：开仓简化接口
   */
  async openPosition(size: string, side: 'LONG' | 'SHORT'): Promise<PlaceOrderResponse> {
    await this.initMockStore();
    const currentPrice = await this.fetchCurrentPrice();

    console.log(`\n🎮 [MOCK] 开${side === 'LONG' ? '多' : '空'}仓: ${size} BTC @ ${currentPrice}`);

    const result = await this.mockStore!.openPosition(side, size, currentPrice);

    return {
      order_id: result.order_id,
      client_oid: result.client_oid
    } as PlaceOrderResponse;
  }

  /**
   * 覆盖：平仓简化接口
   */
  async closePosition(size: string, side: 'LONG' | 'SHORT'): Promise<PlaceOrderResponse> {
    await this.initMockStore();
    const currentPrice = await this.fetchCurrentPrice();

    console.log(`\n🎮 [MOCK] 平${side === 'LONG' ? '多' : '空'}仓: ${size} BTC @ ${currentPrice}`);

    const result = await this.mockStore!.closePosition(side, size, currentPrice);
    console.log(`🎮 [MOCK] 平仓盈亏: ${result.pnl.toFixed(2)} USDT`);

    return {
      order_id: result.order_id,
      client_oid: result.client_oid
    } as PlaceOrderResponse;
  }

  /**
   * 覆盖：获取当前持仓简化接口
   */
  async getCurrentPosition(): Promise<SinglePosition | null> {
    const positions = await this.getSinglePosition({ symbol: 'cmt_btcusdt' });
    return positions.length > 0 ? positions[0] : null;
  }

  /**
   * 覆盖：获取账单历史
   */
  async getAccountBills(params?: any): Promise<BillsResponse> {
    await this.initMockStore();
    const bills = this.mockStore!.getBills();
    const limit = params?.limit || 20;

    return {
      items: bills.slice(0, limit).map(bill => ({
        id: bill.id,
        symbol: bill.symbol,
        businessType: bill.type,
        amount: bill.amount,
        balance: bill.balance,
        fee: bill.fee,
        created_time: bill.time
      })),
      hasNextPage: false
    } as unknown as BillsResponse;
  }

  /**
   * 覆盖：获取账户风险信息
   */
  async getAccountRiskForAI(symbol: string): Promise<any> {
    await this.initMockStore();
    const balance = this.mockStore!.getBalance();
    const currentPrice = await this.fetchCurrentPrice();
    const { positions, totalPnl } = this.mockStore!.calculateUnrealizedPnl(currentPrice);

    const totalValue = positions.reduce((sum, p) => sum + parseFloat(p.open_value), 0);
    const accountValue = balance.total + totalPnl;
    const leverageRatio = accountValue > 0 ? totalValue / accountValue : 0;
    const marginRatio = balance.total > 0 ? (balance.frozen / balance.total) * 100 : 0;

    let riskLevel = 'LOW';
    if (marginRatio > 80 || leverageRatio > 15) riskLevel = 'CRITICAL';
    else if (marginRatio > 60 || leverageRatio > 10) riskLevel = 'HIGH';
    else if (marginRatio > 40 || leverageRatio > 5) riskLevel = 'MEDIUM';

    return {
      symbol,
      timestamp: new Date().toISOString(),
      balance: {
        total: balance.total.toFixed(2),
        available: balance.available.toFixed(2),
        frozen: balance.frozen.toFixed(2)
      },
      leverage: {
        current: positions.length > 0 ? positions[0].leverage : '10',
        mode: 'SHARED'
      },
      margin: {
        used: balance.frozen.toFixed(2),
        available: balance.available.toFixed(2),
        ratio: marginRatio.toFixed(2)
      },
      risk: {
        level: riskLevel,
        leverageRatio: leverageRatio.toFixed(2),
        marginRatio: marginRatio.toFixed(2)
      },
      positions: {
        count: positions.length,
        totalValue: totalValue.toFixed(2),
        totalUnrealizedPnl: totalPnl.toFixed(2)
      }
    };
  }

  /**
   * 覆盖：上传 AI 日志（Mock 模式下只打印）
   */
  async uploadAiLog(params: any): Promise<any> {
    console.log(`\n🎮 [MOCK] AI 日志上传（模拟）`);
    console.log(`   模型: ${params.model}`);
    console.log(`   阶段: ${params.stage}`);
    return { code: '00000', msg: 'success' };
  }

  /**
   * 获取 Mock 统计信息
   */
  async getMockStatistics(): Promise<{
    initialBalance: number;
    currentBalance: number;
    totalPnl: number;
    pnlPercent: number;
    tradesCount: number;
    winRate: number;
  }> {
    await this.initMockStore();
    const currentPrice = await this.fetchCurrentPrice();
    const stats = this.mockStore!.getStatistics(currentPrice);
    const state = this.mockStore!.getState();

    return {
      initialBalance: state.initialBalance,
      currentBalance: state.balance.total + stats.totalPnl,
      ...stats
    };
  }

  /**
   * 重置 Mock 数据
   */
  async resetMockData(initialBalance: number = 1000): Promise<void> {
    await this.initMockStore();
    await this.mockStore!.reset(initialBalance);
  }
}

