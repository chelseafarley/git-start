# git-start
For MacOS.
This npm package creates a command that allows users to create git repos quickly with .gitignore for desired tech stack.

## Getting Started
1. Install the npm package

```npm install -g @chelseas/git-start```

2. Go create a personal access token with access to git repos: 
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-token

3. Open Keychain Access on the mac and store the personal access token there. 

4. Update gitconfig to have your username:

```git config --global user.username gitusername```

5. Run the following command where you want to create your new repo:

```git-start```
