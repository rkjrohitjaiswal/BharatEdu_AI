import { EvaluatedCriterion, StudentScholarshipProfilePayload } from './types.js';

export class ScholarshipCriteriaEngine {
  public static evaluateCriteria(
    profile: StudentScholarshipProfilePayload,
    scholarship: any
  ): EvaluatedCriterion[] {
    const results: EvaluatedCriterion[] = [];

    // 1. Class Level Criterion
    const studentClass = profile.classLevel || 8;
    const schLevels = scholarship.educationLevels || ['Class 8', 'Class 9', 'Class 10'];
    const matchesClass = schLevels.some((l: string) => l.includes(String(studentClass)) || l.includes('Elementary') || l.includes('All'));

    results.push({
      criterionType: 'class_level',
      description: `Class Level: Required ${schLevels.join(', ')}`,
      status: matchesClass ? 'matched' : 'unmet',
      reason: matchesClass
        ? `Student is in Class ${studentClass}, satisfying grade eligibility.`
        : `Student Class ${studentClass} does not match required ${schLevels.join(', ')}.`,
    });

    // 2. Location / State Criterion
    const studentState = (profile.state || 'All India').trim().toLowerCase();
    const schLocations = (scholarship.locations || ['All India']).map((loc: string) => loc.trim().toLowerCase());
    const matchesLocation = schLocations.includes('all india') || schLocations.includes(studentState);

    results.push({
      criterionType: 'location',
      description: `Location Eligibility: Required ${scholarship.locations?.join(', ') || 'All India'}`,
      status: matchesLocation ? 'matched' : 'unmet',
      reason: matchesLocation
        ? `Student location (${profile.state || 'All India'}) is eligible.`
        : `Student state (${profile.state}) is not listed in target locations.`,
    });

    // 3. Annual Family Income Ceiling Criterion
    const incomeCriteriaStr = scholarship.incomeCriteria || 'Annual income <= ₹3,50,000';
    if (typeof profile.annualFamilyIncome === 'number') {
      let incomeLimit = 350000;
      const match = incomeCriteriaStr.match(/\d[\d,.]*/);
      if (match) {
        incomeLimit = parseInt(match[0].replace(/,/g, ''), 10);
      }

      const matchesIncome = profile.annualFamilyIncome <= incomeLimit;
      results.push({
        criterionType: 'income_ceiling',
        description: `Income Limit: ${incomeCriteriaStr}`,
        status: matchesIncome ? 'matched' : 'unmet',
        reason: matchesIncome
          ? `Family annual income (₹${profile.annualFamilyIncome.toLocaleString('en-IN')}) is within ₹${incomeLimit.toLocaleString('en-IN')} limit.`
          : `Family annual income (₹${profile.annualFamilyIncome.toLocaleString('en-IN')}) exceeds limit of ₹${incomeLimit.toLocaleString('en-IN')}.`,
      });
    } else {
      results.push({
        criterionType: 'income_ceiling',
        description: `Income Limit: ${incomeCriteriaStr}`,
        status: 'unknown',
        reason: `Family annual income not provided in scholarship profile. Please verify.`,
      });
    }

    // 4. Category Criterion
    const schCategories = (scholarship.categoryCriteria || ['All Categories']).map((c: string) => c.toLowerCase());
    const studentCat = (profile.category || 'General').toLowerCase();
    const matchesCat = schCategories.includes('all categories') || schCategories.includes('all') || schCategories.includes(studentCat);

    results.push({
      criterionType: 'category',
      description: `Category Eligibility: Required ${scholarship.categoryCriteria?.join(', ') || 'All Categories'}`,
      status: matchesCat ? 'matched' : 'unmet',
      reason: matchesCat
        ? `Category (${profile.category || 'General'}) is eligible.`
        : `Category (${profile.category}) is not included in eligible categories.`,
    });

    // 5. Academic Percentage Criterion
    if (typeof profile.academicPercentage === 'number') {
      const minPercentage = 55; // Default NCERT state benchmark
      const matchesAcademic = profile.academicPercentage >= minPercentage;
      results.push({
        criterionType: 'academic_percentage',
        description: `Minimum Academic Marks: ${minPercentage}%`,
        status: matchesAcademic ? 'matched' : 'unmet',
        reason: matchesAcademic
          ? `Student score (${profile.academicPercentage}%) satisfies ${minPercentage}% threshold.`
          : `Student score (${profile.academicPercentage}%) is below required ${minPercentage}%.`,
      });
    } else {
      results.push({
        criterionType: 'academic_percentage',
        description: `Minimum Academic Marks: 55%`,
        status: 'unknown',
        reason: `Academic marks percentage not specified in profile. Please verify.`,
      });
    }

    return results;
  }
}
