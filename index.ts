import * as dotenv from 'dotenv';
import { WeexApiClient } from './weex';
import { AITradingSignal, validateAITradingSignal } from './ai-trading-signal';
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
 * 等待到下一个 5 分钟 K 线结束时刻
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

  const waitMs = targetTime.diff(now);

  console.log(`⏰ 当前时间: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`⏰ 下一个 5 分钟 K 线结束时间: ${targetTime.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`⏰ 等待 ${(waitMs / 1000).toFixed(0)} 秒...`);

  await new Promise(resolve => setTimeout(resolve, waitMs));
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
 * 鲁棒的 JSON 解析函数
 * 尝试多种方式解析 AI 返回的内容
 */
function robustJsonParse(text: string): any {
  // 1. 尝试直接解析
  try {
    return JSON.parse(text);
  } catch (e) {
    // 继续尝试其他方法
  }

  // 2. 移除 markdown 代码块标记
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // 继续尝试其他方法
  }

  // 3. 尝试提取 JSON 对象（查找第一个 { 到最后一个 }）
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // 继续尝试其他方法
    }
  }

  // 4. 尝试移除注释
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, ''); // 移除 /* */ 注释
  cleaned = cleaned.replace(/\/\/.*/g, ''); // 移除 // 注释

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // 所有方法都失败
    throw new Error(`无法解析 JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * 调用 AI 生成交易信号
 */
async function generateTradingSignal(marketReport: string): Promise<AITradingSignal> {
  console.log('\n🤖 正在调用 AI 分析市场数据...');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'user',
            content: marketReport
          }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`AI API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('✅ AI 响应接收成功');

    // 使用鲁棒的 JSON 解析
    const parsedJson = robustJsonParse(aiResponse);

    // 验证信号
    if (!validateAITradingSignal(parsedJson)) {
      throw new Error('AI 返回的交易信号格式无效');
    }

    return parsedJson as AITradingSignal;

  } catch (error) {
    console.error('❌ AI 调用失败:', error);
    throw error;
  }
}

/**
 * 执行交易信号
 */
async function executeTradingSignal(signal: AITradingSignal): Promise<string> {
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

      } catch (error) {
        results.push(`  ❌ 订单执行失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.push('');
      }
    }
  } else {
    results.push('='.repeat(80));
    results.push('💤 观望 - 无需执行订单');
    results.push('='.repeat(80));
    results.push('');
  }

  return results.join('\n');
}

/**
 * 执行一次完整的交易周期
 */
async function runTradingCycle(): Promise<void> {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log('\n' + '='.repeat(80));
  console.log(`🚀 开始交易周期: ${timestamp}`);
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
    let aiRawResponse = '';
    let signal: AITradingSignal | null = null;

    try {
      signal = await generateTradingSignal(marketReport);
      aiRawResponse = JSON.stringify(signal, null, 2);

      // 保存 AI 返回的 JSON
      await saveToFolder(folderPath, '2-ai-signal.json', aiRawResponse);

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

    // 4. 执行交易信号
    if (signal) {
      const executionResult = await executeTradingSignal(signal);

      // 保存执行结果
      await saveToFolder(folderPath, '3-execution-result.txt', executionResult);

      console.log('\n' + executionResult);
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

  // 无限循环
  while (true) {
    try {
      // 等待到下一个 5 分钟 K 线结束时刻
      await waitFor5MinuteKlineClose();

      // 执行交易周期
      await runTradingCycle();

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
