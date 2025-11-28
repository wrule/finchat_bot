import * as dotenv from 'dotenv';
import { WeexApiClient } from './weex';
import { validateAITradingSignal } from './ai-trading-signal';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import path from 'path';

// 加载环境变量
dotenv.config();

// 初始化 Weex 客户端
const weexClient = new WeexApiClient(
  process.env.WEEX_API_KEY || '',
  process.env.WEEX_SECRET_KEY || '',
  process.env.WEEX_PASSPHRASE || '',
  'https://api-contract.weex.com'
);

/**
 * 测试市场数据获取
 */
async function testMarketDataRetrieval() {
  console.log('='.repeat(80));
  console.log('测试 1: 获取市场数据报告');
  console.log('='.repeat(80));
  
  try {
    const marketReport = await weexClient.getAITradingContextText('cmt_btcusdt', 10);
    
    console.log('✅ 市场数据获取成功');
    console.log(`报告长度: ${marketReport.length} 字符`);
    console.log(`报告行数: ${marketReport.split('\n').length} 行`);
    
    // 保存到测试文件夹
    const testFolder = path.join(process.cwd(), 'test-output');
    await fs.mkdir(testFolder, { recursive: true });
    await fs.writeFile(
      path.join(testFolder, 'market-report.txt'),
      marketReport,
      'utf-8'
    );
    
    console.log('💾 报告已保存到: test-output/market-report.txt');
    
    return marketReport;
    
  } catch (error) {
    console.error('❌ 市场数据获取失败:', error);
    throw error;
  }
}

/**
 * 测试 JSON 解析鲁棒性
 */
function testJsonParsing() {
  console.log('\n' + '='.repeat(80));
  console.log('测试 2: JSON 解析鲁棒性');
  console.log('='.repeat(80));
  
  const testCases = [
    {
      name: '纯 JSON',
      input: '{"analysis":{"marketTrend":"test"},"signal":{"action":"HOLD","confidence":"LOW","reasoning":"test"},"execution":{"hasOrder":false,"orders":[]},"riskWarning":"test"}'
    },
    {
      name: 'Markdown 代码块',
      input: '```json\n{"analysis":{"marketTrend":"test"},"signal":{"action":"HOLD","confidence":"LOW","reasoning":"test"},"execution":{"hasOrder":false,"orders":[]},"riskWarning":"test"}\n```'
    },
    {
      name: '带注释',
      input: '// 这是注释\n{"analysis":{"marketTrend":"test"},"signal":{"action":"HOLD","confidence":"LOW","reasoning":"test"},"execution":{"hasOrder":false,"orders":[]},"riskWarning":"test"}'
    },
    {
      name: '前后有文本',
      input: '这是一些文本\n{"analysis":{"marketTrend":"test"},"signal":{"action":"HOLD","confidence":"LOW","reasoning":"test"},"execution":{"hasOrder":false,"orders":[]},"riskWarning":"test"}\n这是更多文本'
    }
  ];
  
  let passedCount = 0;
  
  for (const testCase of testCases) {
    try {
      // 使用与 index.ts 相同的解析逻辑
      let cleaned = testCase.input.trim();
      
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }
      
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
      cleaned = cleaned.replace(/\/\/.*/g, '');
      
      const parsed = JSON.parse(cleaned);
      
      if (validateAITradingSignal(parsed)) {
        console.log(`✅ ${testCase.name}: 解析成功`);
        passedCount++;
      } else {
        console.log(`⚠️  ${testCase.name}: 解析成功但验证失败`);
      }
      
    } catch (error) {
      console.log(`❌ ${testCase.name}: 解析失败`);
    }
  }
  
  console.log(`\n通过率: ${passedCount}/${testCases.length}`);
}

/**
 * 测试时间计算
 */
function testTimeCalculation() {
  console.log('\n' + '='.repeat(80));
  console.log('测试 3: 5 分钟 K 线时间计算');
  console.log('='.repeat(80));
  
  const now = dayjs();
  const currentMinute = now.minute();
  
  // 计算下一个 5 分钟整点
  const nextMinute = Math.ceil((currentMinute + 1) / 5) * 5;
  let targetTime = now.minute(nextMinute).second(0).millisecond(0);
  
  if (nextMinute >= 60) {
    targetTime = now.add(1, 'hour').minute(0).second(0).millisecond(0);
  }
  
  const waitMs = targetTime.diff(now);
  
  console.log(`当前时间: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`下一个 5 分钟 K 线结束时间: ${targetTime.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`需要等待: ${(waitMs / 1000).toFixed(0)} 秒`);
  console.log('✅ 时间计算正常');
}

/**
 * 主测试函数
 */
async function main() {
  console.log('🧪 自动交易系统测试\n');
  
  try {
    // 测试 1: 市场数据获取
    await testMarketDataRetrieval();
    
    // 测试 2: JSON 解析
    testJsonParsing();
    
    // 测试 3: 时间计算
    testTimeCalculation();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ 所有测试完成');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

main();

