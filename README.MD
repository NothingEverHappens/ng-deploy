To run the builder:
```sh
cd ../ng-deploy
npm start
```

In other terminal:

```sh
cd sample-app
npm link ../ng-deploy
ng add ng-deploy --project sample-app
npm i -g @angular-devkit/architect-cli@next
architect sample-app:deploy
```

or to debug 
```
node --inspect-brk $(which architect) sample-app:deploy
node --inspect-brk $(which ng) add ng-deploy --project sample-app
```

