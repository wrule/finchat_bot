/**
 * 查看合约账户资产脚本
 * 显示账户余额、持仓、盈亏等信息
 */

import * as dotenv from 'dotenv';
import { WeexApiClient } from './weex';

dotenv.config();

// 初始化 Weex 客户端
const weexClient = new WeexApiClient(
  process.env.WEEX_API_KEY || '',
  process.env.WEEX_SECRET_KEY || '',
  process.env.WEEX_PASSPHRASE || '',
  'https://api-contract.weex.com'
);

/**
 * 格式化数字显示
 */
function formatNumber(num: number | string, decimals: number = 2): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return n.toFixed(decimals);
}

/**
 * 格式化百分比
 */
function formatPercent(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

/**
 * 查看账户资产
 */
async function checkAccountBalance() {
  console.log('='.repeat(80));
  console.log('💰 合约账户资产查询');
  console.log('='.repeat(80));
  console.log('');

  try {
    // 1. 获取账户资产
    console.log('📊 正在获取账户资产...');
    const assets = await weexClient.getContractAccountAssets();

    console.log('');
    console.log('='.repeat(80));
    console.log('💵 账户资产');
    console.log('='.repeat(80));

    let totalEquity = 0;
    let totalAvailable = 0;
    let totalFrozen = 0;
    let totalUnrealizedPnl = 0;

    assets.forEach((asset: any) => {
      const equity = parseFloat(asset.equity);
      const available = parseFloat(asset.available);
      const frozen = parseFloat(asset.frozen);
      const unrealizePnl = parseFloat(asset.unrealizePnl);

      // 只显示有余额的币种
      if (equity > 0 || unrealizePnl !== 0) {
        console.log('');
        console.log(`币种: ${asset.coinName} (ID: ${asset.coinId})`);
        console.log(`  总资产:       ${formatNumber(equity, 4)}`);
        console.log(`  可用余额:     ${formatNumber(available, 4)}`);
        console.log(`  冻结余额:     ${formatNumber(frozen, 4)}`);
        console.log(`  未实现盈亏:   ${formatNumber(unrealizePnl, 4)}`);
      }

      totalEquity += equity;
      totalAvailable += available;
      totalFrozen += frozen;
      totalUnrealizedPnl += unrealizePnl;
    });

    console.log('');
    console.log('-'.repeat(80));
    console.log(`总资产:       ${formatNumber(totalEquity, 4)} USDT`);
    console.log(`总可用余额:   ${formatNumber(totalAvailable, 4)} USDT`);
    console.log(`总冻结余额:   ${formatNumber(totalFrozen, 4)} USDT`);
    console.log(`总未实现盈亏: ${formatNumber(totalUnrealizedPnl, 4)} USDT`);
    console.log('');

    // 2. 获取持仓信息
    console.log('📊 正在获取持仓信息...');
    const positions = await weexClient.getSinglePosition({ symbol: 'cmt_btcusdt' });
    
    console.log('');
    console.log('='.repeat(80));
    console.log('📈 当前持仓');
    console.log('='.repeat(80));

    if (positions.length === 0) {
      console.log('暂无持仓');
    } else {
      let totalPnl = 0;
      let totalValue = 0;

      positions.forEach((pos: any, index: number) => {
        console.log('');
        console.log(`持仓 ${index + 1}:`);
        console.log(`  交易对:       ${pos.symbol || 'cmt_btcusdt'}`);
        console.log(`  方向:         ${pos.side === 'LONG' ? '多仓 🟢' : '空仓 🔴'}`);
        console.log(`  数量:         ${formatNumber(pos.size, 4)} BTC`);
        console.log(`  杠杆倍数:     ${pos.leverage}x`);
        console.log(`  保证金模式:   ${pos.margin_mode === 'SHARED' ? '全仓' : '逐仓'}`);
        console.log(`  开仓价值:     ${formatNumber(pos.open_value, 4)} USDT`);
        console.log(`  未实现盈亏:   ${formatNumber(pos.unrealizePnl, 4)} USDT`);
        console.log(`  预估强平价:   ${pos.liquidatePrice === '0' ? '低风险' : formatNumber(pos.liquidatePrice, 2) + ' USDT'}`);

        // 计算盈亏百分比
        const unrealizePnl = parseFloat(pos.unrealizePnl);
        const openValue = parseFloat(pos.open_value);
        const pnlPercent = openValue > 0 ? (unrealizePnl / openValue) * 100 : 0;
        const pnlColor = pnlPercent >= 0 ? '🟢' : '🔴';
        console.log(`  盈亏百分比:   ${formatPercent(pnlPercent)} ${pnlColor}`);

        totalPnl += unrealizePnl;
        totalValue += openValue;
      });

      console.log('');
      console.log('-'.repeat(80));
      console.log(`总持仓价值:   ${formatNumber(totalValue, 4)} USDT`);
      console.log(`总未实现盈亏: ${formatNumber(totalPnl, 4)} USDT`);

      if (totalValue > 0) {
        const totalPnlPercent = (totalPnl / totalValue) * 100;
        const totalPnlColor = totalPnlPercent >= 0 ? '🟢' : '🔴';
        console.log(`总盈亏百分比: ${formatPercent(totalPnlPercent)} ${totalPnlColor}`);
      }
    }
    
    // 3. 获取账户风险信息
    console.log('');
    console.log('📊 正在获取账户风险信息...');
    const risk = await weexClient.getAccountRiskForAI('cmt_btcusdt');

    console.log('');
    console.log('='.repeat(80));
    console.log('⚠️  账户风险');
    console.log('='.repeat(80));
    console.log(`总余额:           ${formatNumber(risk.balance.total, 4)} USDT`);
    console.log(`可用余额:         ${formatNumber(risk.balance.available, 4)} USDT`);
    console.log(`冻结余额:         ${formatNumber(risk.balance.frozen, 4)} USDT`);
    console.log(`已用保证金:       ${formatNumber(risk.margin.used, 4)} USDT`);
    console.log(`可用保证金:       ${formatNumber(risk.margin.available, 4)} USDT`);
    console.log(`保证金使用率:     ${formatNumber(risk.margin.ratio, 2)}%`);
    console.log(`当前杠杆:         ${risk.leverage.current}x`);
    console.log(`杠杆模式:         ${risk.leverage.mode}`);
    console.log(`实际杠杆倍数:     ${formatNumber(risk.risk.leverageRatio, 2)}x`);
    console.log(`风险等级:         ${risk.risk.level}`);

    // 风险等级颜色
    let riskColor = '🟢';
    if (risk.risk.level === 'MEDIUM') riskColor = '🟡';
    if (risk.risk.level === 'HIGH') riskColor = '🔴';
    console.log(`风险状态:         ${riskColor}`);

    // 4. 总结
    console.log('');
    console.log('='.repeat(80));
    console.log('📊 资产总结');
    console.log('='.repeat(80));

    console.log(`💰 总资产:         ${formatNumber(totalEquity, 4)} USDT`);
    console.log(`� 可用余额:       ${formatNumber(totalAvailable, 4)} USDT (${formatNumber((totalAvailable / totalEquity) * 100, 2)}%)`);
    console.log(`� 冻结余额:       ${formatNumber(totalFrozen, 4)} USDT (${formatNumber((totalFrozen / totalEquity) * 100, 2)}%)`);
    console.log(`📈 未实现盈亏:     ${formatNumber(totalUnrealizedPnl, 4)} USDT`);
    console.log(`⚠️  风险等级:       ${risk.risk.level} ${riskColor}`);
    console.log(`📊 持仓数量:       ${positions.length} 个`);
    console.log(`📊 持仓总价值:     ${formatNumber(risk.positions.totalValue, 4)} USDT`);
    console.log(`📊 持仓总盈亏:     ${formatNumber(risk.positions.totalUnrealizedPnl, 4)} USDT`);
    
    console.log('');
    console.log('='.repeat(80));
    console.log('✅ 查询完成');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('');
    console.error('='.repeat(80));
    console.error('❌ 查询失败');
    console.error('='.repeat(80));
    console.error('');
    console.error('错误信息:', error);
    
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
    }
  }
}

// 运行查询
checkAccountBalance();

