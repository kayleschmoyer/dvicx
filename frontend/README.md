# Frontend

React Native app using Expo in TypeScript.

## Setup

```bash
npm install -g expo-cli
npm install
expo start
```

Environment variables can be configured in `.env`.

`EXPO_PUBLIC_API_URL` should point to your backend server URL. For testing on a
local network, set it to the IP address of your machine, e.g.

```
EXPO_PUBLIC_API_URL=http://192.168.7.185:3000/api
```

