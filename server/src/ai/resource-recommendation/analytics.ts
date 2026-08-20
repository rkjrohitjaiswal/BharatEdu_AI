export interface ResourceUsageStats {
  resourceId: string;
  views: number;
  starts: number;
  completions: number;
  completionRate: number; // %
  averageDurationSeconds: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulRate: number; // %
  dismisses: number;
  dismissRate: number; // %
}

export class ResourceAnalyticsEngine {
  static computeStats(resourceId: string, interactions: any[]): ResourceUsageStats {
    const resInteractions = interactions.filter((i) => i.resourceId === resourceId);

    const views = resInteractions.filter((i) => i.action === 'viewed').length;
    const starts = resInteractions.filter((i) => i.action === 'started').length;
    const completions = resInteractions.filter((i) => i.action === 'completed').length;
    const dismisses = resInteractions.filter((i) => i.action === 'skipped').length;

    const ratedHelpful = resInteractions.filter((i) => i.helpful === true).length;
    const ratedNotHelpful = resInteractions.filter((i) => i.helpful === false).length;
    const totalRated = ratedHelpful + ratedNotHelpful;

    const completionRate = starts > 0 ? Math.round((completions / starts) * 100) : 0;
    const helpfulRate = totalRated > 0 ? Math.round((ratedHelpful / totalRated) * 100) : 0;
    const dismissRate = views > 0 ? Math.round((dismisses / views) * 100) : 0;

    const durations = resInteractions.map((i) => i.durationSeconds || 0).filter((d) => d > 0);
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    return {
      resourceId,
      views,
      starts,
      completions,
      completionRate,
      averageDurationSeconds: avgDuration,
      helpfulCount: ratedHelpful,
      notHelpfulCount: ratedNotHelpful,
      helpfulRate,
      dismisses,
      dismissRate,
    };
  }
}
