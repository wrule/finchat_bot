/**
 * 虚拟盘模式入口
 * 使用真实市场数据 + Mock 交易执行
 * 用于策略验证，不承担真实交易风险
 */

import * as dotenv from 'dotenv';
import { WeexApiClientMock } from './mock/weex-mock';
import { generateAITradingSignalWithLangChain } from './ai-langchain-generator';
import { validateAITradingSignal } from './ai-signal-generator';
import type { AITradingSignal } from './ai-trading-schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import fs from 'fs/promises';
import path from 'path';

// 加载环境变量
dotenv.config();

// 扩展 dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// 初始化 Mock 客户端（使用真实 API Key 获取市场数据）
const weexClient = new WeexApiClientMock(
  process.env.WEEX_API_KEY || '',
  process.env.WEEX_SECRET_KEY || '',
  process.env.WEEX_PASSPHRASE || '',
  'https://api-contract.weex.com'
);

/**
 * 等待到下一个 5 分钟 K 线结束时刻（带实时倒计时）
 */
async function waitFor5MinuteKlineClose(): Promise<void> {
  const now = dayjs();
  const currentMinute = now.minute();
  const nextMinute = Math.ceil((currentMinute + 1) / 5) * 5;
  let targetTime = now.minute(nextMinute).second(0).millisecond(0);

  if (nextMinute >= 60) {
    targetTime = now.add(1, 'hour').minute(0).second(0).millisecond(0);
  }

  const totalWaitMs = targetTime.diff(now);

  console.log(`⏰ 当前时间: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`⏰ 下一个 5 分钟 K 线结束时间: ${targetTime.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`⏰ 总等待时间: ${(totalWaitMs / 1000).toFixed(0)} 秒\n`);

  return new Promise((resolve) => {
    const endTime = Date.now() + totalWaitMs;

    const updateCountdown = () => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        process.stdout.write('\r⏰ 倒计时: 0 秒     \n');
        resolve();
        return;
      }

      const seconds = Math.ceil(remaining / 1000);
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;

      if (minutes > 0) {
        process.stdout.write(`\r⏰ 倒计时: ${minutes} 分 ${secs} 秒     `);
      } else {
        process.stdout.write(`\r⏰ 倒计时: ${secs} 秒     `);
      }

      setTimeout(updateCountdown, 1000);
    };

    updateCountdown();
  });
}

/**
 * 创建以时间命名的文件夹
 */
async function createTimestampFolder(): Promise<string> {
  const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
  const folderPath = path.join(process.cwd(), 'mock-trading-logs', timestamp);
  await fs.mkdir(folderPath, { recursive: true });
  return folderPath;
}

/**
 * 保存文件到指定文件夹
 */
async function saveToFolder(folderPath: string, filename: string, content: string): Promise<void> {
  const filePath = path.join(folderPath, filename);
  await fs.writeFile(filePath, content, 'utf-8');
  console.log(`💾 已保存: ${filename}`);
}

/**
 * 调用 AI 生成交易信号
 */
async function generateTradingSignal(marketReport: string): Promise<AITradingSignal> {
  const signal = await generateAITradingSignalWithLangChain(marketReport);
  if (!validateAITradingSignal(signal)) {
    throw new Error('AI 返回的交易信号格式无效');
  }
  return signal;
}

/**
 * 执行交易信号（Mock 模式）
 */
async function executeTradingSignal(signal: AITradingSignal, marketReport: string): Promise<string> {
  const results: string[] = [];

  results.push('='.repeat(80));
  results.push('🎮 [MOCK MODE] 交易信号分析');
  results.push('='.repeat(80));
  results.push('');

  results.push('市场分析:');
  results.push(`  趋势: ${signal.analysis.marketTrend}`);
  results.push(`  持仓: ${signal.analysis.positionStatus}`);
  results.push(`  风险: ${signal.analysis.riskAssessment}`);
  results.push('');

  results.push('交易信号:');
  results.push(`  操作: ${signal.signal.action}`);
  results.push(`  置信度: ${signal.signal.confidence}`);
  results.push(`  理由: ${signal.signal.reasoning}`);
  results.push('');

  results.push(`风险提示: ${signal.riskWarning}`);
  results.push('');

  // 执行订单（Mock）
  if (signal.execution.hasOrder && signal.execution.orders.length > 0) {
    results.push('='.repeat(80));
    results.push('🎮 [MOCK] 执行交易订单');
    results.push('='.repeat(80));
    results.push('');

    for (let i = 0; i < signal.execution.orders.length; i++) {
      const order = signal.execution.orders[i];

      results.push(`订单 ${i + 1}:`);
      results.push(`  类型: ${order.typeDescription}`);
      results.push(`  数量: ${order.size} BTC`);
      results.push(`  价格类型: ${order.priceType}`);
      results.push(`  理由: ${order.reasoning}`);
      results.push('');

      try {
        const result = await weexClient.placeOrder({
          symbol: 'cmt_btcusdt',
          client_oid: `mock_${order.type}_${Date.now()}`,
          size: order.size,
          type: order.type,
          order_type: '0',
          match_price: order.priceType === 'MARKET' ? '1' : '0',
          price: order.priceType === 'MARKET' ? '' : order.price,
          marginMode: 1,
          separatedMode: 1
        });

        results.push(`  ✅ [MOCK] 订单执行成功!`);
        results.push(`  订单 ID: ${result.client_oid}`);
        results.push('');

        // Mock 上传 AI 日志
        await weexClient.uploadAiLog({
          orderId: null,
          stage: 'mock',
          model: 'deepseek/deepseek-r1',
          input: { marketReport: marketReport.substring(0, 500), symbol: 'cmt_btcusdt' },
          output: { signal: signal.signal, order: order },
          explanation: `[MOCK] ${signal.signal.reasoning}`
        });

        results.push(`  📤 [MOCK] AI 日志已上报`);
        results.push('');

      } catch (error) {
        results.push(`  ❌ [MOCK] 订单执行失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.push('');
      }
    }
  } else {
    results.push('='.repeat(80));
    results.push('💤 [MOCK] 观望 - 无需执行订单');
    results.push('='.repeat(80));
    results.push('');

    await weexClient.uploadAiLog({
      orderId: null,
      stage: 'mock',
      model: 'deepseek/deepseek-r1',
      input: { marketReport: marketReport.substring(0, 500), symbol: 'cmt_btcusdt' },
      output: { signal: signal.signal, action: 'HOLD' },
      explanation: `[MOCK] ${signal.signal.reasoning}`
    });

    results.push('📤 [MOCK] AI 日志已上报（观望）');
    results.push('');
  }

  // 显示 Mock 统计信息
  const stats = await weexClient.getMockStatistics();
  results.push('='.repeat(80));
  results.push('📊 [MOCK] 虚拟盘统计');
  results.push('='.repeat(80));
  results.push(`  初始资金: ${stats.initialBalance.toFixed(2)} USDT`);
  results.push(`  当前资金: ${stats.currentBalance.toFixed(2)} USDT`);
  results.push(`  总盈亏: ${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)} USDT (${stats.pnlPercent >= 0 ? '+' : ''}${stats.pnlPercent.toFixed(2)}%)`);
  results.push(`  交易次数: ${stats.tradesCount}`);
  results.push(`  胜率: ${stats.winRate.toFixed(1)}%`);
  results.push('');

  return results.join('\n');
}

/**
 * 执行一次完整的交易周期（Mock 模式）
 */
async function runTradingCycle(dryRun: boolean = false): Promise<void> {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log('\n' + '='.repeat(80));
  console.log(`🎮 [MOCK] 开始交易周期: ${timestamp}${dryRun ? ' [仅分析模式]' : ''}`);
  console.log('='.repeat(80));

  try {
    const folderPath = await createTimestampFolder();
    console.log(`📁 创建文件夹: ${folderPath}`);

    console.log('\n📊 正在获取真实市场数据...');
    const marketReport = await weexClient.getAITradingContextText('cmt_btcusdt', 10);
    await saveToFolder(folderPath, '1-market-report.txt', marketReport);

    let signal: AITradingSignal | null = null;

    try {
      signal = await generateTradingSignal(marketReport);
      await saveToFolder(folderPath, '2-ai-signal.json', JSON.stringify(signal, null, 2));

      console.log('\n✅ AI 交易信号生成成功');
      console.log(`操作: ${signal.signal.action}`);
      console.log(`置信度: ${signal.signal.confidence}`);

    } catch (error) {
      const errorMsg = `AI 信号生成失败: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`\n❌ ${errorMsg}`);
      await saveToFolder(folderPath, '2-ai-signal-error.txt', errorMsg);
      return;
    }

    if (signal) {
      if (dryRun) {
        const analysisResult = [
          '='.repeat(80),
          '🎮 [MOCK] 交易信号分析 [仅分析模式 - 不执行交易]',
          '='.repeat(80),
          '',
          '市场分析:',
          `  趋势: ${signal.analysis.marketTrend}`,
          `  持仓: ${signal.analysis.positionStatus}`,
          `  风险: ${signal.analysis.riskAssessment}`,
          '',
          '交易信号:',
          `  操作: ${signal.signal.action}`,
          `  置信度: ${signal.signal.confidence}`,
          `  理由: ${signal.signal.reasoning}`,
          '',
          `风险提示: ${signal.riskWarning}`,
          '',
          '='.repeat(80),
          '💤 仅分析模式 - 不执行任何订单',
          '='.repeat(80),
        ].join('\n');

        await saveToFolder(folderPath, '3-execution-result.txt', analysisResult);
        console.log('\n' + analysisResult);
      } else {
        const executionResult = await executeTradingSignal(signal, marketReport);
        await saveToFolder(folderPath, '3-execution-result.txt', executionResult);
        console.log('\n' + executionResult);
      }
    }

    console.log('\n✅ 交易周期完成');

  } catch (error) {
    console.error('\n❌ 交易周期执行失败:', error);
  }
}

/**
 * 主函数 - 定时执行虚拟盘交易
 */
async function main() {
  console.log('');
  console.log('🎮'.repeat(40));
  console.log('');
  console.log('        🎮 AI 自动交易系统 - 虚拟盘模式 🎮');
  console.log('');
  console.log('🎮'.repeat(40));
  console.log('');
  console.log('交易对: cmt_btcusdt');
  console.log('执行频率: 每 5 分钟（K 线结束时）');
  console.log('AI 模型: deepseek/deepseek-r1');
  console.log('');
  console.log('⚠️  注意: 这是虚拟盘模式！');
  console.log('   - 市场数据: 真实');
  console.log('   - 交易执行: 模拟');
  console.log('   - 不会产生真实交易');
  console.log('');
  console.log('='.repeat(80));

  // 初始化 Mock 存储
  await weexClient.initMockStore();

  // 显示初始统计
  const stats = await weexClient.getMockStatistics();
  console.log('\n📊 虚拟盘初始状态:');
  console.log(`   初始资金: ${stats.initialBalance.toFixed(2)} USDT`);
  console.log(`   当前资金: ${stats.currentBalance.toFixed(2)} USDT`);
  console.log(`   总盈亏: ${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)} USDT`);

  // 启动时立即执行一次分析
  console.log('\n📋 启动时执行初始分析（仅分析模式）...\n');
  await runTradingCycle(true);

  console.log('\n' + '='.repeat(80));
  console.log('🔄 进入定时交易循环...');
  console.log('='.repeat(80));

  // 无限循环
  while (true) {
    try {
      await waitFor5MinuteKlineClose();
      await runTradingCycle(false);
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      console.error('❌ 主循环错误:', error);
      console.log('⏰ 等待 1 分钟后重试...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
}

// 启动程序
main().catch(error => {
  console.error('❌ 程序启动失败:', error);
  process.exit(1);
});

