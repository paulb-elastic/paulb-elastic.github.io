import { journey, step, monitor, expect } from '@elastic/synthetics';

journey('Custom Behaviour Journey', ({ page, params }) => {
  monitor.use({
    id: 'custom-behaviour-journey',
    schedule: 30,
  });
  
  step('Load initial page', async () => {
    await page.goto('https://www.becnetworks.co.uk/testing/testCustomBehaviourPage.html');
  });
  step('Set behaviour configuration', async () => {
    await page.fill('input[name="imageTtfb"]', '8000');
    await page.fill('input[name="textContentDownload"]', '3000');
  });
  step('Run scenario 1', async () => {
    await page.click('text=Run scenario 1');
    await page.waitForLoadState("load");
    await page.waitForSelector('#textComplete >> text=Finished loading text');
  });

});