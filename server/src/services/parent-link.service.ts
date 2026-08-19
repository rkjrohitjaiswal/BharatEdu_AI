import { dataRepository } from '../repositories/data.repository.js';

export class ParentLinkService {
  public static async generateInvitationCode(
    studentId: string,
    relationship: 'father' | 'mother' | 'guardian' | 'other' = 'guardian'
  ): Promise<{ code: string; expiresAt: Date }> {
    // Generate a secure 6-character uppercase alphanumeric code
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `LINK-${randomChars}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

    await dataRepository.createParentInvitation({
      studentId,
      code,
      relationship,
      expiresAt,
    });

    return { code, expiresAt };
  }

  public static async acceptInvitationCode(
    parentId: string,
    code: string
  ): Promise<{ success: boolean; message: string; link?: any }> {
    const invitation = await dataRepository.getParentInvitationByCode(code);

    if (!invitation) {
      return { success: false, message: 'Invalid invitation code.' };
    }

    if (invitation.status === 'revoked') {
      return { success: false, message: 'This invitation code has been revoked.' };
    }

    if (invitation.status === 'active') {
      return { success: false, message: 'This invitation code has already been used.' };
    }

    if (new Date(invitation.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'This invitation code has expired.' };
    }

    // Activate link & link student to parent
    const link = await dataRepository.activateParentStudentLink({
      parentId,
      studentId: invitation.studentId,
      relationship: invitation.relationship || 'guardian',
      code,
    });

    return {
      success: true,
      message: 'Student successfully linked to parent account.',
      link,
    };
  }

  public static async getStudentInvitations(studentId: string): Promise<any[]> {
    return await dataRepository.getStudentInvitations(studentId);
  }

  public static async revokeInvitationCode(studentId: string, code: string): Promise<boolean> {
    return await dataRepository.revokeParentInvitation(studentId, code);
  }
}
