export class StatisticsEngine {
  static calculateStats(values: number[]): {
    sampleSize: number;
    mean: number;
    median: number;
    improvementRatePct: number;
    confidenceLevel: string;
  } {
    const sampleSize = values.length;
    if (sampleSize === 0) {
      return { sampleSize: 0, mean: 0, median: 0, improvementRatePct: 0, confidenceLevel: 'Insufficient evidence' };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const mean = Math.round((sum / sampleSize) * 10) / 10;
    const median = sorted[Math.floor(sampleSize / 2)];
    const positiveCount = sorted.filter((v) => v > 0).length;
    const improvementRatePct = Math.round((positiveCount / sampleSize) * 100);

    let confidenceLevel = 'High confidence';
    if (sampleSize < 3) confidenceLevel = 'Insufficient evidence';
    else if (sampleSize < 10) confidenceLevel = 'Moderate evidence';

    return {
      sampleSize,
      mean,
      median,
      improvementRatePct,
      confidenceLevel,
    };
  }
}
