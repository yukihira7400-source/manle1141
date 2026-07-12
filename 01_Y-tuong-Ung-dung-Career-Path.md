# Ý TƯỞNG ỨNG DỤNG: CAREER PATH BUILDER CHO SME

**Tên gợi ý:** CareerCompass — La bàn lộ trình nghề nghiệp cho nhân viên SME
**Nền tảng build:** Google Antigravity (spec chi tiết ở file `02_Spec-Google-Antigravity.md`)

---

## 1. Bài toán

SME thường mất người giỏi vì nhân viên "không thấy tương lai" — không biết vị trí tiếp theo là gì, cần gì để lên, và công ty cũng không có công cụ đánh giá năng lực bài bản. Ứng dụng giải quyết 4 việc:

1. Chuẩn hóa **khung năng lực ASK** (Attitude – Skills – Knowledge) cho từng vị trí.
2. **Đánh giá nhân viên** theo khung ASK (tự đánh giá + quản lý đánh giá).
3. Tính **% matching** giữa hồ sơ năng lực của nhân viên với mọi vị trí khác → nhân viên nhìn thấy các lộ trình khả thi (thăng tiến dọc hoặc chuyển ngang).
4. Chỉ ra **gap năng lực** cho lộ trình họ chọn → sinh kế hoạch **reskill/upskill** cá nhân (IDP).

## 2. Người dùng & vai trò

| Vai trò | Làm gì trong app |
|---|---|
| HR Admin | Quản lý thư viện năng lực, ma trận vị trí, chu kỳ đánh giá, danh mục khóa học |
| Quản lý trực tiếp | Đánh giá năng lực nhân viên, duyệt IDP |
| Nhân viên | Tự đánh giá, khám phá career map, chọn lộ trình, theo dõi IDP |

## 3. Mô hình dữ liệu (5 thực thể chính)

- **Competency**: mã, tên, nhóm (A/S/K), mô tả 5 mức (thang 1–5, có mô tả hành vi từng mức).
- **Position**: mã, tên, phòng ban, cấp bậc (level 1–4), ma trận yêu cầu năng lực (competency → mức yêu cầu).
- **Employee**: thông tin cơ bản, vị trí hiện tại.
- **Assessment**: kết quả đánh giá của nhân viên theo từng năng lực (mức hiện tại, kỳ đánh giá, người đánh giá). Điểm chốt = trung bình có trọng số giữa tự đánh giá (30%) và quản lý đánh giá (70%).
- **DevelopmentPlan (IDP)**: lộ trình đích đã chọn + danh sách hành động học tập (khóa học, mentoring, on-the-job) gắn với từng gap.

## 4. Khung năng lực ASK dùng chung (thư viện 15 năng lực)

Thang đo mỗi năng lực: **1** Cơ bản → **2** Áp dụng có hướng dẫn → **3** Độc lập thành thạo → **4** Chuyên sâu/hướng dẫn người khác → **5** Chuyên gia/định hình chuẩn mực.

**Knowledge (K)**
- K1 Kiến thức sản phẩm & ngành hàng
- K2 Kiến thức thị trường & khách hàng
- K3 Kiến thức quy trình vận hành & CRM
- K4 Kiến thức marketing & digital
- K5 Kiến thức quản trị (kế hoạch, ngân sách, KPI)

**Skills (S)**
- S1 Giao tiếp & trình bày
- S2 Đàm phán & thuyết phục
- S3 Phân tích dữ liệu & báo cáo
- S4 Quản lý đội nhóm & coaching
- S5 Giải quyết vấn đề & ra quyết định
- S6 Sử dụng công cụ số (CRM, Excel/Sheets, công cụ ads)

**Attitude (A)**
- A1 Định hướng khách hàng
- A2 Chủ động & cam kết kết quả
- A3 Học hỏi & thích nghi
- A4 Chính trực & hợp tác

## 5. Ví dụ doanh nghiệp mẫu: SME thương mại/dịch vụ, 3 phòng ban, 12 vị trí

```
KINH DOANH:  NV Kinh doanh → NV KD cấp cao → Trưởng nhóm KD → Trưởng phòng KD
MARKETING:   NV Marketing / NV Digital MKT → Trưởng nhóm MKT → Trưởng phòng MKT
VẬN HÀNH:    NV CSKH / NV Vận hành đơn hàng → Trưởng nhóm CSKH → Trưởng phòng Vận hành
```

Ngoài lộ trình dọc, app cho thấy **lộ trình ngang** (ví dụ NV CSKH → NV Kinh doanh) — điểm khác biệt chính so với sơ đồ thăng tiến truyền thống.

### Ma trận yêu cầu năng lực theo vị trí (mức 1–5, 0 = không yêu cầu)

| Vị trí | K1 | K2 | K3 | K4 | K5 | S1 | S2 | S3 | S4 | S5 | S6 | A1 | A2 | A3 | A4 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SAL-01 NV Kinh doanh | 3 | 3 | 2 | 1 | 1 | 3 | 3 | 2 | 0 | 2 | 2 | 4 | 4 | 3 | 3 |
| SAL-02 NV KD cấp cao | 4 | 4 | 2 | 2 | 2 | 4 | 4 | 3 | 1 | 3 | 3 | 4 | 4 | 3 | 3 |
| SAL-03 Trưởng nhóm KD | 4 | 4 | 3 | 2 | 3 | 4 | 4 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | 4 |
| SAL-04 Trưởng phòng KD | 4 | 5 | 3 | 3 | 4 | 4 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | 4 |
| MKT-01 NV Marketing | 2 | 3 | 1 | 3 | 1 | 3 | 2 | 2 | 0 | 2 | 3 | 3 | 3 | 4 | 3 |
| MKT-02 NV Digital MKT | 2 | 3 | 1 | 4 | 1 | 2 | 2 | 3 | 0 | 2 | 4 | 3 | 3 | 4 | 3 |
| MKT-03 Trưởng nhóm MKT | 3 | 4 | 2 | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 4 | 3 | 4 | 4 | 4 |
| MKT-04 Trưởng phòng MKT | 3 | 5 | 2 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 4 |
| OPS-01 NV CSKH | 3 | 2 | 3 | 1 | 1 | 3 | 2 | 2 | 0 | 3 | 2 | 4 | 3 | 3 | 3 |
| OPS-02 NV Vận hành ĐH | 2 | 2 | 4 | 0 | 1 | 2 | 1 | 3 | 0 | 3 | 3 | 3 | 3 | 3 | 3 |
| OPS-03 Trưởng nhóm CSKH | 3 | 3 | 4 | 1 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | 4 |
| OPS-04 Trưởng phòng VH | 3 | 3 | 5 | 1 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |

## 6. Thuật toán matching %

**Công thức** (chỉ tính trên các năng lực vị trí đích có yêu cầu, req > 0; điểm vượt yêu cầu không cộng thêm):

```
Match_nhóm(g) = Σ min(mức hiện tại, mức yêu cầu) / Σ mức yêu cầu   (trong nhóm g)
Match_tổng    = 35% × Match_K + 40% × Match_S + 25% × Match_A
```

Trọng số K/S/A cho HR Admin tùy chỉnh (mặc định 35/40/25 — Skills nặng nhất vì khó bù đắp nhanh nhất; Attitude thấp hơn vì ít thay đổi theo vị trí).

**Diễn giải mức sẵn sàng:**

| Match % | Ý nghĩa | Thời gian chuẩn bị gợi ý |
|---|---|---|
| ≥ 85% | Sẵn sàng | 0–6 tháng |
| 70–84% | Gần sẵn sàng | 6–12 tháng |
| 50–69% | Trung hạn | 12–24 tháng |
| < 50% | Dài hạn | > 24 tháng |

**Phân loại gap → hành động:**

- **Upskill**: năng lực đã có, chỉ thiếu 1 mức → khóa học nâng cao, coaching, giao việc thử thách (stretch assignment).
- **Reskill**: năng lực nhân viên chưa có (mức 0) hoặc thiếu ≥ 2 mức → đào tạo lại bài bản, luân chuyển, mentoring dài hạn.

## 7. Ví dụ hoàn chỉnh: nhân viên Nguyễn Thị Mai — NV CSKH (OPS-01)

**Hồ sơ năng lực hiện tại** (sau kỳ đánh giá):
K1:3 K2:2 K3:3 K4:1 K5:1 | S1:4 S2:2 S3:2 S4:1 S5:3 S6:2 | A1:4 A2:4 A3:4 A4:3

**Kết quả matching** (app tự tính cho mọi vị trí):

| Vị trí đích | Match % | K / S / A | Mức sẵn sàng |
|---|---|---|---|
| SAL-01 NV Kinh doanh (ngang) | **93%** | 90 / 92 / 100 | Sẵn sàng |
| OPS-02 NV Vận hành ĐH (ngang) | 89% | 89 / 83 / 100 | Sẵn sàng |
| MKT-01 NV Marketing (ngang) | 86% | 70 / 92 / 100 | Sẵn sàng |
| **OPS-03 Trưởng nhóm CSKH (dọc)** | **78%** | 71 / 74 / 93 | Gần sẵn sàng (6–12 tháng) |
| SAL-02 NV KD cấp cao | 79% | 64 / 78 / 100 | Gần sẵn sàng |
| OPS-04 Trưởng phòng VH | 70% | 62 / 61 / 94 | Trung hạn |

**Mai chọn lộ trình: Trưởng nhóm CSKH (OPS-03).** App sinh IDP từ 8 gap:

| Gap | Hiện tại → Yêu cầu | Loại | Hành động đề xuất |
|---|---|---|---|
| K5 Kiến thức quản trị | 1 → 3 | Reskill | Khóa "Quản trị cơ bản cho quản lý mới" + shadow trưởng nhóm 3 tháng |
| S4 Quản lý đội nhóm & coaching | 1 → 3 | Reskill | Khóa kỹ năng quản lý + làm mentor cho 1 NV mới (OJT) |
| K3 Quy trình vận hành & CRM | 3 → 4 | Upskill | Chủ trì cải tiến 1 quy trình CSKH |
| S3 Phân tích dữ liệu & báo cáo | 2 → 3 | Upskill | Khóa Excel/dashboard + phụ trách báo cáo tuần |
| K2 Thị trường & KH | 2 → 3 | Upskill | Tham gia 2 dự án khảo sát khách hàng |
| S2 Đàm phán & thuyết phục | 2 → 3 | Upskill | Khóa xử lý khiếu nại nâng cao |
| S6 Công cụ số | 2 → 3 | Upskill | Chứng chỉ CRM nội bộ |
| A4 Chính trực & hợp tác | 3 → 4 | Upskill | Feedback 360° + dẫn dắt 1 hoạt động liên phòng ban |

→ Nhân viên thấy rõ: *"Tôi đang khớp 78% với vị trí mơ ước, cần 12 tháng và 8 hành động cụ thể."* Đồng thời app cũng gợi ý phương án B (chuyển ngang sang Sales, khớp 93%, đi nhanh hơn).

## 8. Các màn hình chính của app

1. **Career Map** — sơ đồ 12 vị trí theo phòng ban/cấp bậc; chọn nhân viên → mỗi ô vị trí hiện % matching bằng màu (xanh ≥85, vàng 70–84, cam 50–69, xám <50); mũi tên gợi ý lộ trình dọc/ngang.
2. **Hồ sơ năng lực** — radar chart 3 lớp: mức hiện tại vs yêu cầu vị trí hiện tại vs yêu cầu vị trí đích.
3. **So sánh & chọn lộ trình** — bảng xếp hạng vị trí theo % matching, bấm chọn làm mục tiêu.
4. **Kế hoạch phát triển (IDP)** — danh sách gap phân loại reskill/upskill, hành động, deadline, tiến độ %.
5. **Admin** — CRUD năng lực, ma trận vị trí, nhập đánh giá, chỉnh trọng số K/S/A.

## 9. Lộ trình triển khai gợi ý

- **MVP (build trên Antigravity, 1–2 tuần):** web app 1 trang, dữ liệu seed JSON, đủ 5 màn hình trên, chưa cần đăng nhập/backend.
- **Giai đoạn 2:** backend + đăng nhập theo vai trò, chu kỳ đánh giá 2 chiều, import Excel nhân sự.
- **Giai đoạn 3:** gợi ý khóa học tự động (AI), liên kết LMS, báo cáo succession planning cho ban giám đốc.
