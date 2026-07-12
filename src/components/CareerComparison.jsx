import React, { useState } from 'react';
import { calculateMatch, getReadinessStatus } from '../utils';

export default function CareerComparison({
  employee,
  positions,
  competencies,
  weights,
  targetPositionId,
  onSetTargetPosition,
  onViewDetails
}) {
  const [deptFilter, setDeptFilter] = useState('All');
  const [moveFilter, setMoveFilter] = useState('All');

  const currentPosition = positions.find(p => p.id === employee.positionId);

  // Helper to determine movement type
  const getMovementType = (pos) => {
    if (pos.id === currentPosition.id) return { label: "Hiện tại", class: "move-current" };
    if (pos.dept === currentPosition.dept && pos.level > currentPosition.level) {
      return { label: "Dọc (Thăng tiến)", class: "move-vertical" };
    }
    return { label: "Ngang (Chuyển nhánh)", class: "move-horizontal" };
  };

  // Process all positions with their match calculations
  const rankedPositions = positions
    .map(pos => {
      const matchDetails = calculateMatch(employee, pos, competencies, weights);
      const movement = getMovementType(pos);
      return {
        ...pos,
        match: matchDetails,
        movement
      };
    })
    // Sort by match percentage descending, then level descending
    .sort((a, b) => b.match.totalScore - a.match.totalScore || b.level - a.level);

  // Filter positions
  const filteredPositions = rankedPositions.filter(pos => {
    const passDept = deptFilter === 'All' || pos.dept === deptFilter;
    const passMove = moveFilter === 'All' || 
      (moveFilter === 'Vertical' && pos.movement.label.includes('Dọc')) ||
      (moveFilter === 'Horizontal' && pos.movement.label.includes('Ngang'));
    return passDept && passMove;
  });

  // Extract unique departments for filter dropdown
  const uniqueDepts = Array.from(new Set(positions.map(p => p.dept)));

  return (
    <div className="career-comparison-screen">
      <div className="screen-header">
        <h2>So sánh & Lựa chọn mục tiêu</h2>
        <p className="screen-desc">
          Bảng xếp hạng mức độ tương thích năng lực của <strong>{employee.name}</strong> với các vị trí trong doanh nghiệp. Hãy chọn một vị trí làm mục tiêu nghề nghiệp để thiết lập Kế hoạch phát triển cá nhân (IDP).
        </p>
      </div>

      {/* Filter bar */}
      <div className="filters-bar glass-card">
        <div className="filter-group">
          <label htmlFor="dept-select">Phòng ban:</label>
          <select
            id="dept-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="filter-control"
          >
            <option value="All">Tất cả phòng ban</option>
            {uniqueDepts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="move-select">Hướng phát triển:</label>
          <select
            id="move-select"
            value={moveFilter}
            onChange={(e) => setMoveFilter(e.target.value)}
            className="filter-control"
          >
            <option value="All">Tất cả hướng đi</option>
            <option value="Vertical">Thăng tiến dọc (Cùng phòng ban)</option>
            <option value="Horizontal">Dịch chuyển ngang (Chuyển đổi phòng ban)</option>
          </select>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="glass-card table-card">
        <div className="table-responsive">
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: '6%', textAlign: 'center' }}>Hạng</th>
                <th style={{ width: '10%' }}>Mã vị trí</th>
                <th style={{ width: '22%' }}>Tên vị trí</th>
                <th style={{ width: '15%' }}>Phòng ban</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Loại dịch chuyển</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Tỉ lệ khớp (K / S / A)</th>
                <th style={{ width: '13%', textAlign: 'center' }}>Mức sẵn sàng</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPositions.map((pos, index) => {
                const isCurrent = pos.id === employee.positionId;
                const isTarget = pos.id === targetPositionId;
                const readiness = getReadinessStatus(pos.match.totalScore);

                return (
                  <tr key={pos.id} className={`${isCurrent ? 'row-current' : ''} ${isTarget ? 'row-target' : ''}`}>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {index + 1}
                    </td>
                    <td><span className="pos-code-badge">{pos.id}</span></td>
                    <td>
                      <div className="pos-name-cell">
                        <span className="name">{pos.name}</span>
                        {isCurrent && <span className="lbl-current">Vị trí hiện tại</span>}
                        {isTarget && <span className="lbl-target">Mục tiêu</span>}
                      </div>
                    </td>
                    <td>{pos.dept}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`move-badge ${pos.movement.class}`}>
                        {pos.movement.label}
                      </span>
                    </td>
                    <td>
                      <div className="match-percent-cell">
                        <strong className="total-match-pct" style={{ color: readiness.colorCode }}>
                          {pos.match.totalScore}%
                        </strong>
                        <span className="breakdown-pct">
                          (K: {pos.match.kScore}% | S: {pos.match.sScore}% | A: {pos.match.aScore}%)
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {isCurrent ? (
                        <span className="readiness-current-txt">—</span>
                      ) : (
                        <div className="readiness-status-cell">
                          <span
                            className={`status-pill ${readiness.colorClass}`}
                            style={{ backgroundColor: readiness.colorCode }}
                          >
                            {readiness.label}
                          </span>
                          <span className="timeframe-text">{readiness.timeframe}</span>
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {isCurrent ? (
                        <span className="action-txt-muted">Đang giữ</span>
                      ) : isTarget ? (
                        <div className="action-buttons-group">
                          <button
                            onClick={() => onViewDetails(pos.id)}
                            className="btn-action btn-secondary btn-sm"
                            title="Xem chi tiết năng lực"
                          >
                            Xem hồ sơ
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons-group">
                          <button
                            onClick={() => onSetTargetPosition(pos.id)}
                            className="btn-action btn-primary btn-sm"
                          >
                            Chọn mục tiêu
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
