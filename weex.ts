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
 * 合约账户资产信息
 */
export interface ContractAccountAsset {
  /** 币种 ID */
  coinId: number;
  /** 币种名称 */
  coinName: string;
  /** 可用资产 */
  available: string;
  /** 冻结资产 */
  frozen: string;
  /** 总资产 */
  equity: string;
  /** 未实现盈亏 */
  unrealizePnl: string;
}

/**
 * 现货账户资产信息
 */
export interface SpotAccountAsset {
  /** 币种 ID */
  coinId: number;
  /** 币种名称 */
  coinName: string;
  /** 可用资产 */
  available: string;
  /** 冻结资产 */
  frozen: string;
  /** 总资产 */
  equity: string;
}

/**
 * 现货资产响应
 */
export interface SpotAssetsResponse {
  /** 响应代码 */
  code: string;
  /** 响应消息 */
  msg: string;
  /** 请求时间 */
  requestTime: number;
  /** 资产数据 */
  data: SpotAccountAsset[];
}

/**
 * 业务类型
 */
export type BusinessType =
  | 'deposit'                        // 存款
  | 'withdraw'                       // 提款
  | 'transfer_in'                    // 转入
  | 'transfer_out'                   // 转出
  | 'margin_move_in'                 // 保证金转入
  | 'margin_move_out'                // 保证金转出
  | 'position_open_long'             // 开多仓
  | 'position_open_short'            // 开空仓
  | 'position_close_long'            // 平多仓
  | 'position_close_short'           // 平空仓
  | 'position_funding'               // 资金费用
  | 'order_fill_fee_income'          // 订单成交手续费收入
  | 'order_liquidate_fee_income'     // 订单清算手续费收入
  | 'start_liquidate'                // 开始清算
  | 'finish_liquidate'               // 完成清算
  | 'order_fix_margin_amount'        // 清算损失补偿
  | 'tracking_follow_pay'            // 跟单支付
  | 'tracking_system_pre_receive'    // 系统预收佣金
  | 'tracking_follow_back'           // 跟单退款
  | 'tracking_trader_income'         // 带单收入
  | 'tracking_third_party_share';    // 第三方分成

/**
 * 转账原因
 */
export type TransferReason =
  | 'UNKNOWN_TRANSFER_REASON'        // 未知转账原因
  | 'USER_TRANSFER'                  // 用户手动转账
  | 'INCREASE_CONTRACT_CASH_GIFT'    // 增加合约现金礼物
  | 'REDUCE_CONTRACT_CASH_GIFT'      // 减少合约现金礼物
  | 'REFUND_WXB_DISCOUNT_FEE';       // 退还 WXB 折扣费用

/**
 * 获取账单请求参数
 */
export interface GetBillsParams {
  /** 币种名称 */
  coin?: string;
  /** 交易对 */
  symbol?: string;
  /** 业务类型 */
  businessType?: BusinessType;
  /** 开始时间（毫秒时间戳） */
  startTime?: number;
  /** 结束时间（毫秒时间戳） */
  endTime?: number;
  /** 返回记录限制（默认：20，最小：1，最大：100） */
  limit?: number;
}

/**
 * 账单信息
 */
export interface Bill {
  /** 账单 ID */
  billId: number;
  /** 币种名称 */
  coin: string;
  /** 交易对 */
  symbol: string;
  /** 金额 */
  amount: string;
  /** 业务类型 */
  businessType: BusinessType;
  /** 余额 */
  balance: string;
  /** 成交手续费 */
  fillFee: string;
  /** 转账原因 */
  transferReason: TransferReason;
  /** 创建时间（毫秒时间戳） */
  ctime: number;
}

/**
 * 账单列表响应
 */
export interface BillsResponse {
  /** 是否有下一页 */
  hasNextPage: boolean;
  /** 账单列表 */
  items: Bill[];
}

/**
 * 订单类型（开平仓方向）
 */
export type OrderSide = '1' | '2' | '3' | '4';
// 1: 开多, 2: 开空, 3: 平多, 4: 平空

/**
 * 订单类型（执行方式）
 */
export type OrderExecutionType = '0' | '1' | '2' | '3';
// 0: 普通, 1: 只做 Maker, 2: 全部成交或立即取消, 3: 立即成交并取消剩余

/**
 * 价格类型
 */
export type MatchPriceType = '0' | '1';
// 0: 限价, 1: 市价

/**
 * 保证金模式（订单）
 */
export type OrderMarginMode = 1 | 3;
// 1: 全仓模式, 3: 逐仓模式

/**
 * 仓位隔离模式
 */
export type SeparatedMode = 1 | 2;
// 1: 合并模式, 2: 分离模式

/**
 * 下单请求参数
 */
export interface PlaceOrderParams {
  /** 交易对（必填） */
  symbol: string;
  /** 自定义订单 ID（不超过 40 个字符，必填） */
  client_oid: string;
  /** 订单数量（不能为零或负数，必填） */
  size: string;
  /** 订单类型：1-开多, 2-开空, 3-平多, 4-平空（必填） */
  type: OrderSide;
  /** 订单执行类型：0-普通, 1-只做Maker, 2-全部成交或立即取消, 3-立即成交并取消剩余（必填） */
  order_type: OrderExecutionType;
  /** 价格匹配类型：0-限价, 1-市价（必填） */
  match_price: MatchPriceType;
  /** 订单价格（限价单必填） */
  price: string;
  /** 预设止盈价格（可选） */
  presetTakeProfitPrice?: string;
  /** 预设止损价格（可选） */
  presetStopLossPrice?: string;
  /** 保证金模式：1-全仓, 3-逐仓（默认：1） */
  marginMode?: OrderMarginMode;
  /** 仓位隔离模式：1-合并, 2-分离（默认：1） */
  separatedMode?: SeparatedMode;
}

/**
 * 下单响应
 */
export interface PlaceOrderResponse {
  /** 客户端订单 ID */
  client_oid: string | null;
  /** 订单 ID */
  order_id: string;
}

/**
 * 取消订单请求参数
 */
export interface CancelOrderParams {
  /** 订单 ID（与 clientOid 二选一） */
  orderId?: string;
  /** 客户端自定义订单 ID（与 orderId 二选一） */
  clientOid?: string;
}

/**
 * 取消订单响应
 */
export interface CancelOrderResponse {
  /** 订单 ID */
  order_id: string;
  /** 客户端订单 ID */
  client_oid: string | null;
  /** 取消状态 */
  result: boolean;
  /** 错误信息（如果取消失败） */
  err_msg: string | null;
}

/**
 * 获取成交记录请求参数
 */
export interface GetFillsParams {
  /** 交易对名称（可选） */
  symbol?: string;
  /** 订单 ID（可选） */
  orderId?: string;
  /** 开始时间戳（可选） */
  startTime?: number;
  /** 结束时间戳（可选） */
  endTime?: number;
  /** 查询数量：最大 100，默认 100（可选） */
  limit?: number;
}

/**
 * 成交记录
 */
export interface Fill {
  /** 成交订单 ID */
  tradeId: number;
  /** 关联订单 ID */
  orderId: number;
  /** 交易对名称 */
  symbol: string;
  /** 保证金模式 */
  marginMode: string;
  /** 分离模式 */
  separatedMode: string;
  /** 仓位方向 */
  positionSide: string;
  /** 订单方向 */
  orderSide: string;
  /** 实际成交数量 */
  fillSize: string;
  /** 实际成交价值 */
  fillValue: string;
  /** 实际交易手续费 */
  fillFee: string;
  /** 平仓手续费 */
  liquidateFee: string;
  /** 实际已实现盈亏 */
  realizePnl: string;
  /** 实际执行方向 */
  direction: string;
  /** 强平订单类型 */
  liquidateType: string;
  /** 兼容旧版订单方向类型 */
  legacyOrdeDirection: string;
  /** 时间戳 */
  createdTime: number;
}

/**
 * 获取成交记录响应
 */
export interface GetFillsResponse {
  /** 成交记录列表 */
  list: Fill[];
  /** 是否有更多页 */
  nextFlag: boolean;
  /** 总条目数 */
  totals: number;
}

/**
 * 单个仓位信息
 */
export interface SinglePosition {
  /** 仓位 ID */
  id: number;
  /** 关联账户 ID */
  account_id: number;
  /** 关联抵押品币种 ID */
  coin_id: number;
  /** 关联合约 ID */
  contract_id: number;
  /** 交易对 */
  symbol?: string;
  /** 仓位方向（LONG: 多头, SHORT: 空头） */
  side: string;
  /** 保证金模式（SHARED: 全仓, ISOLATED: 逐仓） */
  margin_mode: string;
  /** 分离模式（COMBINED: 合并, SEPARATED: 分离） */
  separated_mode: string;
  /** 分离仓位的开仓订单 ID */
  separated_open_order_id: number;
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
  /** 是否启用逐仓保证金自动追加（仅逐仓模式） */
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
  /** 累计强平手续费 */
  cum_liquidate_fee: string;
  /** 创建时的撮合引擎序列 ID */
  created_match_sequence_id: number;
  /** 最后更新时的撮合引擎序列 ID */
  updated_match_sequence_id: number;
  /** 创建时间 */
  created_time: number;
  /** 更新时间 */
  updated_time: number;
  /** 合约面值 */
  contractVal: string;
  /** 未实现盈亏 */
  unrealizePnl: string;
  /** 预估强平价格（0 表示低风险，无强平价格） */
  liquidatePrice: string;
}

/**
 * 获取单个仓位请求参数
 */
export interface GetSinglePositionParams {
  /** 交易对（必填） */
  symbol: string;
}

/**
 * 单个合约的用户设置
 */
export interface FuturesUserSettings {
  /** 逐仓多头杠杆 */
  isolated_long_leverage: string;
  /** 逐仓空头杠杆 */
  isolated_short_leverage: string;
  /** 全仓杠杆 */
  cross_leverage: string;
}

/**
 * 获取用户设置请求参数
 */
export interface GetUserSettingsParams {
  /** 交易对（可选） */
  symbol?: string;
}

/**
 * 获取用户设置响应
 * 键为交易对名称，值为该交易对的设置
 */
export type GetUserSettingsResponse = {
  [symbol: string]: FuturesUserSettings;
};

/**
 * 保证金模式（数字类型，用于修改杠杆接口）
 */
export type MarginModeNumber = 1 | 3;  // 1: 全仓, 3: 逐仓

/**
 * 修改杠杆请求参数
 */
export interface ChangeLeverageParams {
  /** 交易对（必填） */
  symbol: string;
  /** 保证金模式（必填）：1-全仓, 3-逐仓 */
  marginMode: MarginModeNumber;
  /** 多头杠杆（必填）。全仓模式下会同时应用到空头 */
  longLeverage: string;
  /** 空头杠杆（可选）。逐仓模式下可以与多头不同，全仓模式下会被忽略 */
  shortLeverage?: string;
}

/**
 * 修改杠杆响应
 */
export interface ChangeLeverageResponse {
  /** 响应消息 */
  msg: string;
  /** 请求时间戳 */
  requestTime: number;
  /** 响应代码 */
  code: string;
}

/**
 * 深度档位（价格和数量）
 */
export type DepthLevel = [string, string];  // [价格, 数量]

/**
 * 获取订单簿深度请求参数
 */
export interface GetOrderBookDepthParams {
  /** 交易对（必填） */
  symbol: string;
  /** 深度档位数量（可选）：15 或 200，默认 15 */
  limit?: 15 | 200;
}

/**
 * 订单簿深度响应
 */
export interface OrderBookDepthResponse {
  /** 卖单深度（ask，从低到高排序） */
  asks: DepthLevel[];
  /** 买单深度（bid，从高到低排序） */
  bids: DepthLevel[];
  /** 时间戳 */
  timestamp: string;
}

/**
 * Ticker 信息
 */
export interface Ticker {
  /** 交易对 */
  symbol: string;
  /** 卖一价 */
  best_ask: string;
  /** 买一价 */
  best_bid: string;
  /** 24小时最高价 */
  high_24h: string;
  /** 最新成交价 */
  last: string;
  /** 24小时最低价 */
  low_24h: string;
  /** 系统时间戳 */
  timestamp: string;
  /** 24小时成交量 */
  volume_24h: string;
  /** 24小时价格变化百分比 */
  priceChangePercent: string;
  /** 24小时成交量（代币数量） */
  base_volume: string;
  /** 标记价格（可选） */
  markPrice?: string;
  /** 指数价格（可选） */
  indexPrice?: string;
}

/**
 * 获取单个 Ticker 请求参数
 */
export interface GetSingleTickerParams {
  /** 交易对（必填） */
  symbol: string;
}

/**
 * 上传 AI 日志请求参数
 */
export interface UploadAiLogParams {
  /** 订单 ID（可选） */
  orderId?: number | null;
  /** 阶段标识符（必填） */
  stage: string;
  /** 模型名称（必填） */
  model: string;
  /** 输入参数（必填，JSON 对象） */
  input: Record<string, any>;
  /** 输出结果（必填，JSON 对象） */
  output: Record<string, any>;
  /** 说明（可选） */
  explanation?: string;
}

/**
 * 上传 AI 日志响应
 */
export interface UploadAiLogResponse {
  /** 响应代码，"00000" 表示成功 */
  code: string;
  /** 响应消息，"success" 表示成功 */
  msg: string;
  /** 请求时间戳（毫秒） */
  requestTime: number;
  /** 返回的业务数据，"upload success" 表示上传成功 */
  data: string;
}

/**
 * 获取成交记录请求参数
 */
export interface GetTradesParams {
  /** 交易对（必填） */
  symbol: string;
  /** 数据大小，范围 1-1000，默认 100 */
  limit?: number;
}

/**
 * 成交记录
 */
export interface Trade {
  /** 成交订单 ID */
  ticketId: string;
  /** 成交时间 */
  time: number;
  /** 成交价格 */
  price: string;
  /** 成交数量 */
  size: string;
  /** 成交金额 */
  value: string;
  /** 交易对 */
  symbol: string;
  /** 是否完全匹配 */
  isBestMatch: boolean;
  /** 是否买方挂单 */
  isBuyerMaker: boolean;
  /** 合约面值 */
  contractVal: string;
}

/**
 * 修改用户账户模式请求参数
 */
export interface ChangeHoldModelParams {
  /** 交易对（必填） */
  symbol: string;
  /** 保证金模式（必填）
   * 1: 全仓模式
   * 3: 逐仓模式
   */
  marginMode: 1 | 3;
  /** 持仓分离模式（必填）
   * 1: 合并模式
   * 2: 分离模式
   */
  separatedMode: 1 | 2;
}

/**
 * 修改用户账户模式响应
 */
export interface ChangeHoldModelResponse {
  /** 响应消息 */
  msg: string;
  /** 请求时间戳 */
  requestTime: number;
  /** 响应代码 */
  code: string;
}

/**
 * 调整持仓保证金请求参数
 */
export interface AdjustMarginParams {
  /** 抵押品 ID（必填） */
  coinId: number;
  /** 逐仓持仓 ID（必填） */
  isolatedPositionId: number;
  /** 抵押品数量（必填）
   * 正数表示增加保证金
   * 负数表示减少保证金
   */
  collateralAmount: string;
}

/**
 * 调整持仓保证金响应
 */
export interface AdjustMarginResponse {
  /** 响应消息 */
  msg: string;
  /** 请求时间戳 */
  requestTime: number;
  /** 响应代码 */
  code: string;
}

/**
 * 账户类型
 */
export type AccountType = 'SPOT' | 'FUND';
// SPOT: 现货钱包, FUND: 资金钱包

/**
 * 内部划转请求参数
 */
export interface InternalWithdrawalParams {
  /** 转入用户 ID（必填） */
  toUserId: string;
  /** 币种类型（必填，如 USDT, BTC） */
  coin: string;
  /** 转账金额（必填，最多 6 位小数） */
  amount: string;
  /** 转出账户类型（可选，默认：SPOT） */
  fromAccountType?: AccountType;
  /** 转入账户类型（可选，默认：SPOT） */
  toAccountType?: AccountType;
}

/**
 * 内部划转响应
 */
export interface InternalWithdrawalResponse {
  /** 响应代码 */
  code: string;
  /** 提现 ID */
  id: string;
  /** 时间戳 */
  timestamp: number;
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
   * @param baseUrl - API base URL (默认: https://api-spot.weex.com)
   */
  constructor(
    apiKey: string,
    secretKey: string,
    accessPassphrase: string,
    baseUrl: string = 'https://api-spot.weex.com'
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
   * @param queryString - Query string (without '?')
   * @returns Signature string
   */
  private generateSignatureGet(
    timestamp: string,
    method: string,
    requestPath: string,
    queryString: string
  ): string {
    // 如果有查询参数，需要在签名中加上 '?'
    const queryPart = queryString ? '?' + queryString : '';
    const message = timestamp + method.toUpperCase() + requestPath + queryPart;
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

    const url = this.baseUrl + requestPath + (queryString ? '?' + queryString : '');

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
   * 获取订单簿深度（公共接口，无需签名）
   * GET /capi/v2/market/depth
   * Weight(IP): 1
   * @param params - 请求参数
   * @returns 订单簿深度数据
   */
  async getOrderBookDepth(params: GetOrderBookDepthParams): Promise<OrderBookDepthResponse> {
    const url = `${this.baseUrl}/capi/v2/market/depth`;

    // 构建查询参数
    const queryParams: any = {
      symbol: params.symbol,
    };

    if (params.limit) {
      queryParams.limit = params.limit;
    }

    try {
      const response = await axios.get<OrderBookDepthResponse>(url, {
        params: queryParams,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取订单簿深度失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取所有交易对的 Ticker 信息（公共接口，无需签名）
   * GET /capi/v2/market/tickers
   * Weight(IP): 40
   * @returns 所有交易对的 Ticker 信息数组
   */
  async getAllTickers(): Promise<Ticker[]> {
    const url = `${this.baseUrl}/capi/v2/market/tickers`;

    try {
      const response = await axios.get<Ticker[]>(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取所有 Ticker 失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取单个交易对的 Ticker 信息（公共接口，无需签名）
   * GET /capi/v2/market/ticker
   * Weight(IP): 1
   * @param params - 请求参数
   * @returns 单个交易对的 Ticker 信息
   */
  async getSingleTicker(params: GetSingleTickerParams): Promise<Ticker> {
    const url = `${this.baseUrl}/capi/v2/market/ticker`;

    try {
      const response = await axios.get<Ticker>(url, {
        params: {
          symbol: params.symbol,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取单个 Ticker 失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取成交记录（公共接口，无需签名）
   * GET /capi/v2/market/trades
   * Weight(IP): 5
   * @param params - 请求参数
   * @returns 成交记录列表
   */
  async getTrades(params: GetTradesParams): Promise<Trade[]> {
    const url = `${this.baseUrl}/capi/v2/market/trades`;

    try {
      const response = await axios.get<Trade[]>(url, {
        params: {
          symbol: params.symbol,
          limit: params.limit || 100,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取成交记录失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
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

  /**
   * 获取单个账户信息（私有接口，需要签名）
   * GET /capi/v2/account/account
   * Weight(IP): 1, Weight(UID): 1
   * 需要权限：合约交易读权限
   * @param coinId - 币种 ID（必填）
   * @returns 单个账户信息
   */
  async getAccount(coinId: number): Promise<AccountListResponse> {
    const requestPath = '/capi/v2/account/account';
    const queryString = `coinId=${coinId}`;

    try {
      const response = await this.sendRequestGet<AccountListResponse>(
        requestPath,
        queryString
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取账户信息失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取合约账户资产（私有接口，需要签名）
   * GET /capi/v2/account/assets
   * Weight(IP): 2, Weight(UID): 2
   * 需要权限：合约交易读权限
   * @returns 合约账户资产列表
   */
  async getContractAccountAssets(): Promise<ContractAccountAsset[]> {
    const requestPath = '/capi/v2/account/assets';
    const queryString = '';

    try {
      const response = await this.sendRequestGet<ContractAccountAsset[]>(
        requestPath,
        queryString
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取合约账户资产失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取现货账户资产（私有接口，需要签名）
   * GET /api/v2/account/assets
   * Weight(IP): 5, Weight(UID): 5
   * 需要权限：现货交易读权限
   * @returns 现货账户资产列表
   */
  async getSpotAccountAssets(): Promise<SpotAssetsResponse> {
    const requestPath = '/api/v2/account/assets';
    const queryString = '';

    try {
      const response = await this.sendRequestGet<SpotAssetsResponse>(
        requestPath,
        queryString
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取现货账户资产失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取合约账户账单历史（私有接口，需要签名）
   * POST /capi/v2/account/bills
   * Weight(IP): 2, Weight(UID): 5
   * 需要权限：合约交易读权限
   * @param params - 查询参数
   * @returns 账单列表
   */
  async getAccountBills(params?: GetBillsParams): Promise<BillsResponse> {
    const requestPath = '/capi/v2/account/bills';

    // 构建请求体
    const body = {
      coin: params?.coin || '',
      symbol: params?.symbol || '',
      businessType: params?.businessType || '',
      startTime: params?.startTime || null,
      endTime: params?.endTime || null,
      limit: params?.limit || 20,
    };

    try {
      const response = await this.sendRequestPost<BillsResponse>(
        requestPath,
        body
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取账单历史失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 下单（私有接口，需要签名）
   * POST /capi/v2/order/placeOrder
   * Weight(IP): 2, Weight(UID): 5
   * 需要权限：合约交易权限
   * @param params - 下单参数
   * @returns 下单响应
   */
  async placeOrder(params: PlaceOrderParams): Promise<PlaceOrderResponse> {
    const requestPath = '/capi/v2/order/placeOrder';

    // 构建请求体
    const body: any = {
      symbol: params.symbol,
      client_oid: params.client_oid,
      size: params.size,
      type: params.type,
      order_type: params.order_type,
      match_price: params.match_price,
      price: params.price,
    };

    // 添加可选参数
    if (params.presetTakeProfitPrice !== undefined) {
      body.presetTakeProfitPrice = params.presetTakeProfitPrice;
    }
    if (params.presetStopLossPrice !== undefined) {
      body.presetStopLossPrice = params.presetStopLossPrice;
    }
    if (params.marginMode !== undefined) {
      body.marginMode = params.marginMode;
    }
    if (params.separatedMode !== undefined) {
      body.separatedMode = params.separatedMode;
    }

    try {
      const response = await this.sendRequestPost<PlaceOrderResponse>(
        requestPath,
        body
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `下单失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 取消订单
   * POST /capi/v2/order/cancel_order
   * Weight(IP): 2, Weight(UID): 3
   * 需要权限：合约交易权限
   * @param params - 取消订单参数（orderId 或 clientOid 二选一）
   * @returns 取消订单响应
   */
  async cancelOrder(params: CancelOrderParams): Promise<CancelOrderResponse> {
    const requestPath = '/capi/v2/order/cancel_order';

    // 验证参数：orderId 和 clientOid 至少要有一个
    if (!params.orderId && !params.clientOid) {
      throw new Error('Either orderId or clientOid is required');
    }

    // 构建请求体
    const body: any = {};
    if (params.orderId) {
      body.orderId = params.orderId;
    }
    if (params.clientOid) {
      body.clientOid = params.clientOid;
    }

    try {
      const response = await this.sendRequestPost<CancelOrderResponse>(
        requestPath,
        body
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `取消订单失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取成交记录
   * GET /capi/v2/order/fills
   * Weight(IP): 5, Weight(UID): 5
   * 需要权限：合约交易权限
   * @param params - 查询参数（可选）
   * @returns 成交记录响应
   */
  async getFills(params?: GetFillsParams): Promise<GetFillsResponse> {
    const requestPath = '/capi/v2/order/fills';

    // 构建查询参数对象
    const queryParams: any = {};
    if (params?.symbol) {
      queryParams.symbol = params.symbol;
    }
    if (params?.orderId) {
      queryParams.orderId = params.orderId;
    }
    if (params?.startTime) {
      queryParams.startTime = params.startTime;
    }
    if (params?.endTime) {
      queryParams.endTime = params.endTime;
    }
    if (params?.limit) {
      queryParams.limit = params.limit;
    }

    // 将查询参数对象转换为查询字符串
    const queryString = Object.keys(queryParams).length > 0
      ? Object.entries(queryParams)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&')
      : '';

    try {
      const response = await this.sendRequestGet<GetFillsResponse>(
        requestPath,
        queryString
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取成交记录失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取单个仓位信息
   * GET /capi/v2/account/position/singlePosition
   * Weight(IP): 2, Weight(UID): 3
   * 需要权限：合约交易权限
   * @param params - 查询参数
   * @returns 单个仓位信息数组
   */
  async getSinglePosition(params: GetSinglePositionParams): Promise<SinglePosition[]> {
    const requestPath = '/capi/v2/account/position/singlePosition';

    // 构建查询字符串
    const queryString = `symbol=${encodeURIComponent(params.symbol)}`;

    try {
      const response = await this.sendRequestGet<SinglePosition[]>(
        requestPath,
        queryString
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取单个仓位失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 获取单个合约的用户设置
   * GET /capi/v2/account/settings
   * Weight(IP): 1, Weight(UID): 1
   * 需要权限：合约账户读取权限
   * @param params - 查询参数（可选）
   * @returns 用户设置响应
   */
  async getUserSettings(params?: GetUserSettingsParams): Promise<GetUserSettingsResponse> {
    const requestPath = '/capi/v2/account/settings';

    // 构建查询字符串
    const queryString = params?.symbol
      ? `symbol=${encodeURIComponent(params.symbol)}`
      : '';

    try {
      const response = await this.sendRequestGet<GetUserSettingsResponse>(
        requestPath,
        queryString
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `获取用户设置失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 修改杠杆
   * POST /capi/v2/account/leverage
   * Weight(IP): 10, Weight(UID): 20
   * 需要权限：合约交易权限
   * @param params - 修改杠杆参数
   * @returns 修改杠杆响应
   */
  async changeLeverage(params: ChangeLeverageParams): Promise<ChangeLeverageResponse> {
    const requestPath = '/capi/v2/account/leverage';

    // 构建请求体
    const bodyObj: any = {
      symbol: params.symbol,
      marginMode: params.marginMode,
      longLeverage: params.longLeverage,
    };

    // 全仓模式下，shortLeverage 使用 longLeverage 的值（或者不传）
    // 逐仓模式下，如果提供了 shortLeverage 则使用，否则也使用 longLeverage
    if (params.marginMode === 3 && params.shortLeverage) {
      // 逐仓模式，使用提供的 shortLeverage
      bodyObj.shortLeverage = params.shortLeverage;
    } else {
      // 全仓模式或未提供 shortLeverage，使用 longLeverage
      bodyObj.shortLeverage = params.longLeverage;
    }

    try {
      const response = await this.sendRequestPost<ChangeLeverageResponse>(
        requestPath,
        bodyObj,
        ''
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `修改杠杆失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 修改用户账户模式（私有接口，需要签名）
   * POST /capi/v2/account/position/changeHoldModel
   * Weight(IP): 20, Weight(UID): 50
   * 需要权限：合约交易权限
   * @param params - 账户模式参数
   * @returns 修改响应
   */
  async changeHoldModel(params: ChangeHoldModelParams): Promise<ChangeHoldModelResponse> {
    const requestPath = '/capi/v2/account/position/changeHoldModel';

    // 构建请求体
    const bodyObj = {
      symbol: params.symbol,
      marginMode: params.marginMode,
      separatedMode: params.separatedMode,
    };

    try {
      const response = await this.sendRequestPost<ChangeHoldModelResponse>(
        requestPath,
        bodyObj,
        ''
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `修改账户模式失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 调整持仓保证金（私有接口，需要签名）
   * POST /capi/v2/account/adjustMargin
   * Weight(IP): 15, Weight(UID): 30
   * 需要权限：合约交易权限
   *
   * 注意：
   * - 只适用于逐仓模式的持仓
   * - 正数表示增加保证金，负数表示减少保证金
   * - 减少保证金时不能导致强平
   *
   * @param params - 调整保证金参数
   * @returns 调整响应
   */
  async adjustMargin(params: AdjustMarginParams): Promise<AdjustMarginResponse> {
    const requestPath = '/capi/v2/account/adjustMargin';

    // 构建请求体
    const bodyObj = {
      coinId: params.coinId,
      isolatedPositionId: params.isolatedPositionId,
      collateralAmount: params.collateralAmount,
    };

    try {
      const response = await this.sendRequestPost<AdjustMarginResponse>(
        requestPath,
        bodyObj,
        ''
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `调整持仓保证金失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 上传 AI 日志（私有接口，需要签名）
   * POST /capi/v2/order/uploadAiLog
   * Weight(IP): 1, Weight(UID): 1
   *
   * 重要规则：
   * 进入实盘交易阶段的 BUIDLs 必须提供包含以下内容的 AI 日志：
   * - 模型版本
   * - 输入和输出数据
   * - 订单执行详情
   *
   * AI 日志用于验证 AI 参与和合规性。如果未能提供有效的 AI 参与证明，
   * 团队将被取消资格并从排名中移除。只有官方白名单上批准的 UID 可以提交 AI 日志数据。
   *
   * @param params - AI 日志参数
   * @returns 上传响应
   */
  async uploadAiLog(params: UploadAiLogParams): Promise<UploadAiLogResponse> {
    const requestPath = '/capi/v2/order/uploadAiLog';

    // 构建请求体
    const bodyObj: any = {
      orderId: params.orderId || null,
      stage: params.stage,
      model: params.model,
      input: params.input,
      output: params.output,
    };

    if (params.explanation) {
      bodyObj.explanation = params.explanation;
    }

    try {
      const response = await this.sendRequestPost<UploadAiLogResponse>(
        requestPath,
        bodyObj,
        ''
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `上传 AI 日志失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  /**
   * 内部划转（私有接口，需要签名）
   * POST /api/v2/rebate/affiliate/internalWithdrawal
   * Weight(IP): 100, Weight(UID): 100
   * 需要权限：提现权限
   * @param params - 划转参数
   * @returns 划转响应
   */
  async internalWithdrawal(params: InternalWithdrawalParams): Promise<InternalWithdrawalResponse> {
    const requestPath = '/api/v2/rebate/affiliate/internalWithdrawal';

    // 构建请求体
    const body: any = {
      toUserId: params.toUserId,
      coin: params.coin,
      amount: params.amount,
      fromAccountType: params.fromAccountType || 'SPOT',
      toAccountType: params.toAccountType || 'SPOT',
    };

    try {
      const response = await this.sendRequestPost<InternalWithdrawalResponse>(
        requestPath,
        body
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `内部划转失败: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      }
      throw error;
    }
  }

  // ==================== 简化的 BTC/USDT 专用接口 ====================

  /**
   * 开仓 - BTC/USDT 专用简化接口
   *
   * @param size - 开仓数量（BTC 数量，如 "0.001"）
   * @param side - 方向：'LONG' 开多 | 'SHORT' 开空
   * @returns 订单响应
   *
   * @example
   * // 开多仓 0.001 BTC
   * const order = await client.openPosition('0.001', 'LONG');
   *
   * // 开空仓 0.001 BTC
   * const order = await client.openPosition('0.001', 'SHORT');
   */
  async openPosition(size: string, side: 'LONG' | 'SHORT'): Promise<PlaceOrderResponse> {
    const clientOid = `open_${side.toLowerCase()}_${Date.now()}`;

    return await this.placeOrder({
      symbol: 'cmt_btcusdt',
      client_oid: clientOid,
      size: size,
      type: side === 'LONG' ? '1' : '2',  // 1-开多, 2-开空
      order_type: '0',                     // 0-普通订单
      match_price: '1',                    // 1-市价
      price: '',                           // 市价单价格为空
      marginMode: 1,                       // 1-全仓模式
      separatedMode: 1                     // 1-合并模式
    });
  }

  /**
   * 平仓 - BTC/USDT 专用简化接口
   *
   * @param size - 平仓数量（BTC 数量，如 "0.001"）
   * @param side - 方向：'LONG' 平多 | 'SHORT' 平空
   * @returns 订单响应
   *
   * @example
   * // 平多仓 0.001 BTC
   * const order = await client.closePosition('0.001', 'LONG');
   *
   * // 平空仓 0.001 BTC
   * const order = await client.closePosition('0.001', 'SHORT');
   */
  async closePosition(size: string, side: 'LONG' | 'SHORT'): Promise<PlaceOrderResponse> {
    const clientOid = `close_${side.toLowerCase()}_${Date.now()}`;

    return await this.placeOrder({
      symbol: 'cmt_btcusdt',
      client_oid: clientOid,
      size: size,
      type: side === 'LONG' ? '3' : '4',  // 3-平多, 4-平空
      order_type: '0',                     // 0-普通订单
      match_price: '1',                    // 1-市价
      price: '',                           // 市价单价格为空
      marginMode: 1,                       // 1-全仓模式
      separatedMode: 1                     // 1-合并模式
    });
  }

  /**
   * 获取当前持仓 - BTC/USDT 专用简化接口
   *
   * @returns 持仓信息，如果没有持仓返回 null
   *
   * @example
   * const position = await client.getCurrentPosition();
   * if (position) {
   *   console.log('持仓方向:', position.side);
   *   console.log('持仓数量:', position.size);
   *   console.log('未实现盈亏:', position.unrealizePnl);
   * } else {
   *   console.log('当前无持仓');
   * }
   */
  async getCurrentPosition(): Promise<SinglePosition | null> {
    const positions = await this.getSinglePosition({ symbol: 'cmt_btcusdt' });

    if (positions && positions.length > 0) {
      return positions[0];
    }

    return null;
  }

  /**
   * AI 专用：获取当前持仓信息（精简版）
   * 只返回 AI 策略分析所需的关键字段
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   */
  async getPositionForAI(symbol: string): Promise<{
    symbol: string;
    hasPosition: boolean;
    positions?: Array<{
      side: 'LONG' | 'SHORT';
      size: string;
      entryPrice: string;
      leverage: string;
      unrealizedPnl: string;
      pnlPercent: string;
    }>;
    totalPnl?: string;
    netPosition?: {
      side: 'LONG' | 'SHORT' | 'NEUTRAL';
      size: string;
    };
  }> {
    const positions = await this.getSinglePosition({ symbol });

    if (!positions || positions.length === 0) {
      return {
        symbol,
        hasPosition: false
      };
    }

    // 精简每个持仓的数据
    const simplifiedPositions = positions.map(position => {
      const pnl = parseFloat(position.unrealizePnl);
      const openValue = parseFloat(position.open_value);
      const size = parseFloat(position.size);
      const pnlPercent = ((pnl / openValue) * 100).toFixed(4);

      // 计算平均开仓价格 = 开仓价值 / 持仓数量
      const entryPrice = size > 0 ? (openValue / size).toFixed(2) : '0.00';

      return {
        side: position.side === 'LONG' ? 'LONG' as const : 'SHORT' as const,
        size: position.size,
        entryPrice: entryPrice,
        leverage: position.leverage,
        unrealizedPnl: position.unrealizePnl,
        pnlPercent: pnlPercent
      };
    });

    // 计算总盈亏
    const totalPnl = positions.reduce((sum, p) => sum + parseFloat(p.unrealizePnl), 0).toFixed(5);

    // 计算净持仓
    const longSize = positions
      .filter(p => p.side === 'LONG')
      .reduce((sum, p) => sum + parseFloat(p.size), 0);
    const shortSize = positions
      .filter(p => p.side === 'SHORT')
      .reduce((sum, p) => sum + parseFloat(p.size), 0);

    const netSize = Math.abs(longSize - shortSize);
    const netSide = longSize > shortSize ? 'LONG' : (shortSize > longSize ? 'SHORT' : 'NEUTRAL');

    return {
      symbol,
      hasPosition: true,
      positions: simplifiedPositions,
      totalPnl: totalPnl,
      netPosition: {
        side: netSide as 'LONG' | 'SHORT' | 'NEUTRAL',
        size: netSize.toFixed(4)
      }
    };
  }

  /**
   * AI 专用：获取K线数据（精简版）
   * 只返回 AI 策略分析所需的关键字段
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   * @param granularity - K线周期，例如 '1m', '5m', '15m', '1h', '4h', '1d'
   * @param limit - 返回数量，默认 100
   */
  async getKlineForAI(
    symbol: string,
    granularity: CandlestickGranularity,
    limit: number = 100
  ): Promise<{
    symbol: string;
    granularity: string;
    count: number;
    latestPrice: string;
    priceChange24h: string;
    priceChangePercent24h: string;
    high24h: string;
    low24h: string;
    candles: Array<{
      time: string;
      open: string;
      high: string;
      low: string;
      close: string;
      volume: string;
    }>;
  }> {
    const rawData = await this.getCandles({
      symbol,
      granularity,
      limit,
      priceType: 'LAST'
    });

    if (!rawData || rawData.length === 0) {
      throw new Error('No kline data available');
    }

    // 转换为精简格式
    const candles = rawData.map(candle => ({
      time: new Date(parseInt(candle[0])).toISOString(),
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5]
    }));

    // 计算统计数据
    const latestCandle = rawData[rawData.length - 1];
    const firstCandle = rawData[0];
    const latestPrice = latestCandle[4]; // 最新收盘价
    const price24hAgo = firstCandle[1]; // 24小时前开盘价

    const priceChange = (parseFloat(latestPrice) - parseFloat(price24hAgo)).toFixed(2);
    const priceChangePercent = ((parseFloat(priceChange) / parseFloat(price24hAgo)) * 100).toFixed(2);

    // 计算24小时最高最低
    const high24h = Math.max(...rawData.map(c => parseFloat(c[2]))).toFixed(2);
    const low24h = Math.min(...rawData.map(c => parseFloat(c[3]))).toFixed(2);

    return {
      symbol,
      granularity,
      count: candles.length,
      latestPrice,
      priceChange24h: priceChange,
      priceChangePercent24h: priceChangePercent,
      high24h,
      low24h,
      candles
    };
  }

  /**
   * AI 专用：获取订单簿深度（精简版）
   * 只返回 AI 策略分析所需的关键字段
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   * @param depth - 深度档位，默认 10（只取前10档）
   */
  async getOrderBookForAI(
    symbol: string,
    depth: number = 10
  ): Promise<{
    symbol: string;
    timestamp: string;
    bestBid: string;
    bestAsk: string;
    spread: string;
    spreadPercent: string;
    bidDepth: Array<{
      price: string;
      amount: string;
      total: string;
    }>;
    askDepth: Array<{
      price: string;
      amount: string;
      total: string;
    }>;
    totalBidVolume: string;
    totalAskVolume: string;
    bidAskRatio: string;
  }> {
    const orderBook = await this.getOrderBookDepth({
      symbol,
      limit: 200  // 获取完整深度，然后取前N档
    });

    if (!orderBook.bids || orderBook.bids.length === 0 ||
        !orderBook.asks || orderBook.asks.length === 0) {
      throw new Error('No order book data available');
    }

    // 取前N档
    const topBids = orderBook.bids.slice(0, depth);
    const topAsks = orderBook.asks.slice(0, depth);

    // 最优买卖价
    const bestBid = topBids[0][0];
    const bestAsk = topAsks[0][0];

    // 计算价差
    const spread = (parseFloat(bestAsk) - parseFloat(bestBid)).toFixed(2);
    const spreadPercent = ((parseFloat(spread) / parseFloat(bestBid)) * 100).toFixed(4);

    // 计算累计数量
    let bidCumulative = 0;
    const bidDepth = topBids.map(([price, amount]) => {
      bidCumulative += parseFloat(amount);
      return {
        price,
        amount,
        total: bidCumulative.toFixed(4)
      };
    });

    let askCumulative = 0;
    const askDepth = topAsks.map(([price, amount]) => {
      askCumulative += parseFloat(amount);
      return {
        price,
        amount,
        total: askCumulative.toFixed(4)
      };
    });

    // 计算总买卖量
    const totalBidVolume = bidCumulative.toFixed(4);
    const totalAskVolume = askCumulative.toFixed(4);

    // 买卖比
    const bidAskRatio = (bidCumulative / askCumulative).toFixed(4);

    return {
      symbol,
      timestamp: new Date(parseInt(orderBook.timestamp)).toISOString(),
      bestBid,
      bestAsk,
      spread,
      spreadPercent,
      bidDepth,
      askDepth,
      totalBidVolume,
      totalAskVolume,
      bidAskRatio
    };
  }

  /**
   * AI 专用：获取完整市场数据（汇总版）
   * 包含多个时间周期的K线数据和订单簿数据
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   * @param klineLimit - K线数据数量，默认 50
   */
  async getMarketDataForAI(symbol: string, klineLimit: number = 50) {
    console.log(`正在获取 ${symbol} 的市场数据...`);

    // 并行获取所有数据
    const [kline5m, kline1h, orderBook] = await Promise.all([
      this.getKlineForAI(symbol, '5m', klineLimit),
      this.getKlineForAI(symbol, '1h', klineLimit),
      this.getOrderBookForAI(symbol, 20)  // 增加深度到20档
    ]);

    console.log(`✅ 市场数据获取完成`);

    return {
      symbol,
      timestamp: new Date().toISOString(),
      currentPrice: orderBook.bestBid,  // 使用最优买价作为当前价格
      klines: {
        '5m': kline5m,
        '1h': kline1h
      },
      orderBook
    };
  }

  /**
   * AI 专用：获取账单历史（精简版）
   * 只返回 AI 策略分析所需的关键字段
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   * @param limit - 返回数量，默认 50
   */
  async getBillsForAI(
    symbol: string,
    limit: number = 50
  ): Promise<{
    symbol: string;
    totalRecords: number;
    summary: {
      totalIncome: string;
      totalExpense: string;
      netPnL: string;
      totalFees: string;
      openPositions: number;
      closePositions: number;
      fundingFees: number;
    };
    recentTrades: Array<{
      time: string;
      type: string;
      amount: string;
      balance: string;
      fee: string;
    }>;
    typeBreakdown: Record<string, {
      count: number;
      totalAmount: string;
    }>;
  }> {
    const bills = await this.getAccountBills({
      symbol,
      limit
    });

    if (!bills.items || bills.items.length === 0) {
      return {
        symbol,
        totalRecords: 0,
        summary: {
          totalIncome: '0',
          totalExpense: '0',
          netPnL: '0',
          totalFees: '0',
          openPositions: 0,
          closePositions: 0,
          fundingFees: 0
        },
        recentTrades: [],
        typeBreakdown: {}
      };
    }

    // 计算汇总数据
    let totalIncome = 0;
    let totalExpense = 0;
    let totalFees = 0;
    let openPositions = 0;
    let closePositions = 0;
    let fundingFees = 0;

    const typeBreakdown: Record<string, { count: number; totalAmount: number }> = {};

    bills.items.forEach(bill => {
      const amount = parseFloat(bill.amount);
      const fee = parseFloat(bill.fillFee || '0');

      // 统计收入和支出
      if (amount > 0) {
        totalIncome += amount;
      } else {
        totalExpense += Math.abs(amount);
      }

      // 统计手续费
      totalFees += fee;

      // 统计业务类型
      if (!typeBreakdown[bill.businessType]) {
        typeBreakdown[bill.businessType] = { count: 0, totalAmount: 0 };
      }
      typeBreakdown[bill.businessType].count++;
      typeBreakdown[bill.businessType].totalAmount += amount;

      // 统计开平仓次数
      if (bill.businessType.includes('open')) {
        openPositions++;
      } else if (bill.businessType.includes('close')) {
        closePositions++;
      } else if (bill.businessType.includes('funding')) {
        fundingFees++;
      }
    });

    // 转换为精简格式
    const recentTrades = bills.items.slice(0, 20).map(bill => ({
      time: new Date(bill.ctime).toISOString(),
      type: bill.businessType,
      amount: bill.amount,
      balance: bill.balance,
      fee: bill.fillFee || '0'
    }));

    // 转换类型统计
    const typeBreakdownFormatted: Record<string, { count: number; totalAmount: string }> = {};
    Object.entries(typeBreakdown).forEach(([type, data]) => {
      typeBreakdownFormatted[type] = {
        count: data.count,
        totalAmount: data.totalAmount.toFixed(8)
      };
    });

    return {
      symbol,
      totalRecords: bills.items.length,
      summary: {
        totalIncome: totalIncome.toFixed(8),
        totalExpense: totalExpense.toFixed(8),
        netPnL: (totalIncome - totalExpense).toFixed(8),
        totalFees: totalFees.toFixed(8),
        openPositions,
        closePositions,
        fundingFees
      },
      recentTrades,
      typeBreakdown: typeBreakdownFormatted
    };
  }

  /**
   * AI 专用：获取账户风险信息（精简版）
   * 包含杠杆率、保证金比率、风险水平等关键指标
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   */
  async getAccountRiskForAI(symbol: string): Promise<{
    symbol: string;
    timestamp: string;
    balance: {
      total: string;
      available: string;
      frozen: string;
    };
    leverage: {
      current: string;
      mode: string;
    };
    margin: {
      used: string;
      available: string;
      ratio: string;
    };
    risk: {
      level: string;
      leverageRatio: string;
      marginRatio: string;
    };
    positions: {
      count: number;
      totalValue: string;
      totalUnrealizedPnl: string;
    };
  }> {
    // 并行获取账户资产和持仓信息
    const [assets, positions] = await Promise.all([
      this.getContractAccountAssets(),
      this.getSinglePosition({ symbol })
    ]);

    // 获取 USDT 资产
    const usdtAsset = assets.find(asset => asset.coinName === 'USDT');
    if (!usdtAsset) {
      throw new Error('未找到 USDT 资产');
    }

    const totalBalance = parseFloat(usdtAsset.available) + parseFloat(usdtAsset.frozen);
    const available = parseFloat(usdtAsset.available);
    const frozen = parseFloat(usdtAsset.frozen);

    // 计算持仓信息
    let totalPositionValue = 0;
    let totalUnrealizedPnl = 0;
    let currentLeverage = '0';
    let marginMode = 'SHARED';

    if (positions && positions.length > 0) {
      positions.forEach(pos => {
        totalPositionValue += parseFloat(pos.open_value);
        totalUnrealizedPnl += parseFloat(pos.unrealizePnl);
      });

      // 使用第一个持仓的杠杆和模式
      currentLeverage = positions[0].leverage;
      marginMode = positions[0].margin_mode;
    }

    // 计算保证金使用情况
    const usedMargin = frozen;  // 冻结资产即为已使用保证金
    const availableMargin = available;

    // 计算保证金比率 (已使用保证金 / 总余额)
    const marginRatio = totalBalance > 0
      ? ((usedMargin / totalBalance) * 100).toFixed(2)
      : '0.00';

    // 计算账户价值 (总余额 + 未实现盈亏)
    const accountValue = totalBalance + totalUnrealizedPnl;

    // 计算实际杠杆率 (持仓价值 / 账户价值)
    const leverageRatio = accountValue > 0
      ? (totalPositionValue / accountValue).toFixed(2)
      : '0.00';

    // 计算风险等级
    let riskLevel = 'LOW';
    const marginRatioNum = parseFloat(marginRatio);
    const leverageRatioNum = parseFloat(leverageRatio);

    if (marginRatioNum > 80 || leverageRatioNum > 15) {
      riskLevel = 'CRITICAL';
    } else if (marginRatioNum > 60 || leverageRatioNum > 10) {
      riskLevel = 'HIGH';
    } else if (marginRatioNum > 40 || leverageRatioNum > 5) {
      riskLevel = 'MEDIUM';
    }

    return {
      symbol,
      timestamp: new Date().toISOString(),
      balance: {
        total: totalBalance.toFixed(2),
        available: available.toFixed(2),
        frozen: frozen.toFixed(2)
      },
      leverage: {
        current: currentLeverage,
        mode: marginMode
      },
      margin: {
        used: usedMargin.toFixed(2),
        available: availableMargin.toFixed(2),
        ratio: marginRatio
      },
      risk: {
        level: riskLevel,
        leverageRatio: leverageRatio,
        marginRatio: marginRatio
      },
      positions: {
        count: positions ? positions.length : 0,
        totalValue: totalPositionValue.toFixed(2),
        totalUnrealizedPnl: totalUnrealizedPnl.toFixed(2)
      }
    };
  }

  /**
   * AI 专用：获取完整的交易上下文报告
   * 整合账单历史、市场数据、账户风险和持仓信息
   * 这是为 AI 决策提供的完整上下文数据
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   * @param billsLimit - 账单历史记录数量，默认 10
   * @param klineLimit - K线数据数量，默认 50
   * @param saveToFile - 是否保存到文件，默认 true
   * @param filePath - 保存的文件路径，默认 'ai-trading-context.json'
   */
  async getAITradingContext(
    symbol: string,
    billsLimit: number = 10,
    klineLimit: number = 50,
    saveToFile: boolean = true,
    filePath: string = 'ai-trading-context.json'
  ) {
    console.log(`\n🤖 正在获取 ${symbol} 的完整 AI 交易上下文...`);
    console.log('-----------------------------------');

    // 并行获取所有数据以提高性能
    const startTime = Date.now();

    console.log('📊 1/4 获取账单历史...');
    const billsPromise = this.getBillsForAI(symbol, billsLimit);

    console.log('📈 2/4 获取市场数据...');
    const marketDataPromise = this.getMarketDataForAI(symbol, klineLimit);

    console.log('⚠️  3/4 获取账户风险信息...');
    const riskPromise = this.getAccountRiskForAI(symbol);

    console.log('💼 4/4 获取持仓信息...');
    const positionPromise = this.getPositionForAI(symbol);

    // 等待所有数据获取完成
    const [bills, marketData, accountRisk, position] = await Promise.all([
      billsPromise,
      marketDataPromise,
      riskPromise,
      positionPromise
    ]);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`✅ 所有数据获取完成 (耗时: ${duration}秒)`);
    console.log('-----------------------------------\n');

    // 构建完整的上下文报告
    const context = {
      // 元数据
      metadata: {
        symbol,
        timestamp: new Date().toISOString(),
        dataFetchDuration: `${duration}s`
      },

      // 1. 账单历史（交易历史和盈亏统计）
      tradingHistory: bills,

      // 2. 市场数据（K线和订单簿）
      marketData,

      // 3. 账户风险（余额、杠杆、保证金、风险等级）
      accountRisk,

      // 4. 当前持仓（持仓详情和盈亏）
      currentPosition: position
    };

    // 计算上下文数据大小
    const contextSize = JSON.stringify(context).length;
    const contextSizeKB = (contextSize / 1024).toFixed(2);

    console.log(`📦 上下文数据大小: ${contextSize} bytes (${contextSizeKB} KB)`);

    // 保存到文件
    if (saveToFile) {
      const fs = await import('fs/promises');
      const jsonContent = JSON.stringify(context, null, 2);
      await fs.writeFile(filePath, jsonContent, 'utf-8');
      console.log(`💾 数据已保存到: ${filePath}`);
    }

    return context;
  }

  /**
   * AI 专用：获取格式化的交易上下文文本
   * 将完整的交易上下文转换为易读的文本格式，适合直接传递给 AI
   * @param symbol - 交易对，例如 'cmt_btcusdt'
   * @param billsLimit - 账单历史记录数量，默认 10
   * @param klineLimit - K线数据数量，默认 50
   * @param saveToFile - 是否保存到文件，默认 true
   * @param filePath - 保存的文件路径，默认 'ai-trading-context.txt'
   */
  async getAITradingContextText(
    symbol: string,
    billsLimit: number = 10,
    klineLimit: number = 50,
    saveToFile: boolean = true,
    filePath: string = 'ai-trading-context.txt'
  ): Promise<string> {
    const context = await this.getAITradingContext(symbol, billsLimit, klineLimit, false); // 不保存JSON，只保存文本

    // 构建格式化的文本报告
    const lines: string[] = [];

    lines.push(`交易对: ${context.metadata.symbol}`);
    lines.push('');

    // 1. 交易历史
    lines.push('最近交易记录:');

    // 显示最近的交易记录（只显示前10条）
    const tradesToShow = context.tradingHistory.recentTrades.slice(0, 10);
    tradesToShow.forEach((trade: any, index: number) => {
      lines.push(`交易 ${index + 1}:`);
      lines.push(`  时间: ${trade.time}`);
      lines.push(`  类型: ${trade.type}`);
      lines.push(`  金额: ${trade.amount} USDT`);
      if (trade.fee && parseFloat(trade.fee) > 0) {
        lines.push(`  手续费: ${trade.fee} USDT`);
      }
      lines.push('');
    });
    lines.push('');

    // 2. 市场数据
    lines.push('市场数据:');
    lines.push(`当前价格: ${context.marketData.currentPrice} USDT`);
    lines.push('');

    // K线数据 - 按时间周期从大到小排序：1h → 5m
    const kline1h = context.marketData.klines['1h'];
    const kline5m = context.marketData.klines['5m'];

    // 1小时K线
    lines.push('1小时K线数据:');
    lines.push(`  最新价: ${kline1h.latestPrice}, 24h涨跌: ${kline1h.priceChangePercent24h}%`);
    lines.push('  K线详情:');
    kline1h.candles.forEach((k: any, index: number) => {
      lines.push(`    ${index + 1}. 时间:${k.time} 开:${k.open} 高:${k.high} 低:${k.low} 收:${k.close} 量:${k.volume}`);
    });
    lines.push('');

    // 5分钟K线
    lines.push('5分钟K线数据:');
    lines.push(`  最新价: ${kline5m.latestPrice}, 24h涨跌: ${kline5m.priceChangePercent24h}%`);
    lines.push('  K线详情:');
    kline5m.candles.forEach((k: any, index: number) => {
      lines.push(`    ${index + 1}. 时间:${k.time} 开:${k.open} 高:${k.high} 低:${k.low} 收:${k.close} 量:${k.volume}`);
    });
    lines.push('');

    // 订单簿数据
    lines.push('订单簿深度:');
    lines.push(`最优买价: ${context.marketData.orderBook.bestBid} USDT`);
    lines.push(`最优卖价: ${context.marketData.orderBook.bestAsk} USDT`);
    lines.push(`价差: ${context.marketData.orderBook.spread} USDT (${context.marketData.orderBook.spreadPercent}%)`);
    lines.push(`买卖比: ${context.marketData.orderBook.bidAskRatio}`);
    lines.push('');

    // 显示买盘深度
    lines.push('买盘深度:');
    context.marketData.orderBook.bidDepth.forEach((bid: any, index: number) => {
      lines.push(`  ${index + 1}. 价格:${bid.price} 数量:${bid.amount} 累计:${bid.total}`);
    });
    lines.push('');

    // 显示卖盘深度
    lines.push('卖盘深度:');
    context.marketData.orderBook.askDepth.forEach((ask: any, index: number) => {
      lines.push(`  ${index + 1}. 价格:${ask.price} 数量:${ask.amount} 累计:${ask.total}`);
    });
    lines.push('');

    // 3. 账户风险
    lines.push('账户风险:');
    lines.push('余额:');
    lines.push(`  总余额: ${context.accountRisk.balance.total} USDT`);
    lines.push(`  可用: ${context.accountRisk.balance.available} USDT`);
    lines.push(`  冻结: ${context.accountRisk.balance.frozen} USDT`);
    lines.push('');
    lines.push('杠杆:');
    lines.push(`  当前杠杆: ${context.accountRisk.leverage.current}x`);
    lines.push(`  保证金模式: ${context.accountRisk.leverage.mode}`);
    lines.push('');
    lines.push('保证金:');
    lines.push(`  已使用: ${context.accountRisk.margin.used} USDT`);
    lines.push(`  可用: ${context.accountRisk.margin.available} USDT`);
    lines.push(`  使用率: ${context.accountRisk.margin.ratio}%`);
    lines.push('');
    lines.push('风险评估:');
    lines.push(`  风险等级: ${context.accountRisk.risk.level}`);
    lines.push(`  实际杠杆率: ${context.accountRisk.risk.leverageRatio}x`);
    lines.push(`  保证金比率: ${context.accountRisk.risk.marginRatio}%`);
    lines.push('');
    lines.push('持仓统计:');
    lines.push(`  持仓数量: ${context.accountRisk.positions.count}`);
    lines.push(`  持仓总价值: ${context.accountRisk.positions.totalValue} USDT`);
    lines.push(`  未实现盈亏: ${context.accountRisk.positions.totalUnrealizedPnl} USDT`);
    lines.push('');

    // 4. 当前持仓
    lines.push('当前持仓:');

    if (context.currentPosition.hasPosition && context.currentPosition.positions) {
      lines.push(`持仓状态: 有持仓 (${context.currentPosition.positions.length}个)`);
      lines.push('');

      context.currentPosition.positions.forEach((pos, index) => {
        lines.push(`持仓 ${index + 1}:`);
        lines.push(`  方向: ${pos.side}`);
        lines.push(`  数量: ${pos.size}`);
        lines.push(`  持仓价格: ${pos.entryPrice} USDT`);
        lines.push(`  当前价格: ${context.marketData.currentPrice} USDT`);
        lines.push(`  杠杆: ${pos.leverage}x`);
        lines.push(`  未实现盈亏: ${pos.unrealizedPnl} USDT (${pos.pnlPercent}%)`);
        lines.push('');
      });

      if (context.currentPosition.totalPnl) {
        lines.push(`总盈亏: ${context.currentPosition.totalPnl} USDT`);
      }
    } else {
      lines.push('持仓状态: 无持仓');
    }

    // 读取并拼接 AI 交易分析 prompt
    const fs = await import('fs/promises');
    const path = await import('path');

    try {
      const promptPath = path.join(process.cwd(), 'ai-trading-prompt.md');
      const promptContent = await fs.readFile(promptPath, 'utf-8');

      // 在报告末尾添加分隔和 prompt
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push(promptContent);
    } catch (error) {
      console.warn('⚠️  未找到 ai-trading-prompt.md 文件，跳过 prompt 拼接');
    }

    const textReport = lines.join('\n');

    // 保存到文件
    if (saveToFile) {
      await fs.writeFile(filePath, textReport, 'utf-8');
      console.log(`💾 文本报告已保存到: ${filePath}`);
    }

    return textReport;
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
