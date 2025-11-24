import 'dotenv/config';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import crypto from 'crypto';

/**
 * Weex API 配置接口
 */
export interface WeexConfig {
  apiKey?: string;
  secretKey?: string;
  baseURL?: string;
  timeout?: number;
}

/**
 * API 响应接口
 */
export interface WeexResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * Weex 交易所合约交易 API 客户端
 */
export class WeexClient {
  private apiKey: string;
  private secretKey: string;
  private baseURL: string;
  private axiosInstance: AxiosInstance;

  /**
   * 构造函数
   * @param config 配置选项
   */
  constructor(config?: WeexConfig) {
    // 从环境变量或配置中获取密钥
    this.apiKey = config?.apiKey || process.env.WEEX_API_KEY || '';
    this.secretKey = config?.secretKey || process.env.WEEX_SECRET_KEY || '';
    this.baseURL = config?.baseURL || 'https://api.weex.com'; // 默认API地址，需要根据实际文档调整

    if (!this.apiKey || !this.secretKey) {
      throw new Error('API Key and Secret Key are required');
    }

    // 创建 axios 实例
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: config?.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加签名和认证
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return this.signRequest(config);
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 统一处理响应
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * 签名请求
   * @param config axios 请求配置
   * @returns 签名后的配置
   */
  private signRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const timestamp = Date.now().toString();

    // 添加 API Key 到请求头
    config.headers = config.headers || {};
    config.headers['X-API-KEY'] = this.apiKey;
    config.headers['X-TIMESTAMP'] = timestamp;

    // 生成签名（具体签名算法需要根据 Weex 文档调整）
    const signature = this.generateSignature(config, timestamp);
    config.headers['X-SIGNATURE'] = signature;

    return config;
  }

  /**
   * 生成签名
   * @param config 请求配置
   * @param timestamp 时间戳
   * @returns 签名字符串
   */
  private generateSignature(config: InternalAxiosRequestConfig, timestamp: string): string {
    // 这是一个示例签名算法，需要根据 Weex 实际文档调整
    const method = config.method?.toUpperCase() || 'GET';
    const path = config.url || '';
    const queryString = this.buildQueryString(config.params);
    const body = config.data ? JSON.stringify(config.data) : '';

    // 构建待签名字符串
    const signString = `${method}${path}${queryString}${body}${timestamp}`;

    // 使用 HMAC-SHA256 生成签名
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(signString)
      .digest('hex');

    return signature;
  }

  /**
   * 构建查询字符串
   * @param params 参数对象
   * @returns 查询字符串
   */
  private buildQueryString(params?: any): string {
    if (!params) return '';
    const sortedKeys = Object.keys(params).sort();
    const queryParts = sortedKeys.map(key => `${key}=${params[key]}`);
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  }

  /**
   * 错误处理
   * @param error 错误对象
   * @returns 格式化的错误信息
   */
  private handleError(error: any): Error {
    if (error.response) {
      // 服务器返回错误
      const { status, data } = error.response;
      return new Error(`API Error [${status}]: ${data?.msg || data?.message || 'Unknown error'}`);
    } else if (error.request) {
      // 请求发送但没有收到响应
      return new Error('No response from server');
    } else {
      // 其他错误
      return new Error(error.message || 'Unknown error');
    }
  }

  /**
   * 发送 GET 请求
   * @param endpoint API 端点
   * @param params 查询参数
   * @returns 响应数据
   */
  protected async get<T = any>(endpoint: string, params?: any): Promise<WeexResponse<T>> {
    return this.axiosInstance.get(endpoint, { params });
  }

  /**
   * 发送 POST 请求
   * @param endpoint API 端点
   * @param data 请求体数据
   * @returns 响应数据
   */
  protected async post<T = any>(endpoint: string, data?: any): Promise<WeexResponse<T>> {
    return this.axiosInstance.post(endpoint, data);
  }

  /**
   * 发送 PUT 请求
   * @param endpoint API 端点
   * @param data 请求体数据
   * @returns 响应数据
   */
  protected async put<T = any>(endpoint: string, data?: any): Promise<WeexResponse<T>> {
    return this.axiosInstance.put(endpoint, data);
  }

  /**
   * 发送 DELETE 请求
   * @param endpoint API 端点
   * @param params 查询参数
   * @returns 响应数据
   */
  protected async delete<T = any>(endpoint: string, params?: any): Promise<WeexResponse<T>> {
    return this.axiosInstance.delete(endpoint, { params });
  }

  // ==================== 以下是具体的 API 方法，等待文档后完善 ====================

  /**
   * 示例：获取账户信息
   */
  async getAccountInfo() {
    return this.get('/api/v1/account/info');
  }

  /**
   * 示例：下单
   */
  async placeOrder(params: any) {
    return this.post('/api/v1/order/place', params);
  }

  /**
   * 示例：取消订单
   */
  async cancelOrder(orderId: string) {
    return this.delete(`/api/v1/order/${orderId}`);
  }

  /**
   * 示例：获取持仓信息
   */
  async getPositions() {
    return this.get('/api/v1/positions');
  }

  /**
   * 示例：获取订单列表
   */
  async getOrders(params?: any) {
    return this.get('/api/v1/orders', params);
  }
}

// 导出默认实例
export default new WeexClient();
