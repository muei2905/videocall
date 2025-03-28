import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    GithubAuthProvider, 
    signInWithPopup, 
    signOut 
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBa3shUPwhPs-mLOtIPYxQI6QLLiljg4bQ",
    authDomain: "call-video-b3a23.firebaseapp.com",
    projectId: "call-video-b3a23",
    storageBucket: "call-video-b3a23.firebasestorage.app",
    messagingSenderId: "878759658491",
    appId: "1:878759658491:web:474909d4a1b1b3e26f415e",
    measurementId: "G-BTY9X6HJK8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const handleSignInError = (error) => {
    if (error.code === "auth/account-exists-with-different-credential") {
        alert("Tài khoản đã tồn tại với một phương thức đăng nhập khác.\nVui lòng sử dụng phương thức đã dùng trước đó.");
    } else if (error.code === "auth/popup-closed-by-user") {
        alert("Cửa sổ đăng nhập đã bị đóng trước khi hoàn tất. Vui lòng thử lại!");
    } else {
        alert("Lỗi đăng nhập: " + error.message);
        console.error("Lỗi chi tiết:", error);
    }
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("🔹 Đăng nhập Google thành công:", result.user);
    } catch (error) {
        handleSignInError(error);
    }
};

export const signInWithGitHub = async () => {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        console.log("🔹 Đăng nhập GitHub thành công:", result.user);
    } catch (error) {
        handleSignInError(error);
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        console.log("🔹 Đã đăng xuất thành công");
    } catch (error) {
        alert("Lỗi đăng xuất: " + error.message);
    }
};

export { auth };
