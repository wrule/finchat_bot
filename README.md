<div align="center">

# 🚀 SCTY Bot - 让 AI 为你炒币！

<img src="https://img.shields.io/badge/🤖_AI_Powered-DeepSeek_R1-FF6B6B?style=for-the-badge" />
<img src="https://img.shields.io/badge/⚡_Auto_Trading-5min_Cycle-4ECDC4?style=for-the-badge" />
<img src="https://img.shields.io/badge/💰_Strategy-Martin_Hedging-FFE66D?style=for-the-badge" />
<img src="https://img.shields.io/badge/📊_TypeScript-100%25-3178C6?style=for-the-badge&logo=typescript" />

### 🎯 一个真正会思考的加密货币交易机器人

*不是简单的技术指标，而是深度推理 + 马丁格尔策略 + 多空对冲的完美结合*

[✨ 核心特性](#-核心特性) • [🧠 AI 大脑](#-ai-交易大脑deepseek-r1) • [🎮 快速开始](#-快速开始) • [📊 实时监控](#-实时交易监控) • [🎬 演示](#-实战演示)

---

### 💡 为什么选择 SCTY Bot？

<table>
<tr>
<td width="33%" align="center">
<h3>🧠 真正的 AI 思考</h3>
<p>不是简单的 if-else，而是 DeepSeek-R1 深度推理模型，每次决策都经过完整的思考链路</p>
</td>
<td width="33%" align="center">
<h3>🎯 稳健盈利策略</h3>
<p>马丁格尔 + 多空对冲，目标周收益 3-8%，风险延后，避免频繁交易</p>
</td>
<td width="33%" align="center">
<h3>⚡ 全自动运行</h3>
<p>每 5 分钟自动分析市场，生成交易信号，执行订单，上报日志，完全无人值守</p>
</td>
</tr>
</table>

</div>

---

## ✨ 核心特性

### 🎯 智能交易系统

```
┌─────────────────────────────────────────────────────────────────┐
│  每 5 分钟自动执行一次完整的交易周期                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  📊 收集市场数据                          │
        │  • 最近 10 条交易记录                     │
        │  • 1 小时 K 线（50 根）                   │
        │  • 5 分钟 K 线（50 根）                   │
        │  • 订单簿深度（20 档买卖盘）              │
        │  • 账户余额、杠杆、保证金                 │
        │  • 当前持仓（价格、盈亏、方向）           │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  🤖 AI 深度分析（DeepSeek-R1）            │
        │  • 市场趋势判断（多空力量对比）           │
        │  • 持仓状态评估（盈亏、风险）             │
        │  • 风险评估（保证金使用率）               │
        │  • 生成交易信号（补仓/平仓/观望）         │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  ⚡ 自动执行交易                          │
        │  • 如果是观望 → 不执行任何操作            │
        │  • 如果有信号 → 立即执行订单              │
        │  • 上报 AI 日志到 Weex 官方               │
        │  • 保存完整记录到本地文件夹               │
        └──────────────────────────────────────────┘
```

### 🧠 AI 交易大脑（DeepSeek-R1）

> **不是普通的 AI，而是会"深度思考"的 AI！**

DeepSeek-R1 是一个具有**推理能力**的大语言模型，它不会直接给出答案，而是：

1. **📖 阅读市场数据** - 分析 K 线、订单簿、持仓、历史交易
2. **🤔 深度思考** - 内部进行多步推理，权衡利弊
3. **📊 综合判断** - 结合马丁策略原则，评估风险收益
4. **✅ 输出决策** - 给出明确的交易信号和详细理由

**示例思考过程：**
```
AI 内部思考（不输出）：
1. 当前 BTC 价格 91000，多仓持仓价 91226.5，亏损 0.25%
2. 1 小时 K 线显示在 90000 附近有强支撑
3. 5 分钟 K 线开始企稳反弹
4. 订单簿 90000 附近买盘深度较厚
5. 账户余额充足，保证金使用率仅 30%
6. 根据马丁策略，可以在支撑位补仓降低成本
7. 但需要控制仓位，避免过度加仓

最终决策：在 90000 补仓 0.005 BTC（限价单）
```

### 💰 马丁格尔多空对冲策略

这不是赌博式的马丁，而是**专业的风险管理策略**：

<table>
<tr>
<td width="50%">

#### 📈 核心原则

- **风险优先** - 保本第一，盈利第二
- **对冲平衡** - 同时持有多空，降低单边风险
- **逐步加仓** - 亏损时在关键位置补仓降低成本
- **及时止盈** - 盈利 2-5% 就平仓，落袋为安

</td>
<td width="50%">

#### 🎯 交易目标

- **周期**: 1 周
- **目标 ROI**: 3-8%（稳健）
- **风险控制**: 保证金使用率 < 70%
- **交易频率**: 不频繁交易，只在合适时机操作

</td>
</tr>
</table>

#### 🔄 仓位管理规则

| 场景 | 操作 | 条件 |
|------|------|------|
| 🟢 **补仓** | 在亏损仓位的支撑/阻力位补仓 | 亏损 > 2%，技术面支持，保证金充足 |
| 🔴 **平仓** | 盈利仓位止盈，亏损仓位止损 | 盈利 > 2-5%，或亏损 > 8% 无反转迹象 |
| 🟡 **开仓** | 市场出现明确趋势时开新仓 | 技术面强烈信号，风险可控 |
| ⚪ **观望** | 大多数时候什么都不做 | 没有明确信号，市场不确定 |

### 📊 数据驱动决策

每次分析都基于**完整的市场快照**：

```typescript
{
  "交易对": "cmt_btcusdt",

  "最近交易记录": [
    { "时间": "2025-11-27T02:26:35Z", "类型": "开多", "金额": -456.41, "手续费": 0.27 },
    // ... 共 10 条
  ],

  "市场数据": {
    "当前价格": 91187.6,
    "1小时K线": [ /* 50 根 K 线 */ ],
    "5分钟K线": [ /* 50 根 K 线 */ ],
    "订单簿": {
      "买盘": [ /* 20 档深度 */ ],
      "卖盘": [ /* 20 档深度 */ ]
    }
  },

  "账户风险": {
    "余额": 950.08,
    "杠杆": 20,
    "保证金使用率": 0.96,
    "风险等级": "LOW"
  },

  "当前持仓": [
    { "方向": "LONG", "数量": 0.005, "持仓价": 91226.5, "当前价": 91187.6, "盈亏": -0.19 },
    { "方向": "SHORT", "数量": 0.005, "持仓价": 90669.9, "当前价": 91187.6, "盈亏": -2.59 }
  ]
}
```

---

## 🎮 快速开始

### 📦 安装依赖

```bash
# 克隆项目
git clone https://github.com/wrule/scty_bot.git
cd scty_bot

# 安装依赖
npm install
```

### 🔑 配置 API 密钥

创建 `.env` 文件：

```env
# Weex 交易所 API 密钥（必填）
WEEX_API_KEY=你的_API_KEY
WEEX_SECRET_KEY=你的_SECRET_KEY
WEEX_PASSPHRASE=你的_PASSPHRASE

# OpenRouter AI API 密钥（必填）
OPENROUTER_API_KEY=你的_OPENROUTER_KEY
```

> 💡 **获取 API 密钥：**
> - Weex API: https://www.weex.com/api-management
> - OpenRouter: https://openrouter.ai/keys

### 🚀 启动机器人

```bash
# 方式 1: 直接运行
npx tsx index.ts

# 方式 2: 使用 npm script
npm start
```

### 🎬 启动后会发生什么？

```
🤖 AI 自动交易系统启动
交易对: cmt_btcusdt
执行频率: 每 5 分钟（K 线结束时）
AI 模型: deepseek/deepseek-r1
================================================================================

📋 启动时执行初始分析（仅分析模式）...

================================================================================
🚀 开始交易周期: 2025-11-27 12:15:00 [仅分析模式]
================================================================================
📁 创建文件夹: /trading-logs/2025-11-27_12-15-00

📊 正在获取市场数据...
✅ 市场数据获取完成
💾 已保存: 1-market-report.txt

🤖 正在调用 AI 分析市场数据...
✅ AI 响应接收成功
💾 已保存: 2-ai-raw-response.txt
💾 已保存: 2-ai-signal.json

✅ AI 交易信号生成成功
操作: HOLD
置信度: MEDIUM

================================================================================
📊 交易信号分析 [仅分析模式 - 不执行交易]
================================================================================

市场分析:
  趋势: BTC 在 91000 附近震荡，1小时K线显示横盘整理...
  持仓: 多空仓位基本平衡，总盈亏 -2.78 USDT...
  风险: 账户健康良好，保证金使用率低...

交易信号:
  操作: HOLD
  置信度: MEDIUM
  理由: 当前市场没有明确方向，建议观望等待更好的入场时机

风险提示: 保持耐心，不要频繁交易

================================================================================
💤 仅分析模式 - 不执行任何订单
================================================================================

✅ 交易周期完成

================================================================================
🔄 进入定时交易循环...
================================================================================
⏰ 当前时间: 2025-11-27 12:15:37
⏰ 下一个 5 分钟 K 线结束时间: 2025-11-27 12:20:00
⏰ 总等待时间: 263 秒

⏰ 倒计时: 4 分 23 秒
```

---

## 📊 实时交易监控

### 📁 自动生成的交易日志

每次交易周期都会在 `trading-logs/` 目录下创建一个以时间命名的文件夹：

```
trading-logs/
├── 2025-11-27_12-15-00/
│   ├── 1-market-report.txt      # 📊 完整的市场数据报告
│   ├── 2-ai-raw-response.txt    # 🤖 AI 原始响应（含思考过程）
│   ├── 2-ai-signal.json         # 📋 解析后的交易信号
│   └── 3-execution-result.txt   # ✅ 订单执行结果
├── 2025-11-27_12-20-00/
│   ├── 1-market-report.txt
│   ├── 2-ai-raw-response.txt
│   ├── 2-ai-signal.json
│   └── 3-execution-result.txt
└── ...
```

### 📄 文件内容示例

#### 1️⃣ 市场报告 (`1-market-report.txt`)

```
交易对: cmt_btcusdt

最近交易记录:
交易 1:
  时间: 2025-11-27T02:26:35.981Z
  类型: position_open_long
  金额: -456.40617950 USDT
  手续费: 0.27367950 USDT

市场数据:
当前价格: 91187.6 USDT

1小时K线 (最近50根):
  [1] 时间: 2025-11-26 23:00:00, 开: 90800, 高: 91200, 低: 90500, 收: 91000
  [2] 时间: 2025-11-27 00:00:00, 开: 91000, 高: 91500, 低: 90800, 收: 91200
  ...

5分钟K线 (最近50根):
  [1] 时间: 2025-11-27 11:50:00, 开: 91150, 高: 91200, 低: 91100, 收: 91180
  [2] 时间: 2025-11-27 11:55:00, 开: 91180, 高: 91250, 低: 91150, 收: 91187
  ...

订单簿深度:
买盘 (Bids):
  [1] 价格: 91187.0, 数量: 2.5000, 累计: 2.5000
  [2] 价格: 91186.0, 数量: 1.8000, 累计: 4.3000
  ...

卖盘 (Asks):
  [1] 价格: 91188.0, 数量: 1.2000, 累计: 1.2000
  [2] 价格: 91189.0, 数量: 2.1000, 累计: 3.3000
  ...

账户风险:
余额:
  总余额: 950.08 USDT
  可用余额: 950.08 USDT
  冻结余额: 0.00 USDT

杠杆与保证金:
  杠杆倍数: 20.00x
  保证金使用率: 0.96%

风险评估:
  风险等级: LOW
  建议: 账户健康状况良好

当前持仓:
持仓状态: 有持仓 (2个)

持仓 1:
  方向: LONG
  数量: 0.0050
  持仓价格: 91226.50 USDT
  当前价格: 91187.6 USDT
  杠杆: 20.00x
  未实现盈亏: -0.19000 USDT (-0.0417%)

持仓 2:
  方向: SHORT
  数量: 0.0050
  持仓价格: 90669.90 USDT
  当前价格: 91187.6 USDT
  杠杆: 20.00x
  未实现盈亏: -2.58850 USDT (-0.5707%)

总盈亏: -2.77850 USDT

---

[这里会自动拼接 ai-trading-prompt.md 的完整内容]
```

#### 2️⃣ AI 信号 (`2-ai-signal.json`)

```json
{
  "analysis": {
    "marketTrend": "BTC 在 91000-91200 区间震荡，1小时K线显示横盘整理，5分钟K线波动较小。订单簿买卖盘力量相对均衡。",
    "positionStatus": "多仓持仓价 91226.5，当前价 91187.6，轻微亏损 0.04%。空仓持仓价 90669.9，当前价 91187.6，亏损 0.57%。总体亏损 2.78 USDT。",
    "riskAssessment": "账户余额充足，保证金使用率仅 0.96%，风险等级 LOW，有充足的补仓空间。"
  },
  "signal": {
    "action": "HOLD",
    "confidence": "MEDIUM",
    "reasoning": "当前市场处于震荡整理阶段，没有明确的趋势方向。虽然空仓有一定亏损，但尚未达到补仓或止损的阈值。建议观望，等待市场给出更明确的信号。"
  },
  "execution": {
    "hasOrder": false,
    "orders": []
  },
  "riskWarning": "保持耐心，不要在震荡市中频繁交易，等待趋势明朗后再行动。"
}
```

#### 3️⃣ 执行结果 (`3-execution-result.txt`)

```
================================================================================
📊 交易信号分析
================================================================================

市场分析:
  趋势: BTC 在 91000-91200 区间震荡，1小时K线显示横盘整理...
  持仓: 多仓持仓价 91226.5，当前价 91187.6，轻微亏损 0.04%...
  风险: 账户余额充足，保证金使用率仅 0.96%，风险等级 LOW...

交易信号:
  操作: HOLD
  置信度: MEDIUM
  理由: 当前市场处于震荡整理阶段，没有明确的趋势方向...

风险提示: 保持耐心，不要在震荡市中频繁交易...

================================================================================
💤 观望 - 无需执行订单
================================================================================

📤 AI 日志已上报（观望）
```

---

## 🎬 实战演示

### 场景 1: AI 建议补仓 📈

**市场情况：** BTC 从 91500 跌到 90000，多仓亏损 3%，但技术面显示支撑强劲

**AI 分析：**
```json
{
  "analysis": {
    "marketTrend": "BTC 跌至 90000 附近，1小时K线出现长下影线，订单簿 90000 买盘深度增加，显示强支撑。",
    "positionStatus": "多仓持仓价 91500，当前价 90000，亏损 3.28%，符合补仓条件。",
    "riskAssessment": "保证金使用率 35%，有充足的补仓空间。"
  },
  "signal": {
    "action": "ADD_LONG",
    "confidence": "HIGH",
    "reasoning": "在强支撑位补仓可以降低平均成本，提高盈利概率。"
  },
  "execution": {
    "hasOrder": true,
    "orders": [{
      "type": "1",
      "typeDescription": "1-开多",
      "size": "0.0050",
      "priceType": "LIMIT",
      "price": "90000.0",
      "reasoning": "在支撑位 90000 补仓 0.005 BTC，降低平均成本至 90750"
    }]
  }
}
```

**执行结果：**
```
✅ 订单执行成功!
订单 ID: ai_1_1732704000000
📤 AI 日志上报成功

补仓后持仓情况:
  原持仓: 0.005 BTC @ 91500
  新补仓: 0.005 BTC @ 90000
  平均成本: 90750 USDT
  当前价格: 90000 USDT
  浮动亏损: -0.83% (从 -3.28% 降低)
```

---

### 场景 2: AI 建议平仓止盈 💰

**市场情况：** BTC 从 90000 反弹到 92000，多仓盈利 2.5%

**AI 分析：**
```json
{
  "analysis": {
    "marketTrend": "BTC 快速反弹至 92000，5分钟K线连续阳线，但 RSI 已达 75，进入超买区。",
    "positionStatus": "多仓持仓价 90750，当前价 92000，盈利 2.76%，达到止盈目标。",
    "riskAssessment": "短期涨幅较大，存在回调风险，建议止盈。"
  },
  "signal": {
    "action": "CLOSE_LONG",
    "confidence": "HIGH",
    "reasoning": "盈利 2.76% 已达目标，且技术面显示超买，应及时止盈锁定利润。"
  },
  "execution": {
    "hasOrder": true,
    "orders": [{
      "type": "3",
      "typeDescription": "3-平多",
      "size": "0.0100",
      "priceType": "MARKET",
      "price": "",
      "reasoning": "市价平仓全部多仓，锁定利润 25.12 USDT"
    }]
  }
}
```

**执行结果：**
```
✅ 订单执行成功!
订单 ID: ai_3_1732704300000
📤 AI 日志上报成功

平仓盈利:
  持仓成本: 90750 USDT
  平仓价格: 92000 USDT
  持仓数量: 0.01 BTC
  盈利金额: +25.12 USDT (+2.76%)
  手续费: -0.46 USDT
  净盈利: +24.66 USDT
```

---

### 场景 3: AI 建议观望 😴

**市场情况：** BTC 在 91000-91500 区间震荡，没有明确方向

**AI 分析：**
```json
{
  "analysis": {
    "marketTrend": "BTC 在 91000-91500 区间窄幅震荡，1小时和5分钟K线均无明确方向。",
    "positionStatus": "多空仓位基本平衡，总盈亏 -1.2 USDT，处于可接受范围。",
    "riskAssessment": "账户健康良好，无紧急风险。"
  },
  "signal": {
    "action": "HOLD",
    "confidence": "MEDIUM",
    "reasoning": "当前市场处于震荡整理，没有明确的交易机会，建议观望等待。"
  },
  "execution": {
    "hasOrder": false,
    "orders": []
  },
  "riskWarning": "不要在震荡市中频繁交易，耐心等待趋势明朗。"
}
```

**执行结果：**
```
💤 观望 - 无需执行订单
📤 AI 日志已上报（观望）

统计: 过去 24 小时内，80% 的周期都是观望，只有 20% 执行了交易
这正是马丁策略的精髓：不频繁交易，只在最佳时机出手！
```

---

## 🔧 技术架构

### 📚 技术栈

<table>
<tr>
<td width="50%">

#### 🎯 核心技术

- **TypeScript 5.9** - 100% 类型安全
- **Node.js 22** - 最新 LTS 版本
- **DeepSeek-R1** - 推理能力最强的开源模型
- **OpenRouter** - AI 模型聚合平台
- **Dayjs** - 轻量级时间处理库

</td>
<td width="50%">

#### 🔌 API 集成

- **Weex Exchange API** - 完整的合约交易 API
- **HMAC SHA256** - 企业级安全认证
- **RESTful API** - 标准化接口调用
- **JSON Schema** - 结构化数据验证

</td>
</tr>
</table>

### 🏗️ 项目结构

```
scty_bot/
├── 📄 index.ts                      # 🚀 主程序（自动交易循环）
├── 📄 weex.ts                       # 🔌 Weex API 客户端（2900+ 行）
├── 📄 ai-trading-signal.ts          # 📊 交易信号类型定义
├── 📄 ai-trading-prompt.md          # 🤖 AI 交易策略 Prompt
│
├── 🧪 测试文件/
│   ├── test-ai-context.ts           # 测试市场数据收集
│   ├── test-ai-signal.ts            # 测试信号解析
│   ├── test-ai-log-upload.ts        # 测试日志上报
│   ├── test-auto-trading.ts         # 测试自动交易
│   └── test-account-bills.ts        # 测试账单查询
│
├── 📁 trading-logs/                 # 📊 交易日志（自动生成）
│   ├── 2025-11-27_12-15-00/
│   ├── 2025-11-27_12-20-00/
│   └── ...
│
├── 📄 package.json                  # 依赖配置
├── 📄 tsconfig.json                 # TypeScript 配置
├── 📄 .env                          # API 密钥（不提交）
└── 📄 README.md                     # 项目文档
```

### 🔄 核心工作流程

```typescript
// 1️⃣ 等待 5 分钟 K 线结束
await waitFor5MinuteKlineClose();

// 2️⃣ 收集市场数据
const marketReport = await weexClient.getAITradingContextText('cmt_btcusdt');

// 3️⃣ 调用 AI 分析
const { signal, rawResponse } = await generateTradingSignal(marketReport);

// 4️⃣ 执行交易（如果不是观望）
if (signal.execution.hasOrder) {
  for (const order of signal.execution.orders) {
    // 下单
    const result = await weexClient.placeOrder({...});

    // 上报 AI 日志
    await weexClient.uploadAiLog({
      model: 'deepseek/deepseek-r1',
      input: { marketReport },
      output: { signal, order },
      explanation: signal.signal.reasoning
    });
  }
}

// 5️⃣ 保存日志到本地
await saveToFolder(folderPath, '1-market-report.txt', marketReport);
await saveToFolder(folderPath, '2-ai-signal.json', JSON.stringify(signal));
await saveToFolder(folderPath, '3-execution-result.txt', executionResult);
```

---

## 🛡️ 风险管理与安全

### ⚠️ 重要免责声明

<div align="center">

**🚨 本项目仅供学习和研究使用，不构成任何投资建议 🚨**

</div>

- ⚠️ **加密货币交易风险极高** - 可能导致本金全部损失
- ⚠️ **AI 不是万能的** - 模型可能做出错误判断
- ⚠️ **过往表现不代表未来** - 历史收益不保证未来盈利
- ⚠️ **请谨慎使用** - 建议先用小资金测试
- ⚠️ **自负盈亏** - 开发者不对任何损失负责

### 🔐 安全最佳实践

#### 1️⃣ API 密钥安全

```bash
# ✅ 正确做法
# 将 API 密钥存储在 .env 文件中
WEEX_API_KEY=your_key_here

# ❌ 错误做法
# 不要将密钥硬编码在代码中
const apiKey = "sk-xxxxx";  // 危险！
```

#### 2️⃣ 权限最小化

在 Weex 创建 API 密钥时：
- ✅ **只开启必要权限**：读取账户、交易权限
- ❌ **不要开启提现权限**：避免资金被盗风险
- ✅ **绑定 IP 白名单**：限制只能从特定 IP 访问

#### 3️⃣ 资金管理

- 💰 **小资金测试** - 先用 100-500 USDT 测试
- 📊 **分散投资** - 不要把所有资金投入一个策略
- 🎯 **设置止损** - 单日最大亏损不超过总资金的 5%
- 📈 **逐步加仓** - 验证策略有效后再增加资金

#### 4️⃣ 监控与告警

```typescript
// 建议添加监控逻辑
if (totalLoss > maxDailyLoss) {
  // 发送告警通知
  await sendAlert('每日亏损超限，已停止交易');
  process.exit(1);
}

if (marginRatio > 0.8) {
  // 保证金使用率过高
  await sendAlert('保证金使用率超过 80%，风险较高');
}
```

### 📊 性能监控建议

#### 关键指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| **周收益率** | 3-8% | 稳健盈利目标 |
| **最大回撤** | < 10% | 单次最大亏损 |
| **胜率** | > 60% | 盈利交易占比 |
| **盈亏比** | > 1.5 | 平均盈利/平均亏损 |
| **保证金使用率** | < 70% | 避免爆仓风险 |
| **交易频率** | 每天 2-5 次 | 避免过度交易 |

#### 日志分析

```bash
# 查看今天的所有交易
ls -la trading-logs/2025-11-27_*

# 统计观望次数
grep -r "HOLD" trading-logs/ | wc -l

# 统计执行订单次数
grep -r "订单执行成功" trading-logs/ | wc -l

# 查看盈亏情况
grep -r "盈利金额" trading-logs/
```

---

## 🎯 常见问题 FAQ

### ❓ 为什么选择 DeepSeek-R1 而不是 GPT-4？

**答：** DeepSeek-R1 是一个具有**推理能力**的模型，它会在内部进行多步思考，而不是直接给出答案。这对于交易决策非常重要，因为我们需要 AI 真正"理解"市场，而不是简单地匹配模式。

对比：
- **GPT-4**: 快速响应，但缺乏深度推理
- **DeepSeek-R1**: 慢一点，但思考更深入，决策更可靠

### ❓ 为什么是 5 分钟周期，而不是 1 分钟或 1 小时？

**答：** 5 分钟是一个平衡点：
- **1 分钟**: 太频繁，容易被市场噪音干扰，手续费高
- **5 分钟**: 既能及时响应市场变化，又能过滤掉短期波动
- **1 小时**: 太慢，可能错过最佳入场时机

### ❓ 马丁策略不是很危险吗？

**答：** 传统的赌博式马丁策略确实很危险（无限加倍），但我们的策略是**改良版**：
- ✅ **有限加仓** - 最多补仓 2-3 次，不会无限加倍
- ✅ **技术面确认** - 只在支撑/阻力位补仓，不是盲目加仓
- ✅ **风险控制** - 保证金使用率超过 70% 就停止加仓
- ✅ **及时止损** - 亏损超过 8% 且无反转迹象就止损

### ❓ 为什么大多数时候都是观望？

**答：** 这正是专业交易者的做法！
- 📊 **统计数据**: 80% 的时间市场都在震荡，只有 20% 的时间有明确趋势
- 💰 **盈利来源**: 盈利来自于抓住那 20% 的机会，而不是频繁交易
- 🎯 **避免亏损**: 不确定的时候不交易，就是最好的风险管理

### ❓ 如何验证 AI 的决策是否正确？

**答：** 每次交易都会保存完整的日志，你可以：
1. 查看 `2-ai-raw-response.txt` 了解 AI 的思考过程
2. 对比 `1-market-report.txt` 中的市场数据
3. 检查 `3-execution-result.txt` 中的执行结果
4. 长期跟踪盈亏情况，评估策略有效性

### ❓ 需要多少资金才能开始？

**答：** 建议：
- **最低**: 100 USDT（测试用）
- **推荐**: 500-1000 USDT（小规模运行）
- **理想**: 5000+ USDT（充分发挥策略优势）

注意：资金越少，抗风险能力越弱，建议先用小资金测试 1-2 周。

### ❓ 会不会爆仓？

**答：** 理论上有可能，但我们有多重保护：
- ✅ **保证金监控** - 使用率超过 70% 就停止加仓
- ✅ **风险评估** - AI 会评估账户风险等级
- ✅ **及时止损** - 亏损超过阈值就止损
- ✅ **杠杆控制** - 默认 20 倍杠杆，可以调低

只要不手动干预，按照策略运行，爆仓概率很低。

### ❓ 可以同时交易多个币种吗？

**答：** 当前版本只支持 BTC/USDT，但代码结构支持扩展：
```typescript
// 未来可以这样扩展
const symbols = ['cmt_btcusdt', 'cmt_ethusdt', 'cmt_solusdt'];
for (const symbol of symbols) {
  await runTradingCycle(symbol);
}
```

建议先在一个币种上验证策略，再扩展到多币种。

---

## � 进阶使用

### 🎨 自定义交易策略

你可以修改 `ai-trading-prompt.md` 来调整 AI 的交易策略：

```markdown
# 示例：更激进的策略
## 交易目标
- 周期：3 天
- 目标 ROI：10-15%（激进）
- 风险承受：保证金使用率 < 80%

## 补仓规则
- 亏损 > 1.5% 就补仓（更激进）
- 每次补仓 0.01 BTC（更大仓位）

# 示例：更保守的策略
## 交易目标
- 周期：2 周
- 目标 ROI：2-5%（保守）
- 风险承受：保证金使用率 < 50%

## 补仓规则
- 亏损 > 5% 才补仓（更保守）
- 每次补仓 0.003 BTC（更小仓位）
```

### 📊 添加自定义指标

在 `weex.ts` 中添加更多技术指标：

```typescript
// 示例：添加 RSI 指标
async function calculateRSI(candles: any[], period: number = 14): Promise<number> {
  // RSI 计算逻辑
  // ...
  return rsi;
}

// 在 getAITradingContextText() 中使用
const rsi = await calculateRSI(candles1h);
contextText += `RSI (14): ${rsi.toFixed(2)}\n`;
```

### 🔔 添加通知功能

```typescript
// 示例：添加 Telegram 通知
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

async function sendTelegramNotification(message: string) {
  await bot.sendMessage(process.env.TELEGRAM_CHAT_ID!, message);
}

// 在执行订单后发送通知
if (signal.execution.hasOrder) {
  await sendTelegramNotification(`
🤖 AI 交易信号
操作: ${signal.signal.action}
理由: ${signal.signal.reasoning}
订单: ${order.typeDescription} ${order.size} BTC @ ${order.price}
  `);
}
```

### 📈 性能分析工具

创建一个简单的性能分析脚本：

```typescript
// analyze-performance.ts
import fs from 'fs';
import path from 'path';

const logsDir = './trading-logs';
const folders = fs.readdirSync(logsDir);

let totalTrades = 0;
let profitableTrades = 0;
let totalProfit = 0;

for (const folder of folders) {
  const signalPath = path.join(logsDir, folder, '2-ai-signal.json');
  const resultPath = path.join(logsDir, folder, '3-execution-result.txt');

  if (fs.existsSync(signalPath) && fs.existsSync(resultPath)) {
    const signal = JSON.parse(fs.readFileSync(signalPath, 'utf-8'));
    const result = fs.readFileSync(resultPath, 'utf-8');

    if (signal.execution.hasOrder) {
      totalTrades++;

      // 解析盈亏
      const profitMatch = result.match(/盈利金额: ([+-]?\d+\.\d+)/);
      if (profitMatch) {
        const profit = parseFloat(profitMatch[1]);
        totalProfit += profit;
        if (profit > 0) profitableTrades++;
      }
    }
  }
}

console.log('📊 交易统计');
console.log(`总交易次数: ${totalTrades}`);
console.log(`盈利次数: ${profitableTrades}`);
console.log(`胜率: ${(profitableTrades / totalTrades * 100).toFixed(2)}%`);
console.log(`总盈亏: ${totalProfit.toFixed(2)} USDT`);
console.log(`平均每笔: ${(totalProfit / totalTrades).toFixed(2)} USDT`);
```

---

## 🎯 开发路线图

### ✅ 已完成（v1.0）

- [x] 🤖 DeepSeek-R1 AI 深度推理集成
- [x] 📊 完整的 Weex 合约交易 API 封装
- [x] 🔄 5 分钟自动交易循环
- [x] 💰 马丁格尔多空对冲策略
- [x] 📁 完整的交易日志记录
- [x] 📤 AI 日志自动上报（Weex 官方要求）
- [x] 🎨 100% TypeScript 类型安全
- [x] 🔐 HMAC SHA256 企业级安全认证
- [x] 📈 多时间周期 K 线分析（1h + 5m）
- [x] 📊 订单簿深度分析（20 档买卖盘）
- [x] 💼 账户风险实时监控

### 🚧 进行中（v1.1）

- [ ] 📊 **技术指标增强**
  - RSI（相对强弱指标）
  - MACD（指数平滑异同移动平均线）
  - 布林带（Bollinger Bands）
  - 成交量分析

- [ ] 🔔 **通知系统**
  - Telegram 机器人通知
  - 邮件告警
  - 微信推送（企业微信）

- [ ] 📈 **性能分析仪表板**
  - 实时盈亏曲线
  - 胜率统计
  - 最大回撤分析
  - 夏普比率计算

### 🔮 未来计划（v2.0）

- [ ] 🌐 **WebSocket 实时数据**
  - 实时价格推送
  - 订单簿实时更新
  - 交易执行确认

- [ ] 🎯 **多策略支持**
  - 网格交易策略
  - 趋势跟踪策略
  - 套利策略
  - 自定义策略框架

- [ ] 🧪 **回测系统**
  - 历史数据回测
  - 策略参数优化
  - 蒙特卡洛模拟

- [ ] 🌍 **多交易所支持**
  - Binance
  - OKX
  - Bybit
  - 统一接口抽象

- [ ] 🖥️ **Web 管理界面**
  - 实时监控面板
  - 策略配置界面
  - 历史交易查询
  - 性能报表生成

---

## 🤝 贡献指南

欢迎所有形式的贡献！无论是：

<table>
<tr>
<td width="25%" align="center">
<h3>🐛 Bug 报告</h3>
<p>发现问题？请提交 Issue</p>
</td>
<td width="25%" align="center">
<h3>💡 功能建议</h3>
<p>有好想法？我们很乐意听取</p>
</td>
<td width="25%" align="center">
<h3>📝 文档改进</h3>
<p>帮助完善文档</p>
</td>
<td width="25%" align="center">
<h3>🔧 代码贡献</h3>
<p>提交 Pull Request</p>
</td>
</tr>
</table>

### 如何贡献

1. **Fork 项目**
   ```bash
   git clone https://github.com/wrule/scty_bot.git
   cd scty_bot
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **提交更改**
   ```bash
   git commit -m "feat: add your feature"
   ```

4. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**

---

## 📜 开源协议

本项目采用 **MIT License** 开源协议。

这意味着你可以：
- ✅ 自由使用、修改、分发
- ✅ 用于商业项目
- ✅ 私有化部署

但需要：
- ⚠️ 保留原作者版权声明
- ⚠️ 不提供任何担保

---

## 🏆 Hackathon 项目

本项目为 **Weex AI Trading Competition** 参赛作品，展示了：

<div align="center">

| 🎯 创新性 | 🔧 技术性 | 📊 实用性 | 📚 文档性 |
|---------|---------|---------|---------|
| AI 深度推理 + 马丁策略 | TypeScript + 类型安全 | 真实交易场景 | 完整的 README |
| DeepSeek-R1 模型 | 企业级安全认证 | 自动化运行 | 详细的代码注释 |
| 多空对冲 | 模块化设计 | 风险管理 | 使用示例 |

</div>

---

## 📧 联系方式

<div align="center">

**有问题？想交流？欢迎联系！**

[![GitHub](https://img.shields.io/badge/GitHub-@wrule-181717?style=for-the-badge&logo=github)](https://github.com/wrule)
[![Issues](https://img.shields.io/badge/Issues-Report_Bug-red?style=for-the-badge&logo=github)](https://github.com/wrule/scty_bot/issues)
[![Discussions](https://img.shields.io/badge/Discussions-Join_Chat-blue?style=for-the-badge&logo=github)](https://github.com/wrule/scty_bot/discussions)

</div>

---

<div align="center">

# 🌟 如果这个项目对你有帮助，请给个 Star！🌟

<img src="https://img.shields.io/github/stars/wrule/scty_bot?style=social" />

---

### 💭 项目理念

**"让 AI 成为你的交易助手，而不是替代你的判断"**

这个项目的目标不是创造一个完美的交易机器人（那是不存在的），
而是展示如何将 **AI 推理能力** 与 **量化交易策略** 结合，
创造一个可以辅助决策、自动执行、持续学习的智能交易系统。

---

**Built with 🤖 AI + 💻 Code + ❤️ Passion**

*让 AI 为你的财富增值*

---

**⚠️ 最后提醒：投资有风险，入市需谨慎！**

</div>


