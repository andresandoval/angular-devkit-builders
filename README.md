# on dev mode:

### For adding to node packages cache

```bash
npm link
```

for checking linked packages:

```bash
npm ls -g --link=true --depth=0
```

for removing a linked package:

```bash
npm rm --global @andresandoval/angular-devkit-builders
```

### For installing package on target project

```bash
npm link @andresandoval/angular-devkit-builders --save
```

# Publishing a version

1. Commit all git changes
2. Run ```npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease
   [--preid=<prerelease-id>] | from-git]``` for generate next package version,
   check https://docs.npmjs.com/cli/version for details
3. Run ```npm run build```
4. Goto dist folder ```cd dist```
5. Publish package ```npm publish```