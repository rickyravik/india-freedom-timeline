import { test, expect } from '@playwright/test';

test('quiz answers every question and restart reshuffles', async ({ page }) => {
  await page.goto('/learn');
  const quiz = page.getByRole('region', { name: 'History quiz' });
  // Not `.font-display` alone: the "Score N" line above the question shares
  // that class, and picking it up instead of the question was a real bug
  // in an earlier ad hoc version of this check. `.text-h3` is unique to
  // the question text itself.
  const question = quiz.locator('p.text-h3');
  const options = quiz.locator('button:has(span.num)');

  const firstQuestion = await question.textContent();
  expect(firstQuestion).toBeTruthy();

  for (let i = 0; i < 8; i++) {
    await options.first().click();
    await quiz.getByRole('button', { name: /Next question|See result/ }).click();
  }
  await expect(quiz.getByText('Quiz complete')).toBeVisible();

  await quiz.getByRole('button', { name: 'Try again' }).click();
  await expect(question).toBeVisible();
  await expect(quiz.getByText('Question 1 of')).toBeVisible();
});
