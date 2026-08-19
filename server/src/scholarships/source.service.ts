export class ScholarshipSourceService {
  public static verifyScholarshipStatus(scholarship: any): {
    status: 'active' | 'closed' | 'expired';
    verificationStatus: 'verified' | 'needs_review' | 'expired';
    isExpired: boolean;
    daysRemaining: number | null;
  } {
    if (!scholarship.deadline) {
      return {
        status: 'active',
        verificationStatus: 'verified',
        isExpired: false,
        daysRemaining: null,
      };
    }

    const deadlineTime = new Date(scholarship.deadline).getTime();
    const now = Date.now();
    const diffMs = deadlineTime - now;
    const isExpired = diffMs < 0;
    const daysRemaining = isExpired ? 0 : Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      status: isExpired ? 'expired' : 'active',
      verificationStatus: isExpired ? 'expired' : 'verified',
      isExpired,
      daysRemaining,
    };
  }
}
