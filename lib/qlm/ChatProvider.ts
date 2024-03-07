import { chromium, devices , Page, Browser} from 'playwright';

export interface ChatProvider {
    resetSession(): Promise<void>
    invokePrompt(prompt: string): Promise<void>;
    readResponse(): Promise<string>
}
export class ChatProviderBase implements ChatProvider {
    browser: Browser
    page: Page

    constructor() {
    }

    async init() {
        this.browser = await chromium.launch()
        this.page = await this.browser.newPage()
    }

    async resetSession(): Promise<void> {
        console.debug('ChatProviderBase:resetSession/Loop')
    }

    async readResponse() : Promise<string> {
        console.debug('ChatProviderBase:readResponse/Snoop')
        return ''
    }
    async invokePrompt(prompt: string) {
        console.debug('ChatProviderBase:invokePrompt/Boop')
    }
    async authenticate() {
        console.debug('ChatProviderBase:authenticate/Noop')

    }

    static async create() {
        const instance = new this()
        await instance.init()
        return instance

    }
}
export default ChatProvider
