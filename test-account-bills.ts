import 'dotenv/config';
import { WeexApiClient } from './weex';

async function testAccountBills() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://api-contract.weex.com'
  );

  console.log('=== 测试获取账单历史 ===\n');

  // 测试 1: 获取最近 20 条账单
  console.log('📋 测试 1: 获取最近 20 条账单');
  console.log('-----------------------------------\n');

  const bills = await client.getAccountBills({
    limit: 20
  });

  console.log('账单数量:', bills.items.length);
  console.log('是否有下一页:', bills.hasNextPage ? '是' : '否');
  console.log('');

  if (bills.items.length > 0) {
    console.log('📊 账单详情:\n');

    bills.items.forEach((bill, index) => {
      const amount = parseFloat(bill.amount);
      const balance = parseFloat(bill.balance);
      const time = new Date(bill.ctime);

      // 根据业务类型显示图标
      let icon = '📝';
      if (bill.businessType.includes('open')) icon = '📈';
      if (bill.businessType.includes('close')) icon = '📉';
      if (bill.businessType.includes('funding')) icon = '💰';
      if (bill.businessType.includes('transfer')) icon = '🔄';

      console.log(`${icon} 账单 ${index + 1}:`);
      console.log('  账单 ID:', bill.billId);
      console.log('  币种:', bill.coin);
      console.log('  交易对:', bill.symbol || 'N/A');
      console.log('  业务类型:', bill.businessType);
      console.log('  金额:', amount.toFixed(8), bill.coin, amount >= 0 ? '📈' : '📉');
      console.log('  余额:', balance.toFixed(8), bill.coin);
      console.log('  时间:', time.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('');
    });

    // 统计分析
    console.log('-----------------------------------');
    console.log('📈 统计分析:\n');

    // 按业务类型分组
    const typeStats: Record<string, { count: number; totalAmount: number }> = {};
    bills.items.forEach(bill => {
      if (!typeStats[bill.businessType]) {
        typeStats[bill.businessType] = { count: 0, totalAmount: 0 };
      }
      typeStats[bill.businessType].count++;
      typeStats[bill.businessType].totalAmount += parseFloat(bill.amount);
    });

    console.log('业务类型统计:');
    Object.entries(typeStats).forEach(([type, stats]) => {
      console.log(`  ${type}: ${stats.count} 笔, 总计 ${stats.totalAmount.toFixed(8)}`);
    });

    // 计算总收入和总支出
    let totalIncome = 0;
    let totalExpense = 0;
    bills.items.forEach(bill => {
      const amount = parseFloat(bill.amount);
      if (amount > 0) {
        totalIncome += amount;
      } else {
        totalExpense += Math.abs(amount);
      }
    });

    console.log('\n收支统计:');
    console.log('  总收入:', totalIncome.toFixed(8), '📈');
    console.log('  总支出:', totalExpense.toFixed(8), '📉');
    console.log('  净收益:', (totalIncome - totalExpense).toFixed(8), (totalIncome - totalExpense) >= 0 ? '📈' : '📉');
    console.log('-----------------------------------\n');

  } else {
    console.log('暂无账单记录\n');
  }

  // 测试 2: 获取最近 24 小时的账单
  console.log('📋 测试 2: 获取最近 24 小时的账单');
  console.log('-----------------------------------\n');

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const recentBills = await client.getAccountBills({
    startTime: oneDayAgo,
    endTime: now,
    limit: 50
  });

  console.log('24小时内账单数量:', recentBills.items.length);

  if (recentBills.items.length > 0) {
    const firstTime = new Date(recentBills.items[recentBills.items.length - 1].ctime);
    const lastTime = new Date(recentBills.items[0].ctime);
    console.log('时间范围:', firstTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    console.log('       至:', lastTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  }
  console.log('-----------------------------------\n');

  // 测试 3: 获取特定业务类型的账单
  console.log('📋 测试 3: 获取开仓相关账单');
  console.log('-----------------------------------\n');

  const openBills = await client.getAccountBills({
    businessType: 'position_open_long',
    limit: 10
  });

  console.log('开多仓账单数量:', openBills.items.length);

  if (openBills.items.length > 0) {
    console.log('\n最近的开多仓记录:');
    openBills.items.slice(0, 3).forEach((bill, index) => {
      const time = new Date(bill.ctime);
      console.log(`  ${index + 1}. ${time.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} - ${bill.amount} ${bill.coin}`);
    });
  }
  console.log('-----------------------------------');
}

testAccountBills();

