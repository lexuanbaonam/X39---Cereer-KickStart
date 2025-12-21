import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  ChevronDown,
  User,
  LogOut,
  Home,
  Briefcase,
  Clock,
  Info,
  Shield,
  Settings,
  GitPullRequestDraft,
  FolderOpen,
  Bug,
  LifeBuoy,
} from "lucide-react";
import { FileText } from "lucide-react";
import { AdminPanelSettings } from "@mui/icons-material";

function Navbar({ currentPage, setCurrentPage, currentUser, currentAccount, onLogout, authToken }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [avatarAnchor, setAvatarAnchor] = useState(false);
  const [workAnchor, setWorkAnchor] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  // Define searchable pages (label, path, optional icon)
  const pages = [
    { label: "Trang chủ", path: "/homepage", icon: Home },
    { label: "Công việc - Sprint", path: "/sprints", icon: Settings },
    { label: "task", path: "/personal-task", icon: User },
    { label: "Tài liệu", path: "/documents", icon: FileText },
    { label: "Dự án", path: "/projects", icon: FolderOpen },
    { label: "Sự cố", path: "/incidents", icon: Bug },
    { label: "Timeline", path: "/timeline", icon: Clock },
    { label: "Về chúng tôi", path: "/about", icon: Info },
    { label: "Yêu cầu hỗ trợ", path: "/support-requests", icon: LifeBuoy },
    { label: "Xử lý yêu cầu", path: "/support-responses", icon: LifeBuoy },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Meetings", path: "/meeting-schedule", icon: Clock },
    // Admin pages (only useful if user is admin) — included for searchability
    { label: "Admin Dashboard", path: "/admin", icon: Shield },
    { label: "Báo cáo quản trị", path: "/admin-report", icon: Briefcase },
    { label: "Timeline quản trị", path: "/admin-timeline", icon: Clock },
    { label: "Phân quyền", path: "/admin-decentralization", icon: GitPullRequestDraft },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container") && !event.target.closest(".search-container")) {
        setAvatarAnchor(false);
        setWorkAnchor(false);
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults([]);
      setShowResults(false);
      setSelectedIndex(-1);
      return;
    }

    const q = searchTerm.trim().toLowerCase();
    const results = pages
      .filter((p) => p.label.toLowerCase().includes(q) || p.path.toLowerCase().includes(q))
      // Give exact-start matches priority
      .sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(q) ? -1 : 0;
        const bStarts = b.label.toLowerCase().startsWith(q) ? -1 : 0;
        return aStarts - bStarts;
      });

    setFilteredResults(results);
    setShowResults(results.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm]);

  const handleNavLinkClick = (path) => {
    setCurrentPage(path);
    setAvatarAnchor(false);
    setWorkAnchor(false);
    setShowResults(false);
    setSearchTerm("");
  };

  const styles = {
    navbar: {
      height: "72px",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isScrolled ? "rgba(255, 255, 255, 0.95)" : "white",
      backdropFilter: isScrolled ? "blur(20px)" : "none",
      borderBottom: "1px solid #e5e7eb",
      boxShadow: isScrolled
        ? "0 4px 20px rgba(0, 0, 0, 0.1)"
        : "0 1px 3px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
    },
    container: {
      height: "72px",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      textDecoration: "none",
    },
    logoIcon: {
      width: "32px",
      height: "32px",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
      color: "white",
      fontSize: "14px",
      fontWeight: "bold",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
    },
    navButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",

      borderRadius: "8px",
      fontSize: "15px",
      padding: "10px 14px",
      fontWeight: "500",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#374151",
    },
    navButtonActive: {
      color: "#3b82f6",
      background: "#eff6ff",
    },
    dropdown: {
      position: "relative",
    },
    dropdownMenu: {
      position: "absolute",
      top: "calc(100% + 8px)",
      left: 0,
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      border: "1px solid #e5e7eb",
      minWidth: "200px",
      padding: "8px 0",
      zIndex: 1001,
      opacity: 0,
      visibility: "hidden",
      transform: "translateY(-8px)",
      transition: "all 0.2s ease",
    },
    dropdownMenuOpen: {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },
    dropdownMenuItem: {
      width: "100%",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#374151",
      fontSize: "15px",
      padding: "14px 18px",
      transition: "all 0.15s ease",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    searchContainer: {
      position: "relative",
    },
    searchInput: {
      width: "256px",
      fontSize: "15px",
      padding: "10px 16px 10px 44px",
      border: "1px solid #d1d5db",
      borderRadius: "24px",
      background: "#f9fafb",
      outline: "none",
      transition: "all 0.2s ease",
    },
    searchInputFocus: {
      background: "white",
      borderColor: "#93c5fd",
      boxShadow: "0 0 0 3px rgba(147, 197, 253, 0.1)",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
    },
    resultsBox: {
      position: "absolute",
      top: "calc(100% + 8px)",
      left: 0,
      width: "320px",
      maxHeight: "320px",
      overflowY: "auto",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      zIndex: 1200,
    },
    resultItem: {
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      borderBottom: "1px solid #f3f4f6",
    },
    resultItemHover: {
      background: "#f9fafb",
    },
    iconButton: {
      position: "relative",
      padding: "8px",
      border: "none",
      background: "transparent",
      borderRadius: "50%",
      cursor: "pointer",
      color: "#6b7280",
      transition: "all 0.2s ease",
    },
    avatarButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "4px",
      border: "none",
      background: "transparent",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    avatar: {
      width: "36px",
      height: "36px",
      fontSize: "15px",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "500",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    },
  };

  const DropdownMenu = ({ isOpen, children, className = "", style = {} }) => (
    <div
      style={{
        ...styles.dropdownMenu,
        ...(isOpen ? styles.dropdownMenuOpen : {}),
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );

  const MenuItem = ({ onClick, icon: Icon, children, isLogout = false, isHovered, onMouseEnter, onMouseLeave, style = {} }) => (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...styles.dropdownMenuItem,
        ...(isHovered ? styles.resultItemHover : {}),
        ...(isLogout ? { color: "#dc2626" } : {}),
        ...style,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );

  const [hoveredStates, setHoveredStates] = useState({});

  const handleMouseEnter = (key) => {
    setHoveredStates((prev) => ({ ...prev, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setHoveredStates((prev) => ({ ...prev, [key]: false }));
  };

  // Helper to get initials from email
  const getInitialsFromEmail = (email) => {
    if (!email) return "";
    const parts = email.split("@")[0];
    if (parts.length === 0) return "";
    return parts.slice(0, 2).toUpperCase();
  };

  const handleKeyDown = (e) => {
    if (!showResults) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
        handleNavLinkClick(filteredResults[selectedIndex].path);
      } else if (filteredResults.length > 0) {
        handleNavLinkClick(filteredResults[0].path);
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => handleNavLinkClick("/homepage")}> 
          <div style={styles.logoIcon}>MA</div>
        </div>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <button onClick={() => handleNavLinkClick("/homepage")} style={{ ...styles.navButton, ...(currentPage === "/homepage" ? styles.navButtonActive : {}) }}>
            <Home size={16} />
            Trang chủ
          </button>

          <div style={styles.dropdown} className="dropdown-container">
            <button
              style={{ ...styles.navButton, ...(hoveredStates.work || workAnchor ? { background: "#f9fafb" } : {}) }}
              onMouseEnter={() => { handleMouseEnter("work"); setWorkAnchor(true); }}
              onMouseLeave={() => handleMouseLeave("work")}
            >
              <Briefcase size={16} />
              Công việc
              <ChevronDown size={14} style={{ marginLeft: 6 }} />
            </button>

            <div onMouseEnter={() => setWorkAnchor(true)} onMouseLeave={() => setWorkAnchor(false)}>
              <DropdownMenu isOpen={workAnchor}>
                <MenuItem onClick={() => handleNavLinkClick("/sprints")} icon={Settings}>Sprint</MenuItem>
                <MenuItem onClick={() => handleNavLinkClick("/personal-task")} icon={User}>Công việc cá nhân</MenuItem>
                <MenuItem onClick={() => handleNavLinkClick("/projects")} icon={FolderOpen}>Dự án</MenuItem>
                <MenuItem onClick={() => handleNavLinkClick("/documents")} icon={FileText}>Tài liệu</MenuItem>
                <MenuItem onClick={() => handleNavLinkClick("/incidents")} icon={Bug}>Sự cố</MenuItem>
              </DropdownMenu>
            </div>
          </div>

          <button onClick={() => handleNavLinkClick("/about")} style={{ ...styles.navButton, ...(currentPage === "/about" ? styles.navButtonActive : {}) }}>
            <Info size={16} />
            Về chúng tôi
          </button>
        </div>

        <div style={styles.rightSection}>
          {/* Search */}
          <div style={styles.searchContainer} className="search-container">
            <input
              ref={searchRef}
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { if (filteredResults.length) setShowResults(true); }}
              onKeyDown={handleKeyDown}
              style={{ ...styles.searchInput, ...(showResults ? styles.searchInputFocus : {}) }}
              aria-label="Search site pages"
            />
            <Search size={16} style={styles.searchIcon} />

            {showResults && (
              <div style={styles.resultsBox} role="listbox">
                {filteredResults.map((r, idx) => {
                  const Icon = r.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={r.path}
                      onMouseDown={(ev) => {
                        // mouseDown so the input doesn't lose focus before click
                        ev.preventDefault();
                        handleNavLinkClick(r.path);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{
                        ...styles.resultItem,
                        ...(isSelected ? styles.resultItemHover : {}),
                        background: isSelected ? "#f3f4f6" : "white",
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {Icon && <Icon size={16} />}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: 14 }}>{r.label}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{r.path}</div>
                      </div>
                    </div>
                  );
                })}
                {filteredResults.length === 0 && (
                  <div style={{ padding: 12, color: "#6b7280" }}>Không tìm thấy</div>
                )}
              </div>
            )}
          </div>

          {/* Conditional auth buttons & avatar */}
          {authToken && currentAccount ? (
            <>
              <button onClick={() => handleNavLinkClick("/notifications")} style={styles.iconButton}>
                <Bell size={20} />
                <span style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, background: "#ef4444", borderRadius: "50%" }}></span>
              </button>

              <button onClick={() => handleNavLinkClick("/chat")} style={styles.iconButton}>
                <MessageCircle size={20} />
                <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, background: "#10b981", borderRadius: "50%" }}></span>
              </button>

              <div style={{ position: "relative" }} className="dropdown-container">
                <button onClick={() => setAvatarAnchor(!avatarAnchor)} style={styles.avatarButton}>
                  <div style={styles.avatar}>{currentAccount ? getInitialsFromEmail(currentAccount.email) : "NA"}</div>
                  <ChevronDown size={14} style={{ color: "#9ca3af" }} />
                </button>

                <DropdownMenu isOpen={avatarAnchor} style={{ right: 0, left: "auto" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{currentAccount ? currentAccount.email : "Loading..."}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{currentAccount ? currentAccount.email : "Loading..."}</p>
                  </div>

                  <MenuItem onClick={() => handleNavLinkClick("/profile")} icon={User}>Profile</MenuItem>
                  <MenuItem onClick={() => handleNavLinkClick("/huong-dan")} icon={AdminPanelSettings}>Hướng dẫn</MenuItem>
                  <MenuItem onClick={() => handleNavLinkClick("/support-requests")} icon={LifeBuoy}>Yêu cầu hỗ trợ</MenuItem>

                  {currentAccount && currentAccount.role === "ADMIN" && (
                    <>
                      <MenuItem onClick={() => handleNavLinkClick("/admin")} icon={Shield}>Trang quản trị</MenuItem>
                      <MenuItem onClick={() => handleNavLinkClick("/admin-report")} icon={Briefcase}>Báo cáo</MenuItem>
                      <MenuItem onClick={() => handleNavLinkClick("/admin-timeline")} icon={Clock}>Timeline quản trị</MenuItem>
                      <MenuItem onClick={() => handleNavLinkClick("/admin-decentralization")} icon={GitPullRequestDraft}>Phân quyền</MenuItem>
                      <MenuItem onClick={() => handleNavLinkClick("/support-responses")} icon={LifeBuoy}>Xử lý yêu cầu</MenuItem>
                    </>
                  )}

                  <MenuItem onClick={() => { onLogout(); setAvatarAnchor(false); }} icon={LogOut} isLogout={true}>Logout</MenuItem>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => handleNavLinkClick("/login")} style={{ padding: "8px 16px", borderRadius: 24, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", border: "none" }}>Đăng nhập</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
