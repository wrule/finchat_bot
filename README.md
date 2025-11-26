# 🤖 SCTY Bot - AI-Powered Crypto Trading Bot

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![AI](https://img.shields.io/badge/AI-DeepSeek-purple?style=for-the-badge&logo=openai)
![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**An intelligent cryptocurrency trading bot powered by AI for automated trading on Weex Exchange**

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Coverage](#-api-coverage) • [Demo](#-demo)

</div>

---

## 🌟 Overview

**SCTY Bot** is an advanced AI-powered quantitative trading bot that combines cutting-edge artificial intelligence with professional cryptocurrency trading. Built on the Weex exchange platform, it leverages **DeepSeek AI** to generate intelligent trading signals and execute automated trading strategies.

### 🎯 Key Highlights

- 🧠 **AI-Driven Trading** - Powered by DeepSeek v3.2 for intelligent signal generation
- 📊 **Multi-Market Support** - Spot & Futures trading on Weex Exchange
- 🔐 **Enterprise Security** - HMAC SHA256 authentication & secure API integration
- 📈 **Smart Risk Management** - Automated stop-loss and take-profit execution
- ⚡ **Real-time Analysis** - Live market data processing and decision making
- 🎨 **Type-Safe** - 100% TypeScript with comprehensive type definitions

---

## ✨ Core Features

### 🤖 AI Trading Engine
- **DeepSeek AI Integration** - Advanced language model for market analysis
- **Intelligent Signal Generation** - AI-generated buy/sell/hold signals with confidence scores
- **Contextual Decision Making** - Considers market conditions, trends, and risk factors
- **Automated Reasoning** - Provides detailed explanations for each trading decision

### 📊 Trading Capabilities

#### Spot Trading
- 💰 Real-time account balance monitoring
- 📈 Automated spot order execution
- 💼 Multi-asset portfolio management

#### Futures/Contract Trading
- 🎯 Long/Short position management
- 📊 Advanced order types (Market, Limit, Post-Only, FOK, IOC)
- 🎚️ Dynamic leverage & margin control
- 💸 Automated stop-loss and take-profit
- 📋 Complete transaction history tracking

### 🔧 Technical Features
- ⚡ **Real-time Market Data** - Live candlestick data with multiple timeframes
- 🔐 **Secure Authentication** - HMAC SHA256 signature implementation
- 📡 **RESTful API Integration** - Full Weex API coverage
- 🎨 **Type-Safe Development** - Comprehensive TypeScript interfaces
- 🛡️ **Error Handling** - Robust error management and recovery

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SCTY Trading Bot                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         AI Decision Engine               │
        │    (DeepSeek v3.2 via OpenRouter)       │
        │                                          │
        │  • Market Analysis                       │
        │  • Signal Generation                     │
        │  • Risk Assessment                       │
        │  • Strategy Optimization                 │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │       Trading Signal Schema              │
        │                                          │
        │  • Symbol (BTC/USDT, ETH/USDT, etc.)    │
        │  • Action (Buy/Sell/Hold)               │
        │  • Price & Quantity                      │
        │  • Stop Loss & Take Profit              │
        │  • Confidence Score (0-100)             │
        │  • Reasoning & Timestamp                │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Weex API Client                  │
        │      (Type-Safe TypeScript)              │
        │                                          │
        │  • HMAC SHA256 Authentication           │
        │  • RESTful API Integration              │
        │  • Order Execution                       │
        │  • Position Management                   │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │          Weex Exchange                   │
        │                                          │
        │  • Spot Trading                          │
        │  • Futures/Contract Trading              │
        │  • Real-time Market Data                 │
        └─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1️⃣ Installation

```bash
# Clone the repository
git clone https://github.com/wrule/scty_bot.git
cd scty_bot

# Install dependencies
npm install
# or
yarn install
```

### 2️⃣ Configuration

Create a `.env` file in the project root:

```env
# Weex Exchange API Credentials
WEEX_API_KEY=your_weex_api_key
WEEX_SECRET_KEY=your_weex_secret_key
WEEX_PASSPHRASE=your_weex_passphrase

# OpenRouter AI API Key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3️⃣ Run the Bot

```bash
# Start the trading bot
npm start

# Or use tsx directly
npx tsx index.ts
```

---

## 💡 Usage Examples

### Example 1: AI Signal Generation

```typescript
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = openrouter('deepseek/deepseek-v3.2-exp');

// Generate trading signal
const { object } = await generateObject({
  model,
  schema: tradingSignalSchema,
  prompt: '分析当前BTC市场，生成交易信号',
});

console.log('AI Trading Signal:', object);
// Output:
// {
//   symbol: "BTC/USDT",
//   action: "buy",
//   price: 86500,
//   quantity: 0.01,
//   stopLoss: 85000,
//   takeProfit: 90000,
//   confidence: 85,
//   reason: "技术指标显示超卖，RSI低于30，MACD金叉形成",
//   timestamp: "2024-11-26T14:30:00Z"
// }
```

### Example 2: Execute Trade Based on AI Signal

```typescript
import { WeexApiClient } from './weex';

const client = new WeexApiClient(
  process.env.WEEX_API_KEY!,
  process.env.WEEX_SECRET_KEY!,
  process.env.WEEX_PASSPHRASE!,
  'https://pro-openapi.weex.tech'
);

// Execute the AI-generated signal
if (signal.action === 'buy' && signal.confidence > 80) {
  const order = await client.placeOrder({
    symbol: 'cmt_btcusdt',
    client_oid: `ai_${Date.now()}`,
    size: signal.quantity.toString(),
    type: '1',  // Open Long
    order_type: '0',
    match_price: '0',
    price: signal.price.toString(),
    presetTakeProfitPrice: signal.takeProfit?.toString(),
    presetStopLossPrice: signal.stopLoss?.toString(),
  });

  console.log('Order executed:', order.order_id);
}
```

### Example 3: Monitor Account & Positions

```typescript
// Check account balance
const assets = await client.getSpotAccountAssets();
console.log('Account Balance:', assets.data);

// Get contract positions
const contractAssets = await client.getContractAccountAssets();
console.log('Open Positions:', contractAssets);

// View transaction history
const bills = await client.getAccountBills({
  limit: 50,
  startTime: Date.now() - 24 * 60 * 60 * 1000,
});
console.log('Recent Transactions:', bills.items);
```

---

## 📊 API Coverage

### Weex Exchange Integration

| Category | Endpoint | Method | Status |
|----------|----------|--------|--------|
| **Market Data** | Server Time | `getServerTime()` | ✅ |
| **Market Data** | Contract Info | `getContracts(symbol?)` | ✅ |
| **Market Data** | Candlestick Data | `getCandles(params)` | ✅ |
| **Spot Trading** | Account Assets | `getSpotAccountAssets()` | ✅ |
| **Futures** | Account List | `getAccounts()` | ✅ |
| **Futures** | Single Account | `getAccount(coinId)` | ✅ |
| **Futures** | Contract Assets | `getContractAccountAssets()` | ✅ |
| **Futures** | Bill History | `getAccountBills(params)` | ✅ |
| **Futures** | Place Order | `placeOrder(params)` | ✅ |

### AI Model Integration

- **Provider**: OpenRouter
- **Model**: DeepSeek v3.2 Experimental
- **Capabilities**:
  - Market sentiment analysis
  - Technical indicator interpretation
  - Risk-reward calculation
  - Multi-timeframe analysis
  - Pattern recognition

---

## 🎬 Demo

### AI-Generated Trading Signal Example

```json
{
  "symbol": "BTC/USDT",
  "action": "buy",
  "price": 86500,
  "quantity": 0.01,
  "stopLoss": 85000,
  "takeProfit": 90000,
  "confidence": 85,
  "reason": "技术指标显示超卖，RSI低于30，MACD金叉形成，成交量放大，支撑位强劲",
  "timestamp": "2024-11-26T14:30:00Z"
}
```

### Trading Signal Schema

```typescript
const tradingSignalSchema = z.object({
  symbol: z.string().describe('交易对符号，例如 BTC/USDT'),
  action: z.enum(['buy', 'sell', 'hold']).describe('交易动作'),
  price: z.number().describe('建议交易价格'),
  quantity: z.number().describe('建议交易数量'),
  stopLoss: z.number().optional().describe('止损价格'),
  takeProfit: z.number().optional().describe('止盈价格'),
  confidence: z.number().min(0).max(100).describe('信号置信度'),
  reason: z.string().describe('交易信号的理由'),
  timestamp: z.string().describe('信号生成时间'),
});
```

---

## 🛡️ Risk Management

### Built-in Safety Features

- ✅ **Confidence Threshold** - Only execute trades with high confidence scores (>80%)
- ✅ **Automatic Stop-Loss** - Every position includes stop-loss protection
- ✅ **Take-Profit Targets** - Automated profit-taking at predefined levels
- ✅ **Position Sizing** - AI-calculated optimal position sizes
- ✅ **Rate Limiting** - Respects exchange API rate limits

### Recommended Practices

1. **Start Small** - Begin with minimal position sizes
2. **Monitor Closely** - Regularly review AI decisions and performance
3. **Set Limits** - Define maximum daily loss and profit targets
4. **Diversify** - Don't put all capital in a single position
5. **Backtest** - Test strategies with historical data before live trading

---

## 📁 Project Structure

```
scty_bot/
├── index.ts                 # Main bot entry point (AI signal generation)
├── weex.ts                  # Weex API client implementation
├── weex-example.ts          # API usage examples & tests
├── test-check-balance.ts    # Balance checking utility
├── package.json             # Dependencies & scripts
├── .env                     # API credentials (gitignored)
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **Node.js 22** | Runtime environment |
| **AI SDK** | AI model integration framework |
| **OpenRouter** | AI model provider (DeepSeek) |
| **LangChain** | AI orchestration & chaining |
| **Zod** | Schema validation |
| **Axios** | HTTP client for API calls |
| **crypto-js** | HMAC SHA256 authentication |
| **dotenv** | Environment configuration |

---

## 🚨 Disclaimer

**IMPORTANT: This is an experimental trading bot for educational and research purposes.**

- ⚠️ **Trading Risk**: Cryptocurrency trading involves substantial risk of loss
- ⚠️ **No Guarantees**: Past performance does not guarantee future results
- ⚠️ **Use at Your Own Risk**: The developers are not responsible for any financial losses
- ⚠️ **Test First**: Always test with small amounts before scaling up
- ⚠️ **Not Financial Advice**: This bot does not provide financial advice

**By using this software, you acknowledge and accept all risks associated with automated cryptocurrency trading.**

---

## 🎯 Roadmap

### ✅ Completed (v1.0)
- [x] AI-powered signal generation with DeepSeek
- [x] Weex API integration (Spot & Futures)
- [x] Type-safe TypeScript implementation
- [x] HMAC SHA256 authentication
- [x] Order placement & management
- [x] Account & position monitoring

### 🚧 In Progress
- [ ] WebSocket integration for real-time data
- [ ] Advanced technical indicators
- [ ] Multi-strategy support
- [ ] Backtesting framework
- [ ] Performance analytics dashboard

### 🔮 Future Plans
- [ ] Machine learning model training
- [ ] Sentiment analysis from news/social media
- [ ] Portfolio optimization algorithms
- [ ] Risk management automation
- [ ] Multi-exchange support
- [ ] Web UI for monitoring & control

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- 🔧 Code contributions

Please feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🏆 Hackathon Project

This project was created for hackathon participation, showcasing:

- ✨ **Innovation**: AI-driven quantitative trading
- 🔧 **Technical Excellence**: Modern TypeScript, type safety, clean architecture
- 🎯 **Practical Application**: Real-world cryptocurrency trading automation
- 📚 **Documentation**: Comprehensive README and code comments
- 🚀 **Scalability**: Modular design for easy extension

---

## 📧 Contact & Support

- **GitHub**: [@wrule](https://github.com/wrule)
- **Repository**: [scty_bot](https://github.com/wrule/scty_bot)
- **Issues**: [Report a bug or request a feature](https://github.com/wrule/scty_bot/issues)

---

<div align="center">

### 🌟 If you find this project interesting, please give it a star! 🌟

**Built with 🤖 AI + 💻 Code + ❤️ Passion**

*Empowering traders with artificial intelligence*

</div>


