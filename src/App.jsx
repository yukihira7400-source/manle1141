import React, { useState, useEffect } from 'react';
import { SEED_DATA } from './constants';
import { calculateMatch, getReadinessStatus } from './utils';

// Import components
import CareerMap from './components/CareerMap';
import CompetencyProfile from './components/CompetencyProfile';
import CareerComparison from './components/CareerComparison';
import DevelopmentPlan from './components/DevelopmentPlan';
import AdminDashboard from './components/AdminDashboard';
import AIReport from './components/AIReport';
import TeamPlan from './components/TeamPlan';

export default function App() {
  // --- State Initialization ---
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('cc_employees');
    const base = SEED_DATA.employees;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(emp => {
          const seedEmp = base.find(b => b.id === emp.id);
          return seedEmp ? { ...emp, name: seedEmp.name } : emp;
        });
      } catch (e) {
        return base;
      }
    }
    return base;
  });

  const [positions, setPositions] = useState(() => {
    const saved = localStorage.getItem('cc_positions');
    return saved ? JSON.parse(saved) : SEED_DATA.positions;
  });

  const [weights, setWeights] = useState(() => {
    const saved = localStorage.getItem('cc_weights');
    return saved ? JSON.parse(saved) : SEED_DATA.weights;
  });

  const [activeEmpId, setActiveEmpId] = useState(() => {
    const saved = localStorage.getItem('cc_active_emp_id');
    if (!saved) return 'E01';
    try {
      return JSON.parse(saved);
    } catch (e) {
      return saved;
    }
  });

  // Target positions map: { [employeeId]: positionId }
  const [targetPositions, setTargetPositions] = useState(() => {
    const saved = localStorage.getItem('cc_target_positions');
    return saved ? JSON.parse(saved) : { 'E01': 'OPS-03' }; // Pre-seed Mai with OPS-03
  });

  // Completed actions/gaps map: { [employeeId]: { [competencyId]: boolean } }
  const [completedGaps, setCompletedGaps] = useState(() => {
    const saved = localStorage.getItem('cc_completed_gaps');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState('map'); // 'map', 'profile', 'compare', 'idp', 'admin', 'ai'

  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('cc_gemini_api_key') || '';
  });

  // --- Effects to sync with LocalStorage ---
  useEffect(() => {
    localStorage.setItem('cc_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('cc_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('cc_weights', JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem('cc_active_emp_id', JSON.stringify(activeEmpId));
  }, [activeEmpId]);

  useEffect(() => {
    localStorage.setItem('cc_target_positions', JSON.stringify(targetPositions));
  }, [targetPositions]);

  useEffect(() => {
    localStorage.setItem('cc_completed_gaps', JSON.stringify(completedGaps));
  }, [completedGaps]);

  useEffect(() => {
    localStorage.setItem('cc_gemini_api_key', geminiApiKey);
  }, [geminiApiKey]);

  // --- Handlers ---
  const activeEmployee = employees.find(e => e.id === activeEmpId) || employees[0];
  const activeTargetPosId = targetPositions[activeEmpId] || '';
  const activeTargetPos = positions.find(p => p.id === activeTargetPosId) || null;
  const activeEmpCompleted = completedGaps[activeEmpId] || {};

  const handleSetTargetPosition = (posId) => {
    setTargetPositions(prev => ({
      ...prev,
      [activeEmpId]: posId
    }));
    setActiveTab('idp'); // Automatically jump to IDP screen when target is set
  };

  const handleToggleAction = (compId) => {
    setCompletedGaps(prev => {
      const empCompleted = prev[activeEmpId] || {};
      return {
        ...prev,
        [activeEmpId]: {
          ...empCompleted,
          [compId]: !empCompleted[compId]
        }
      };
    });
  };

  const handleUpdateWeights = (newWeights) => {
    setWeights(newWeights);
  };

  const handleUpdatePositionReq = (posId, compIdx, val) => {
    setPositions(prev => prev.map(pos => {
      if (pos.id === posId) {
        const newReq = [...pos.req];
        newReq[compIdx] = val;
        return { ...pos, req: newReq };
      }
      return pos;
    }));
  };

  const handleUpdateEmployeeSkill = (empId, compIdx, val) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        const newCurrent = [...emp.current];
        newCurrent[compIdx] = val;
        return { ...emp, current: newCurrent };
      }
      return emp;
    }));
  };

  const handleResetToDefault = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ cấu hình và dữ liệu đánh giá về trạng thái mặc định ban đầu không?")) {
      localStorage.clear();
      setEmployees(SEED_DATA.employees);
      setPositions(SEED_DATA.positions);
      setWeights(SEED_DATA.weights);
      setActiveEmpId('E01');
      setTargetPositions({ 'E01': 'OPS-03' });
      setCompletedGaps({});
      setGeminiApiKey('');
      setActiveTab('map');
      // Clear reports cache
      localStorage.removeItem('cc_ai_reports_cache');
    }
  };

  // Helper to handle navigation triggered inside child components
  const handleSelectPositionFromMap = (posId) => {
    const isCurrent = activeEmployee.positionId === posId;
    if (isCurrent) {
      setActiveTab('profile');
    } else {
      // Set as active comparison target
      // Find position, calculate details
      handleSetTargetPosition(posId);
    }
  };

  const handleNavigateToTab = (tab) => {
    setActiveTab(tab);
  };

  // Summary metadata for active employee
  const currentPos = positions.find(p => p.id === activeEmployee.positionId);
  const currentMatchDetails = activeTargetPos 
    ? calculateMatch(activeEmployee, activeTargetPos, SEED_DATA.competencies, weights)
    : null;
  const currentReadiness = currentMatchDetails
    ? getReadinessStatus(currentMatchDetails.totalScore)
    : null;

  return (
    <div className="app-container">
      {/* Global Navigation Header */}
      <header className="global-header">
        <div className="header-brand" onClick={() => setActiveTab('map')}>
          <span className="brand-logo">🧭</span>
          <div className="brand-text">
            <h1>CareerCompass</h1>
            <span className="brand-subtitle">SME Career Path Builder</span>
          </div>
        </div>

        {/* Global Controls: Tabs & Switcher */}
        <div className="header-controls">
          <nav className="main-tabs-nav">
            <button
              onClick={() => setActiveTab('map')}
              className={`tab-link ${activeTab === 'map' ? 'active' : ''}`}
            >
              🗺️ Sơ đồ Lộ trình
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`tab-link ${activeTab === 'profile' ? 'active' : ''}`}
            >
              👤 Hồ sơ Năng lực
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`tab-link ${activeTab === 'compare' ? 'active' : ''}`}
            >
              ⚖️ Xếp hạng & So sánh
            </button>
            <button
              onClick={() => setActiveTab('idp')}
              className={`tab-link ${activeTab === 'idp' ? 'active' : ''}`}
            >
              📋 Kế hoạch IDP
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`tab-link ${activeTab === 'ai' ? 'active' : ''}`}
            >
              🤖 Báo cáo AI
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`tab-link ${activeTab === 'team' ? 'active' : ''}`}
            >
              👥 Kế hoạch Đội nhóm
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`tab-link ${activeTab === 'admin' ? 'active' : ''}`}
            >
              🛡️ Quản trị Admin
            </button>
          </nav>

          <div className="employee-switcher">
            <label htmlFor="global-emp-select">Đang xem:</label>
            <select
              id="global-emp-select"
              value={activeEmpId}
              onChange={(e) => setActiveEmpId(e.target.value)}
              className="global-select-control"
            >
              {employees.map(emp => {
                const empPos = positions.find(p => p.id === emp.positionId);
                return (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({empPos?.name || emp.positionId})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </header>

      {/* Global Mini Info Bar */}
      <div className="mini-info-bar">
        <div className="info-item">
          <span className="label">Nhân viên:</span>
          <strong>{activeEmployee.name}</strong>
        </div>
        <div className="info-item">
          <span className="label">Vị trí hiện tại:</span>
          <strong>{currentPos?.name} ({currentPos?.id})</strong>
        </div>
        {activeTargetPos ? (
          <div className="info-item target-highlight">
            <span className="label">Mục tiêu:</span>
            <strong>{activeTargetPos.name} ({activeTargetPos.id})</strong>
            <span className="match-pill" style={{ backgroundColor: currentReadiness.colorCode }}>
              {currentMatchDetails.totalScore}% Match
            </span>
          </div>
        ) : (
          <div className="info-item target-none" onClick={() => setActiveTab('compare')}>
            <span>⚠️ Chưa chọn vị trí mục tiêu. Click để chọn</span>
          </div>
        )}
      </div>

      {/* Main Tab Screen Area */}
      <main className="main-content-area">
        {activeTab === 'map' && (
          <CareerMap
            employee={activeEmployee}
            positions={positions}
            competencies={SEED_DATA.competencies}
            weights={weights}
            targetPositionId={activeTargetPosId}
            onSelectPosition={handleSelectPositionFromMap}
          />
        )}

        {activeTab === 'profile' && (
          <CompetencyProfile
            employee={activeEmployee}
            positions={positions}
            competencies={SEED_DATA.competencies}
            weights={weights}
            targetPositionId={activeTargetPosId}
          />
        )}

        {activeTab === 'compare' && (
          <CareerComparison
            employee={activeEmployee}
            positions={positions}
            competencies={SEED_DATA.competencies}
            weights={weights}
            targetPositionId={activeTargetPosId}
            onSetTargetPosition={handleSetTargetPosition}
            onViewDetails={(posId) => {
              // Quick view: Set target position in memory first, then jump to profile tab
              setTargetPositions(prev => ({ ...prev, [activeEmpId]: posId }));
              setActiveTab('profile');
            }}
          />
        )}

        {activeTab === 'idp' && (
          <DevelopmentPlan
            employee={activeEmployee}
            targetPosition={activeTargetPos}
            competencies={SEED_DATA.competencies}
            completedGaps={activeEmpCompleted}
            onToggleAction={handleToggleAction}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            employees={employees}
            positions={positions}
            competencies={SEED_DATA.competencies}
            weights={weights}
            onUpdateWeights={handleUpdateWeights}
            onUpdatePositionReq={handleUpdatePositionReq}
            onUpdateEmployeeSkill={handleUpdateEmployeeSkill}
            onResetToDefault={handleResetToDefault}
          />
        )}

        {activeTab === 'ai' && (
          <AIReport
            employee={activeEmployee}
            positions={positions}
            competencies={SEED_DATA.competencies}
            weights={weights}
            targetPositionId={activeTargetPosId}
            apiKey={geminiApiKey}
            onSaveApiKey={setGeminiApiKey}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {activeTab === 'team' && (
          <TeamPlan
            employee={activeEmployee}
            onNavigateToTab={handleNavigateToTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="global-footer">
        <p>&copy; 2026 CareerCompass. Phát triển trên Google Antigravity cho SME Việt Nam.</p>
      </footer>
    </div>
  );
}
