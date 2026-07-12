import React, { useState } from 'react';

export default function RadarChart({ employee, currentPosition, targetPosition, competencies }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const size = 340;
  const center = size / 2;
  const radius = 110;
  const numPoints = competencies.length;

  // Calculate angles and coordinates
  const getCoordinates = (index, value) => {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const r = (value / 5) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getLabelCoordinates = (index, offset = 18) => {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const r = radius + offset;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate grid levels (1 to 5)
  const gridLevels = [1, 2, 3, 4, 5];
  const gridPoints = gridLevels.map(level => {
    return Array.from({ length: numPoints }, (_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x},${y}`;
    }).join(' ');
  });

  // Calculate polygons for paths
  const getPolygonPoints = (values) => {
    return Array.from({ length: numPoints }, (_, i) => {
      const val = values[i] || 0;
      const { x, y } = getCoordinates(i, val);
      return `${x},${y}`;
    }).join(' ');
  };

  const currentPoints = getPolygonPoints(employee.current);
  const currentPosReqPoints = currentPosition ? getPolygonPoints(currentPosition.req) : '';
  const targetPosReqPoints = targetPosition ? getPolygonPoints(targetPosition.req) : '';

  // Get exact values for tooltip
  const getHoveredDetails = () => {
    if (hoveredIdx === null) return null;
    const comp = competencies[hoveredIdx];
    const curVal = employee.current[hoveredIdx] || 0;
    const curReqVal = currentPosition ? currentPosition.req[hoveredIdx] || 0 : 0;
    const tarReqVal = targetPosition ? targetPosition.req[hoveredIdx] || 0 : 0;

    return {
      name: comp.name,
      id: comp.id,
      group: comp.group === 'K' ? 'Knowledge' : comp.group === 'S' ? 'Skills' : 'Attitude',
      current: curVal,
      currentReq: curReqVal,
      targetReq: tarReqVal,
    };
  };

  const hoveredDetails = getHoveredDetails();

  return (
    <div className="radar-chart-container">
      <div className="radar-chart-svg-wrapper">
        <svg viewBox={`0 0 ${size} ${size}`} className="radar-chart-svg">
          {/* Background grid concentric 15-gons */}
          {gridPoints.map((points, idx) => (
            <polygon
              key={`grid-${idx}`}
              points={points}
              className="radar-grid-poly"
              fill="none"
              stroke="var(--bg-card-border)"
              strokeWidth="0.8"
            />
          ))}

          {/* Grid Level Labels (1 to 5) on the top vertical axis */}
          {gridLevels.map((level) => {
            const angle = -Math.PI / 2;
            const r = (level / 5) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <text
                key={`grid-lbl-${level}`}
                x={x - 8}
                y={y + 4}
                className="radar-grid-level-lbl"
                fontSize="9"
                fill="var(--text-secondary)"
              >
                {level}
              </text>
            );
          })}

          {/* Axes lines and outer labels */}
          {competencies.map((comp, idx) => {
            const outerCoord = getCoordinates(idx, 5);
            const labelCoord = getLabelCoordinates(idx);
            
            // Adjust text anchor based on position
            const angleDeg = (idx * 360) / numPoints;
            let textAnchor = 'middle';
            if (angleDeg > 15 && angleDeg < 165) textAnchor = 'start';
            if (angleDeg > 195 && angleDeg < 345) textAnchor = 'end';

            return (
              <g key={`axis-${comp.id}`}>
                <line
                  x1={center}
                  y1={center}
                  x2={outerCoord.x}
                  y2={outerCoord.y}
                  className="radar-axis-line"
                  stroke="var(--bg-card-border)"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                />
                
                {/* Invisible thicker lines for hover interaction */}
                <line
                  x1={center}
                  y1={center}
                  x2={outerCoord.x}
                  y2={outerCoord.y}
                  stroke="transparent"
                  strokeWidth="10"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                <text
                  x={labelCoord.x}
                  y={labelCoord.y + 4}
                  className={`radar-label ${hoveredIdx === idx ? 'active' : ''}`}
                  textAnchor={textAnchor}
                  fontSize="10"
                  fontWeight={hoveredIdx === idx ? 'bold' : 'normal'}
                  fill={hoveredIdx === idx ? 'var(--color-primary)' : 'var(--text-secondary)'}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {comp.id}
                </text>
              </g>
            );
          })}

          {/* LAYER 2: Current Position Requirements (Orange dashed) */}
          {currentPosition && (
            <polygon
              points={currentPosReqPoints}
              fill="rgba(245, 158, 11, 0.05)"
              stroke="var(--color-warning)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              style={{ transition: 'all 0.4s ease' }}
            />
          )}

          {/* LAYER 3: Target Position Requirements (Green solid) */}
          {targetPosition && (
            <polygon
              points={targetPosReqPoints}
              fill="rgba(16, 185, 129, 0.06)"
              stroke="var(--color-success)"
              strokeWidth="2"
              style={{ transition: 'all 0.4s ease' }}
            />
          )}

          {/* LAYER 1: Employee Current Skills (Blue solid filled) */}
          <polygon
            points={currentPoints}
            fill="rgba(59, 130, 246, 0.25)"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            style={{ transition: 'all 0.4s ease' }}
          />

          {/* Vertex dots for Employee Current Skills */}
          {competencies.map((comp, idx) => {
            const val = employee.current[idx] || 0;
            const coord = getCoordinates(idx, val);
            return (
              <circle
                key={`dot-${comp.id}`}
                cx={coord.x}
                cy={coord.y}
                r={hoveredIdx === idx ? 5 : 3.5}
                fill="var(--color-primary)"
                stroke="var(--bg-card)"
                strokeWidth="1.5"
                style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="radar-legend">
          <div className="legend-item">
            <span className="legend-dot current-skills"></span>
            <span className="legend-text">Năng lực hiện tại</span>
          </div>
          {currentPosition && (
            <div className="legend-item">
              <span className="legend-dot current-reqs"></span>
              <span className="legend-text">Yêu cầu Vị trí hiện tại ({currentPosition.name})</span>
            </div>
          )}
          {targetPosition && (
            <div className="legend-item">
              <span className="legend-dot target-reqs"></span>
              <span className="legend-text">Yêu cầu Vị trí mục tiêu ({targetPosition.name})</span>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip detail block */}
      <div className="radar-tooltip-panel">
        {hoveredDetails ? (
          <div className="tooltip-content">
            <div className="tooltip-header">
              <span className={`comp-badge group-${hoveredDetails.id.charAt(0)}`}>
                {hoveredDetails.id}
              </span>
              <h4>{hoveredDetails.name}</h4>
            </div>
            <p className="tooltip-group-text">Nhóm: {hoveredDetails.group}</p>
            <div className="tooltip-values-grid">
              <div className="tooltip-val-col">
                <span className="val-lbl">Hiện tại:</span>
                <span className="val-num current">{hoveredDetails.current} / 5</span>
              </div>
              {currentPosition && (
                <div className="tooltip-val-col">
                  <span className="val-lbl">Yêu cầu vị trí hiện tại:</span>
                  <span className="val-num cur-req">{hoveredDetails.currentReq} / 5</span>
                </div>
              )}
              {targetPosition && (
                <div className="tooltip-val-col">
                  <span className="val-lbl">Yêu cầu vị trí mục tiêu:</span>
                  <span className="val-num tar-req">{hoveredDetails.targetReq} / 5</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="tooltip-placeholder">
            <i className="info-icon">ℹ️</i> Di chuột qua mã năng lực hoặc đỉnh biểu đồ để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
}
