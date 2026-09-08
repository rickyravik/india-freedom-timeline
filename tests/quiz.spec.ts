import { test, expect } from '@playwright/test';

test('the quiz starts from a topic screen, explains every answer, and reviews what was missed', async ({ page }) => {
  await page.goto('/learn');
  const quiz = page.getByRole('region', { name: 'History quiz' });
  await expect(quiz.getByText(/no timer/i)).toBeVisible();
  await quiz.getByRole('button', { name: 'Events' }).click();
  await quiz.getByRole('button', { name: 'Start quiz' }).click();

  const question = quiz.locator('p.text-h3');
  await expect(question).toBeVisible();
  await expect(quiz.getByText('Question 1 of 5')).toBeVisible();
  const options = quiz.locator('button:has(span.num)');
  for (let i = 0; i < 5; i++) {
    await options.last().click(); // deliberately often wrong
    await expect(quiz.getByRole('region', { name: 'Explanation' })).toBeVisible();
    await quiz.getByRole('button', { name: /Next question|See review/ }).click();
  }
  await expect(quiz.getByRole('heading', { name: 'Review' })).toBeVisible();
  await expect(quiz.getByText(/of 5 answered correctly/)).toBeVisible();
  const missed = quiz.getByRole('list', { name: 'Questions to revisit' });
  if ((await missed.count()) > 0) {
    await expect(missed.getByRole('link').first()).toBeVisible();
    await quiz.getByRole('button', { name: 'Retry the ones I missed' }).click();
    await expect(quiz.getByText(/Question 1 of/)).toBeVisible();
  } else {
    await quiz.getByRole('button', { name: 'New set' }).click();
    await expect(quiz.getByText(/no timer/i)).toBeVisible();
  }
});
