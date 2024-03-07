![](https://www.dropbox.com/scl/fi/fyhcvd47r9vmdf66uvn1g/2024-03-07-entrevista.mov?rlkey=v6i41vxld2e24x90q7aa18olf&raw=1)

There isn't one cohesive thing to run here, a lot of bits that come together to create what I showed you in the video
explainer to me doubling back on not actually sending you any code. Of course I should have sent you some code.

## data

`data` - this pulls down some stuff from hugging face. the fuzzer was still too non-deterministic last I checked. It would have been easier if i had ChatGPT's magic parameter to limit responses to JSON. Or if i had a bit more experience with traditional example-based text generation methods, but then again, it would be easier if people didn't speed down rampart by elysian fields at 3pm every day.
`cd data`
`python -m venv venv`
`source ./venv/bin/activate`
`pip install -r requirements.txt`

## the main repo

this contains a framework for running blackbox QA against any LLM reachable via node. It's pointing to browser-accessible LLMs right now because it felt that e2e would be the highest fidelity in terms of capturing the true stream of data that would be made available to a model for informing it of the user's fidelity/integrity. I spent some years working on security for indiegogo.com and there we had quite a bit of questionable activity. The typical things that LLM Guard looks for are all classes of behavior that my collaborators would likely make rules to identify using platforms such as Sift. Sift would look at a few examples of malicious user behavior and use ML to inform a "risk score" that we could use to change what the user experienced. Though itspossible to abandon these "old ways" and strictly use LLMs to prevent malicious actors, it seems that it would likely not hurt to use the "old ways" in conjunction with the new ways. Since platforms like sift integrate with the frontend, and use browser-fingerprinting to identify patterns in malicious users, it made sense to develop a black box testing framework in JS/TS. Plus, I really get nervous when I jump into the nearly typeless horrifying freedom of python.

`npm install`
`npx playwright test --headed`

## deps/synth

Synth is a synthetic data generation framework. It has the ability to create data based on rudimentary descriptions of the types of features required. When I was trying to build the entire end-to-end implementation of what i proposed in what initially turened in, the idea was to generate test data by using a combination of public LLM conversational datasets, e2e testing, and pointing synth at the datastore for openwebui. I didn't go too far down this path though, because I realized the interview question was not "build a chatbot with controls for ethical operation". However, I have a framework to draw upon that I still haven't read the feedback for. Soon... just gotta finish this readme, and edit a video...

Right, so the installation docs for synth are atrocious. They just have you blindly `curl` into bash. Like a madperson. So I took the liberty of dockerizing their rust build process. `deps/synth/Dockerfile` has that lovely 4-5 hour distraction and a 30 minute long build time.

`git submodule update --init --recursive` this will pull down synth
`cp deps/Dockerfile.synth deps/synth/Dockerfile`
`docker build -t deps/synth:latest deps/synth`
`docker run deps/synth:latest generate test/entities/users.json` (may take several days to run)

_PS: If you regularly pipe stuff to your shell from the internet. More power to you. I just feel like its going to byte me one day :P. I'm a huge fan of reproducible configuration, like nix-os stuff. Nix people don't install things by piping to their shell. They breakout their father's rust compiler and pay the iron price!_
