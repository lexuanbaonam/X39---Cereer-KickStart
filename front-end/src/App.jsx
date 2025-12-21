import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Profile from "./components/User/Profile";
import ResetPassword from "./components/User/ResetPassword";
import ForgotPassword from "./components/User/ForgotPassword";
import Homepage from "./components/Homepage";
import Notifications from "./components/Notification";
import Chat from "./components/Chat";
import PersonalWork from "./components/PersonalWork";
import VerifyEmailPage from "./components/User/VerifyEmailPage";
import CreateProfile from "./components/User/CreateProfile";
import PersonalTask from "./components/Task/PersonalTask";
import About from "./components/About";
import Timeline from "./components/Task/Timeline";
import SprintsPage from "./components/Sprint/SprintsPage";
import CreateSprint from "./components/Sprint/CreateSprint";
import Admin from "./components/Admin/Admin";
import AdminReport from "./components/Admin/AdminReport";
import AdminTimeline from "./components/Admin/AdminTimeline";
import MeetingSchedule from "./components/MeetingSchedule";
import NotFoundPage from "./components/NotFoundPage";

import DocumentsPage from "./components/DocumentsPage";
import AdminDecentralization from "./components/Admin/AdminDecentralization"; // Import AdminDecentralization
import ProjectsPage from "./components/ProjectsPage"; // Import ProjectsPage
import IncidentPage from "./components/IncidentPage"; // Import IncidentPage
import SupportRequestPage from "./components/SupportRequestPage"; // Import SupportRequestPage
import SupportResponsePage from "./components/SupportResponsePage"; // Import SupportResponsePage
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import InstructPage from "./components/InstructPage";

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null); // currentUser will contain the user object from /users/me API
  const [currentAccount, setCurrentAccount] = useState(null); // currentAccount will contain the account object from /accounts/me API
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchingUserRef = useRef(false);
  const fetchingAccountRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = useCallback((path) => {
    window.history.pushState(null, "", path);
    setCurrentPage(path);
  }, []);

  const fetchUserProfile = useCallback(async (token) => {
    if (!token || fetchingUserRef.current) {
      console.log(
        token
          ? "fetchUserProfile already in progress, skipping."
          : "No token provided to fetchUserProfile."
      );
      return { needsProfileCreation: false, error: false, user: null };
    }

    fetchingUserRef.current = true;
    try {
      const response = await fetch("https://back-end-hk2p.onrender.com/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user && data.user._id) {
          setCurrentUser(data.user);
          console.log("Fetched user profile:", data.user);
          return { needsProfileCreation: false, error: false, user: data.user };
        } else {
          setCurrentUser(null);
          console.warn("User profile data missing from API response:", data);
          return {
            needsProfileCreation: true,
            error: false,
            user: null,
            message: data.message || "Không tìm thấy hồ sơ người dùng.",
          };
        }
      } else {
        setCurrentUser(null);
        console.error("Error fetching profile, response not ok:", data.message);
        if (
          response.status === 404 ||
          data.message?.includes("Không tìm thấy thông tin người dùng")
        ) {
          return {
            needsProfileCreation: true,
            error: false,
            user: null,
            message: data.message || "Không tìm thấy hồ sơ người dùng.",
          };
        }
        return {
          needsProfileCreation: false,
          error: true,
          user: null,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Fetch profile network/unexpected error:", error);
      setCurrentUser(null);
      return {
        needsProfileCreation: false,
        error: true,
        user: null,
        message: error.message,
      };
    } finally {
      fetchingUserRef.current = false;
    }
  }, []);

  // New function to fetch account profile
  const fetchAccountProfile = useCallback(async (token) => {
    if (!token || fetchingAccountRef.current) {
      console.log(
        token
          ? "fetchAccountProfile already in progress, skipping."
          : "No token provided to fetchAccountProfile."
      );
      return { error: false, account: null };
    }

    fetchingAccountRef.current = true;
    try {
      const response = await fetch("https://back-end-hk2p.onrender.com/api/accounts/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.account && data.account.id) {
          setCurrentAccount(data.account);
          console.log("Fetched account profile:", data.account); // This will now log when fetched
          return { error: false, account: data.account };
        } else {
          setCurrentAccount(null);
          console.warn("Account profile data missing from API response:", data);
          return {
            error: true,
            account: null,
            message: data.message || "Không tìm thấy thông tin tài khoản.",
          };
        }
      } else {
        setCurrentAccount(null);
        console.error("Error fetching account, response not ok:", data.message);
        return {
          error: true,
          account: null,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Fetch account network/unexpected error:", error);
      setCurrentAccount(null);
      return {
        error: true,
        account: null,
        message: error.message,
      };
    } finally {
      fetchingAccountRef.current = false;
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentAccount(null); // Clear account on logout
    setIsInitializing(true);
    toast.info("Bạn đã đăng xuất.");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);
      if (authToken) {
        // Always attempt to fetch account profile if authToken exists
        const accountResult = await fetchAccountProfile(authToken);
        if (accountResult.error) {
          toast.error(
            accountResult.message ||
              "Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại."
          );
          handleLogout();
          setIsInitializing(false); // Stop initializing if account fetch fails and logs out
          return;
        }

        // Only then attempt to fetch user profile
        const profileResult = await fetchUserProfile(authToken);

        if (profileResult.needsProfileCreation) {
          toast.warn("Không tìm thấy hồ sơ người dùng. Vui lòng tạo hồ sơ.");
          navigate("/create-profile");
        } else if (profileResult.error) {
          toast.error(
            profileResult.message ||
              "Phiên đăng nhập không hợp lệ hoặc có lỗi. Vui lòng đăng nhập lại."
          );
          handleLogout();
        }
      } else {
        const publicPages = [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/about",
          "/timeline",
          "/documents",
          "/projects",
          "/incidents",
          "/support-requests", // Add support requests to public pages
          "/support-responses", // Add support responses to public pages
        ];
        if (
          !publicPages.some((publicPath) => currentPage.startsWith(publicPath))
        ) {
          navigate("/login");
        }
      }
      setIsInitializing(false);
    };

    initializeApp();
  }, [
    authToken,
    navigate,
    fetchUserProfile,
    fetchAccountProfile,
    currentPage,
    handleLogout,
  ]);

  const handleLoginSuccess = useCallback(
    async (token) => {
      localStorage.setItem("token", token);
      setAuthToken(token);
      toast.success("Đăng nhập thành công!");

      // Always attempt to fetch account profile after login
      const accountResult = await fetchAccountProfile(token);
      if (accountResult.error) {
        toast.error(
          accountResult.message ||
            "Đăng nhập thành công nhưng không thể tải thông tin tài khoản. Vui lòng thử lại."
        );
        handleLogout();
        return;
      }

      // Then attempt to fetch user profile
      const profileResult = await fetchUserProfile(token);
      if (profileResult.needsProfileCreation) {
        toast.warn("Bạn chưa có hồ sơ. Vui lòng tạo hồ sơ.");
        navigate("/create-profile");
      } else if (profileResult.error) {
        toast.error(
          profileResult.message ||
            "Đăng nhập thành công nhưng không thể tải hồ sơ. Vui lòng thử lại."
        );
        handleLogout();
      } else if (profileResult.user) {
        // If both account and user profile are successfully fetched, navigate to homepage
        navigate("/homepage");
      }
    },
    [fetchUserProfile, fetchAccountProfile, navigate, handleLogout]
  );

  const handleProfileCreatedOrUpdated = useCallback(async () => {
    toast.success("Hồ sơ đã được tạo/cập nhật thành công!");
    if (authToken) {
      // Re-fetch both account and user profile after profile creation/update
      const accountResult = await fetchAccountProfile(authToken);
      const profileResult = await fetchUserProfile(authToken);

      if (profileResult.user && accountResult.account) {
        navigate("/profile");
      } else {
        toast.error(
          "Có lỗi khi tải lại thông tin sau khi tạo/cập nhật hồ sơ. Vui lòng thử lại đăng nhập."
        );
        handleLogout();
      }
    }
  }, [
    authToken,
    fetchUserProfile,
    fetchAccountProfile,
    navigate,
    handleLogout,
  ]);

  const renderCurrentPage = () => {
    const path = currentPage;
    const publicPages = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/about",
      "/timeline",
      "/documents",
      "/projects",
      "/incidents",
      "/support-requests", // Add support requests to public pages
      "/support-responses", // Add support responses to public pages
    ];
    const isPublicPage = publicPages.some((publicPath) =>
      path.startsWith(publicPath)
    );

    if (isInitializing) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress />
          <p style={{ marginTop: "16px" }}>
            Đang tải dữ liệu phiên đăng nhập...
          </p>
        </div>
      );
    }

    // NEW LOGIC: Allow public pages even if not authenticated
    if (isPublicPage) {
      switch (true) {
        case path === "/login":
          return (
            <Login
              setCurrentPage={navigate}
              onLoginSuccess={handleLoginSuccess}
            />
          );
        case path === "/register":
          return <Register setCurrentPage={navigate} />;
        case path === "/forgot-password":
          return <ForgotPassword setCurrentPage={navigate} />;
        case path.startsWith("/reset-password/"):
          const resetToken = path.split("/reset-password/")[1];
          return <ResetPassword setCurrentPage={navigate} token={resetToken} />;
        case path.startsWith("/verify-email/"):
          const emailVerificationToken = path.split("/verify-email/")[1];
          if (!emailVerificationToken) {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "80vh",
                }}
              >
                <p>Mã xác minh email không hợp lệ hoặc bị thiếu.</p>
              </div>
            );
          }
          return (
            <VerifyEmailPage
              token={emailVerificationToken}
              setCurrentPage={navigate}
              onVerificationSuccess={handleLoginSuccess}
            />
          );
        case path === "/about":
          return <About />;
        case path === "/timeline":
          return <Timeline />;
        case path === "/documents":
          return (
            <DocumentsPage
              authToken={authToken}
              currentUser={currentUser}
              setCurrentPage={navigate}
            />
          );
        case path === "/projects":
          return (
            <ProjectsPage
              authToken={authToken}
              currentUserId={currentUser?._id}
            />
          );
        case path === "/incidents": // New case for IncidentPage
          return (
            <IncidentPage
              authToken={authToken}
              currentUserId={currentUser?._id}
              currentUserRoleTag={currentUser?.roleTag} // Pass role tag for conditional rendering
            />
          );
        case path === "/support-requests": // New case for SupportRequestPage
          return (
            <SupportRequestPage
              authToken={authToken}
              currentUserId={currentUser?._id}
              currentUserRoleTag={currentUser?.roleTag}
            />
          );
        case path === "/support-responses": // New case for SupportResponsePage
          return (
            <SupportResponsePage
              authToken={authToken}
              currentUserId={currentUser?._id}
              currentUserRoleTag={currentUser?.roleTag}
            />
          );
        default:
          return (
            <NotFoundPage setCurrentPage={navigate} homePath="/homepage" />
          );
      }
    }

    // If not a public page AND not authenticated, redirect to login
    if (!authToken) {
      navigate("/login");
      return null;
    }

    // Redirect authenticated users from login/register to homepage
    if (
      (path === "/login" || path === "/register") &&
      authToken &&
      currentUser &&
      currentAccount // Ensure account is also loaded
    ) {
      navigate("/homepage");
      return null;
    }

    // Redirect authenticated users without a profile to create-profile
    // This condition now correctly relies on currentUser being null, but authToken and currentAccount exist.


    // Helper for pages requiring authentication and user/account profiles
    const commonAuthProtectedPageCheck = () => {
      if (!authToken) {
        navigate("/login");
        return true; // Indicate that navigation happened, component should not render
      }
      if (!currentUser || !currentAccount) {
        // If authToken exists but currentUser or currentAccount is null (still loading or profile/account not found)
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              flexDirection: "column",
            }}
          >
            <CircularProgress />
            <p style={{ marginTop: "16px" }}>
              Đang tải thông tin người dùng và tài khoản...
            </p>
          </div>
        );
      }
      return false; // Indicate that checks passed, component can render
    };

    switch (true) {
      case path === "/profile":
        const profileCheck = commonAuthProtectedPageCheck();
        if (profileCheck === true) return null;
        if (profileCheck !== false) return profileCheck;
        return (
          <Profile
            setCurrentPage={navigate}
            currentUser={currentUser}
            authToken={authToken}
            onProfileUpdate={handleProfileCreatedOrUpdated}
          />
        );
      case path === "/create-profile":
        if (!authToken || !currentAccount) {
          // Ensure currentAccount is loaded before allowing profile creation
          navigate("/login");
          return null;
        }
        return (
          <CreateProfile
            setCurrentPage={navigate}
            authToken={authToken}
            onProfileCreated={handleProfileCreatedOrUpdated}
          />
        );
      case path === "/sprints":
        const sprintsCheck = commonAuthProtectedPageCheck();
        if (sprintsCheck === true) return null;
        if (sprintsCheck !== false) return sprintsCheck;
        return (
          <SprintsPage
            authToken={authToken}
            currentUser={currentUser}
            setCurrentPage={navigate}
          />
        );
        case path === "/huong-dan":
          return<InstructPage/>

      case path === "/create-sprint":
        const createSprintCheck = commonAuthProtectedPageCheck();
        if (createSprintCheck === true) return null;
        if (createSprintCheck !== false) return createSprintCheck;
        return (
          <CreateSprint
            authToken={authToken}
            currentUser={currentUser}
            setCurrentPage={navigate}
          />
        );
      case path === "/personal-work":
        const personalWorkCheck = commonAuthProtectedPageCheck();
        if (personalWorkCheck === true) return null;
        if (personalWorkCheck !== false) return personalWorkCheck;
        return (
          <PersonalWork
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );
      case path === "/personal-task":
        const personalTaskCheck = commonAuthProtectedPageCheck();
        if (personalTaskCheck === true) return null;
        if (personalTaskCheck !== false) return personalTaskCheck;
        return (
          <PersonalTask
            setCurrentPage={navigate}
            authToken={authToken}
            currentUserId={currentUser._id}
          />
        );
      case path === "/notifications":
        const notificationsCheck = commonAuthProtectedPageCheck();
        if (notificationsCheck === true) return null;
        if (notificationsCheck !== false) return notificationsCheck;
        return (
          <Notifications
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );
      case path === "/chat":
        const chatCheck = commonAuthProtectedPageCheck();
        if (chatCheck === true) return null;
        if (chatCheck !== false) return chatCheck;
        return (
          <Chat
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );

      // ===== ADMIN ROUTES =====
      case path === "/admin":
        if (!authToken || !currentUser || !currentAccount) {
          toast.error("Bạn không có quyền truy cập trang Admin.");
          navigate("/homepage");
          return null;
        }
        if (currentAccount.role !== "ADMIN") {
          // Check role from currentAccount
          toast.error("Bạn không có quyền truy cập trang Admin.");
          navigate("/homepage");
          return null;
        }
        return (
          <Admin
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );
      case path === "/admin-report":
        if (
          !authToken ||
          !currentUser ||
          !currentAccount ||
          currentAccount.role !== "ADMIN"
        ) {
          toast.error("Bạn không có quyền truy cập báo cáo.");
          navigate("/homepage");
          return null;
        }
        return (
          <AdminReport
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );

      case path === "/admin-timeline":
        if (
          !authToken ||
          !currentUser ||
          !currentAccount ||
          currentAccount.role !== "ADMIN"
        ) {
          toast.error("Bạn không có quyền truy cập timeline quản trị.");
          navigate("/homepage");
          return null;
        }
        return (
          <AdminTimeline
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );
      case path === "/admin-decentralization": // Add this new case for AdminDecentralization
        if (
          !authToken ||
          !currentUser ||
          !currentAccount ||
          currentAccount.role !== "ADMIN"
        ) {
          toast.error("Bạn không có quyền truy cập trang phân quyền quản trị.");
          navigate("/homepage");
          return null;
        }
        return (
          <AdminDecentralization
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
            currentAccount={currentAccount}
          />
        );
      case path === "/meeting-schedule":
        const meetingScheduleCheck = commonAuthProtectedPageCheck();
        if (meetingScheduleCheck === true) return null;
        if (meetingScheduleCheck !== false) return meetingScheduleCheck;
        return (
          <MeetingSchedule
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );

      case path === "/homepage":
      case path === "/":
        const homepageCheck = commonAuthProtectedPageCheck();
        if (homepageCheck === true) return null;
        if (homepageCheck !== false) return homepageCheck;
        return (
          <Homepage
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );

      default:
        if (!authToken) {
          navigate("/login");
          return null;
        }
        return <NotFoundPage setCurrentPage={navigate} homePath="/homepage" />;
    }
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigate}
        currentUser={currentUser}
        currentAccount={currentAccount}
        onLogout={handleLogout}
        authToken={authToken}
      />
      {renderCurrentPage()}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
