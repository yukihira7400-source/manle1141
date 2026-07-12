export const SEED_DATA = {
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
    {"id":"E01","name":"Tú Mẫn","positionId":"OPS-01","tenureYears":2,"current":[3,2,3,1,1,4,2,2,1,3,2,4,4,4,3]},
    {"id":"E02","name":"Lương Văn Hùng","positionId":"SAL-01","tenureYears":3,"current":[4,3,2,1,2,4,4,2,2,3,2,4,4,3,3]},
    {"id":"E03","name":"Hải Băng","positionId":"MKT-01","tenureYears":1.5,"current":[2,3,1,3,1,3,2,3,0,2,4,3,3,4,3]}
  ],
  "weights": {"K":0.35,"S":0.40,"A":0.25}
};

export const ACTION_RECOMMENDATIONS = {
  K1: {
    upskill: "Khóa học sản phẩm nâng cao hoặc tham gia trực tiếp vào việc kiểm thử/phát triển sản phẩm mới.",
    reskill: "Đào tạo lại bài bản toàn bộ danh mục sản phẩm của doanh nghiệp & vượt qua bài kiểm tra năng lực nội bộ."
  },
  K2: {
    upskill: "Tham gia vào dự án khảo sát thị trường nhỏ hoặc phân tích đối thủ cạnh tranh.",
    reskill: "Luân chuyển tạm thời qua phòng CSKH hoặc Kinh doanh để trực tiếp lắng nghe ý kiến phản hồi của khách hàng."
  },
  K3: {
    upskill: "Chủ trì cải tiến hoặc chuẩn hóa một quy trình vận hành cụ thể trong nhóm của mình.",
    reskill: "Khóa học chuyên sâu về quy trình CRM và làm việc kèm cặp (shadow) cùng chuyên viên vận hành chính."
  },
  K4: {
    upskill: "Khóa học tối ưu hóa chuyển đổi nâng cao và trực tiếp thiết lập một chiến dịch marketing quy mô nhỏ.",
    reskill: "Đào tạo lại bài bản từ đầu về Marketing Mix, SEO/Ads và mentoring 1-1 với trưởng nhóm Marketing."
  },
  K5: {
    upskill: "Tham gia hỗ trợ lập kế hoạch tuần/tháng hoặc tham gia xây dựng ngân sách dự toán của phòng ban.",
    reskill: "Khóa học 'Quản trị cơ bản cho quản lý mới' và shadow Trưởng nhóm/Trưởng phòng trong 3 tháng."
  },
  S1: {
    upskill: "Đại diện nhóm báo cáo kết quả trước phòng ban hoặc tham gia khóa học kỹ năng thuyết trình thuyết phục.",
    reskill: "Tham gia các buổi rèn luyện kỹ năng nói, đào tạo lại phương pháp giao tiếp phi ngôn ngữ và mentoring 1-1."
  },
  S2: {
    upskill: "Khóa học xử lý khiếu nại khách hàng nâng cao hoặc tham gia đàm phán hợp đồng quy mô nhỏ.",
    reskill: "Mentoring dài hạn với Trưởng phòng Kinh doanh và trực tiếp shadow các cuộc đàm phán/thương thảo thực tế."
  },
  S3: {
    upskill: "Khóa học Excel nâng cao/Dashboard báo cáo và chịu trách nhiệm làm báo cáo tuần/tháng của bộ phận.",
    reskill: "Học lại từ đầu về tư duy phân tích dữ liệu, SQL/Excel cơ bản, kèm cặp trực tiếp bởi Data Analyst."
  },
  S4: {
    upskill: "Làm mentor hỗ trợ cho 1 nhân viên mới (On-the-job training) hoặc điều phối một dự án liên phòng ban nhỏ.",
    reskill: "Tham gia khóa học kỹ năng quản lý, phân cấp và coaching nhân viên một cách bài bản."
  },
  S5: {
    upskill: "Chủ trì giải quyết một sự cố/vấn đề phát sinh của nhóm bằng phương pháp phân tích nguyên nhân gốc rễ (5 Whys).",
    reskill: "Học khóa học kỹ năng tư duy phản biện và ra quyết định, shadow quản lý trong các ca xử lý khủng hoảng."
  },
  S6: {
    upskill: "Thi lấy chứng chỉ CRM nội bộ hoặc tự học các tính năng/phím tắt nâng cao của công cụ văn phòng.",
    reskill: "Đào tạo lại từ đầu các tính năng cốt lõi của phần mềm doanh nghiệp và kiểm tra thực hành hàng tuần."
  },
  A1: {
    upskill: "Trực tiếp tiếp nhận và giải quyết 3 trường hợp khách hàng khiếu nại/gặp khó khăn phức tạp.",
    reskill: "Khóa học chuyên sâu về Tư duy dịch vụ khách hàng xuất sắc (Service Mindset) và được kèm cặp bởi cá nhân xuất sắc."
  },
  A2: {
    upskill: "Đăng ký đảm nhận chỉ tiêu (KPI) thử thách hơn và tự lập kế hoạch hành động chi tiết để cam kết hoàn thành.",
    reskill: "Thiết lập lại mục tiêu công việc hàng ngày, báo cáo tiến độ chi tiết mỗi buổi chiều với quản lý trực tiếp."
  },
  A3: {
    upskill: "Nghiên cứu ứng dụng một phần mềm/công nghệ/phương pháp làm việc mới giúp nâng cao hiệu suất làm việc nhóm.",
    reskill: "Tham gia đầy đủ các buổi chia sẻ tri thức nội bộ và đặt mục tiêu đọc ít nhất 1 cuốn sách chuyên môn/tháng."
  },
  A4: {
    upskill: "Nhận phản hồi 360 độ từ đồng nghiệp để tự cải thiện và dẫn dắt 1 hoạt động gắn kết (team building) nhỏ.",
    reskill: "Tham gia khóa đào tạo lại về văn hóa doanh nghiệp, quy tắc ứng xử và các hoạt động làm việc nhóm thực tế."
  }
};
