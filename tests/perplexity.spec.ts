const  { PerplexityProvider } = require('./../lib/PerplexityProvider')
const { expect, test } = require('playwright/test')

const { beforeAll, describe, it } = test
console.log('PP', PerplexityProvider, 'PPp', PerplexityProvider.create)

/*
 * Verifies whether the test framework runs
 */
describe("Perplexity", () => {
  let provider
  beforeAll(async () => {
    provider = await PerplexityProvider.create()
    await provider.login()

  });

  test('should know its identity', async () => {
    await provider.invokePrompt('Who do you think you are?')
    const response = await provider.readResponse()
    console.log({response})
  });
});
