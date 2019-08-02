
# Deployment

## Create environment file
Firstly, create `.env` file including these information:

```
API_HOST=http://localhost:3000
BASE_URL=http://localhost:3000
HOST=localhost
PORT=3000
NODE_ENV=development
GOOGLE_API_KEY= your google api key
PAYPAL_CLIENT_ID= your paypal client id
```

## install packages

Run the command:
```
npm install
```

## build project

```
npm run build
```

## start project 

development mode: 
```
npm run dev
```

production mode: 
```
npm start
```

# References

* next proxy https://github.com/zeit/next.js/blob/master/examples/with-custom-reverse-proxy/server.js
* next authentication https://github.com/alan2207/nextjs-jwt-authentication
* https://github.com/alan2207/nextjs-jwt-authentication/blob/master/pages/whoami.js
* config next js and ant design 
    * https://blog.csdn.net/zhumengzj/article/details/87286586
    * https://www.yuque.com/steven-kkr5g/aza/ig3x9w
* config next js and styled component
    * https://dev.to/aprietof/nextjs--styled-components-the-really-simple-guide----101c
