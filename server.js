import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

const app = express();
app.use(cors());

const LIVEKIT_API_KEY = "APIYxWcwM9VFDqa"; 
const LIVEKIT_SECRET = "njN4coiffHsfeDfvlwMP28HqI3YyWUXtVsbcAVnvie7B";
const LIVEKIT_URL = "wss://video-call-crns4gup.livekit.cloud";

app.get("/api/getToken", async (req, res) => { 
    const { room } = req.query;
    if (!room) return res.status(400).json({ error: "Thiếu ID phòng" });
  
    try {
      const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_SECRET, { identity: `user-${Date.now()}` });
      at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });
  
      const token = await at.toJwt(); 
      console.log("🔹 Token LiveKit:", token);
  
      res.json({ token });
    } catch (error) {
      console.error("🔴 Lỗi tạo token:", error);
      res.status(500).json({ error: "Không thể tạo token" });
    }
  });
  


app.listen(3001, () => console.log("🔹 Backend chạy tại http://localhost:3001"));
