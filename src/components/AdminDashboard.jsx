import React, { useState } from 'react';

export default function AdminDashboard({
  employees,
  positions,
  competencies,
  weights,
  onUpdateWeights,
  onUpdatePositionReq,
  onUpdateEmployeeSkill,
  onResetToDefault
}) {
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [activeTab, setActiveTab] = useState('weights'); // 'weights', 'matrix', 'employees'

  const activeEmployee = employees.find(e => e.id === selectedEmpId);

  // Proportional weight distribution slider logic
  const handleWeightChange = (group, percentageValue) => {
    const decimalValue = percentageValue / 100;
    const otherGroups = Object.keys(weights).filter(g => g !== group);
    const currentOthersSum = otherGroups.reduce((sum, g) => sum + weights[g], 0);

    const newWeights = { ...weights };
    newWeights[group] = decimalValue;

    const remainder = 1 - decimalValue;

    if (currentOthersSum > 0) {
      otherGroups.forEach(g => {
        newWeights[g] = (weights[g] / currentOthersSum) * remainder;
      });
    } else {
      otherGroups.forEach(g => {
        newWeights[g] = remainder / otherGroups.length;
      });
    }

    // Floating-point precision cleanup: make sure they add up to exactly 1.0
    const sum = Object.values(newWeights).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 0.0001) {
      // Adjust S or any other group slightly to make sure it is exactly 1
      newWeights[otherGroups[0]] += (1 - sum);
    }

    onUpdateWeights(newWeights);
  };

  return (
    <div className="admin-screen">
      <div className="screen-header">
        <h2>Bảng quản trị hệ thống (HR Admin)</h2>
        <p className="screen-desc">
          Thiết lập các tham số hệ thống: cấu hình trọng số năng lực, chuẩn hóa ma trận yêu cầu của từng vị trí, và cập nhật kết quả đánh giá năng lực của nhân viên.
        </p>
      </div>

      {/* Admin tabs */}
      <div className="admin-tabs-nav">
        <button
          onClick={() => setActiveTab('weights')}
          className={`admin-tab-btn ${activeTab === 'weights' ? 'active' : ''}`}
        >
          ⚙️ Cấu hình trọng số ASK
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`admin-tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
        >
          📊 Ma trận năng lực vị trí
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`admin-tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
        >
          👥 Đánh giá nhân viên
        </button>
      </div>

      {/* Tab Content 1: Weights configuration */}
      {activeTab === 'weights' && (
        <div className="admin-tab-content glass-card">
          <h3>Cấu hình trọng số nhóm năng lực ASK</h3>
          <p className="tab-desc-muted">
            Trọng số quyết định mức độ ảnh hưởng của nhóm Kiến thức (K), Kỹ năng (S), và Thái độ (A) đến điểm tương thích (% matching) tổng quát. 
            Khi kéo slider, hai trọng số còn lại sẽ tự động cân bằng sao cho tổng luôn bằng 100%.
          </p>

          <div className="weights-sliders-wrapper">
            {/* Knowledge Slider */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span className="group-title">Knowledge (Kiến thức)</span>
                <span className="group-pct-val">{Math.round(weights.K * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(weights.K * 100)}
                onChange={(e) => handleWeightChange('K', parseInt(e.target.value))}
                className="slider-control slider-k"
              />
            </div>

            {/* Skills Slider */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span className="group-title">Skills (Kỹ năng)</span>
                <span className="group-pct-val">{Math.round(weights.S * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(weights.S * 100)}
                onChange={(e) => handleWeightChange('S', parseInt(e.target.value))}
                className="slider-control slider-s"
              />
            </div>

            {/* Attitude Slider */}
            <div className="slider-item">
              <div className="slider-label-row">
                <span className="group-title">Attitude (Thái độ)</span>
                <span className="group-pct-val">{Math.round(weights.A * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(weights.A * 100)}
                onChange={(e) => handleWeightChange('A', parseInt(e.target.value))}
                className="slider-control slider-a"
              />
            </div>

            <div className="weights-sum-info">
              <span>Tổng trọng số: <strong>{Math.round((weights.K + weights.S + weights.A) * 100)}%</strong></span>
            </div>
          </div>

          <div className="admin-actions-row">
            <button
              onClick={onResetToDefault}
              className="btn-action btn-danger"
            >
              🔄 Khôi phục dữ liệu seed gốc
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 2: Position Matrix */}
      {activeTab === 'matrix' && (
        <div className="admin-tab-content glass-card">
          <h3>Ma trận yêu cầu năng lực theo Vị trí (Khung 1–5)</h3>
          <p className="tab-desc-muted">
            Nhập mức yêu cầu cho từng vị trí (0 = Không yêu cầu, 1 = Cơ bản, 5 = Chuyên gia). Thay đổi sẽ cập nhật realtime tỷ lệ tương thích.
          </p>

          <div className="table-responsive matrix-table-wrapper">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="sticky-col first" style={{ minWidth: '160px' }}>Vị trí / Năng lực</th>
                  {competencies.map(comp => (
                    <th key={comp.id} title={comp.name} style={{ textAlign: 'center', minWidth: '55px' }}>
                      {comp.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => (
                  <tr key={pos.id}>
                    <td className="sticky-col first">
                      <div className="matrix-pos-name">
                        <strong>{pos.id}</strong>
                        <span>{pos.name}</span>
                      </div>
                    </td>
                    {competencies.map((comp, compIdx) => {
                      const reqValue = pos.req[compIdx] || 0;
                      return (
                        <td key={comp.id} style={{ textAlign: 'center' }}>
                          <select
                            value={reqValue}
                            onChange={(e) => onUpdatePositionReq(pos.id, compIdx, parseInt(e.target.value))}
                            className="matrix-select-cell"
                          >
                            {[0, 1, 2, 3, 4, 5].map(v => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Employee Skill Assessment */}
      {activeTab === 'employees' && (
        <div className="admin-tab-content glass-card">
          <h3>Cập nhật kết quả Đánh giá năng lực</h3>
          <p className="tab-desc-muted">
            Chọn nhân viên và điều chỉnh mức độ thành thạo hiện tại của họ theo từng tiêu chí (Thang 1-5).
          </p>

          <div className="employee-select-row">
            <label htmlFor="admin-emp-select">Chọn nhân viên:</label>
            <select
              id="admin-emp-select"
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="filter-control select-emp"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
              ))}
            </select>
          </div>

          {activeEmployee && (
            <div className="employee-assessment-editor">
              <div className="assessment-emp-meta">
                <span>Vị trí hiện tại: <strong>{positions.find(p => p.id === activeEmployee.positionId)?.name}</strong></span>
                <span>Thâm niên: <strong>{activeEmployee.tenureYears} năm</strong></span>
              </div>

              <div className="table-responsive">
                <table className="assessment-edit-table">
                  <thead>
                    <tr>
                      <th style={{ width: '10%' }}>Mã</th>
                      <th style={{ width: '15%' }}>Nhóm</th>
                      <th style={{ width: '50%' }}>Tên năng lực</th>
                      <th style={{ width: '25%', textAlign: 'center' }}>Mức đánh giá hiện tại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competencies.map((comp, compIdx) => {
                      const curValue = activeEmployee.current[compIdx] || 0;
                      return (
                        <tr key={comp.id}>
                          <td><span className={`comp-id-badge group-${comp.group}`}>{comp.id}</span></td>
                          <td>
                            {comp.group === 'K' ? 'Knowledge' : comp.group === 'S' ? 'Skills' : 'Attitude'}
                          </td>
                          <td><strong>{comp.name}</strong></td>
                          <td style={{ textAlign: 'center' }}>
                            <select
                              value={curValue}
                              onChange={(e) => onUpdateEmployeeSkill(activeEmployee.id, compIdx, parseInt(e.target.value))}
                              className="matrix-select-cell size-large"
                            >
                              {[1, 2, 3, 4, 5].map(v => (
                                <option key={v} value={v}>Mức {v}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
