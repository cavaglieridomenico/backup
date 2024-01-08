# Store Block course template

Here you'll learn how to create awesome Store Framework blocks!

info:

- this app allow to show a list of recipes in [workspacename]/[recipes in specific language] (example "ricette" in IT)
- to let this app work perfectly, you have to set an external link in :
  - [workspacename]/admin -> cms -> site editor -> write the correct name of /[recipes in specifica language]
  - set link in field [remote-html-embed] on the right menu
  - you could find this link in the same point of admin pages but setted in the production workspaces(the ones wich one don't start with your workspace name)

update by internationalization:

- the thing was been modified are only the "formatted message" to set external link

## v3.0.0

This version has been developed for the Hotpoint UK Service integration.

With this new version is possible to customize the meta tags object feed.

> :warning: **If you are passing from v2.x to 3.x**: Be very careful and check all the existing page that use the _remote-html-embed_ in order to not have content loss. If necessary do the mutation for the content porting for the _whirlpoolemea.remote-html-embed_ app.

### In which accounts the application is installed

- ITWH
