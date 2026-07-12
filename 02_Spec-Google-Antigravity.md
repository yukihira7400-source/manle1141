# SPEC BUILD TRÊN GOOGLE ANTIGRAVITY — DÁN TOÀN BỘ NỘI DUNG DƯỚI ĐÂY LÀM PROMPT

---

Build a single-page web app called **CareerCompass** — a career path builder for a Vietnamese SME, UI language: Vietnamese.

## Tech
- Single-page app: React (Vite) hoặc HTML+JS thuần, tùy bạn chọn cho gọn.
- Không cần backend/đăng nhập. Toàn bộ dữ liệu seed nhúng trong code (JSON bên dưới). Trạng thái (nhân viên đang chọn, lộ trình đã chọn, trọng số) giữ trong memory.
- Chart: radar chart cho hồ sơ năng lực (Chart.js hoặc tự vẽ SVG).
- Giao diện sạch, hiện đại, responsive; màu chủ đạo xanh dương.

## Domain
Khung năng lực ASK (Attitude–Skills–Knowledge), thang 1–5 (1 Cơ bản, 2 Áp dụng có hướng dẫn, 3 Độc lập thành thạo, 4 Chuyên sâu/hướng dẫn người khác, 5 Chuyên gia). Mỗi vị trí có ma trận mức yêu cầu; mỗi nhân viên có mức hiện tại. App tính % matching của nhân viên với mọi vị trí và sinh kế hoạch reskill/upskill cho vị trí đích họ chọn.

## Matching algorithm (implement chính xác)
Với vị trí đích P và nhân viên E, chỉ xét năng lực có req > 0:
```
groupScore(g) = Σ min(cur_i, req_i) / Σ req_i        // i thuộc nhóm g ∈ {K, S, A}
match = wK*groupScore(K) + wS*groupScore(S) + wA*groupScore(A)
```
Trọng số mặc định wK=0.35, wS=0.40, wA=0.25 (cho chỉnh bằng slider, tổng luôn = 1, hiển thị kết quả cập nhật realtime).

Mức sẵn sàng: ≥85% "Sẵn sàng" (xanh); 70–84% "Gần sẵn sàng, 6–12 tháng" (vàng); 50–69% "Trung hạn, 12–24 tháng" (cam); <50% "Dài hạn" (xám).

Phân loại gap (req > cur):
- **Reskill**: cur = 0, hoặc (req − cur) ≥ 2.
- **Upskill**: các trường hợp còn lại (thiếu 1 mức).

Gợi ý hành động theo loại gap: Upskill → "Khóa học nâng cao / coaching / giao việc thử thách"; Reskill → "Đào tạo lại bài bản / mentoring / luân chuyển tạm thời". Kèm gợi ý cụ thể theo tên năng lực (tự sinh hợp lý).

## Screens (5 tab)
1. **Career Map**: lưới vị trí theo 3 cột phòng ban × 4 cấp bậc. Dropdown chọn nhân viên → mỗi thẻ vị trí hiện % matching, tô màu theo mức sẵn sàng, đánh dấu vị trí hiện tại. Click thẻ → sang tab 3 với vị trí đó.
2. **Hồ sơ năng lực**: radar chart 15 năng lực, 2–3 lớp (mức hiện tại / yêu cầu vị trí hiện tại / yêu cầu vị trí đích nếu đã chọn) + bảng chi tiết theo nhóm A-S-K.
3. **So sánh & chọn lộ trình**: bảng xếp hạng tất cả vị trí theo match % (kèm điểm K/S/A từng nhóm, badge dọc/ngang so với vị trí hiện tại). Nút "Chọn làm mục tiêu".
4. **Kế hoạch phát triển (IDP)**: sau khi chọn mục tiêu — danh sách gap (năng lực, cur → req, loại Reskill/Upskill, hành động gợi ý, ô checkbox hoàn thành), thanh tiến độ tổng.
5. **Admin**: bảng ma trận vị trí × năng lực (chỉnh sửa inline), slider trọng số K/S/A, form sửa mức đánh giá nhân viên.

## Seed data (dùng đúng dữ liệu này)

```json
{
  "competencies": [
    {"id":"K1","group":"K","name":"Kiến thức sản phẩm & ngành hàng"},
    {"id":"K2","group":"K","name":"Kiến thức thị trường & khách hàng"},
    {"id":"K3","group":"K","name":"Kiến thức quy trình vận hành & CRM"},
    {"id":"K4","group":"K","name":"Kiến thức marketing & digital"},
    {"id":"K5","group":"K","name":"Kiến thức quản trị (kế hoạch, ngân sách, KPI)"},
    {"id":"S1","group":"S","name":"Giao tiếp & trình bày"},
    {"id":"S2","group":"S","name":"Đàm phán & thuyết phục"},
    {"id":"S3","group":"S","name":"Phân tích dữ liệu & báo cáo"},
    {"id":"S4","group":"S","name":"Quản lý đội nhóm & coaching"},
    {"id":"S5","group":"S","name":"Giải quyết vấn đề & ra quyết định"},
    {"id":"S6","group":"S","name":"Sử dụng công cụ số (CRM, Excel, ads)"},
    {"id":"A1","group":"A","name":"Định hướng khách hàng"},
    {"id":"A2","group":"A","name":"Chủ động & cam kết kết quả"},
    {"id":"A3","group":"A","name":"Học hỏi & thích nghi"},
    {"id":"A4","group":"A","name":"Chính trực & hợp tác"}
  ],
  "competencyOrder": ["K1","K2","K3","K4","K5","S1","S2","S3","S4","S5","S6","A1","A2","A3","A4"],
  "positions": [
    {"id":"SAL-01","name":"NV Kinh doanh","dept":"Kinh doanh","level":1,"req":[3,3,2,1,1,3,3,2,0,2,2,4,4,3,3]},
    {"id":"SAL-02","name":"NV Kinh doanh cấp cao","dept":"Kinh doanh","level":2,"req":[4,4,2,2,2,4,4,3,1,3,3,4,4,3,3]},
    {"id":"SAL-03","name":"Trưởng nhóm Kinh doanh","dept":"Kinh doanh","level":3,"req":[4,4,3,2,3,4,4,3,3,3,3,4,4,3,4]},
    {"id":"SAL-04","name":"Trưởng phòng Kinh doanh","dept":"Kinh doanh","level":4,"req":[4,5,3,3,4,4,5,4,4,4,3,4,5,4,4]},
    {"id":"MKT-01","name":"NV Marketing","dept":"Marketing","level":1,"req":[2,3,1,3,1,3,2,2,0,2,3,3,3,4,3]},
    {"id":"MKT-02","name":"NV Digital Marketing","dept":"Marketing","level":2,"req":[2,3,1,4,1,2,2,3,0,2,4,3,3,4,3]},
    {"id":"MKT-03","name":"Trưởng nhóm Marketing","dept":"Marketing","level":3,"req":[3,4,2,4,3,4,3,3,3,3,4,3,4,4,4]},
    {"id":"MKT-04","name":"Trưởng phòng Marketing","dept":"Marketing","level":4,"req":[3,5,2,5,4,4,4,4,4,4,4,4,5,4,4]},
    {"id":"OPS-01","name":"NV Chăm sóc khách hàng","dept":"Vận hành & CSKH","level":1,"req":[3,2,3,1,1,3,2,2,0,3,2,4,3,3,3]},
    {"id":"OPS-02","name":"NV Vận hành đơn hàng","dept":"Vận hành & CSKH","level":2,"req":[2,2,4,0,1,2,1,3,0,3,3,3,3,3,3]},
    {"id":"OPS-03","name":"Trưởng nhóm CSKH","dept":"Vận hành & CSKH","level":3,"req":[3,3,4,1,3,4,3,3,3,3,3,4,4,3,4]},
    {"id":"OPS-04","name":"Trưởng phòng Vận hành","dept":"Vận hành & CSKH","level":4,"req":[3,3,5,1,4,4,3,4,4,4,4,4,4,4,4]}
  ],
  "employees": [
    {"id":"E01","name":"Nguyễn Thị Mai","positionId":"OPS-01","tenureYears":2,"current":[3,2,3,1,1,4,2,2,1,3,2,4,4,4,3]},
    {"id":"E02","name":"Lê Văn Hùng","positionId":"SAL-01","tenureYears":3,"current":[4,3,2,1,2,4,4,2,2,3,2,4,4,3,3]},
    {"id":"E03","name":"Phạm Thu Trang","positionId":"MKT-01","tenureYears":1.5,"current":[2,3,1,3,1,3,2,3,0,2,4,3,3,4,3]}
  ],
  "weights": {"K":0.35,"S":0.40,"A":0.25}
}
```

## Acceptance tests (với trọng số mặc định — kết quả phải khớp, làm tròn đến %)
- Nguyễn Thị Mai: OPS-01 = 100%, SAL-01 = 93%, OPS-02 = 89%, MKT-01 = 86%, OPS-03 = 78% (K 71 / S 74 / A 93).
- Lê Văn Hùng: SAL-01 = 100%, SAL-02 = 91%, OPS-03 = 85%, SAL-03 = 84%.
- Phạm Thu Trang: MKT-01 = 100%, MKT-02 = 97%, SAL-01 = 86%, MKT-03 = 72%.
- Mai chọn mục tiêu OPS-03 → IDP có đúng 8 gap, trong đó K5 (1→3) và S4 (1→3) hiển thị nhãn Reskill, còn lại Upskill.
- Điểm vượt yêu cầu không làm match vượt 100%.
- Đổi trọng số bằng slider → mọi % cập nhật ngay.
