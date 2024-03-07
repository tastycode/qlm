class ChatMessage {
    constructor(public role: "user"|"assistant"|"system", content: string) {}
}

export default ChatMessage
