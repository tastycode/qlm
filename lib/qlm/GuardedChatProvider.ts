/*
 *  Disregard, this was going to be an implementation of what I emailed you about.
 *  It's kind of a cool thought, what if I wrapped any model in a "metamodel" that
 *  did all the tracking of user prompt history and behavioral analysis. Also wrapping the ensemble-oriented approach of asking several models to answer the prompt and using another model to synthesize a cohesive result and sanitize it for the downstream consumer and just
 *  exposed all of it via the same standard /chat/completions API. You could probably offer that service to other LLM vendors, they'd probably pay. Especially if you gave them control over their content policies
 *  and integrated LlamaGuard and google text moderation. Anyway..that's where this was heading but that was a distraction.
 */
import { ChatProvider} from './ChatProvider'
class GuardedChatProvider implements ChatProvider {
    #coreProvider: ChatProvider
    constructor(coreProvider: ChatProvider) {
         this.#coreProvider = coreProvider
    }
    async invokePrompt(prompt: string) {
        //


    }
}
