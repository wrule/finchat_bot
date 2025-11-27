/**
 * AI 交易信号 Zod Schema 定义
 * 用于 Vercel AI SDK 的 generateObject 方法
 */

import { z } from 'zod';

/**
 * 市场分析 Schema
 */
export const marketAnalysisSchema = z.object({
  marketTrend: z.string().describe('市场趋势分析：分析当前 BTC 价格走势、K线形态、订单簿买卖力量对比。2-3句话。'),
  positionStatus: z.string().describe('持仓状态评估：分析当前多空仓位的盈亏情况、持仓成本、浮动盈亏百分比。2-3句话。'),
  riskAssessment: z.string().describe('风险评估：评估账户余额、保证金使用率、风险等级、是否有补仓或止损空间。1-2句话。'),
});

/**
 * 交易动作枚举
 */
export const tradingActionSchema = z.enum([
  'HOLD',         // 观望，不操作
  'OPEN_LONG',    // 开多仓
  'OPEN_SHORT',   // 开空仓
  'CLOSE_LONG',   // 平多仓
  'CLOSE_SHORT',  // 平空仓
  'ADD_LONG',     // 加多仓（补仓）
  'ADD_SHORT',    // 加空仓（补仓）
]).describe('交易动作类型');

/**
 * 信号置信度枚举
 */
export const signalConfidenceSchema = z.enum(['HIGH', 'MEDIUM', 'LOW'])
  .describe('信号置信度：HIGH-强烈建议, MEDIUM-中等建议, LOW-弱建议');

/**
 * 交易信号 Schema
 */
export const tradingSignalSchema = z.object({
  action: tradingActionSchema,
  confidence: signalConfidenceSchema,
  reasoning: z.string().describe('操作理由：详细说明为什么做出这个决策，基于哪些市场数据和策略原则。2-3句话。'),
});

/**
 * 订单类型枚举（对应 Weex API）
 */
export const orderTypeSchema = z.enum(['1', '2', '3', '4'])
  .describe('订单类型：1-开多, 2-开空, 3-平多, 4-平空');

/**
 * 价格类型枚举
 */
export const priceTypeSchema = z.enum(['MARKET', 'LIMIT'])
  .describe('价格类型：MARKET-市价单（立即成交）, LIMIT-限价单（指定价格）');

/**
 * 订单详情 Schema
 */
export const orderDetailSchema = z.object({
  type: orderTypeSchema,
  typeDescription: z.string().describe('类型描述：例如 "1-开多", "3-平多"'),
  size: z.string().describe('订单数量：BTC 数量，字符串格式，例如 "0.0050"'),
  priceType: priceTypeSchema,
  price: z.string().describe('订单价格：USDT 价格，字符串格式。市价单填当前价格，限价单填目标价格。'),
  reasoning: z.string().describe('此订单的具体理由：说明为什么在这个价格、这个数量下单。1-2句话。'),
});

/**
 * 执行细节 Schema
 */
export const executionDetailSchema = z.object({
  hasOrder: z.boolean().describe('是否有具体订单需要执行：true-需要执行订单, false-仅观望'),
  orders: z.array(orderDetailSchema).describe('订单数组：可以包含多个订单，如果 hasOrder 为 false 则为空数组'),
});

/**
 * AI 交易信号完整 Schema
 */
export const aiTradingSignalSchema = z.object({
  analysis: marketAnalysisSchema.describe('市场分析：包含趋势、持仓、风险三个维度的分析'),
  signal: tradingSignalSchema.describe('交易信号：包含操作类型、置信度、理由'),
  execution: executionDetailSchema.describe('执行细节：包含是否有订单、订单列表'),
  riskWarning: z.string().describe('风险提示：提醒用户注意的风险点或操作建议。1句话。'),
});

/**
 * 导出类型（从 Schema 推导）
 */
export type MarketAnalysis = z.infer<typeof marketAnalysisSchema>;
export type TradingAction = z.infer<typeof tradingActionSchema>;
export type SignalConfidence = z.infer<typeof signalConfidenceSchema>;
export type TradingSignal = z.infer<typeof tradingSignalSchema>;
export type OrderType = z.infer<typeof orderTypeSchema>;
export type PriceType = z.infer<typeof priceTypeSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type ExecutionDetail = z.infer<typeof executionDetailSchema>;
export type AITradingSignal = z.infer<typeof aiTradingSignalSchema>;

