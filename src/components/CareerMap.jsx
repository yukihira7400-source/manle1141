import React from 'react';
import { calculateMatch, getReadinessStatus } from '../utils';

export default function CareerMap({
  employee,
  positions,
  competencies,
  weights,
  targetPositionId,
  onSelectPosition
}) {
  const depts = ["Kinh doanh", "Marketing", "Vận hành & CSKH"];
  const levels = [4, 3, 2, 1];
  const levelNames = {
    4: "Trưởng phòng (L4)",
    3: "Trưởng nhóm (L3)",
    2: "Chuyên viên cấp cao (L2)",
    1: "Nhân viên (L1)"
  };

  // Find position by dept and level
  const getPositionByDeptAndLevel = (dept, level) => {
    return positions.find(pos => pos.dept === dept && pos.level === level);
  };

  return (
    <div className="career-map-screen">
      <div className="screen-header">
        <h2>Sơ đồ lộ trình nghề nghiệp (Career Map)</h2>
        <p className="screen-desc">
          Khám phá mạng lưới các vị trí công việc. Xem mức độ sẵn sàng và tỷ lệ tương thích năng lực hiện tại của bạn với các lộ trình thăng tiến dọc hoặc chuyển ngang.
        </p>
      </div>

      <div className="career-grid-wrapper">
        <div className="career-grid-header">
          <div className="empty-cell"></div>
          {depts.map(dept => (
            <div key={dept} className="dept-header-cell">
              <h3>{dept}</h3>
            </div>
          ))}
        </div>

        <div className="career-grid-body">
          {levels.map(level => (
            <div key={level} className="career-grid-row">
              {/* Level label on the left */}
              <div className="level-label-cell">
                <span>{levelNames[level]}</span>
              </div>

              {/* Department columns */}
              {depts.map(dept => {
                const pos = getPositionByDeptAndLevel(dept, level);
                if (!pos) return <div key={dept} className="grid-cell empty"></div>;

                const isCurrent = employee.positionId === pos.id;
                const isTarget = targetPositionId === pos.id;

                // Calculate match
                const { totalScore } = calculateMatch(employee, pos, competencies, weights);
                const readiness = getReadinessStatus(totalScore);

                return (
                  <div
                    key={dept}
                    className={`grid-cell position-card-wrapper ${isCurrent ? 'current' : ''} ${isTarget ? 'target' : ''}`}
                    onClick={() => onSelectPosition(pos.id)}
                  >
                    <div className="position-card">
                      <div className="card-top">
                        <span className="pos-code">{pos.id}</span>
                        {isCurrent && <span className="badge-current">Hiện tại</span>}
                        {isTarget && <span className="badge-target">Mục tiêu</span>}
                      </div>

                      <h4 className="pos-name">{pos.name}</h4>

                      {!isCurrent && (
                        <div className="card-match-info">
                          <div className="match-bar-bg">
                            <div
                              className="match-bar-fill"
                              style={{
                                width: `${totalScore}%`,
                                backgroundColor: readiness.colorCode
                              }}
                            ></div>
                          </div>
                          
                          <div className="match-text-row">
                            <span className="match-pct" style={{ color: readiness.colorCode }}>
                              {totalScore}% tương thích
                            </span>
                            <span
                              className={`readiness-badge ${readiness.colorClass}`}
                              style={{ borderColor: readiness.colorCode, color: readiness.colorCode }}
                            >
                              {readiness.label}
                            </span>
                          </div>
                        </div>
                      )}

                      {isCurrent && (
                        <div className="card-current-placeholder">
                          <span>Đang giữ vị trí</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="map-legend">
        <h4>Chú thích Mức sẵn sàng (Chuẩn bị gợi ý):</h4>
        <div className="legend-badges-row">
          <div className="legend-badge-item">
            <span className="color-dot ready"></span>
            <span>Sẵn sàng (≥ 85%): 0–6 tháng</span>
          </div>
          <div className="legend-badge-item">
            <span className="color-dot near"></span>
            <span>Gần sẵn sàng (70–84%): 6–12 tháng</span>
          </div>
          <div className="legend-badge-item">
            <span className="color-dot medium"></span>
            <span>Trung hạn (50–69%): 12–24 tháng</span>
          </div>
          <div className="legend-badge-item">
            <span className="color-dot long"></span>
            <span>Dài hạn (&lt; 50%): &gt; 24 tháng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
