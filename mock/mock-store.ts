/**
 * Mock 交易数据存储
 * 用于虚拟盘模式，存储模拟的持仓、余额和交易历史
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Mock 持仓接口
 */
export interface MockPosition {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: string;
  entryPrice: string;
  leverage: string;
  margin_mode: string;
  separated_mode: string;
  created_time: number;
  open_value: string;
  open_fee: string;
}

/**
 * Mock 订单接口
 */
export interface MockOrder {
  order_id: string;
  client_oid: string;
  symbol: string;
  type: string;  // 1-开多, 2-开空, 3-平多, 4-平空
  size: string;
  price: string;
  status: 'filled' | 'pending' | 'cancelled';
  created_time: number;
}

/**
 * Mock 账单接口
 */
export interface MockBill {
  id: string;
  symbol: string;
  type: string;
  amount: string;
  balance: string;
  fee: string;
  time: number;
}

/**
 * Mock 存储状态
 */
export interface MockState {
  balance: {
    total: number;
    available: number;
    frozen: number;
  };
  positions: MockPosition[];
  orders: MockOrder[];
  bills: MockBill[];
  initialBalance: number;
  createdAt: number;
  updatedAt: number;
}

const MOCK_DATA_FILE = path.join(process.cwd(), 'mock', 'mock-data.json');

/**
 * 默认初始状态
 */
function getDefaultState(): MockState {
  const initialBalance = 1000; // 初始 1000 USDT
  return {
    balance: {
      total: initialBalance,
      available: initialBalance,
      frozen: 0
    },
    positions: [],
    orders: [],
    bills: [],
    initialBalance,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

/**
 * Mock 存储类
 */
export class MockStore {
  private state: MockState;
  private autoSave: boolean;

  constructor(autoSave: boolean = true) {
    this.state = getDefaultState();
    this.autoSave = autoSave;
  }

  /**
   * 加载存储状态
   */
  async load(): Promise<void> {
    try {
      const data = await fs.readFile(MOCK_DATA_FILE, 'utf-8');
      this.state = JSON.parse(data);
      console.log('📂 Mock 数据已加载');
    } catch (error) {
      // 文件不存在，使用默认状态
      this.state = getDefaultState();
      console.log('📂 Mock 数据初始化（新建）');
      await this.save();
    }
  }

  /**
   * 保存存储状态
   */
  async save(): Promise<void> {
    this.state.updatedAt = Date.now();
    await fs.writeFile(MOCK_DATA_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
  }

  /**
   * 重置为初始状态
   */
  async reset(initialBalance: number = 1000): Promise<void> {
    this.state = getDefaultState();
    this.state.initialBalance = initialBalance;
    this.state.balance.total = initialBalance;
    this.state.balance.available = initialBalance;
    await this.save();
    console.log(`🔄 Mock 数据已重置，初始余额: ${initialBalance} USDT`);
  }

  // Getters
  getState(): MockState { return this.state; }
  getBalance() { return this.state.balance; }
  getPositions(): MockPosition[] { return this.state.positions; }
  getOrders(): MockOrder[] { return this.state.orders; }
  getBills(): MockBill[] { return this.state.bills; }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 开仓
   * @param side - 方向 LONG/SHORT
   * @param size - 数量
   * @param price - 开仓价格
   * @param leverage - 杠杆倍数
   */
  async openPosition(
    side: 'LONG' | 'SHORT',
    size: string,
    price: string,
    leverage: string = '20'
  ): Promise<{ order_id: string; client_oid: string }> {
    const sizeNum = parseFloat(size);
    const priceNum = parseFloat(price);
    const leverageNum = parseFloat(leverage);

    // 计算开仓价值和保证金
    const openValue = sizeNum * priceNum;
    const margin = openValue / leverageNum;
    const fee = openValue * 0.0006; // 0.06% 手续费

    // 检查余额
    if (this.state.balance.available < margin + fee) {
      throw new Error(`余额不足: 需要 ${(margin + fee).toFixed(2)} USDT, 可用 ${this.state.balance.available.toFixed(2)} USDT`);
    }

    // 查找是否有同方向的持仓
    const existingPosition = this.state.positions.find(p => p.side === side);

    const orderId = this.generateId();
    const clientOid = `${side.toLowerCase()}_${Date.now()}`;

    if (existingPosition) {
      // 加仓：更新现有持仓
      const existingSize = parseFloat(existingPosition.size);
      const existingValue = parseFloat(existingPosition.open_value);
      const newSize = existingSize + sizeNum;
      const newValue = existingValue + openValue;
      const newEntryPrice = newValue / newSize;

      existingPosition.size = newSize.toFixed(4);
      existingPosition.open_value = newValue.toFixed(2);
      existingPosition.entryPrice = newEntryPrice.toFixed(2);
      existingPosition.open_fee = (parseFloat(existingPosition.open_fee) + fee).toFixed(5);
    } else {
      // 新开仓
      const position: MockPosition = {
        id: this.generateId(),
        symbol: 'cmt_btcusdt',
        side,
        size: sizeNum.toFixed(4),
        entryPrice: priceNum.toFixed(2),
        leverage,
        margin_mode: 'SHARED',
        separated_mode: 'COMBINED',
        created_time: Date.now(),
        open_value: openValue.toFixed(2),
        open_fee: fee.toFixed(5)
      };
      this.state.positions.push(position);
    }

    // 更新余额
    this.state.balance.available -= (margin + fee);
    this.state.balance.frozen += margin;

    // 记录订单
    const order: MockOrder = {
      order_id: orderId,
      client_oid: clientOid,
      symbol: 'cmt_btcusdt',
      type: side === 'LONG' ? '1' : '2',
      size,
      price,
      status: 'filled',
      created_time: Date.now()
    };
    this.state.orders.push(order);

    // 记录账单
    const bill: MockBill = {
      id: this.generateId(),
      symbol: 'cmt_btcusdt',
      type: side === 'LONG' ? 'open_long' : 'open_short',
      amount: `-${margin.toFixed(5)}`,
      balance: this.state.balance.available.toFixed(5),
      fee: fee.toFixed(5),
      time: Date.now()
    };
    this.state.bills.unshift(bill);

    if (this.autoSave) await this.save();

    return { order_id: orderId, client_oid: clientOid };
  }

  /**
   * 平仓
   * @param side - 平仓方向 LONG/SHORT
   * @param size - 平仓数量
   * @param currentPrice - 当前价格
   */
  async closePosition(
    side: 'LONG' | 'SHORT',
    size: string,
    currentPrice: string
  ): Promise<{ order_id: string; client_oid: string; pnl: number }> {
    const position = this.state.positions.find(p => p.side === side);

    if (!position) {
      throw new Error(`未找到 ${side} 持仓`);
    }

    const sizeNum = parseFloat(size);
    const positionSize = parseFloat(position.size);
    const currentPriceNum = parseFloat(currentPrice);
    const entryPrice = parseFloat(position.entryPrice);
    const leverageNum = parseFloat(position.leverage);

    if (sizeNum > positionSize) {
      throw new Error(`平仓数量 ${size} 超过持仓数量 ${position.size}`);
    }

    // 计算盈亏
    const closeValue = sizeNum * currentPriceNum;
    const openValue = sizeNum * entryPrice;
    let pnl: number;
    if (side === 'LONG') {
      pnl = closeValue - openValue;
    } else {
      pnl = openValue - closeValue;
    }

    // 计算手续费
    const fee = closeValue * 0.0006;
    pnl -= fee;

    // 计算释放的保证金
    const releasedMargin = openValue / leverageNum;

    const orderId = this.generateId();
    const clientOid = `close_${side.toLowerCase()}_${Date.now()}`;

    // 更新持仓
    if (sizeNum >= positionSize) {
      // 全部平仓
      this.state.positions = this.state.positions.filter(p => p.id !== position.id);
    } else {
      // 部分平仓
      const remainingSize = positionSize - sizeNum;
      const remainingValue = remainingSize * entryPrice;
      position.size = remainingSize.toFixed(4);
      position.open_value = remainingValue.toFixed(2);
    }

    // 更新余额
    this.state.balance.frozen -= releasedMargin;
    this.state.balance.available += releasedMargin + pnl;
    this.state.balance.total = this.state.balance.available + this.state.balance.frozen;

    // 记录订单
    const order: MockOrder = {
      order_id: orderId,
      client_oid: clientOid,
      symbol: 'cmt_btcusdt',
      type: side === 'LONG' ? '3' : '4',
      size,
      price: currentPrice,
      status: 'filled',
      created_time: Date.now()
    };
    this.state.orders.push(order);

    // 记录账单
    const bill: MockBill = {
      id: this.generateId(),
      symbol: 'cmt_btcusdt',
      type: side === 'LONG' ? 'close_long' : 'close_short',
      amount: pnl.toFixed(5),
      balance: this.state.balance.available.toFixed(5),
      fee: fee.toFixed(5),
      time: Date.now()
    };
    this.state.bills.unshift(bill);

    if (this.autoSave) await this.save();

    return { order_id: orderId, client_oid: clientOid, pnl };
  }

  /**
   * 计算持仓未实现盈亏
   * @param currentPrice - 当前市场价格
   */
  calculateUnrealizedPnl(currentPrice: string): { positions: any[]; totalPnl: number } {
    const priceNum = parseFloat(currentPrice);
    let totalPnl = 0;

    const positions = this.state.positions.map(pos => {
      const size = parseFloat(pos.size);
      const entryPrice = parseFloat(pos.entryPrice);
      const openValue = parseFloat(pos.open_value);

      let unrealizedPnl: number;
      if (pos.side === 'LONG') {
        unrealizedPnl = (priceNum - entryPrice) * size;
      } else {
        unrealizedPnl = (entryPrice - priceNum) * size;
      }

      const pnlPercent = (unrealizedPnl / openValue) * 100;
      totalPnl += unrealizedPnl;

      return {
        ...pos,
        unrealizePnl: unrealizedPnl.toFixed(5),
        pnlPercent: pnlPercent.toFixed(4)
      };
    });

    return { positions, totalPnl };
  }

  /**
   * 获取统计信息
   */
  getStatistics(currentPrice: string): {
    totalPnl: number;
    pnlPercent: number;
    tradesCount: number;
    winRate: number;
  } {
    const { totalPnl } = this.calculateUnrealizedPnl(currentPrice);

    // 计算已实现盈亏
    const closeBills = this.state.bills.filter(b =>
      b.type === 'close_long' || b.type === 'close_short'
    );
    const realizedPnl = closeBills.reduce((sum, b) => sum + parseFloat(b.amount), 0);

    const totalProfit = realizedPnl + totalPnl;
    const pnlPercent = (totalProfit / this.state.initialBalance) * 100;

    // 计算胜率
    const winTrades = closeBills.filter(b => parseFloat(b.amount) > 0).length;
    const winRate = closeBills.length > 0 ? (winTrades / closeBills.length) * 100 : 0;

    return {
      totalPnl: totalProfit,
      pnlPercent,
      tradesCount: closeBills.length,
      winRate
    };
  }
}

// 单例导出
let mockStoreInstance: MockStore | null = null;

export async function getMockStore(): Promise<MockStore> {
  if (!mockStoreInstance) {
    mockStoreInstance = new MockStore();
    await mockStoreInstance.load();
  }
  return mockStoreInstance;
}

