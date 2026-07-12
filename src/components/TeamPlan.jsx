import React from 'react';

export default function TeamPlan({ employee, onNavigateToTab }) {
  const isHung = employee.id === 'E02';

  return (
    <div className="team-plan-screen">
      <div className="screen-header">
        <h2>Phân công Công việc & Quy trình Đội nhóm</h2>
        <p className="screen-desc">
          Kế hoạch vận hành và xử lý data thí sinh dành cho nhóm tư vấn tuyển sinh do <strong>Lương Văn Hùng</strong> làm Trưởng nhóm.
        </p>
      </div>

      {!isHung ? (
        <div className="glass-card no-target-card" style={{ padding: '40px', textAlign: 'center' }}>
          <span className="info-large-icon" style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👥</span>
          <h4>Kế hoạch dành riêng cho nhóm của Lương Văn Hùng</h4>
          <p>Vui lòng chuyển nhân viên sang <strong>Lương Văn Hùng (NV Kinh doanh)</strong> ở thanh điều khiển phía trên để xem chi tiết phân công công việc đội nhóm.</p>
          <button 
            onClick={() => onNavigateToTab('map')} 
            className="btn-action btn-primary"
            style={{ marginTop: '16px' }}
          >
            Quay lại Sơ đồ Lộ trình
          </button>
        </div>
      ) : (
        <div className="team-plan-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Pipeline Section */}
          <div className="glass-card pipeline-card">
            <h3>🔄 Quy trình Phễu Xử lý Thí sinh (Candidate Pipeline)</h3>
            <div className="pipeline-flow" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '20px',
              padding: '16px 8px'
            }}>
              
              {/* Step 1 */}
              <div className="pipeline-step-box" style={{
                flex: 1,
                minWidth: '200px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '16px',
                position: 'relative'
              }}>
                <span className="step-num" style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '16px',
                  background: '#3B82F6',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>1</span>
                <h4 style={{ margin: '8px 0 4px 0', color: '#60A5FA' }}>Hải Băng (Telesales)</h4>
                <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>Kết nối & Sàng lọc</strong>
                <p style={{ fontSize: '12px', margin: 0, opacity: 0.8 }}>Gọi điện theo data, khai thác nhu cầu, phân loại và đặt lịch hẹn tư vấn sâu.</p>
              </div>

              <div className="pipeline-arrow" style={{ fontSize: '20px', color: '#3B82F6' }}>➡️</div>

              {/* Step 2 */}
              <div className="pipeline-step-box" style={{
                flex: 1,
                minWidth: '200px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '16px',
                position: 'relative'
              }}>
                <span className="step-num" style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '16px',
                  background: '#10B981',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>2</span>
                <h4 style={{ margin: '8px 0 4px 0', color: '#34D399' }}>Tú Mẫn (Closer)</h4>
                <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>Tư vấn sâu & Chốt số</strong>
                <p style={{ fontSize: '12px', margin: 0, opacity: 0.8 }}>Tiếp nhận lịch hẹn, tư vấn chuyên sâu lộ trình học, xử lý từ chối và chốt số phí.</p>
              </div>

              <div className="pipeline-arrow" style={{ fontSize: '20px', color: '#10B981' }}>➡️</div>

              {/* Step 3 */}
              <div className="pipeline-step-box" style={{
                flex: 1,
                minWidth: '200px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '16px',
                position: 'relative'
              }}>
                <span className="step-num" style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '16px',
                  background: '#F59E0B',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>3</span>
                <h4 style={{ margin: '8px 0 4px 0', color: '#FBBF24' }}>Lương Văn Hùng (Lead)</h4>
                <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>Hỗ trợ & Quản lý</strong>
                <p style={{ fontSize: '12px', margin: 0, opacity: 0.8 }}>Hỗ trợ xử lý ca khó, giám sát KPI phễu chuyển đổi, phân bổ data và huấn luyện kỹ năng.</p>
              </div>

            </div>
          </div>

          {/* RACI Matrix Section */}
          <div className="glass-card raci-card">
            <h3>👥 Phân Phối Trách Nhiệm Chi Tiết (RACI Matrix)</h3>
            <div className="table-responsive" style={{ marginTop: '16px' }}>
              <table className="competency-table">
                <thead>
                  <tr>
                    <th>Nhiệm vụ chính</th>
                    <th style={{ textAlign: 'center' }}>Lương Văn Hùng (Lead)</th>
                    <th style={{ textAlign: 'center' }}>Tú Mẫn (Closer)</th>
                    <th style={{ textAlign: 'center' }}>Hải Băng (Telesales)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Lập kế hoạch KPI & Phân bổ data tuyển sinh</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#3B82F6', color: '#fff' }}>A / R</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">C</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">I</span></td>
                  </tr>
                  <tr>
                    <td><strong>Liên hệ data thô, kết nối & phân loại thí sinh</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">A</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">I</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#10B981', color: '#fff' }}>R</span></td>
                  </tr>
                  <tr>
                    <td><strong>Đặt lịch hẹn tư vấn sâu & cập nhật thông tin CRM</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">I</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">C</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#10B981', color: '#fff' }}>R / A</span></td>
                  </tr>
                  <tr>
                    <td><strong>Thực hiện tư vấn chuyên sâu, thiết lập lộ trình học</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">C</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#10B981', color: '#fff' }}>R / A</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">I</span></td>
                  </tr>
                  <tr>
                    <td><strong>Chốt số đóng phí & Thu thập hồ sơ nhập học</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">C</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#10B981', color: '#fff' }}>R / A</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">I</span></td>
                  </tr>
                  <tr>
                    <td><strong>Xử lý các ca thí sinh khó, khiếu nại hoặc do dự lâu</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#3B82F6', color: '#fff' }}>R / A</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#10B981', color: '#fff' }}>R</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">C</span></td>
                  </tr>
                  <tr>
                    <td><strong>Đào tạo kịch bản, nghe lại ghi âm cuộc gọi hỗ trợ</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#3B82F6', color: '#fff' }}>R / A</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">C</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">C</span></td>
                  </tr>
                  <tr>
                    <td><strong>Báo cáo hiệu suất phễu chuyển đổi tuyển sinh tuần/tháng</strong></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur" style={{ background: '#3B82F6', color: '#fff' }}>R / A</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">I</span></td>
                    <td style={{ textAlign: 'center' }}><span className="val-text cur-req">I</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '11px', marginTop: '12px', opacity: 0.6 }}>
              * Chú thích: <strong>R (Responsible)</strong> - Người thực hiện | <strong>A (Accountable)</strong> - Người chịu trách nhiệm chính | <strong>C (Consulted)</strong> - Người được hỏi ý kiến | <strong>I (Informed)</strong> - Người nhận thông tin.
            </p>
          </div>

          {/* Development / IDP Mapping Section */}
          <div className="glass-card stat-box" style={{ display: 'block', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 Lồng ghép lộ trình Phát triển Năng lực (IDP) của Lương Văn Hùng
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #3B82F6' }}>
                <strong style={{ fontSize: '13px', color: '#60A5FA' }}>1. Thực hành Quản lý & Coaching (S4)</strong>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.8 }}>
                  Hùng trực tiếp kèm cặp Hải Băng cải thiện kịch bản telesales và cùng Tú Mẫn tháo gỡ các ca tư vấn khó. Đây là hành động ưu tiên 1 trong IDP.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                <strong style={{ fontSize: '13px', color: '#34D399' }}>2. Thực hành Kiến thức Quản trị (K5)</strong>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.8 }}>
                  Hùng trực tiếp lập kế hoạch mục tiêu tuyển sinh tuần, quản lý phân bổ nguồn data thí sinh và chịu trách nhiệm về chỉ tiêu chung của nhóm.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
                <strong style={{ fontSize: '13px', color: '#FBBF24' }}>3. Thực hành Phân tích & Báo cáo (S3)</strong>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.8 }}>
                  Hùng phụ trách xây dựng và theo dõi báo cáo tỷ lệ chuyển đổi của phễu tuyển sinh theo tuần, tính toán tỷ lệ chốt số của Tú Mẫn.
                </p>
              </div>
            </div>
          </div>

          {/* KPI Targets Section */}
          <div className="glass-card info-card">
            <h3>📊 Chỉ tiêu KPI Đội Nhóm Tuần (Đề xuất)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', opacity: 0.6, display: 'block' }}>Số cuộc gọi kết nối</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#3B82F6' }}>350+</span>
                <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', color: '#60A5FA' }}>Hải Băng phụ trách chính</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', opacity: 0.6, display: 'block' }}>Tỷ lệ hẹn gặp thành công</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>{'\u2265'} 35%</span>
                <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', color: '#34D399' }}>Hải Băng & Hùng hỗ trợ</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', opacity: 0.6, display: 'block' }}>Số ca tư vấn sâu</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#8B5CF6' }}>120+</span>
                <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', color: '#A78BFA' }}>Tú Mẫn phụ trách chính</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', opacity: 0.6, display: 'block' }}>Tỷ lệ Chốt số thành công</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#F59E0B' }}>{'\u2265'} 20%</span>
                <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', color: '#FBBF24' }}>Tú Mẫn & Hùng hỗ trợ</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
