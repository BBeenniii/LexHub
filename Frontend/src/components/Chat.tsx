import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  // Ellenőrzés, hogy be van-e jelentkezve
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.get(
        `http://localhost:3001/messages/${userId}/${selectedUser._id}`
      );
      setMessageList(response.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        await axios.post("http://localhost:3001/messages", {
          sender_id: userId,
          receiver_id: selectedUser._id,
          content: message,
        });
        setMessage("");
        fetchMessages(); // Azonnal frissítjük az üzeneteket
      } catch (err) {
        console.error("Failed to send message", err);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000); // 3 másodpercenként frissítjük az üzeneteket
    return () => clearInterval(interval); // Tisztítjuk az intervallumot, amikor a komponens unmountol
  }, [selectedUser]);

  return (
    <div className="row">
      <div className="col-md-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="list-group">
          {users
            .filter((user: any) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user: any) => (
              <button
                key={user._id}
                className="list-group-item list-group-item-action"
                onClick={() => setSelectedUser(user)}
              >
                {user.name}
              </button>
            ))}
        </div>
      </div>
      <div className="col-md-8">
        {selectedUser ? (
          <div>
            <h3>Chat with {selectedUser.name}</h3>
            <div
              className="chat-box border p-3 mb-3"
              style={{ height: "300px", overflowY: "scroll" }}
            >
              {messageList.map((msg: any, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.sender_id === userId ? "right" : "left",
                    margin: "10px 0",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor:
                        msg.sender_id === userId ? "#d1e7dd" : "#f8d7da",
                      maxWidth: "60%",
                    }}
                  >
                    <strong>
                      {msg.sender_id === userId
                        ? "You"
                        : selectedUser.name}:
                    </strong>
                    <p>{msg.content}</p>
                    <small>{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn btn-primary ms-2" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;