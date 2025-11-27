/**
 * 简化版账户资产查询脚本
 * 快速查看账户余额和持仓盈亏
 */

import * as dotenv from 'dotenv';
import { WeexApiClient } from './weex';

dotenv.config();

// 初始化 Weex 客户端
const weexClient = new WeexApiClient(
  process.env.WEEX_API_KEY || '',
  process.env.WEEX_SECRET_KEY || '',
  process.env.WEEX_PASSPHRASE || '',
  'https://pro-openapi.weex.tech'
);

/**
 * 格式化数字显示
 */
function formatNumber(num: number | string, decimals: number = 2): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return n.toFixed(decimals);
}

/**
 * 简化版账户查询
 */
async function checkBalanceSimple() {
  try {
    // 获取账户风险信息（包含余额、持仓、风险等所有信息）
    const risk = await weexClient.getAccountRiskForAI('cmt_btcusdt');
    
    console.log('');
    console.log('💰 账户资产概览');
    console.log('='.repeat(60));
    console.log(`总余额:       ${formatNumber(risk.balance.total, 2)} USDT`);
    console.log(`可用余额:     ${formatNumber(risk.balance.available, 2)} USDT`);
    console.log(`未实现盈亏:   ${formatNumber(risk.positions.totalUnrealizedPnl, 2)} USDT`);
    console.log('');
    
    console.log('📊 持仓信息');
    console.log('='.repeat(60));
    console.log(`持仓数量:     ${risk.positions.count} 个`);
    console.log(`持仓价值:     ${formatNumber(risk.positions.totalValue, 2)} USDT`);
    console.log(`持仓盈亏:     ${formatNumber(risk.positions.totalUnrealizedPnl, 2)} USDT`);
    
    // 计算盈亏百分比
    const totalValue = parseFloat(risk.positions.totalValue);
    const totalPnl = parseFloat(risk.positions.totalUnrealizedPnl);
    if (totalValue > 0) {
      const pnlPercent = (totalPnl / totalValue) * 100;
      const pnlColor = pnlPercent >= 0 ? '🟢' : '🔴';
      console.log(`盈亏百分比:   ${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}% ${pnlColor}`);
    }
    console.log('');
    
    console.log('⚠️  风险状态');
    console.log('='.repeat(60));
    console.log(`保证金使用率: ${formatNumber(risk.margin.ratio, 2)}%`);
    console.log(`实际杠杆:     ${formatNumber(risk.risk.leverageRatio, 2)}x`);
    
    let riskColor = '🟢';
    if (risk.risk.level === 'MEDIUM') riskColor = '🟡';
    if (risk.risk.level === 'HIGH') riskColor = '🔴';
    console.log(`风险等级:     ${risk.risk.level} ${riskColor}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ 查询失败:', error instanceof Error ? error.message : error);
  }
}

// 运行查询
checkBalanceSimple();

