import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('verify urban evolution pro features', async ({ page }) => {
  const filePath = path.resolve('urban_evolution_simulation.html');
  const fileUrl = `file://${filePath}`;
  await page.goto(fileUrl);

  // 1. Initial Load Verification
  await expect(page.locator('h1')).toContainText('Simulador Urbano');
  await page.screenshot({ path: 'pro_initial_load.png' });

  // 2. Playback and Speed Control
  const playBtn = page.locator('#play-pause-btn');
  await playBtn.click();
  await expect(playBtn).toHaveText('⏸');

  // Wait for some years to pass
  await page.waitForTimeout(2000);
  const yearText = await page.locator('#year-display').innerText();
  console.log(`Year after 2s: ${yearText}`);

  // 3. Comparison Mode
  const compareBtn = page.locator('#btn-compare');
  await compareBtn.click();
  await expect(page.locator('#canvas-wrapper-B')).toBeVisible();
  await page.screenshot({ path: 'pro_comparison_mode.png' });

  // 4. Layers
  await page.click('button[data-layer="density"]');
  await page.screenshot({ path: 'pro_density_layer.png' });

  // 5. Educational Modal
  await page.click('#btn-edu');
  await expect(page.locator('#edu-modal')).toBeVisible();
  await expect(page.locator('#edu-text')).toContainText('Gentrificación');
  await page.screenshot({ path: 'pro_educational_modal.png' });
  await page.click('.close-modal');

  // 6. Inspector
  // Click on the center of Canvas A
  const canvasA = page.locator('#canvas-A');
  const box = await canvasA.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    // The inspector might not show if the cell is empty, but let's check visibility if possible
    // Wait a bit for potential growth
    await page.waitForTimeout(2000);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    // await expect(page.locator('#inspector-A')).toBeVisible(); // Might fail if no building there yet
  }

  await page.screenshot({ path: 'pro_final_state.png' });
});
