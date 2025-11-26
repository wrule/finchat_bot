import { WeexApiClient } from './weex';
import * as dotenv from 'dotenv';

dotenv.config();

async function testSimpleAPI() {
  const client = new WeexApiClient(
    process.env.WEEX_API_KEY || '',
    process.env.WEEX_SECRET_KEY || '',
    process.env.WEEX_PASSPHRASE || '',
    'https://pro-openapi.weex.tech'
  );

  await client.getCurrentPosition();
  await client.openPosition('0.001', 'LONG');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const position = await client.getCurrentPosition();
  await new Promise(resolve => setTimeout(resolve, 5000));

  await client.closePosition(position!.size, 'LONG');
  await new Promise(resolve => setTimeout(resolve, 3000));
  await client.getCurrentPosition();
}

testSimpleAPI();

