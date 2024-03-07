import ChatMessage from "./ChatMessage"
/*
 *  Unused, this was to be used as a starting point for a container that not only held
 *  the messages the user sees, but also the prompts and resulting responses for any meta models guarding the input and outputs.
 *  The intent being, you should be able to use a serialized ChatSession object to reliably
 *  reproduce any problematic interaction discovered. By passing serialized versions of these around you could
 *  simplify regression testing and the fine tuning of platform-level anti-toxicity controls.
 *
 */
class ChatSession {
    messages: ChatMessage[]

    lastResponse() {
        return this.messages.filter( m => m.role != "user").at(-1);
    }
    receiveMessage(message: ChatMessage) {
        this.messages.push(message)
    }
}
