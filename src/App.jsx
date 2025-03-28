import { useState, useEffect } from "react";
import VideoCall from "./videoCall";
import { auth, signInWithGoogle, signInWithGitHub, logOut } from "./firebase";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import "./App.css"; // Import CSS mới

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (

    <div className="aaa">

      <div className="app-container">
        <div className="background"></div>

        <div className="content">
          <h1 className="group-title">Nhóm 6 - Sáng thứ 6</h1>

          <h1>Video Call App</h1>
          {user ? (
            <div className="user-info">
              <p>Xin chào, <span>{user.displayName}</span></p>
              <button onClick={logOut} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
              <VideoCall />
            </div>
          ) : (
            <div className="login-buttons">
              <button onClick={signInWithGoogle} className="google-btn">
                <i className="fab fa-google"></i> Đăng nhập với Google
              </button>
              <button onClick={signInWithGitHub} className="github-btn">
                <i className="fab fa-github"></i> Đăng nhập với GitHub
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
