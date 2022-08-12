## Steps to run the app

1. Create a `.env` file in root & copy the keys from [.env.sample](.env.sample) file
1. Install the dependencies with `npm install`
1. Start the server in development `npm start`
1. Command to deploy on production - npm run deploy

## Production using pm2
1. create file .pm2.json in root directory
1. paste .pm2.json.sample file content into .pm2.json file or can edit pm2 configs 
1. pm2:deploy - install all dependencies and deploy app
1. pm2:stop - stop pm2 instance
1. pm2:restart - restart running pm2 instance