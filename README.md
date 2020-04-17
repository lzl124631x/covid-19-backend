This project contains the code to power the api for covid projections web portal.

Install the stable version of yarn from - https://classic.yarnpkg.com/en/docs/install/#windows-stable

In the project directory, you can:

### Preferred IDE

VSCode - https://code.visualstudio.com/download <br />

### Step 0
`yarn install` to install all the needed node modules.<br/>

### Run the app in the development mode - `yarn start`
The API server runs on [http://localhost:6789](http://localhost:6789).

### Deployment to production
Install VSCode<br />
Install the azure app service extension from  https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice<br />
Run the command `yarn run build` to produce the dist folder.<br />

To deploy the app using the dist folder, follow this link - https://docs.microsoft.com/en-us/azure/javascript/tutorial-vscode-azure-app-service-node-01?tabs=bash
