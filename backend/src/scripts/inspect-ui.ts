import { chromium } from 'playwright-core';
import * as path from 'path';

async function main() {
  const artifactDir = 'C:\\Users\\Pc\\.gemini\\antigravity-ide\\brain\\e4b1e7e9-cdd7-4fb7-a829-011e2180ae67';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  console.log('🚀 Launching Playwright with Chrome at:', chromePath);
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 950 },
  });

  const page = await context.newPage();

  console.log('🌐 Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Initial screenshot - check if chat is visible above fold
  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log('📍 Initial window.scrollY:', initialScrollY);

  const initialShot = path.join(artifactDir, 'ui_initial_clean.png');
  await page.screenshot({ path: initialShot });
  console.log('📸 Saved initial view screenshot:', initialShot);

  // 2. Click quick prompt pill
  console.log('👆 Clicking first quick prompt pill...');
  const promptPill = page.locator('.quick-prompt-pill').first();
  await promptPill.click();

  // Wait for loading to finish and bot response to appear
  await page.waitForTimeout(3000);
  const scrollAfterPrompt = await page.evaluate(() => window.scrollY);
  console.log('📍 window.scrollY after clicking prompt pill & bot response:', scrollAfterPrompt);

  const afterPromptShot = path.join(artifactDir, 'ui_bot_response.png');
  await page.screenshot({ path: afterPromptShot });
  console.log('📸 Saved bot response screenshot:', afterPromptShot);

  // 3. Test chat input focus & typing
  console.log('⌨️ Typing into chatbox input...');
  const chatInput = page.locator('.chat-input-bar .chatbox-input');
  await chatInput.click();
  await chatInput.fill('Chính sách đổi trả hàng như thế nào?');
  
  const scrollAfterFocus = await page.evaluate(() => window.scrollY);
  console.log('📍 window.scrollY after input focus & typing:', scrollAfterFocus);

  // 4. Click ChatBox send button
  console.log('🚀 Clicking ChatBox send button...');
  const sendBtn = page.locator('.chat-input-bar .send-btn');
  await sendBtn.click();

  await page.waitForTimeout(3000);
  const scrollAfterSend = await page.evaluate(() => window.scrollY);
  console.log('📍 window.scrollY after sending message:', scrollAfterSend);

  const fullPageShot = path.join(artifactDir, 'ui_full_page_clean.png');
  await page.screenshot({ path: fullPageShot, fullPage: true });
  console.log('📸 Saved full page screenshot:', fullPageShot);

  await browser.close();
  console.log('✅ Visual verification finished successfully.');
}

main().catch((err) => {
  console.error('❌ Error during inspection:', err);
  process.exit(1);
});
