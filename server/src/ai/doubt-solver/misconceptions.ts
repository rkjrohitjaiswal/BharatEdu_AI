export function detectMisconceptionInDoubt(
  question: string,
  topicId: string
): string | null {
  const q = question.toLowerCase();
  if (q.includes('divide by zero') || q.includes('infinity')) {
    return 'formula_confusion';
  }
  if (q.includes('negative sign') || q.includes('minus minus')) {
    return 'calculation_error';
  }
  return null;
}
