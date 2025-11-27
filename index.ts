import * as dotenv from 'dotenv';
import { WeexApiClient } from './weex';
import { generateAITradingSignal, validateAITradingSignal, formatTradingSignal } from './ai-signal-generator';
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

// 初始化 Weex 客户端
const weexClient = new WeexApiClient(
  process.env.WEEX_API_KEY || '',
  process.env.WEEX_SECRET_KEY || '',
  process.env.WEEX_PASSPHRASE || '',
  'https://pro-openapi.weex.tech'
);

/**
 * 等待到下一个 5 分钟 K 线结束时刻（带实时倒计时）
 */
async function waitFor5MinuteKlineClose(): Promise<void> {
  const now = dayjs();
  const currentMinute = now.minute();

  // 计算下一个 5 分钟整点
  const nextMinute = Math.ceil((currentMinute + 1) / 5) * 5;
  let targetTime = now.minute(nextMinute).second(0).millisecond(0);

  // 如果下一个整点超过 60 分钟，需要进入下一个小时
  if (nextMinute >= 60) {
    targetTime = now.add(1, 'hour').minute(0).second(0).millisecond(0);
  }

  const totalWaitMs = targetTime.diff(now);

  console.log(`⏰ 当前时间: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`⏰ 下一个 5 分钟 K 线结束时间: ${targetTime.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`⏰ 总等待时间: ${(totalWaitMs / 1000).toFixed(0)} 秒\n`);

  // 实时倒计时
  return new Promise((resolve) => {
    const startTime = Date.now();
    const endTime = startTime + totalWaitMs;

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
  const folderPath = path.join(process.cwd(), 'trading-logs', timestamp);

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
 * 调用 AI 生成交易信号（使用 Vercel AI SDK）
 * @returns 返回 AI 交易信号对象
 */
async function generateTradingSignal(marketReport: string): Promise<AITradingSignal> {
  // 使用新的 AI 信号生成器（基于 Zod Schema + Vercel AI SDK）
  const signal = await generateAITradingSignal(marketReport);

  // 验证信号
  if (!validateAITradingSignal(signal)) {
    throw new Error('AI 返回的交易信号格式无效');
  }

  return signal;
}

/**
 * 执行交易信号并上报 AI 日志
 * @param signal - AI 交易信号
 * @param marketReport - 市场报告（作为 AI 输入）
 */
async function executeTradingSignal(signal: AITradingSignal, marketReport: string): Promise<string> {
  const results: string[] = [];

  results.push('='.repeat(80));
  results.push('📊 交易信号分析');
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

  // 执行订单
  if (signal.execution.hasOrder && signal.execution.orders.length > 0) {
    results.push('='.repeat(80));
    results.push('📝 执行交易订单');
    results.push('='.repeat(80));
    results.push('');

    for (let i = 0; i < signal.execution.orders.length; i++) {
      const order = signal.execution.orders[i];

      results.push(`订单 ${i + 1}:`);
      results.push(`  类型: ${order.typeDescription}`);
      results.push(`  数量: ${order.size} BTC`);
      results.push(`  价格类型: ${order.priceType}`);
      results.push(`  价格: ${order.price} USDT`);
      results.push(`  理由: ${order.reasoning}`);
      results.push('');

      try {
        // 执行订单
        const result = await weexClient.placeOrder({
          symbol: 'cmt_btcusdt',
          client_oid: `ai_${order.type}_${Date.now()}`,
          size: order.size,
          type: order.type,
          order_type: '0',
          match_price: order.priceType === 'MARKET' ? '1' : '0',
          price: order.priceType === 'MARKET' ? '' : order.price,
          marginMode: 1,
          separatedMode: 1
        });

        results.push(`  ✅ 订单执行成功!`);
        results.push(`  订单 ID: ${result.client_oid}`);
        results.push('');

        // 上报 AI 日志
        try {
          const aiLogResponse = await weexClient.uploadAiLog({
            orderId: null, // 如果有订单 ID 可以传入
            stage: 'production',
            model: 'deepseek/deepseek-r1',
            input: {
              marketReport: marketReport.substring(0, 1000), // 截取前 1000 字符避免过长
              timestamp: new Date().toISOString(),
              symbol: 'cmt_btcusdt'
            },
            output: {
              signal: signal.signal,
              analysis: signal.analysis,
              order: {
                type: order.typeDescription,
                size: order.size,
                priceType: order.priceType,
                price: order.price
              },
              executionResult: {
                success: true,
                orderId: result.client_oid
              }
            },
            explanation: `AI 分析: ${signal.signal.reasoning}. 订单理由: ${order.reasoning}`
          });

          if (aiLogResponse.code === '00000') {
            results.push(`  📤 AI 日志上报成功`);
          } else {
            results.push(`  ⚠️  AI 日志上报失败: ${aiLogResponse.msg}`);
          }
        } catch (logError) {
          results.push(`  ⚠️  AI 日志上报失败: ${logError instanceof Error ? logError.message : 'Unknown error'}`);
        }

        results.push('');

      } catch (error) {
        results.push(`  ❌ 订单执行失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.push('');

        // 即使订单失败也上报 AI 日志
        try {
          await weexClient.uploadAiLog({
            orderId: null,
            stage: 'production',
            model: 'deepseek/deepseek-r1',
            input: {
              marketReport: marketReport.substring(0, 1000),
              timestamp: new Date().toISOString(),
              symbol: 'cmt_btcusdt'
            },
            output: {
              signal: signal.signal,
              analysis: signal.analysis,
              order: {
                type: order.typeDescription,
                size: order.size,
                priceType: order.priceType,
                price: order.price
              },
              executionResult: {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            },
            explanation: `AI 分析: ${signal.signal.reasoning}. 订单执行失败: ${error instanceof Error ? error.message : 'Unknown error'}`
          });

          results.push(`  📤 AI 日志已上报（订单失败）`);
          results.push('');
        } catch (logError) {
          // 忽略日志上报错误
        }
      }
    }
  } else {
    results.push('='.repeat(80));
    results.push('💤 观望 - 无需执行订单');
    results.push('='.repeat(80));
    results.push('');

    // 即使是观望也上报 AI 日志
    try {
      await weexClient.uploadAiLog({
        orderId: null,
        stage: 'production',
        model: 'deepseek/deepseek-r1',
        input: {
          marketReport: marketReport.substring(0, 1000),
          timestamp: new Date().toISOString(),
          symbol: 'cmt_btcusdt'
        },
        output: {
          signal: signal.signal,
          analysis: signal.analysis,
          action: 'HOLD',
          executionResult: {
            success: true,
            message: 'No order executed - HOLD signal'
          }
        },
        explanation: `AI 建议观望: ${signal.signal.reasoning}`
      });

      results.push('📤 AI 日志已上报（观望）');
      results.push('');
    } catch (logError) {
      results.push(`⚠️  AI 日志上报失败: ${logError instanceof Error ? logError.message : 'Unknown error'}`);
      results.push('');
    }
  }

  return results.join('\n');
}

/**
 * 执行一次完整的交易周期
 * @param dryRun - 是否为模拟运行（只分析不执行交易）
 */
async function runTradingCycle(dryRun: boolean = false): Promise<void> {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log('\n' + '='.repeat(80));
  console.log(`🚀 开始交易周期: ${timestamp}${dryRun ? ' [仅分析模式]' : ''}`);
  console.log('='.repeat(80));

  try {
    // 1. 创建时间戳文件夹
    const folderPath = await createTimestampFolder();
    console.log(`📁 创建文件夹: ${folderPath}`);

    // 2. 获取市场数据报告
    console.log('\n📊 正在获取市场数据...');
    const marketReport = await weexClient.getAITradingContextText('cmt_btcusdt', 10);

    // 保存市场报告
    await saveToFolder(folderPath, '1-market-report.txt', marketReport);

    // 3. 调用 AI 生成交易信号
    let signal: AITradingSignal | null = null;

    try {
      signal = await generateTradingSignal(marketReport);

      // 保存解析后的 JSON
      await saveToFolder(folderPath, '2-ai-signal.json', JSON.stringify(signal, null, 2));

      console.log('\n✅ AI 交易信号生成成功');
      console.log(`操作: ${signal.signal.action}`);
      console.log(`置信度: ${signal.signal.confidence}`);

    } catch (error) {
      const errorMsg = `AI 信号生成失败: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`\n❌ ${errorMsg}`);

      // 保存错误信息
      await saveToFolder(folderPath, '2-ai-signal-error.txt', errorMsg);

      // 如果 AI 调用失败，不执行交易
      return;
    }

    // 4. 执行交易信号（如果不是模拟运行）
    if (signal) {
      if (dryRun) {
        // 模拟运行：只显示分析结果，不执行交易
        const analysisResult = [
          '='.repeat(80),
          '📊 交易信号分析 [仅分析模式 - 不执行交易]',
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

        // 保存分析结果
        await saveToFolder(folderPath, '3-execution-result.txt', analysisResult);

        console.log('\n' + analysisResult);
      } else {
        // 正常运行：执行交易
        const executionResult = await executeTradingSignal(signal, marketReport);

        // 保存执行结果
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
 * 主函数 - 定时执行交易
 */
async function main() {
  console.log('🤖 AI 自动交易系统启动');
  console.log('交易对: cmt_btcusdt');
  console.log('执行频率: 每 5 分钟（K 线结束时）');
  console.log('AI 模型: deepseek/deepseek-r1');
  console.log('='.repeat(80));

  // 启动时立即执行一次分析（仅分析，不执行交易）
  console.log('\n📋 启动时执行初始分析（仅分析模式）...\n');
  await runTradingCycle(true);

  console.log('\n' + '='.repeat(80));
  console.log('🔄 进入定时交易循环...');
  console.log('='.repeat(80));

  // 无限循环
  while (true) {
    try {
      // 等待到下一个 5 分钟 K 线结束时刻
      await waitFor5MinuteKlineClose();

      // 执行交易周期（正常模式，会执行交易）
      await runTradingCycle(false);

      // 等待 10 秒，避免在同一分钟内重复执行
      await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
      console.error('❌ 主循环错误:', error);

      // 发生错误后等待 1 分钟再继续
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
