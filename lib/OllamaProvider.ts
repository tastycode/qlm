const MSG_SEL = '.prose.chat-assistant, div.user-message'
import { chromium, devices } from 'playwright';
import { ChatProviderBase } from './qlm/ChatProvider'
const OLLAMA_EMAIL = 'sasha.devol@protonmail.com'
const OLLAMA_PASS = '0xOMOIYARIx0'
class OllamaProvider extends ChatProviderBase {
    private lastCount: number

    async authenticate() {
        console.debug('No login required')
        await this.page.goto('http://localhost:3000')
        await this.page.locator('input[type=email]').fill(OLLAMA_EMAIL)
        await this.page.locator('input[type=password]').fill(OLLAMA_PASS)
        await this.page.getByRole('button', { name: 'Sign In' }).click()
        await this.page.getByText('You\'re now logged in.')
        await this.page.getByRole('button', { name: 'Okay, Let\'s Go!' }).click()
        await this.page.selectOption('#models', { value: 'phi:latest'})
    }

    async invokePrompt(prompt:  string) {
        const countGreaterThan = (lastCount) => {
            const count = document.querySelectorAll('div.user-message,.chat-assistant.prose').length
            console.log('count is now', count, 'lastcount',lastCount);
            return count > lastCount
        }
        await this.page.getByPlaceholder('Send a message').fill(prompt)
        this.lastCount = await this.messageCount()
        await this.page.locator('button[type=submit]').click()
        await this.page.waitForFunction(countGreaterThan, this.lastCount)
    }

    async readResponse(options?: {returnMatching?: RegExp, responseLimit?: number}) : Promise<string> {
        let responseReady = false;
        while (!responseReady) {
            const newMessages = (await this.messageCount()) - this.lastCount
            responseReady = newMessages == 2
        }

        const fetchLastResponse = async () =>  this.page.evaluate(() => {
          return Promise.resolve([...document.querySelectorAll('div.user-message,.prose.chat-assistant')].at(-1)?.innerText);
        });

        let responseStableThresholdCount = 3
        const responseStableInterval = 750
        const responseStableLimit = 10000 /* 10 seconds */
        let lastResponseLength = (await fetchLastResponse()).length

        const stabilizeResponseCycle = (responseStableThresholdCount, initiallyStartedAt = Date.now()) => new Promise((resolve,reject) => {
            setTimeout(async () => {
                let nextStableThresholdCount = responseStableThresholdCount
                const lastResponse = await fetchLastResponse()
                const responseLength=  lastResponse.length
                if (responseLength == lastResponseLength) {
                    nextStableThresholdCount -= 1
                }
                if (nextStableThresholdCount > 0) {
                    // wait anothercycle
                    const elapsedTotal = Date.now() - initiallyStartedAt
                    if (elapsedTotal < responseStableLimit) {
                        console.log(options.returnMatching, options?.returnMatching.exec(lastResponse), lastResponse)
                        if (options?.returnMatching && options?.returnMatching.exec(lastResponse)) {
                            resolve(lastResponse)
                        } else if (options?.responseLimit && lastResponse.length > options?.responseLimit) {
                            resolve(lastResponse)
                        } else {
                            resolve(await stabilizeResponseCycle(responseStableThresholdCount, initiallyStartedAt))
                        }
                    } else {
                        console.error("Inference exceeded max time.",{lastResponse})
                        reject(new Error("Model response unstable after " + elapsedTotal + "ms"))
                    }
                } else {
                    resolve(lastResponse)
                }
            }, responseStableInterval)
        });
        return await stabilizeResponseCycle(responseStableThresholdCount)
    }

    async resetSession() {
        return await this.page.getByRole('link', { name: 'logo New Chat' }).click()
    }

    private async messageCount(): Promise<number> {
        return await this.page.evaluate(() => {
            return Promise.resolve(document.querySelectorAll('div.user-message, .prose.chat-assistant').length)
          });
    }

    static async create() : Promise<OllamaProvider> {
        await super.create()
    }

}

OllamaProvider.create = async () => {
    const instance = new OllamaProvider()
    await instance.init()
    return instance

}

module.exports = {
    OllamaProvider
}
