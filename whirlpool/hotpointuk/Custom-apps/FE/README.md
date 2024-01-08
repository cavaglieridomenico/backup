# Custom apps VTEX wiki (WIP)

# Table of Contents
1. [Introduction](#introduction)
2. [How to make/edit Custom VTEX Apps](#edit-vtex-apps)
3. [VTEX CLI Cheatsheets](#vtex-cli)
3. [Troubleshooting](#troubleshooting)
3. [Resources](#resources)

---

## **Introduction**
<a id="introduction"></a>

This repository contains all the custom vtex apps for both Whirlpool IT and Whirlpool RU.


**Important**: Only edit the code through feature branches made with git flow.

Most of the custom apps are inside the develop branch.

The template to make new apps is [this one](https://github.com/vtex-apps/react-app-template).

---


## **How to make/edit custom VTEX apps** 
<a id="edit-vtex-apps"></a>

As for now we're publishing the custom apps for Whirlpool inside [this repository](http://obiwan.replynet.prv/l.cavallera/custom-vtex-apps).
Here's a list of common tasks regarding custom apps.

- Create / Import custom app to custom-apps repository:

    1. Download the react-custom-app template from [vtex-apps/react-app-template](https://github.com/vtex-apps/react-app-template)

    2. Open a feature in the custom-vtex-apps repository
        
        > `git flow feature start <name>`

    3. Copy the template folder in the root custom-vtex-apps project folder alongside the others

    4. Install dependencies then link.
        Lot's of things can go wrong there like the unavailability of the installed dependencies and other confusing error messages that will interrupt the link. 
        I will update the troubleshooting as these kind of issues come up.

    5. Edit the app by making sure it's listed inside the linked apps.

    6. Publish the app:

        > `vtex release patch stable`
        > `vtex publish`
        > `vtex deploy <appId>`

    7. If the result looks alright you can close the feature:

        > `git flow feature finish <name>`


- Edit existing app in custom-vtex-apps repository

    1. Locate the app inside the repository and cd into it.

    2. Open a feature branch
    
    3. Cd into the app folder and link it

    4. Edit

    5. Publish the app:

        > `vtex release patch stable`
        > `vtex publish`
        > `vtex deploy <appId>`

- Import custom app in vtex theme

    1. <++>

---
## VTEX CLI CHEATSHEET
<a id="vtex-cli"></a>

> `vtex login <account>`

This is not the email address but rather the vtex account who owns the project for example ruwhirlpool.

> `vtex browse`

Opens a browser instance with the current workspace version of the project. 

> `vtex whoami`

Outputs the current user account, email and workspace

> `vtex use <workspace>`

Moves the user to the selected workspace

> `vtex ls`

List the installed and linked apps for current workspace

> `vtex workspace ls`

List the available workspaces;

> `vtex link --clean`

Synch the current code repository to the current workspace;

> `vtex unlink <vendor.appName@version>`

Unsynch the specified app from the current workspace;

> `vtex release patch stable`

(Only for git users.) Bumps the app version, commits, and pushes to remote the app in the current directory;

> `vtex publish`

Publishes the app as a release candidate version;

> `vtex deploy <vendor.appName@version>`

Publishes an app as a stable version. Only works for apps previously published as a release candidate version;

> `vtex update`

Updates all installed apps to the latest (minor or patch) version. Does not upgrade to another major version.

---

## **Troubleshooting**
<a id="troubleshooting"></a>

- Changes not updating after link:

  Check the workspace installed and linked apps with `vtex ls` and make sure the linked theme is not overridden by the installed one.


- Cannot link app:

    <++>

- App link keeps rebooting on "uploading files"

    Try to link it outside the Reply VPN (or on a different network)

- Cannot push:

    Try to see if you can access the repository origin on gitlab, if you can see it you should be able to push, if not check the vpn connection.

---

---------------------------------------------------

NEW CUSTOM APP CREATION LAYOUT:

http://d2boikuckiqt95.cloudfront.net/basic-block.zip

---------------------------------------------------

## **Resources**
<a id="resources"></a>
