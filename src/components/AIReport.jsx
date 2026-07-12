import React, { useState } from 'react';
import { calculateMatch, getReadinessStatus, getCompetencyGaps } from '../utils';

// Helper to render basic Markdown elements safely in React
function renderMarkdown(mdText) {
  if (!mdText) return null;

  const lines = mdText.split('\n');
  let inList = false;
  let listItems = [];
  const elements = [];

  const parseInline = (text) => {
    // Parse bold text: **bold**
    const parts = text.split('**');
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx}>{part}</strong>;
      }
      // Simple italic: *italic*
      const subParts = part.split('*');
      if (subParts.length > 1) {
        return subParts.map((sp, sIdx) => {
          if (sIdx % 2 === 1) {
            return <em key={`em-${sIdx}`}>{sp}</em>;
          }
          return sp;
        });
      }
      return part;
    });
  };

  const flushList = (keyPrefix) => {
    if (inList && listItems.length > 0) {
      elements.push(<ul key={`ul-${keyPrefix}-${elements.length}`}>{listItems}</ul>);
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Header level 1
    if (trimmed.startsWith('# ')) {
      flushList(index);
      elements.push(<h2 key={`h1-${index}`} className="md-h1">{parseInline(trimmed.substring(2))}</h2>);
    }
    // Header level 2
    else if (trimmed.startsWith('## ')) {
      flushList(index);
      elements.push(<h3 key={`h2-${index}`} className="md-h2">{parseInline(trimmed.substring(3))}</h3>);
    }
    // Header level 3
    else if (trimmed.startsWith('### ')) {
      flushList(index);
      elements.push(<h4 key={`h3-${index}`} className="md-h3">{parseInline(trimmed.substring(4))}</h4>);
    }
    // Blockquote
    else if (trimmed.startsWith('> ')) {
      flushList(index);
      elements.push(<blockquote key={`quote-${index}`}>{parseInline(trimmed.substring(2))}</blockquote>);
    }
    // Unordered List Items
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(<li key={`li-${index}`}>{parseInline(trimmed.substring(2))}</li>);
    }
    // Ordered List Items (simple match e.g. 1. )
    else if (/^\d+\.\s/.test(trimmed)) {
      inList = true;
      // Strip the digits and period
      const content = trimmed.replace(/^\d+\.\s/, '');
      listItems.push(<li key={`li-ol-${index}`} style={{ listStyleType: 'decimal' }}>{parseInline(content)}</li>);
    }
    // Empty line
    else if (trimmed === '') {
      flushList(index);
    }
    // Normal paragraph
    else {
      flushList(index);
      elements.push(<p key={`p-${index}`}>{parseInline(line)}</p>);
    }
  });

  // Final flush
  flushList('final');

  return elements;
}

export default function AIReport({
  employee,
  positions,
  competencies,
  weights,
  targetPositionId,
  apiKey,
  onSaveApiKey,
  onNavigateToTab
}) {
  const [showKey, setShowKey] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Cache of reports by employeeId-targetPositionId
  const [reportsCache, setReportsCache] = useState(() => {
    const saved = localStorage.getItem('cc_ai_reports_cache');
    return saved ? JSON.parse(saved) : {};
  });

  const currentPosition = positions.find(p => p.id === employee.positionId);
  const targetPosition = positions.find(p => p.id === targetPositionId);

  const cacheKey = `${employee.id}-${targetPositionId}`;
  
  const HUNG_REPORT = `# BÁO CÁO PHÂN TÍCH LỘ TRÌNH PHÁT TRIỂN NGHỀ NGHIỆP: LƯƠNG VĂN HÙNG

## 1. Tóm Tắt Tổng Quan Lộ Trình
Lương Văn Hùng hiện là Nhân viên Kinh doanh (SAL-01) hướng tới mục tiêu Trưởng nhóm Kinh doanh (SAL-03). Kết quả phân tích cho thấy tỷ lệ tương thích tổng thể là 84%, đạt mức "Gần sẵn sàng" với thời gian chuẩn bị dự kiến từ 6–12 tháng. Đây là lộ trình thăng tiến dọc tự nhiên và có tính khả thi cực kỳ cao. Trở ngại chính không nằm ở chuyên môn bán hàng thực chiến mà ở việc dịch chuyển tư duy từ một cá nhân bán hàng xuất sắc sang một người dẫn dắt đội nhóm hiệu quả.

## 2. Điểm Mạnh Năng Lực Hiện Tại
Hùng sở hữu những điểm mạnh vượt trội làm bệ phóng vững chắc:
- Kiến thức sản phẩm (K1: 4/4) giúp Hùng làm chủ chuyên môn.
- Giao tiếp trình bày (S1: 4/4) và Đàm phán thuyết phục (S2: 4/4) là vũ khí thực chiến sắc bén.
- Thái độ chủ động và cam kết (A2: 4/4) cùng định hướng khách hàng (A1: 4/4) giúp Hùng luôn duy trì hiệu suất cao và sự tin cậy.

## 3. Phân Tích Khoảng Cách Năng Lực Trọng Yếu (Gaps)
- Hệ thống ghi nhận không có gap nào thuộc nhóm "Reskill" nghiêm trọng (gap >= 2 hoặc cur = 0).
- Các khoảng cách năng lực trọng yếu tập trung hoàn toàn ở nhóm "Upskill" bao gồm Kỹ năng quản lý (S4), Kiến thức quản trị (K5) và Phân tích báo cáo (S3). Mặc dù các khoảng lệch này chỉ là 1 điểm, nhưng chúng đại diện cho các năng lực quản trị hệ thống mà Hùng chưa có nhiều cơ hội cọ xát thực tế.

## 4. Lộ Trình Hành Động Học Tập Ưu Tiên (Giai đoạn 0–6 tháng)
- Giai đoạn 0-3 tháng: Tập trung cải thiện tư duy số liệu và báo cáo (S3) bằng khóa học Dashboard và nhận làm báo cáo tuần. Song song đó, tham gia hỗ trợ lập kế hoạch phòng ban (K5).
- Giai đoạn 3-6 tháng: Nhận vai trò Buddy/Mentor kèm cặp nhân viên mới (S4) để thực hành kỹ năng coaching và dẫn dắt.
- Giai đoạn 6-12 tháng: Bổ sung kiến thức Marketing liên đới (K4) và tối ưu hóa quy trình CRM (K3) để hoàn thiện năng lực quản lý toàn diện.

## 5. Vai Trò Đồng Hành Của Quản Lý & Doanh Nghiệp
- Quản lý trực tiếp cần chuyển giao dần các đầu việc mang tính quản trị (lập kế hoạch, làm báo cáo doanh thu nhóm).
- Doanh nghiệp hỗ trợ ngân sách cho các khóa đào tạo kỹ năng quản lý cơ bản và tạo điều kiện để Hùng chủ trì các cuộc họp nhóm nhỏ.`;

  const cachedReport = targetPositionId 
    ? (reportsCache[cacheKey] || (cacheKey === 'E02-SAL-03' ? HUNG_REPORT : null)) 
    : null;

  // --- Handlers ---
  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      alert("Vui lòng nhập API Key hợp lệ!");
      return;
    }
    onSaveApiKey(inputKey.trim());
    alert("Đã lưu API Key thành công vào bộ nhớ trình duyệt!");
  };

  const handleClearKey = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa API Key khỏi bộ nhớ trình duyệt không?")) {
      setInputKey('');
      onSaveApiKey('');
    }
  };

  const handleGenerateReport = async () => {
    if (!apiKey) {
      setError("Vui lòng cấu hình và lưu API Key của Gemini trước khi tiếp tục.");
      return;
    }

    if (!targetPosition) {
      setError("Nhân viên chưa chọn vị trí mục tiêu. Hãy chọn mục tiêu trước.");
      return;
    }

    setLoading(true);
    setError('');

    const matchDetails = calculateMatch(employee, targetPosition, competencies, weights);
    const readiness = getReadinessStatus(matchDetails.totalScore);
    const gaps = getCompetencyGaps(employee, targetPosition, competencies);

    const promptText = `
Bạn là một chuyên gia tư vấn nhân sự và phát triển tổ chức (OD) hàng đầu. Hãy viết một báo cáo đánh giá năng lực và lộ trình phát triển nghề nghiệp chi tiết bằng tiếng Việt cho nhân viên dưới đây:

THÔNG TIN NHÂN VIÊN:
- Họ và tên: ${employee.name}
- Vị trí hiện tại: ${currentPosition ? currentPosition.name : 'Chưa rõ'}
- Vị trí mục tiêu: ${targetPosition.name} (${targetPosition.id})
- Tỷ lệ tương thích tổng thể: ${matchDetails.totalScore}%
- Độ tương thích nhóm: Kiến thức (K): ${matchDetails.kScore}%, Kỹ năng (S): ${matchDetails.sScore}%, Thái độ (A): ${matchDetails.aScore}%
- Mức độ sẵn sàng: ${readiness.label} (Thời gian chuẩn bị gợi ý: ${readiness.timeframe})

CHI TIẾT KHOẢNG CÁCH NĂNG LỰC (GAPS) CẦN ĐÀO TẠO:
${gaps.map((g, i) => `${i+1}. ${g.id} - ${g.name} (Nhóm ${g.group}): Hiện tại ${g.current}/5 -> Yêu cầu mục tiêu ${g.required}/5 [Phân loại: ${g.type}]
   - Hành động đề xuất từ doanh nghiệp: ${g.specificAction}
`).join('\n')}

TRỌNG SỐ ĐÁNH GIÁ (ASK):
- Kiến thức (K): ${Math.round(weights.K * 100)}%
- Kỹ năng (S): ${Math.round(weights.S * 100)}%
- Thái độ (A): ${Math.round(weights.A * 100)}%

HÃY VIẾT BÁO CÁO CÓ CẤU TRÚC SAU (sử dụng định dạng Markdown, viết chi tiết, chuyên nghiệp và thực tế):

# BÁO CÁO PHÂN TÍCH LỘ TRÌNH PHÁT TRIỂN NGHỀ NGHIỆP: ${employee.name}

## 1. Tóm Tắt Tổng Quan Lộ Trình
(Đánh giá tổng quan về tỉ lệ tương thích ${matchDetails.totalScore}%, mức sẵn sàng và thời gian chuẩn bị gợi ý là ${readiness.timeframe}. Nhận định xem đây là lộ trình thăng tiến dọc hay dịch chuyển ngang, đánh giá độ khả thi và khó khăn chính).

## 2. Điểm Mạnh Năng Lực Hiện Tại
(Phân tích sâu các năng lực nhân viên đang đáp ứng tốt hoặc vượt yêu cầu của vị trí mục tiêu, đặc biệt chú ý đến nhóm Thái độ (A) hoặc Kỹ năng (S) làm bệ phóng).

## 3. Phân Tích Khoảng Cách Năng Lực Trọng Yếu (Gaps)
(Tập trung phân tích các gap thuộc nhóm **Reskill** và tại sao các gap này lại là trở ngại chính để lên vị trí mục tiêu. Sau đó phân tích ngắn gọn các gap thuộc nhóm **Upskill**).

## 4. Lộ Trình Hành Động Học Tập Ưu Tiên (Dành cho Nhân Viên)
(Lập kế hoạch hành động 3 giai đoạn rõ ràng: 0-3 tháng, 3-6 tháng, 6-12 tháng, chỉ rõ hành động thực tế nào cần thực hiện trước dựa trên các đề xuất học tập).

## 5. Vai Trò Đồng Hành Của Quản Lý & Doanh Nghiệp
(Đề xuất cách quản lý trực tiếp hỗ trợ: giao việc thử thách thế nào, kèm cặp ra sao, luân chuyển công việc tạm thời và hỗ trợ ngân sách đào tạo ra sao).

## 6. Lời Khuyên Chiến Lược & Động Viên
(Lời khuyên ngắn gọn, thiết thực để nhân viên duy trì động lực, chủ động học hỏi và chuẩn bị tâm lý sẵn sàng cho vai trò mới).
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Lỗi API (Mã: ${response.status})`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("API không trả về nội dung báo cáo phù hợp.");
      }

      // Save to cache
      const updatedCache = {
        ...reportsCache,
        [cacheKey]: text
      };
      setReportsCache(updatedCache);
      localStorage.setItem('cc_ai_reports_cache', JSON.stringify(updatedCache));

    } catch (err) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi không xác định khi kết nối với Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!cachedReport) return;
    const blob = new Blob([cachedReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao-cao-CareerPath-${employee.name.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ai-report-screen">
      <div className="screen-header">
        <h2>Báo cáo Lộ trình với Gemini AI</h2>
        <p className="screen-desc">
          Tích hợp trí tuệ nhân tạo để phân tích sâu hơn về hồ sơ năng lực của nhân viên, chỉ ra các hành động cốt lõi và xây dựng báo cáo phát triển toàn diện.
        </p>
      </div>

      {/* API Key Setup panel */}
      <div className="glass-card api-key-card">
        <h3>Cấu hình Kết nối Gemini API</h3>
        <p className="tab-desc-muted">
          Nhập Gemini API Key của bạn để sử dụng tính năng sinh báo cáo tự động. Key được lưu trữ cục bộ trên trình duyệt của bạn và chỉ gửi trực tiếp đến máy chủ Google. 
          <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="key-link-hint">
             Lấy API Key miễn phí tại Google AI Studio ↗
          </a>
        </p>

        <form onSubmit={handleSaveKey} className="api-key-form">
          <div className="input-group-wrapper">
            <input
              type={showKey ? "text" : "password"}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Nhập AIzaSy..."
              className="filter-control api-key-input"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="btn-action btn-secondary btn-sm toggle-key-btn"
            >
              {showKey ? "Ẩn" : "Hiện"}
            </button>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-action btn-primary">
              💾 Lưu API Key
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="btn-action btn-danger"
              >
                🗑️ Xóa Key
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Main Report Block */}
      <div className="report-main-wrapper">
        {!targetPosition ? (
          <div className="glass-card no-target-card">
            <span className="info-large-icon">🧭</span>
            <h4>Chưa chọn vị trí mục tiêu</h4>
            <p>Vui lòng chọn vị trí mục tiêu để AI có dữ liệu phân tích lộ trình thăng tiến và chênh lệch năng lực.</p>
            <button
              onClick={() => onNavigateToTab('compare')}
              className="btn-action btn-primary"
            >
              Chọn vị trí mục tiêu
            </button>
          </div>
        ) : (
          <div className="report-content-panel">
            {/* Meta and trigger block */}
            <div className="glass-card report-meta-card">
              <div className="meta-left">
                <h4>Phân tích lộ trình phát triển cho: <strong>{employee.name}</strong></h4>
                <p>
                  Vị trí xuất phát: <strong>{currentPosition?.name}</strong> &rarr; Vị trí đích: <strong>{targetPosition.name} ({targetPosition.id})</strong>
                </p>
              </div>
              <div className="meta-right">
                {!apiKey ? (
                  <span className="warning-text">⚠️ Hãy nhập API Key trước để tạo báo cáo</span>
                ) : loading ? (
                  <button className="btn-action btn-primary" disabled>
                    <span className="loading-spinner"></span> Đang phân tích...
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateReport}
                    className="btn-action btn-primary"
                  >
                    🚀 {cachedReport ? "Tái tạo báo cáo AI" : "Tạo báo cáo AI bằng Gemini"}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="error-alert-box">
                <strong>Lỗi sinh báo cáo:</strong> {error}
              </div>
            )}

            {/* Rendered report */}
            {loading && (
              <div className="glass-card report-loading-card">
                <div className="ai-wave-animation">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <h4>Trí tuệ nhân tạo Gemini đang phân tích hồ sơ...</h4>
                <p>Quá trình này mất khoảng 3 đến 7 giây. Gemini đang tổng hợp các gaps, đối chiếu thang ASK và xây dựng kế hoạch học tập chi tiết.</p>
              </div>
            )}

            {!loading && cachedReport && (
              <div className="report-result-section">
                <div className="report-actions-bar">
                  <button
                    onClick={handleDownloadReport}
                    className="btn-action btn-secondary"
                  >
                    💾 Tải về (.md)
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-action btn-primary"
                  >
                    🖨️ In / Xuất PDF
                  </button>
                </div>

                <div className="glass-card markdown-report-card printable-area">
                  {renderMarkdown(cachedReport)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
