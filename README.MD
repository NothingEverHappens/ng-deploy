# Angular-cli deploy to firebase

This angular schematic would allow you to deploy you Angular app to Firebase Hosting.

## Installing 
Run `ng --version`, make sure you have angular CLI version greater than 8.

Add the schematic by running: 

```sh
ng add kirjs-test-ng-deploy
```

This command will prompt you to login to firebase and configure the project.

## Deploying

```sh
ng deploy:firebase ?? this is tbd
```

### TODO:(kirjs): Remove below or find a better name

To run the builder:
```sh
cd ng-deploy
npm install
npm start
```

In other terminal:

```sh
cd sample-app
npm install
npm link ../ng-deploy
ng add ng-deploy --project sample-app
npm i -g @angular-devkit/architect-cli@next
architect sample-app:deploy

## Or to test with the second app.
ng add ng-deploy --project second-app
architect second-app:deploy

```

or to debug 
```
node --inspect-brk $(which architect) sample-app:deploy
node --inspect-brk $(which ng) add ng-deploy --project sample-app
```
