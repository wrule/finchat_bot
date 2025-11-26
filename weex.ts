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
