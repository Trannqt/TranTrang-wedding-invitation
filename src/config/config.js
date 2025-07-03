// config/config.js
const config = {
  data: {
    title: "Trường Trận & Minh Trang",
    description: "Trận Yêu Trang",
    groomName: "Trường Trận",
    brideName: "Minh Trang",
    parentGroom: "Bố mẹ Trường Trận",
    parentBride: "Bố mẹ Minh Trang",
    date: "2025-07-15",
    dateChurnch: "2025-07-12",
    // THÊM THÔNG TIN SỰ KIỆN RIÊNG CHO NHÀ NAM VÀ NHÀ NỮ
    groomEvent: {
      date: "2025-07-15", // Ngày sự kiện nhà nam
      time: "09:00", // Giờ sự kiện nhà nam
      location: "Gia đình chú rể Trường Trận", // Địa điểm nhà nam
      address: "Số 123, Đường A, Quận B, TP.HCM", // Địa chỉ nhà nam
      title: "Lễ Dạm Ngõ (Nhà Chú Rể)", // Tiêu đề sự kiện nhà nam (tùy chọn)
    },
    brideEvent: {
      date: "2025-07-13", // Ngày sự kiện nhà nữ
      time: "10:00", // Giờ sự kiện nhà nữ
      location: "Gia đình cô dâu Minh Trang", // Địa điểm nhà nữ
      address: "Số 456, Đường C, Quận D, TP.HCM", // Địa chỉ nhà nữ
      title: "Lễ Ăn Hỏi (Nhà Cô Dâu)", // Tiêu đề sự kiện nhà nữ (tùy chọn)
    },
    maps_url: "https://maps.app.goo.gl/puZv2t8WNPr8kGzX8",
    maps_embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.89355447059!2d108.2009375!3d12.914562499999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316e03326ea42363%3A0x818c2664eb78140e!2zVzY3MitSOSwgS3LDtG5nIELDumssIMSQ4bqvayBM4bqvaw!5e0!3m2!1svi!2s!4v1751300092167!5m2!1svi!2s",
    time: "15:00 - 16:30",
    location: "Nhà Thờ giáo họ Tân Lập",
    address: "Cư M'gar, Cư Dliê M'nông, ĐắkLắk",
    ogImage: "/images/og-image.jpg",
    favicon: "/images/favicon.ico",
    heroImage: "/images/hero-wedding-background.jpg",
    loveQuote:
      "Tình yêu không phải là tìm một người để sống cùng, mà là tìm một người mình không thể sống thiếu.",
    saveTheDate: "SAVE THE DATE",
    agenda: [
      {
        title: "Lễ Vu Quy",
        date: "2025-07-13",
        startTime: "09:00",
        endTime: "12:00",
        location: "Cư M'gar, Cư Dliê M'nông, ĐắkLắk",
        address: "Cư M'gar, Cư Dliê M'nông, ĐắkLắk",
        description:
          "Lễ Vu Quy của cô dâu Minh Trang sẽ diễn ra tại gia đình cô dâu.",
        timeZone: "Asia/Ho_Chi_Minh",
      },
      {
        title: "Lễ Thành Hôn",
        date: "2025-07-15",
        startTime: "10:00",
        endTime: "12:00",
        location: "Chánh Hữu, Cát Chánh, Phù Cát, Bình Định",
        address: "Chánh Hữu, Cát Chánh, Phù Cát, Bình Định",
        description:
          "Lễ Thành Hôn của chú rể Trường Trận sẽ diễn ra tại gia đình chú rể.",
        timeZone: "Asia/Ho_Chi_Minh",
      },
    ],
    audio: {
      src: "audio/AThousandYears.mp3",
      title: "AThousandYears.mp3",
      autoplay: true,
      loop: true,
    },
    banks: [
      {
        bank: "Ngân hàng ACB",
        accountNumber: "1234567890",
        accountName: "TRƯỜNG TRẬN",
      },
      {
        bank: "Ngân hàng Vietcombank",
        accountNumber: "0987654321",
        accountName: "MINH TRANG",
      },
    ],
    wedding_images: [
      "public/images/LQP04640.jpg", // Thay thế bằng đường dẫn ảnh thật của bạn
      "public/images/LQP04716.jpg",
      "public/images/LQP04722.jpg",
      "public/images/LQP04793.jpg",
      "public/images/LQP04844.jpg",
      "/images/LQP05050.jpg",
      // Thêm nhiều ảnh khác nếu cần
    ],
    youtubeVideoId: "OTQ-Tb4EjCA", // <--- THÊM DÒNG NÀY (thay bằng ID video của bạn)
  },
  ui: {
    imageWedding: {
      subtitle: "Khoảnh Khắc Đáng Nhớ",
      title: "Bộ Sưu Tập Ảnh Cưới",
      description:
        "Cùng nhìn lại hành trình tình yêu của chúng tôi qua những bức ảnh tuyệt đẹp.",
    },
    hero: {
      saveDate: "Save The Date",
      weddingAnnouncement: "Hành trình yêu của chúng ta bắt đầu...",
      guestTitle: "", // <--- ĐẶT RỖNG
      guestPrefix: "", // <--- ĐẶT RỖNG
      guestDefaultName: "Quý khách",
      coupleImage: "images/LQP04716.jpg", // Path to your couple's image
      bouquetImage: "images/LQP04716.jpg", // Path to your bouquet image
    },
    events: {
      subtitle: "Lưu Ngày Trọng Đại",
      title: "Lịch Trình Hôn Lễ",
      description:
        "Chân thành kính mời Quý khách đến tham dự và chung vui cùng chúng tôi!",
      cardBackgroundColor: "rgba(255, 255, 255, 0.8)",
      cardBorderColor: "#FFB6C1",
    },
    location: {
      title: "Lễ Hôn Phối",
      subtitle: "Địa Điểm Tổ Chức",
      viewMap: "Xem Bản Đồ",
    },
    gifts: {
      title: "Món Quà Cưới",
      subtitle: "Gửi Tặng Món Quà",
      message:
        "Chúng tôi sẽ dành tặng tất cả các món quà cho các tổ chức từ thiện và nhà thờ đang cần sự giúp đỡ",
      arabicDua: "جزاكم الله خيرا وبارك الله فيكم",
      duaTranslation: "Cầu Chúa ban phước lành cho bạn",
      copy: "Sao chép",
      copied: "Đã sao chép!",
    },
    wishes: {
      subtitle: "WISHES & LOVE",
      title: "Lời Chúc Tốt Đẹp",
      nameLabel: "Tên của bạn",
      namePlaceholder: "Nhập tên của bạn",
      attendanceLabel: "Bạn có thể tham dự?",
      attendancePlaceholder: "Chọn trạng thái tham dự",
      wishLabel: "Lời chúc của bạn",
      wishPlaceholder: "Gửi lời chúc hạnh phúc đến cô dâu chú rể...",
      submitButton: "Gửi Lời Chúc",
      submitting: "Đang gửi...",
      attendanceOptions: [
        { label: "Có", value: "attending" },
        { label: "Không", value: "not-attending" },
        { label: "Có thể", value: "maybe" },
      ],
    },
    landing: {
      openInvitation: "Mở Thiệp Mời",
      colors: {
        background: "#FDF4F6", // Light pink/cream
        textColor: "#333333", // Dark grey for text
        highlightColor: "#E76F8D", // A shade of rose/pink
        cardBackground: "#FFFFFF", // White for cards
        cardBorder: "#FBE9EC", // Very light pink border
        iconColor: "#E76F8D", // Same as highlight color for icons
      },
      colorsHomePage: {
        backgroundLayoutGradient:
          "linear-gradient(to bottom right, #FFD1DC, #FFF0F5)",
        backgroundGradient:
          "linear-gradient(to bottom right, #FFE4E1, #FFC0CB)",
        cardBackground: "rgba(255, 255, 255, 0.4)",
        cardBorder: "rgba(255, 255, 255, 0.6)",
        textColor: "#6B2737",
        highlightColor: "#F472B6",
        buttonBackground: "linear-gradient(to right, #FF69B4, #FF1493)",
        buttonHoverBackground: "linear-gradient(to right, #FF1493, #FF69B4)",
        buttonText: "#FFFFFF",
        iconColor: "#F472B6",
      },
      fonts: {
        heading: "'Playfair Display', serif",
        body: "'Open Sans', sans-serif",
      },
      sparkleEffect: {
        enabled: true,
        count: 100,
        color: "rgba(255, 255, 255, 0.4)",
        size: "10px",
        animationDuration: "4s",
      },
      heartEffect: {
        enabled: true,
        count: 15,
        color: "rgba(255, 127, 127, 1)",
        size: "25px",
        animationDuration: "8s",
        delayOffset: 1,
      },
      brideEventLabel: "Lễ Vu Quy",
      groomEventLabel: "Lễ Thành Hôn",
    },
  },
};

export default config;
