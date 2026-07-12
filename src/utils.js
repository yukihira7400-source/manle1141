import { ACTION_RECOMMENDATIONS } from './constants.js';

/**
 * Calculates the matching scores for an employee against a position.
 * @param {Object} employee - The employee object.
 * @param {Object} position - The position object.
 * @param {Array} competencies - The lists of competency definitions.
 * @param {Object} weights - The weights object (e.g. { K: 0.35, S: 0.40, A: 0.25 }).
 * @returns {Object} - Detailed score results including group scores and total match.
 */
export function calculateMatch(employee, position, competencies, weights) {
  const K_competencies = competencies.filter(c => c.group === 'K').map(c => c.id);
  const S_competencies = competencies.filter(c => c.group === 'S').map(c => c.id);
  const A_competencies = competencies.filter(c => c.group === 'A').map(c => c.id);

  const competencyOrder = competencies.map(c => c.id);

  // Group scores calculation helper
  const getGroupScore = (compIds) => {
    let sumMin = 0;
    let sumReq = 0;

    compIds.forEach(id => {
      const idx = competencyOrder.indexOf(id);
      if (idx !== -1) {
        const reqVal = position.req[idx] || 0;
        const curVal = employee.current[idx] || 0;

        if (reqVal > 0) {
          sumMin += Math.min(curVal, reqVal);
          sumReq += reqVal;
        }
      }
    });

    return sumReq === 0 ? 1.0 : sumMin / sumReq;
  };

  const scoreK = getGroupScore(K_competencies);
  const scoreS = getGroupScore(S_competencies);
  const scoreA = getGroupScore(A_competencies);

  const totalK = weights.K !== undefined ? weights.K : 0.35;
  const totalS = weights.S !== undefined ? weights.S : 0.40;
  const totalA = weights.A !== undefined ? weights.A : 0.25;

  const totalScore = (totalK * scoreK) + (totalS * scoreS) + (totalA * scoreA);

  return {
    kScore: Math.round(scoreK * 100),
    sScore: Math.round(scoreS * 100),
    aScore: Math.round(scoreA * 100),
    totalScore: Math.round(totalScore * 100)
  };
}

/**
 * Gets readiness status name and color.
 * @param {number} matchPercent - The matching percentage (0-100).
 * @returns {Object} - Status metadata.
 */
export function getReadinessStatus(matchPercent) {
  if (matchPercent >= 85) {
    return {
      label: "Sẵn sàng",
      timeframe: "0–6 tháng",
      colorClass: "status-ready",
      colorCode: "#10B981" // green
    };
  } else if (matchPercent >= 70) {
    return {
      label: "Gần sẵn sàng",
      timeframe: "6–12 tháng",
      colorClass: "status-near",
      colorCode: "#F59E0B" // yellow/orange
    };
  } else if (matchPercent >= 50) {
    return {
      label: "Trung hạn",
      timeframe: "12–24 tháng",
      colorClass: "status-medium",
      colorCode: "#EF4444" // red/orange (using orange/coral)
    };
  } else {
    return {
      label: "Dài hạn",
      timeframe: "> 24 tháng",
      colorClass: "status-long",
      colorCode: "#6B7280" // gray
    };
  }
}

/**
 * Identifies competency gaps and details development actions.
 * @param {Object} employee - The employee object.
 * @param {Object} position - The target position object.
 * @param {Array} competencies - Competency list.
 * @returns {Array} - List of gap objects.
 */
export function getCompetencyGaps(employee, position, competencies) {
  const gaps = [];
  const competencyOrder = competencies.map(c => c.id);

  competencies.forEach((comp) => {
    const idx = competencyOrder.indexOf(comp.id);
    if (idx !== -1) {
      const curVal = employee.current[idx] || 0;
      const reqVal = position.req[idx] || 0;

      if (reqVal > curVal) {
        const gapVal = reqVal - curVal;
        const isReskill = curVal === 0 || gapVal >= 2;
        const type = isReskill ? 'Reskill' : 'Upskill';
        
        // Base actions recommendation
        const generalAction = isReskill 
          ? "Đào tạo lại bài bản / mentoring / luân chuyển tạm thời"
          : "Khóa học nâng cao / coaching / giao việc thử thách";

        // Specific action recommendation
        const specificAction = ACTION_RECOMMENDATIONS[comp.id]
          ? (isReskill ? ACTION_RECOMMENDATIONS[comp.id].reskill : ACTION_RECOMMENDATIONS[comp.id].upskill)
          : "";

        gaps.push({
          id: comp.id,
          name: comp.name,
          group: comp.group,
          current: curVal,
          required: reqVal,
          type,
          generalAction,
          specificAction
        });
      }
    }
  });

  return gaps;
}
