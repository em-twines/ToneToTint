# ToneToTint
An ai-powered color generator utilizing OpenAI's Mood to Color api.

To view a deployed build: https://tonetotint.netlify.app/

Description: 
This application starts with a default text and color, then uses react hook form to capture an input and submit that input as content in an api call to the ai endpoint. 
It then returns the response, unpacks it two ways depending on the structure of the response (hex or rgb), and updates a ui element that shows a new color. 

See an example of the endpoint in action here: https://platform.openai.com/examples/default-mood-color


Project setup: 
created using "npx create-next-app@latest --typescript"
- using ESLint
- using Tailwind
- using src/ as directory
- using import alias "@/"


To run: 
- supply a valid api key to a .env file located at the root of the project
- be sure line 6 of form.tsx is commented out
- npm run dev 


To run jest testing: 
- comment in line 6 of form.tsx
- npm test


Future itereations will incluced: 
- a more extensive testing suite
- further refactoring of the api call 