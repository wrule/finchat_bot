import * as dotenv from 'dotenv';
import { WeexApiClient } from './weex';

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
 * 测试上传 AI 日志
 */
async function testUploadAiLog() {
  console.log('='.repeat(80));
  console.log('测试 AI 日志上报功能');
  console.log('='.repeat(80));
  console.log('');
  
  try {
    // 测试 1: 上报一个成功的交易日志
    console.log('📤 测试 1: 上报成功交易日志');
    console.log('-'.repeat(80));
    
    const response1 = await weexClient.uploadAiLog({
      orderId: null,
      stage: 'test',
      model: 'deepseek/deepseek-r1',
      input: {
        marketReport: '市场数据摘要...',
        timestamp: new Date().toISOString(),
        symbol: 'cmt_btcusdt',
        currentPrice: 91000,
        positions: [
          { direction: 'LONG', size: 0.005, entryPrice: 91226.5 }
        ]
      },
      output: {
        signal: {
          action: 'ADD_LONG',
          confidence: 'MEDIUM',
          reasoning: '测试补仓逻辑'
        },
        analysis: {
          marketTrend: '市场在支撑位附近',
          positionStatus: '多仓轻微亏损',
          riskAssessment: '风险可控'
        },
        order: {
          type: '1-开多',
          size: '0.0050',
          priceType: 'LIMIT',
          price: '90000.0'
        },
        executionResult: {
          success: true,
          orderId: 'test_order_123'
        }
      },
      explanation: '测试 AI 日志上报功能 - 成功交易'
    });
    
    console.log('响应代码:', response1.code);
    console.log('响应消息:', response1.msg);
    console.log('响应数据:', response1.data);
    console.log('');
    
    if (response1.code === '00000') {
      console.log('✅ 测试 1 通过: AI 日志上报成功');
    } else {
      console.log('❌ 测试 1 失败:', response1.msg);
    }
    
    console.log('');
    
    // 测试 2: 上报一个观望日志
    console.log('📤 测试 2: 上报观望日志');
    console.log('-'.repeat(80));
    
    const response2 = await weexClient.uploadAiLog({
      orderId: null,
      stage: 'test',
      model: 'deepseek/deepseek-r1',
      input: {
        marketReport: '市场数据摘要...',
        timestamp: new Date().toISOString(),
        symbol: 'cmt_btcusdt'
      },
      output: {
        signal: {
          action: 'HOLD',
          confidence: 'HIGH',
          reasoning: '当前市场没有明确信号，建议观望'
        },
        analysis: {
          marketTrend: '震荡行情',
          positionStatus: '持仓平衡',
          riskAssessment: '风险较低'
        },
        action: 'HOLD',
        executionResult: {
          success: true,
          message: 'No order executed - HOLD signal'
        }
      },
      explanation: '测试 AI 日志上报功能 - 观望'
    });
    
    console.log('响应代码:', response2.code);
    console.log('响应消息:', response2.msg);
    console.log('响应数据:', response2.data);
    console.log('');
    
    if (response2.code === '00000') {
      console.log('✅ 测试 2 通过: AI 日志上报成功');
    } else {
      console.log('❌ 测试 2 失败:', response2.msg);
    }
    
    console.log('');
    console.log('='.repeat(80));
    console.log('✅ 所有测试完成');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
    }
  }
}

// 运行测试
testUploadAiLog();

