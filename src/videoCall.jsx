import { useEffect, useState } from "react";
import { Room, createLocalVideoTrack } from "livekit-client";
import "./VideoCall.css";

const LIVEKIT_URL = "wss://video-call-crns4gup.livekit.cloud";

function VideoCall() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);
  const [participants, setParticipants] = useState([]);

  const createRoom = () => {
    const newRoomId = `room-${Date.now()}`;
    setRoomId(newRoomId);
    joinRoom(newRoomId);
  };

  const joinRoom = async (id) => {
    const roomToJoin = id || roomId;
    if (!roomToJoin) return alert("Vui lòng nhập ID phòng!");

    try {
      const response = await fetch(`https://callvideo-rdhq.onrender.com/api/getToken?room=${roomToJoin}`);
      const data = await response.json();
      if (!data.token) throw new Error("Không thể lấy token");
      console.log("🔹 Token nhận được:", data.token);

      const newRoom = new Room();
      await newRoom.connect(LIVEKIT_URL, data.token);
      setRoom(newRoom);
      setJoined(true);

      const track = await createLocalVideoTrack();
      setVideoTrack(track);
      newRoom.localParticipant.publishTrack(track);

      newRoom.on("participantConnected", (participant) => {
        console.log(`🟢 Người tham gia mới: ${participant.identity}`);
        setParticipants((prev) => [...prev, participant.identity]);
      });

      newRoom.on("trackSubscribed", (track, publication, participant) => {
        if (track.kind === "video") {
          console.log(`📹 Nhận video từ: ${participant.identity}`);

          let remoteVideo = document.getElementById(`video-${participant.identity}`);
          if (!remoteVideo) {
            remoteVideo = document.createElement("video");
            remoteVideo.id = `video-${participant.identity}`;
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            remoteVideo.className = "remote-video";
            document.querySelector(".video-wrapper").appendChild(remoteVideo);
          }
          track.attach(remoteVideo);
        }
      });
    } catch (error) {
      console.error("Lỗi kết nối LiveKit:", error);
      alert("Lỗi kết nối phòng, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    if (videoTrack) {
      const videoElement = document.getElementById("local-video");
      if (videoElement) {
        videoTrack.attach(videoElement);
      }
    }
  }, [videoTrack]);

  useEffect(() => {
    return () => {
      room?.disconnect();
    };
  }, [room]);

  return (
    <div className="video-container">
      <div className="log-container">
        <h3>📜 Người tham gia</h3>
        {participants.length === 0 ? (
          <p>Chưa có ai tham gia</p>
        ) : (
          participants.map((p, index) => (
            <div key={index} className="log-item">🟢 {p}</div>
          ))
        )}
      </div>

      {!joined ? (
        <div className="join-container">
          <h2>🎥 LiveKit Video Call</h2>
          <input
            type="text"
            placeholder="🔑 Nhập ID phòng"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="input-box"
          />
          <button onClick={() => joinRoom()} className="join-btn">🚀 Tham gia phòng</button>
          <button onClick={createRoom} className="create-btn">🔹 Tạo phòng mới</button>
        </div>
      ) : (
        <div className="call-container">
          <h3>📌 Đã vào phòng: <span className="room-id">{roomId}</span></h3>
          <div className="video-wrapper">
            <video id="local-video" autoPlay muted />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCall;