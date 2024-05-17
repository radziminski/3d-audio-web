# 3D sound in web applications

Repository containing source code for the evaluation platform used to analyze four technologies used to create 3D sound in web applications:

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Resonance Audio](https://resonance-audio.github.io/resonance-audio/)
- [JS Ambisonics](https://github.com/polarch/JSAmbisonics)
- [Mach1 Audio SDK](https://github.com/Mach1Studios/m1-sdk)

The results of the performance evaluation can be found in `results/performance` directory.
The results of the user survey can be found in form of CSV files in `results/survey` directory.

## Application demo

[Application demo on Youtube](https://youtu.be/NWnre1SebSs)

## Getting started

To run the project you will need `Node.js` v18.17.0 and `yarn` v1. To install the packages run: 
```
yarn install
```

Keep in mind, that this project uses PostgreSQL as a database. To run the project with all functionalities you will need PosgtreSQL database and a `.env` file with all necessary variables (see `.env.example`). You will also need to push the database schema using: 
```
yarn db:push
```

To run the application in development mode use: 
```
yarn dev
```

To run the application in production mode use: 
```
yarn build && yarn start
```

## Tests

This project uses automated tests written in (Playwright)[https://playwright.dev/]. To run these tests use: 
```
yarn test
``` 
