import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Change style as needed
import "./ChatBox.css";
import { getAddress } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

const text = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Level1 {
    mapping(address => uint256) public contributions;
    address public owner;

    constructor() {
        owner = msg.sender;
        contributions[msg.sender] = 1000 * (1 ether);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function contribute() public payable {
        require(msg.value < 0.001 ether);
        contributions[msg.sender] += msg.value;
        if (contributions[msg.sender] > contributions[owner]) {
            owner = msg.sender;
        }
    }

    function getContribution() public view returns (uint256) {
        return contributions[msg.sender];
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function isWon() public view returns (bool) {
        return msg.sender == owner;
    }

    receive() external payable {
        require(msg.value > 0 && contributions[msg.sender] > 0);
        owner = msg.sender;
    }
}`;

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [contract, setContract] = useState(true);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const [score, setScore] = useState(1000);
    const userAvatar = "https://i.pravatar.cc/40";
    const botAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712104.png";

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input, avatar: userAvatar };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_PUBLIC_AGENT_URL}/chat`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: input,
                        level: 1,
                    }),
                }
            );
            const data = await response.json();
            const aiMessage = {
                role: "ai",
                content: data.response,
                avatar: botAvatar,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setScore(score - 1);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Error getting response.", avatar: botAvatar },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="chat-container">
            {contract?( <div className="chat-header" style={{justifyContent:"center"}}>
                {/* <div>AI Chat</div> */}
                <button onClick={() => setContract((prev) => !prev)}>
                    {contract ? "Show AI Chat" : "Show Contract"}
                </button>
                {/* <div>Score: {score}</div> */}
            </div>):( <div className="chat-header">
                <div>AI Chat</div>
                <button onClick={() => setContract((prev) => !prev)}>
                    {contract ? "Show AI Chat" : "Show Contract"}
                </button>
                <div>Score: {score}</div>
            </div>)}
           

            <div className="chat-box" style={{width: contract?"100%":"90%", marginLeft: contract?"0px":"5%"}}>
                {contract ? (
                    <div className="contract-text">
                        <SyntaxHighlighter
                            language="solidity"
                            style={dracula}
                            wrapLongLines={true}  // Enables word wrap
                            showLineNumbers={false}
                            className="highlight"
                        >
                            {text}
                        </SyntaxHighlighter>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.role}`}>
                                <img src={msg.avatar} alt="avatar" className="avatar" />
                                <div className={`message ${msg.role}`}>{msg.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message-wrapper ai">
                                <img src={botAvatar} alt="avatar" className="avatar" />
                                <div className="message ai">Typing...</div>
                            </div>
                        )}
                    </>
                )}
                <div ref={chatEndRef} />
            </div>
            {contract?(<></>):(<div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} disabled={loading}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2983/2983788.png"
                        alt="Send"
                        className="send-icon"
                    />
                </button>
            </div>)}

            
        </div>
    );
};

export default ChatBox;
