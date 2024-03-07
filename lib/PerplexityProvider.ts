const MSG_SEL = 'div.prose.inline.leading-normal'
import { chromium, devices } from 'playwright';
import { ChatProviderBase } from './qlm/ChatProvider'

class PerplexityProvider extends ChatProviderBase {
    private lastCount: number

    async authenticate() {
        console.debug('No login required')
        await this.page.goto('https://labs.perplexity.ai/')
    }

    async invokePrompt(prompt:  string) {
        await this.page.locator('textarea[autocomplete=off][autofocus]').fill(prompt)
        await this.page.locator('button.rounded-full[type=button]').click()
        this.lastCount = await this.messageCount()
        // returns once user prompt is reflected in UI
        await this.page.waitForFunction(() => {
            const count = document.querySelectorAll(MSG_SEL).length
            return count > this.lastCount && (count % 2 == 0)
        })
    }

    async readResponse() {
        // blocks until response received
        await this.page.waitForFunction(() => {
            const count = document.querySelectorAll(MSG_SEw).length
            const newMessages = count - this.lastCount
            return Promise.resolve(newMessages == 2)
        })

        return await this.page.evaluate(() => {
          return Promise.resolve([...document.querySelectorAll(MSG_SEL)].at(-1).innerText);
        });
    }

    private async messageCount(): Promise<number> {
        return await this.page.evaluate(() => {
            return Promise.resolve(document.querySelectorAll(MSG_SEL).length)
          });
    }

    static async create() : Promise<PerplexityProvider> {
        await super.create()
    }

}

PerplexityProvider.create = async () => {
    const instance = new PerplexityProvider()
    await instance.init()
    return instance

}

module.exports = {
    PerplexityProvider
}
