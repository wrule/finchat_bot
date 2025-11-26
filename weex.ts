import axios, { AxiosResponse } from 'axios';
import CryptoJS from 'crypto-js';

/**
 * 服务器时间响应接口
 */
export interface ServerTimeResponse {
  /** Unix 时间戳（UTC 时区），以秒为单位的十进制数 */
  epoch: string;
  /** ISO 8601 标准时间格式 */
  iso: string;
  /** 服务器时间戳（毫秒） */
  timestamp: number;
}

/**
 * 合约信息响应接口
 */
export interface ContractInfo {
  /** 交易对 */
  symbol: string;
  /** 合约标的 */
  underlying_index: string;
  /** 计价货币 */
  quote_currency: string;
  /** 保证金币种 */
  coin: string;
  /** 合约面值 */
  contract_val: string;
  /** 创建时间 */
  listing: string | null;
  /** 结算时间数组 */
  delivery: string[];
  /** 数量精度 */
  size_increment: string;
  /** 价格精度 */
  tick_size: string;
  /** 是否为 USDT-M 合约 */
  forwardContractFlag: boolean;
  /** 价格最后一位小数的步长 */
  priceEndStep: number;
  /** 最小杠杆（默认：1） */
  minLeverage: number;
  /** 最大杠杆（默认：100） */
  maxLeverage: number;
  /** 买入限价比率 */
  buyLimitPriceRatio: string;
  /** 卖出限价比率 */
  sellLimitPriceRatio: string;
  /** Maker 费率 */
  makerFeeRate: string;
  /** Taker 费率 */
  takerFeeRate: string;
  /** 最小下单数量（基础货币） */
  minOrderSize: string;
  /** 最大下单数量（基础货币） */
  maxOrderSize: string;
  /** 最大持仓数量（基础货币） */
  maxPositionSize: string;
}

/**
 * K线周期类型
 */
export type CandlestickGranularity = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d' | '1w';

/**
 * 价格类型
 */
export type PriceType = 'LAST' | 'MARK' | 'INDEX';

/**
 * K线数据（原始数组格式）
 * [时间, 开盘价, 最高价, 最低价, 收盘价, 交易量, 成交额]
 */
export type CandlestickRaw = [string, string, string, string, string, string, string];

/**
 * K线数据（对象格式，便于使用）
 */
export interface Candlestick {
  /** K线时间（毫秒时间戳） */
  time: number;
  /** 开盘价 */
  open: string;
  /** 最高价 */
  high: string;
  /** 最低价 */
  low: string;
  /** 收盘价 */
  close: string;
  /** 交易量 */
  volume: string;
  /** 成交额 */
  turnover: string;
}

/**
 * 获取K线数据的请求参数
 */
export interface GetCandlesParams {
  /** 交易对（必填） */
  symbol: string;
  /** K线周期（必填） */
  granularity: CandlestickGranularity;
  /** 返回数量限制（默认：100） */
  limit?: number;
  /** 价格类型（默认：LAST） */
  priceType?: PriceType;
  /** 开始时间（毫秒时间戳） */
  startTime?: number;
  /** 结束时间（毫秒时间戳） */
  endTime?: number;
}

/**
 * 账户状态
 */
export type AccountStatus = 'UNKNOWN_ACCOUNT_STATUS' | 'NORMAL' | 'DISABLED';

/**
 * 保证金模式
 */
export type MarginMode = 'SHARED' | 'CROSS' | 'ISOLATED';

/**
 * 仓位方向
 */
export type PositionSide = 'LONG' | 'SHORT';

/**
 * 费用设置
 */
export interface FeeSetting {
  /** 是否设置费率 */
  is_set_fee_rate: boolean;
  /** Taker 费率 */
  taker_fee_rate: string;
  /** Maker 费率 */
  maker_fee_rate: string;
  /** 是否启用费率折扣 */
  is_set_fee_discount: boolean;
  /** 费率折扣 */
  fee_discount: string;
  /** 是否对 Taker 和 Maker 应用单独的费率折扣 */
  is_set_taker_maker_fee_discount: boolean;
  /** Taker 费率折扣 */
  taker_fee_discount: string;
  /** Maker 费率折扣 */
  maker_fee_discount: string;
}

/**
 * 模式设置
 */
export interface ModeSetting {
  /** 保证金模式 */
  margin_mode: string;
  /** 仓位隔离模式 */
  separated_mode: string;
  /** 仓位模式 */
  position_mode: string;
}

/**
 * 杠杆设置
 */
export interface LeverageSetting {
  /** 逐仓多头杠杆 */
  isolated_long_leverage: string;
  /** 逐仓空头杠杆 */
  isolated_short_leverage: string;
  /** 全仓杠杆 */
  cross_leverage: string;
  /** 共享杠杆 */
  shared_leverage: string;
}

/**
 * 账户信息
 */
export interface AccountInfo {
  /** 账户 ID */
  id: string;
  /** 关联用户 ID */
  user_id: string;
  /** 客户账户 ID */
  client_account_id: string;
  /** 是否为系统账户 */
  is_system_account: boolean;
  /** 默认费用配置 */
  default_fee_setting: FeeSetting | null;
  /** 合约 ID 到费用设置的映射 */
  contract_id_to_fee_setting: Record<string, FeeSetting>;
  /** 合约 ID 到模式设置的映射 */
  contract_id_to_mode_setting: Record<string, ModeSetting>;
  /** 合约 ID 到杠杆设置的映射 */
  contract_id_to_leverage_setting: Record<string, LeverageSetting>;
  /** 每分钟创建订单速率限制 */
  create_order_rate_limit_per_minute: number;
  /** 创建订单延迟（毫秒） */
  create_order_delay_milliseconds: number;
  /** 附加类型 */
  extra_type: string;
  /** 附加数据 */
  extra_data_json: string;
  /** 账户状态 */
  status: AccountStatus;
  /** 创建时间 */
  created_time: string;
  /** 更新时间 */
  updated_time: string;
}

/**
 * 抵押品信息
 */
export interface CollateralInfo {
  /** 账户 ID */
  account_id: string;
  /** 币种 ID */
  coin_id: number;
  /** 保证金模式 */
  margin_mode: MarginMode;
  /** 全仓合约 ID */
  cross_contract_id: number;
  /** 逐仓仓位 ID */
  isolated_position_id: string;
  /** 抵押品数量 */
  amount: string;
  /** 待存入数量 */
  pending_deposit_amount: string;
  /** 待提取数量 */
  pending_withdraw_amount: string;
  /** 待转入数量 */
  pending_transfer_in_amount: string;
  /** 待转出数量 */
  pending_transfer_out_amount: string;
  /** 是否正在清算 */
  is_liquidating: boolean;
  /** 遗留余额 */
  legacy_amount: string;
  /** 累计存入数量 */
  cum_deposit_amount: string;
  /** 累计提取数量 */
  cum_withdraw_amount: string;
  /** 累计转入数量 */
  cum_transfer_in_amount: string;
  /** 累计转出数量 */
  cum_transfer_out_amount: string;
  /** 累计保证金转入数量 */
  cum_margin_move_in_amount: string;
  /** 累计保证金转出数量 */
  cum_margin_move_out_amount: string;
  /** 累计开多仓抵押品数量 */
  cum_position_open_long_amount: string;
  /** 累计开空仓抵押品数量 */
  cum_position_open_short_amount: string;
  /** 累计平多仓抵押品数量 */
  cum_position_close_long_amount: string;
  /** 累计平空仓抵押品数量 */
  cum_position_close_short_amount: string;
  /** 累计成交手续费 */
  cum_position_fill_fee_amount: string;
  /** 累计清算手续费 */
  cum_position_liquidate_fee_amount: string;
  /** 累计资金费用 */
  cum_position_funding_amount: string;
  /** 累计订单手续费收入 */
  cum_order_fill_fee_income_amount: string;
  /** 累计清算手续费收入 */
  cum_order_liquidate_fee_income_amount: string;
  /** 创建时间 */
  created_time: string;
  /** 更新时间 */
  updated_time: string;
}

/**
 * 仓位信息
 */
export interface PositionInfo {
  /** 仓位 ID */
  id: string;
  /** 关联账户 ID */
  account_id: string;
  /** 关联抵押品币种 ID */
  coin_id: number;
  /** 关联合约 ID */
  contract_id: number;
  /** 仓位方向 */
  side: PositionSide;
  /** 当前仓位的保证金模式 */
  margin_mode: MarginMode;
  /** 当前仓位的隔离模式 */
  separated_mode: string;
  /** 隔离仓位的开仓订单 ID */
  separated_open_order_id: string;
  /** 仓位杠杆 */
  leverage: string;
  /** 当前仓位大小 */
  size: string;
  /** 开仓初始价值 */
  open_value: string;
  /** 开仓手续费 */
  open_fee: string;
  /** 资金费用 */
  funding_fee: string;
  /** 逐仓保证金 */
  isolated_margin: string;
  /** 是否启用逐仓保证金自动追加 */
  is_auto_append_isolated_margin: boolean;
  /** 累计开仓数量 */
  cum_open_size: string;
  /** 累计开仓价值 */
  cum_open_value: string;
  /** 累计开仓手续费 */
  cum_open_fee: string;
  /** 累计平仓数量 */
  cum_close_size: string;
  /** 累计平仓价值 */
  cum_close_value: string;
  /** 累计平仓手续费 */
  cum_close_fee: string;
  /** 累计已结算资金费用 */
  cum_funding_fee: string;
  /** 累计清算手续费 */
  cum_liquidate_fee: string;
  /** 创建时的撮合引擎序列 ID */
  created_match_sequence_id: string;
  /** 最后更新时的撮合引擎序列 ID */
  updated_match_sequence_id: string;
  /** 创建时间 */
  created_time: string;
  /** 更新时间 */
  updated_time: string;
}

/**
 * 账户列表响应
 */
export interface AccountListResponse {
  /** 账户信息 */
  account: AccountInfo;
  /** 抵押品信息 */
  collateral: CollateralInfo[];
  /** 仓位信息 */
  position: PositionInfo[];
  /** 版本 */
  version: string;
}

/**
 * Weex OpenAPI Client
 * Based on the official API documentation
 */
export class WeexApiClient {
  private apiKey: string;
  private secretKey: string;
  private accessPassphrase: string;
  private baseUrl: string;

  /**
   * Initialize the Weex API Client
   * @param apiKey - Your API Key
   * @param secretKey - Your Secret Key
   * @param accessPassphrase - Your Access Passphrase
   * @param baseUrl - API base URL (e.g., https://api-contract.weex.com)
   */
  constructor(
    apiKey: string,
    secretKey: string,
    accessPassphrase: string,
    baseUrl: string
  ) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.accessPassphrase = accessPassphrase;
    this.baseUrl = baseUrl;
  }

  /**
   * Generate HMAC SHA256 signature
   * @param message - The message to sign
   * @returns Base64 encoded signature
   */
  private generateHmacSha256Signature(message: string): string {
    const hash = CryptoJS.HmacSHA256(message, this.secretKey);
    return CryptoJS.enc.Base64.stringify(hash);
  }

  /**
   * Generate signature for POST request
   * @param timestamp - Current timestamp in milliseconds
   * @param method - HTTP method (POST)
   * @param requestPath - API endpoint path
   * @param queryString - Query string (usually empty for POST)
   * @param body - Request body as JSON string
   * @returns Signature string
   */
  private generateSignature(
    timestamp: string,
    method: string,
    requestPath: string,
    queryString: string,
    body: string
  ): string {
    const message = timestamp + method.toUpperCase() + requestPath + queryString + body;
    return this.generateHmacSha256Signature(message);
  }

  /**
   * Generate signature for GET request
   * @param timestamp - Current timestamp in milliseconds
   * @param method - HTTP method (GET)
   * @param requestPath - API endpoint path
   * @param queryString - Query string
   * @returns Signature string
   */
  private generateSignatureGet(
    timestamp: string,
    method: string,
    requestPath: string,
    queryString: string
  ): string {
    const message = timestamp + method.toUpperCase() + requestPath + queryString;
    return this.generateHmacSha256Signature(message);
  }

  /**
   * Send POST request to Weex API
   * @param requestPath - API endpoint path
   * @param body - Request body object
   * @param queryString - Optional query string (default: '')
   * @returns API response data
   */
  async sendRequestPost<T = any>(
    requestPath: string,
    body: any,
    queryString: string = ''
  ): Promise<T> {
    const timestamp = Date.now().toString();
    const method = 'POST';
    const bodyString = JSON.stringify(body);
    const signature = this.generateSignature(
      timestamp,
      method,
      requestPath,
      queryString,
      bodyString
    );

    const url = this.baseUrl + requestPath;

    try {
      const response: AxiosResponse<T> = await axios.post(url, bodyString, {
        headers: {
          'ACCESS-KEY': this.apiKey,
          'ACCESS-SIGN': signature,
          'ACCESS-TIMESTAMP': timestamp,
          'ACCESS-PASSPHRASE': this.accessPassphrase,
          'Content-Type': 'application/json',
          'locale': 'en-US',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `API Request Failed: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * Send GET request to Weex API
   * @param requestPath - API endpoint path
   * @param queryString - Query string (default: '')
   * @returns API response data
   */
  async sendRequestGet<T = any>(
    requestPath: string,
    queryString: string = ''
  ): Promise<T> {
    const timestamp = Date.now().toString();
    const method = 'GET';
    const signature = this.generateSignatureGet(
      timestamp,
      method,
      requestPath,
      queryString
    );

    const url = this.baseUrl + requestPath + queryString;

    try {
      const response: AxiosResponse<T> = await axios.get(url, {
        headers: {
          'ACCESS-KEY': this.apiKey,
          'ACCESS-SIGN': signature,
          'ACCESS-TIMESTAMP': timestamp,
          'ACCESS-PASSPHRASE': this.accessPassphrase,
          'Content-Type': 'application/json',
          'locale': 'en-US',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `API Request Failed: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取服务器时间（公共接口，无需签名）
   * GET /capi/v2/market/time
   * Weight(IP): 1
   * @returns 服务器时间信息
   */
  async getServerTime(): Promise<ServerTimeResponse> {
    const url = this.baseUrl + '/capi/v2/market/time';

    try {
      const response: AxiosResponse<ServerTimeResponse> = await axios.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取服务器时间失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取合约信息（公共接口，无需签名）
   * GET /capi/v2/market/contracts
   * Weight(IP): 10
   * @param symbol - 交易对（可选），例如 "cmt_btcusdt"
   * @returns 合约信息数组
   */
  async getContracts(symbol?: string): Promise<ContractInfo[]> {
    let url = this.baseUrl + '/capi/v2/market/contracts';

    // 如果提供了 symbol 参数，添加到查询字符串
    if (symbol) {
      url += `?symbol=${symbol}`;
    }

    try {
      const response: AxiosResponse<ContractInfo[]> = await axios.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取合约信息失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取K线数据（公共接口，无需签名）
   * GET /capi/v2/market/candles
   * Weight(IP): 1
   * @param params - 请求参数
   * @returns K线数据数组（原始格式）
   */
  async getCandles(params: GetCandlesParams): Promise<CandlestickRaw[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('symbol', params.symbol);
    queryParams.append('granularity', params.granularity);

    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params.priceType) {
      queryParams.append('priceType', params.priceType);
    }

    if (params.startTime !== undefined) {
      queryParams.append('startTime', params.startTime.toString());
    }

    if (params.endTime !== undefined) {
      queryParams.append('endTime', params.endTime.toString());
    }

    const url = `${this.baseUrl}/capi/v2/market/candles?${queryParams.toString()}`;

    try {
      const response: AxiosResponse<CandlestickRaw[]> = await axios.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取K线数据失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取K线数据（对象格式，便于使用）
   * @param params - 请求参数
   * @returns K线数据数组（对象格式）
   */
  async getCandlesFormatted(params: GetCandlesParams): Promise<Candlestick[]> {
    const rawData = await this.getCandles(params);

    return rawData.map(candle => ({
      time: parseInt(candle[0]),
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
      turnover: candle[6],
    }));
  }

  /**
   * 获取账户列表（私有接口，需要签名）
   * GET /capi/v2/account/accounts
   * Weight(IP): 5, Weight(UID): 5
   * 需要权限：合约交易读权限
   * @returns 账户列表信息
   */
  async getAccounts(): Promise<AccountListResponse> {
    const requestPath = '/capi/v2/account/accounts';
    const queryString = '';

    try {
      const response = await this.sendRequestGet<AccountListResponse>(
        requestPath,
        queryString
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取账户列表失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }
}

/**
 * Example usage
 */
async function example() {
  // Initialize the client with your credentials
  const client = new WeexApiClient(
    '', // Replace with your API Key
    '', // Replace with your Secret Key
    '', // Replace with your Access Passphrase
    ''  // Replace with your API base URL
  );

  try {
    // 获取服务器时间（公共接口示例）
    const serverTime = await client.getServerTime();
    console.log('服务器时间:', serverTime);
    console.log('ISO 格式:', serverTime.iso);
    console.log('时间戳:', serverTime.timestamp);

    // GET request example
    const requestPath = '/api/uni/v3/order/currentPlan';
    const queryString = '?symbol=cmt_bchusdt&delegateType=0&startTime=1742213127794&endTime=1742213506548';
    const getResponse = await client.sendRequestGet(requestPath, queryString);
    console.log('GET Response:', getResponse);

    // POST request example
    const postRequestPath = '/api/uni/v3/order/currentPlan';
    const body = {
      symbol: 'ETHUSDT_SPBL',
      limit: '2'
    };
    const postResponse = await client.sendRequestPost(postRequestPath, body);
    console.log('POST Response:', postResponse);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the example
// example();
