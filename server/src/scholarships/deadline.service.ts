export type DeadlineStatus = 'open' | 'closing_soon' | 'urgent' | 'closed' | 'rolling' | 'unknown';
export type AlertPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertType = 'urgent_deadline' | 'closing_soon' | 'deadline_today' | 'new_match' | 'saved_deadline';

export interface DeadlineCalculationResult {
  daysRemaining: number | null;
  deadlineStatus: DeadlineStatus;
  alertPriority: AlertPriority;
  alertType: AlertType;
  deadlineFormatted: string;
  isVerified: boolean;
  officialSourceUrl: string;
}

export const DeadlineService = {
  calculateDeadlineInfo(scholarship: any, today: Date = new Date()): DeadlineCalculationResult {
    const isVerified = scholarship.deadlineVerified !== false;
    const officialSourceUrl = scholarship.deadlineSourceUrl || scholarship.applicationUrl || 'https://scholarships.gov.in';

    if (scholarship.deadlineType === 'rolling') {
      return {
        daysRemaining: null,
        deadlineStatus: 'rolling',
        alertPriority: 'LOW',
        alertType: 'new_match',
        deadlineFormatted: 'Rolling Application',
        isVerified,
        officialSourceUrl,
      };
    }

    if (scholarship.deadlineType === 'unknown' || !scholarship.deadline || !isVerified) {
      return {
        daysRemaining: null,
        deadlineStatus: 'unknown',
        alertPriority: 'LOW',
        alertType: 'new_match',
        deadlineFormatted: 'Deadline not verified',
        isVerified: false,
        officialSourceUrl,
      };
    }

    const deadlineDate = new Date(scholarship.deadline);
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const deadlineZero = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());

    const diffTime = deadlineZero.getTime() - todayZero.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let deadlineStatus: DeadlineStatus = 'open';
    let alertPriority: AlertPriority = 'LOW';
    let alertType: AlertType = 'new_match';

    if (daysRemaining < 0) {
      deadlineStatus = 'closed';
      alertPriority = 'LOW';
      alertType = 'closing_soon';
    } else if (daysRemaining === 0) {
      deadlineStatus = 'urgent';
      alertPriority = 'URGENT';
      alertType = 'deadline_today';
    } else if (daysRemaining >= 1 && daysRemaining <= 3) {
      deadlineStatus = 'urgent';
      alertPriority = 'URGENT';
      alertType = 'urgent_deadline';
    } else if (daysRemaining >= 4 && daysRemaining <= 7) {
      deadlineStatus = 'urgent';
      alertPriority = 'HIGH';
      alertType = 'urgent_deadline';
    } else if (daysRemaining >= 8 && daysRemaining <= 30) {
      deadlineStatus = 'closing_soon';
      alertPriority = 'MEDIUM';
      alertType = 'closing_soon';
    } else {
      deadlineStatus = 'open';
      alertPriority = 'LOW';
      alertType = 'new_match';
    }

    return {
      daysRemaining,
      deadlineStatus,
      alertPriority,
      alertType,
      deadlineFormatted: deadlineDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      isVerified,
      officialSourceUrl,
    };
  },
};
