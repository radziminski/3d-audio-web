import { test, expect } from '@playwright/test';

test('3D Sound libraries survey', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Step 1: Introduction
  await expect(
    page.getByText('Welcome to the 3D Sound Experience!')
  ).toBeVisible();
  await page.click("text=Let's begin!");

  // Step 2: Headphones check
  await expect(
    page.getByRole('heading', { name: 'First: Headphones check' })
  ).toBeVisible();
  await page.click('text=Start'); // simulate user hearing sound in the left ear

  await page.goto('http://localhost:3000/preparation/about');

  // Step 3: About 3D Sound
  await expect(
    page.getByRole('heading', { name: 'What is 3D Sound?' })
  ).toBeVisible();
  await page.click('text=Continue');

  // Step 4: Quality & Spatialization
  await expect(
    page.getByText('Explore and Rate the 3D Sound Technologies')
  ).toBeVisible();
  await page.click('text=Technology 1'); // select a technology
  await page.click('text=Play'); // start audio playback
  await page.click('text=Pause'); // stop audio playback

  await page.goto('http://localhost:3000/preparation/tutorial');

  await expect(
    page.getByRole('heading', { name: 'Guessing sound direction - tutorial' })
  ).toBeVisible();

  // Step 5: Tutorial
  for (let i = 0; i < 10; i++) {
    await page.click('text=Next step');
  }

  await page.click('text=Start test');

  // Step 6: Guessing
  await expect(page.getByText('Current step info')).toBeVisible();

  await page.click('text=Play');
  await page.click('text=Pause');

  await page.click('text=Hold for reference');

  // Step 6.1.: Inside view
  await page.click('text=Inside view');

  await page.click('text=Make a guess!');

  // Step 6.1.: Outside view
  await page.click('text=Outside view');

  await page.click('text=Make a guess!');

  // Step 6.1.: Combined view
  await page.click('text=Combined view');

  await page.click('text=Make a guess!');
});
