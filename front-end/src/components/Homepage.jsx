import React, { useState, useEffect } from 'react';

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    hero: {
      position: 'relative',
      height: '100vh',
      background: backgrounds[currentBg],
      transition: 'background 1s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.2)',
      zIndex: 1,
    },
    heroContent: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      color: 'white',
      padding: '0 20px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 1s ease-out',
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 8vw, 5rem)',
      fontWeight: 800,
      marginBottom: '1.5rem',

      background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'pulse 3s ease-in-out infinite',
    },
    heroSubtitle: {
      fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
      marginBottom: '2rem',
      maxWidth: '600px',
      lineHeight: 1.6,
      textShadow: '1px 1px 2px rgba(255, 255, 255, 1)',
      opacity: 0.9,
      margin: '0 auto 2rem',
    },
    heroButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      padding: '15px 40px',
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
    },
    scrollIndicator: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
    },
    scrollMouse: {
      width: '30px',
      height: '50px',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '25px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '8px',
    },
    scrollWheel: {
      width: '4px',
      height: '12px',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '2px',
      animation: 'float 2s ease-in-out infinite',
    },
    companySection: {
      position: 'relative',
      marginTop: '-100px',
      zIndex: 20,
      padding: '0 20px',
    },
    companyCard: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '24px',
      padding: '60px 40px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    },
    companyLogo: {
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '6px solid white',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      margin: '0 auto 30px',
      display: 'block',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
    companyTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1a202c',
      marginBottom: '15px',
    },
    companyDesc: {
      fontSize: '1.2rem',
      color: '#64748b',
      lineHeight: 1.8,
      maxWidth: '600px',
      margin: '0 auto',
    },
    updatesSection: {
      padding: '100px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '80px',
    },
    sectionTitle: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#1a202c',
      marginBottom: '15px',
    },
    sectionDivider: {
      width: '80px',
      height: '4px',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      borderRadius: '2px',
      margin: '0 auto 15px',
    },
    sectionDesc: {
      fontSize: '1.2rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto',
    },
    footer: {
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center',
    },
    footerTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '15px',
    },
    footerDesc: {
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '40px',
    },
    socialButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      flexWrap: 'wrap',
    },
    socialButton: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      background: 'transparent',
      padding: '12px 24px',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  // CSS animations
  const keyframes = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroOverlay}></div>
          
          {/* Floating Elements */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>TaskFlow</h1>
            <p style={styles.heroSubtitle}>
              Ứng dụng quản lý trực tuyến cho phép cá nhân, nhóm tối ưu hóa công việc một cách hiệu quả.
            </p>
            <button 
              style={styles.heroButton}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Tìm hiểu ngay
            </button>
          </div>

          <div style={styles.scrollIndicator}>
            <div style={styles.scrollMouse}>
              <div style={styles.scrollWheel}></div>
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div style={styles.companySection}>
          <div 
            style={styles.companyCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS53uEHLBvKUNSXlML1Qa_qgRLcGc2fe4hJOA&s"
                alt="Company Logo"
                style={styles.companyLogo}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1) rotate(5deg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                }}
              />
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '24px',
                height: '24px',
                background: '#10b981',
                borderRadius: '50%',
                border: '3px solid white',
                animation: 'pulse 2s ease-in-out infinite',
              }}></div>
            </div>
            <h2 style={styles.companyTitle}>Nhóm bảy hết sảy</h2>
            <p style={styles.companyDesc}>
              Đội ngũ sáng tạo và đầy nhiệt huyết, luôn sẵn sàng mang đến những giải pháp tối ưu và trải nghiệm tuyệt vời nhất
            </p>
          </div>
        </div>

        {/* Latest Updates Section */}
        <div style={styles.updatesSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Cập nhật mới nhất</h2>
            <div style={styles.sectionDivider}></div>
            <p style={styles.sectionDesc}>
              Khám phá những dự án và thành tựu mới nhất của chúng tôi
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              {
                title: "Quản lý nhân sự & công việc",
                detail: "Admin có thể quản lý thông tin nhân viên, tài khoản, lịch làm việc, tạo và gán nhiệm vụ, theo dõi tiến độ, và phân tích hiệu suất.",
                imageSrc: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop",
                tag: "Mới",
                color: "#667eea"
              },
              {
                title: "Hỗ trợ nhân viên",
                detail: "Nhân viên có thể quản lý thông tin cá nhân, lịch làm việc, thực hiện và cập nhật nhiệm vụ, và xem thông báo.",
                imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
                tag: "Thành tựu",
                color: "#f093fb"
              },
              {
                title: "Cơ sở dữ liệu tối ưu",
                detail: "Hệ thống được xây dựng với các collection như users, accounts, sprints, tasks, taskcomments… giúp lưu trữ và truy xuất dữ liệu nhanh chóng.",
                imageSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
                tag: "Tương lai",
                color: "#4facfe"
              }
            ].map((post, index) => (
              <PostCard key={index} {...post} index={index} />
            ))}
          </div>
        </div>
        

        {/* Footer */}
        <div style={styles.footer}>
          <h3 style={styles.footerTitle}>Liên hệ với chúng tôi</h3>
          <p style={styles.footerDesc}>
            Sẵn sàng hợp tác và tạo ra những điều tuyệt vời cùng nhau
          </p>
          <div style={styles.socialButtons}>
            {['Facebook', 'Instagram', 'WhatsApp'].map((social) => (
              <button
                key={social}
                style={styles.socialButton}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'white';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {social}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const PostCard = ({ imageSrc, title, detail, tag, color, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyles = {
    card: {
      display: 'flex',
      flexDirection: window.innerWidth > 768 ? (index % 2 === 0 ? 'row' : 'row-reverse') : 'column',
      background: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      boxShadow: isHovered ? '0 20px 60px rgba(0, 0, 0, 0.15)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
    },
    imageContainer: {
      position: 'relative',
      width: window.innerWidth > 768 ? '50%' : '100%',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: window.innerWidth > 768 ? '400px' : '250px',
      objectFit: 'cover',
      transition: 'transform 0.6s ease',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    },
    tag: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      background: color,
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 600,
      animation: isHovered ? 'pulse 1s ease-in-out infinite' : 'none',
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
      opacity: isHovered ? 1 : 0,
      transition: 'opacity 0.3s ease',
    },
    content: {
      width: window.innerWidth > 768 ? '50%' : '100%',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: 'transform 0.3s ease',
      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#1a202c',
      marginBottom: '20px',
      position: 'relative',
    },
    titleUnderline: {
      content: '""',
      position: 'absolute',
      bottom: '-8px',
      left: 0,
      width: isHovered ? '60px' : '30px',
      height: '3px',
      background: color,
      borderRadius: '2px',
      transition: 'width 0.3s ease',
    },
    description: {
      color: '#64748b',
      lineHeight: 1.8,
      marginBottom: '30px',
      fontSize: '1.1rem',
    },
    button: {
      alignSelf: 'flex-start',
      background: `linear-gradient(45deg, ${color}, ${color}dd)`,
      color: 'white',
      border: 'none',
      padding: '12px 32px',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div
      style={cardStyles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={cardStyles.imageContainer}>
        <img
          src={imageSrc}
          alt={title}
          style={cardStyles.image}
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'; 
          }}
        />
        <div style={cardStyles.tag}>{tag}</div>
        <div style={cardStyles.overlay}></div>
      </div>

      <div style={cardStyles.content}>
        <div style={{ position: 'relative' }}>
          <h3 style={cardStyles.title}>{title}</h3>
          <div style={cardStyles.titleUnderline}></div>
        </div>
        <p style={cardStyles.description}>{detail}</p>
        <button
          style={cardStyles.button}
          onMouseEnter={(e) => {
            e.target.style.background = `linear-gradient(45deg, ${color}dd, ${color})`;
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `linear-gradient(45deg, ${color}, ${color}dd)`;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Đọc thêm
        </button>
      </div>
    </div>
  );
};

export default Homepage;