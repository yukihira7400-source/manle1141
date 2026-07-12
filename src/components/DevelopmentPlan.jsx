import React from 'react';
import { getCompetencyGaps, getReadinessStatus } from '../utils';

export default function DevelopmentPlan({
  employee,
  targetPosition,
  competencies,
  completedGaps,
  onToggleAction,
  onNavigateToTab
}) {
  if (!targetPosition) {
    return (
      <div className="idp-screen-empty glass-card">
        <div className="empty-state-content">
          <span className="empty-icon">🧭</span>
          <h3>Chưa có Vị trí mục tiêu</h3>
          <p>
            Bạn cần chọn một vị trí mục tiêu để xây dựng Kế hoạch phát triển cá nhân (IDP). Hệ thống sẽ phân tích các khoảng lệch năng lực (gap) và tự động sinh lộ trình học tập cho bạn.
          </p>
          <div className="empty-actions">
            <button
              onClick={() => onNavigateToTab('map')}
              className="btn-action btn-primary"
            >
              Xem Career Map
            </button>
            <button
              onClick={() => onNavigateToTab('compare')}
              className="btn-action btn-secondary"
            >
              Xếp hạng năng lực
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gaps = getCompetencyGaps(employee, targetPosition, competencies);
  const totalGapsCount = gaps.length;

  // Calculate completed gaps count
  const completedGapsCount = gaps.filter(gap => completedGaps[gap.id]).length;
  const progressPercent = totalGapsCount > 0 
    ? Math.round((completedGapsCount / totalGapsCount) * 100) 
    : 100;

  // Count reskill vs upskill
  const reskillCount = gaps.filter(g => g.type === 'Reskill').length;
  const upskillCount = gaps.filter(g => g.type === 'Upskill').length;

  return (
    <div className="idp-screen">
      <div className="screen-header">
        <h2>Kế hoạch phát triển cá nhân (IDP)</h2>
        <p className="screen-desc">
          Bản kế hoạch hành động chi tiết giúp <strong>{employee.name}</strong> thu hẹp các khoảng cách năng lực để hướng tới vị trí mục tiêu <strong>{targetPosition.name}</strong>.
        </p>
      </div>

      {/* Overview stats */}
      <div className="idp-stats-grid">
        <div className="glass-card stat-box">
          <span className="stat-lbl">Vị trí mục tiêu</span>
          <span className="stat-val-text">{targetPosition.name} ({targetPosition.id})</span>
          <span className="stat-subtext">Cấp bậc: Level {targetPosition.level} | {targetPosition.dept}</span>
        </div>

        <div className="glass-card stat-box">
          <span className="stat-lbl">Tổng khoảng trống năng lực</span>
          <span className="stat-val">{totalGapsCount}</span>
          <span className="stat-subtext">
            <span className="badge-danger-sm">{reskillCount} Reskill</span>
            <span className="badge-warning-sm">{upskillCount} Upskill</span>
          </span>
        </div>

        <div className="glass-card stat-box progress-box">
          <div className="progress-header">
            <span className="stat-lbl">Tiến độ hoàn thành IDP</span>
            <span className="progress-num">{progressPercent}%</span>
          </div>
          <div className="progress-bar-large">
            <div
              className="progress-bar-large-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="stat-subtext">
            Đã hoàn thành {completedGapsCount} / {totalGapsCount} hành động
          </span>
        </div>
      </div>

      {/* Gap list */}
      <div className="idp-gaps-section">
        <div className="section-title-row">
          <h3>Chi tiết hành động thu hẹp khoảng cách ({totalGapsCount} Gap)</h3>
          <span className="title-desc-muted">
            Tập trung giải quyết các năng lực loại <strong>Reskill</strong> trước vì đòi hỏi thời gian đào tạo dài hơn.
          </span>
        </div>

        {totalGapsCount === 0 ? (
          <div className="glass-card all-met-card">
            <span className="success-large-icon">🎉</span>
            <h4>Chúc mừng! Bạn đã hoàn toàn đáp ứng đủ năng lực yêu cầu</h4>
            <p>Không có khoảng cách năng lực nào so với vị trí {targetPosition.name}. Bạn đã sẵn sàng để ứng tuyển hoặc thăng tiến!</p>
          </div>
        ) : (
          <div className="gaps-list-container">
            {gaps.map((gap) => {
              const isDone = !!completedGaps[gap.id];

              return (
                <div
                  key={gap.id}
                  className={`glass-card gap-item-card ${gap.type.toLowerCase()} ${isDone ? 'completed' : ''}`}
                >
                  <div className="gap-card-checkbox-col">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => onToggleAction(gap.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  <div className="gap-card-info-col">
                    <div className="gap-header-row">
                      <div className="comp-info">
                        <span className={`comp-id-badge group-${gap.group}`}>
                          {gap.id}
                        </span>
                        <h4 className="comp-name">{gap.name}</h4>
                      </div>
                      
                      <div className="gap-badges">
                        <span className="gap-levels-badge">
                          Hiện tại: <strong>{gap.current}</strong> &rarr; Yêu cầu: <strong>{gap.required}</strong>
                        </span>
                        <span className={`gap-type-badge ${gap.type.toLowerCase()}`}>
                          {gap.type}
                        </span>
                      </div>
                    </div>

                    <div className="gap-actions-detail">
                      <div className="action-row specific">
                        <span className="action-label">Hành động đề xuất (Doanh nghiệp):</span>
                        <p className="action-desc">{gap.specificAction}</p>
                      </div>
                      <div className="action-row general">
                        <span className="action-label">Phương thức chung:</span>
                        <p className="action-desc">{gap.generalAction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
