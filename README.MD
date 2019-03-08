
```
cd sample-app
npm link ../ng-deploy
node --inspect-brk ./node_modules/.bin/ng run sample-app:deploy
```

To run the builder:

```
npm i -g @angular-devkit/architect-cli@next
architect sample-app:deploy
```
