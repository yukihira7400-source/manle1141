import React from 'react';
import RadarChart from './RadarChart';

export const LEVEL_DESCRIPTIONS = {
  0: "Chưa yêu cầu / Không có",
  1: "Cơ bản (Hiểu lý thuyết, biết khái niệm)",
  2: "Áp dụng có hướng dẫn (Thực hiện được công việc cơ bản khi có người kèm cặp)",
  3: "Độc lập thành thạo (Tự chủ làm việc độc lập trong điều kiện tiêu chuẩn)",
  4: "Chuyên sâu/hướng dẫn người khác (Giải quyết việc khó, đào tạo được đồng nghiệp)",
  5: "Chuyên gia/định hình chuẩn mực (Nghiên cứu sâu, thiết lập quy trình/tiêu chuẩn mới)"
};

export default function CompetencyProfile({
  employee,
  positions,
  competencies,
  weights,
  targetPositionId
}) {
  const currentPosition = positions.find(p => p.id === employee.positionId);
  const targetPosition = positions.find(p => p.id === targetPositionId);

  // Group competencies
  const groupedCompetencies = {
    K: {
      name: "Knowledge (Kiến thức)",
      weight: weights.K,
      items: competencies.filter(c => c.group === 'K')
    },
    S: {
      name: "Skills (Kỹ năng)",
      weight: weights.S,
      items: competencies.filter(c => c.group === 'S')
    },
    A: {
      name: "Attitude (Thái độ)",
      weight: weights.A,
      items: competencies.filter(c => c.group === 'A')
    }
  };

  const getCompetencyValue = (valuesArray, compId) => {
    const idx = competencies.findIndex(c => c.id === compId);
    return idx !== -1 ? valuesArray[idx] || 0 : 0;
  };

  return (
    <div className="competency-profile-screen">
      <div className="screen-header">
        <h2>Hồ sơ năng lực cá nhân</h2>
        <p className="screen-desc">
          Phân tích chi tiết hồ sơ năng lực của <strong>{employee.name}</strong> dựa trên khung năng lực ASK (Attitude - Skills - Knowledge).
        </p>
      </div>

      <div className="profile-layout-grid">
        {/* Left column: Radar Chart */}
        <div className="chart-card-wrapper">
          <div className="glass-card chart-card">
            <h3>Biểu đồ mạng nhện năng lực</h3>
            <RadarChart
              employee={employee}
              currentPosition={currentPosition}
              targetPosition={targetPosition}
              competencies={competencies}
            />
          </div>
        </div>

        {/* Right column: Detailed Competency List */}
        <div className="competency-details-wrapper">
          {Object.entries(groupedCompetencies).map(([groupKey, group]) => (
            <div key={groupKey} className="glass-card competency-group-card">
              <div className="group-header">
                <h3>{group.name}</h3>
                <span className="group-weight-badge">Trọng số: {Math.round(group.weight * 100)}%</span>
              </div>

              <div className="table-responsive">
                <table className="competency-table">
                  <thead>
                    <tr>
                      <th style={{ width: '8%' }}>Mã</th>
                      <th style={{ width: '32%' }}>Năng lực</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Hiện tại</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Yêu cầu hiện tại</th>
                      {targetPosition && (
                        <th style={{ width: '12%', textAlign: 'center' }}>Yêu cầu mục tiêu</th>
                      )}
                      <th style={{ width: '24%' }}>Mức độ thành thạo hiện tại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map(comp => {
                      const curVal = getCompetencyValue(employee.current, comp.id);
                      const curReqVal = currentPosition ? getCompetencyValue(currentPosition.req, comp.id) : 0;
                      const tarReqVal = targetPosition ? getCompetencyValue(targetPosition.req, comp.id) : 0;

                      // Decide class for gap indicator
                      let gapClass = '';
                      if (targetPosition) {
                        if (curVal >= tarReqVal) gapClass = 'gap-met';
                        else if (tarReqVal - curVal === 1) gapClass = 'gap-upskill';
                        else gapClass = 'gap-reskill';
                      }

                      return (
                        <tr key={comp.id} className={gapClass}>
                          <td>
                            <span className={`comp-id-badge group-${groupKey}`}>
                              {comp.id}
                            </span>
                          </td>
                          <td>
                            <span className="comp-name">{comp.name}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="val-text cur">{curVal}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="val-text cur-req">{curReqVal}</span>
                          </td>
                          {targetPosition && (
                            <td style={{ textAlign: 'center' }}>
                              <span className="val-text tar-req">{tarReqVal}</span>
                            </td>
                          )}
                          <td>
                            <span className="level-desc-text">
                              {LEVEL_DESCRIPTIONS[curVal] || `Mức ${curVal}`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
