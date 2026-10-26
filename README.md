# 🌊 Thập Tứ Tour - Cẩm Nang Du Lịch Quy Nhơn (4N3Đ)

> **Dự án học sinh Lớp 10A4 • Khóa 2026 • Trường THPT Lương Thế Vinh, TP. Hồ Chí Minh**  
> *Một cẩm nang du lịch trải nghiệm phi thương mại, chia sẻ chân thực lịch trình, địa điểm nổi bật và kinh phí tham khảo chuyến đi thực tế tại phố biển Quy Nhơn - Bình Định.*

---

## 📖 1. Giới Thiệu Dự Án

**Thập Tứ Tour** là website cẩm nang du lịch được xây dựng bởi tập thể học sinh **Lớp 10A4 (khóa 2026), Trường THPT Lương Thế Vinh - TP.HCM**. Xuất phát từ chuyến đi trải nghiệm thực tế cùng nhau tại Quy Nhơn, trang web được thiết kế nhằm lưu giữ kỷ niệm tuổi học trò và cung cấp thông tin hữu ích, minh bạch cho bất kỳ ai đang lên kế hoạch khám phá miền đất võ xứ Nẫu.

> [!NOTE]  
> **Tuyên bố phi thương mại:** Thập Tứ Tour là dự án cẩm nang thông tin học sinh, hoàn toàn phi lợi nhuận, **không kinh doanh tour và không nhận đặt tour du lịch**. Mức kinh phí `5.920.000đ / bạn` được công khai minh bạch như một khoản chi phí tham khảo thực tế của đoàn học sinh.

---

## ✨ 2. Các Tính Năng Nổi Bật

- 🌓 **Chế độ Sáng / Tối (Dark / Light Mode):** Tự động phát hiện theo hệ điều hành hoặc chuyển đổi thủ công chỉ với 1 chạm, độ tương phản cao, giao diện ban đêm không chói mắt.
- 🌐 **Hỗ trợ Song ngữ (Tiếng Việt & English):** Chuyển đổi ngôn ngữ mượt mà theo chuẩn Natural Writing, tự động đồng bộ toàn bộ nội dung từ cẩm nang, lịch trình đến nhãn nút.
- 🔍 **Tìm kiếm & Gợi ý Thông minh:** Tìm kiếm địa danh tức thì kết hợp thanh gợi ý từ khóa (Keyword Recommendation Chips) và hộp gợi ý tự động (Autocomplete Dropdown).
- 🗓️ **Lịch Trình Chi Tiết 4 Ngày 3 Đêm:** Từng mốc giờ cụ thể, địa điểm tham quan, ẩm thực đặc sản và phương án dự phòng thời tiết chu đáo (chuẩn bị dù & áo mưa).
- 🏷️ **Tập Trung Dữ Liệu Kinh Phí (`TOUR_CONFIG`):** Áp dụng kiến trúc *Single Source of Truth*, giá tour và thông tin chuyến đi được quản lý tại một biến duy nhất trong `js/tours.js` và render động qua template `{PRICE}` trong `i18n.js`.
- 📱 **Giao Diện Siêu Phản Hồi (Mobile First):** Header được tính toán layout chống va chạm, chống che khuất chữ trên mọi màn hình di động từ 320px, 360px (Samsung Galaxy), 375px/390px (iPhone) đến tablet và desktop.
- ♿ **Trợ Năng & Chuyển Động (A11y & Reduced Motion):** Tự động tắt con trỏ chuột tùy biến trên màn hình cảm ứng và tôn trọng cài đặt `prefers-reduced-motion: reduce`.
- 🚀 **Chuẩn Hóa SEO & Chia Sẻ Mạng Xã Hội:** Tích hợp đầy đủ thẻ Open Graph (Facebook, Zalo), Twitter Cards, `sitemap.xml` và `robots.txt` cho xem trước thumbnail bắt mắt khi gửi link.
- 📴 **Hỗ Trợ Xem Tĩnh (`<noscript>` Fallback):** Cung cấp tóm tắt lịch trình và danh sách địa danh đầy đủ cho các công cụ tìm kiếm (web crawlers) và người dùng không bật JavaScript.

---

## 📂 3. Cấu Trúc Thư Mục Dự Án

```plaintext
empobel/
├── css/
│   └── style.css            # Toàn bộ quy tắc giao diện, dark mode, responsive và animation
├── js/
│   ├── tours.js             # Dữ liệu 8 địa danh, timeline 4N3Đ & TOUR_CONFIG (Single Source of Truth)
│   ├── i18n.js              # Từ điển đa ngôn ngữ (VI/EN) tự động render {PRICE}
│   └── main.js              # Xử lý sự kiện, theme, search, marquee động & modal/drawer
├── index.html               # Trang chủ cẩm nang du lịch và lịch trình 4N3Đ
├── tour-detail.html         # Trang chi tiết thông tin và hình ảnh địa danh
├── contact.html             # Chuyển hướng nhanh về phần giới thiệu
├── robots.txt               # Khai báo crawler và liên kết sitemap
├── sitemap.xml              # Bản đồ liên kết phục vụ SEO
├── .gitattributes           # Cấu hình Git LFS cho file media lớn (*.mp4, *.mov)
├── .gitignore               # Loại bỏ file rác môi trường phát triển (.vscode/)
├── vercel.json              # Cấu hình bảo mật HTTP headers và định tuyến Vercel
├── about-quynhon.jpg        # Ảnh bìa toàn cảnh Quy Nhơn (tối ưu loading="lazy")
├── logo.png                 # Logo biểu trưng Thập Tứ Tour
├── favicon.svg              # Favicon vector
└── quy-nhon.mp4             # Thước phim trải nghiệm chuyến đi Quy Nhơn
```

---

## 🚀 4. Hướng Dẫn Cài Đặt & Chạy Thử Nghiệm

Dự án sử dụng công nghệ web thuần túy (**HTML5, Modern CSS, Vanilla JavaScript**), không yêu cầu build step hay framework cồng kềnh.

### Cách 1: Sử dụng Visual Studio Code (Live Server)
1. Cài đặt extension **Live Server** trong VS Code.
2. Mở thư mục dự án `empobel` trong VS Code.
3. Nhấp chuột phải vào file `index.html` và chọn **Open with Live Server** (hoặc phím tắt `Alt + L, Alt + O`).
4. Trang web sẽ tự động mở tại `http://127.0.0.1:5500/`.

### Cách 2: Sử dụng Node.js (http-server / serve)
```bash
# Cài đặt hoặc chạy server tĩnh nhanh
npx serve .
# hoặc
npx http-server . -p 3000
```
Truy cập trình duyệt tại địa chỉ `http://localhost:3000`.

---

## ☁️ 5. Quản Lý File Media & Deploy

### Quản Lý File Video Lớn (`quy-nhon.mp4`)
Repo đã được cấu hình sẵn **Git LFS** trong file `.gitattributes`:
```gitattributes
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
*.webm filter=lfs diff=lfs merge=lfs -text
```
> [!TIP]  
> **Khuyến nghị triển khai thực tế (Production):** Để giữ repo dung lượng nhẹ và đạt tốc độ tải video tối đa qua mạng phân phối nội dung (CDN), nên lưu trữ video tại các dịch vụ Object Storage chuyên dụng như **Cloudflare R2**, **AWS S3** hoặc nhúng qua trình phát **YouTube/Vimeo**.

### Triển Khai Lên Vercel
Dự án đã có sẵn file `vercel.json` với đầy đủ các Security Headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`).
```bash
# Deploy bằng Vercel CLI
vercel --prod
```

---

## 📜 6. Bản Quyền & Giấy Phép

© 2026 **Thập Tứ Tour** • Dự án học sinh Lớp 10A4 Trường THPT Lương Thế Vinh, TP. Hồ Chí Minh.  
Tất cả nội dung, hình ảnh và tư liệu thuộc về tập thể học sinh và được lưu hành vì mục đích giáo dục, lưu niệm và phi lợi nhuận.
