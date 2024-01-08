# Pixel My Account App

This pixel app is used to change the content of the newsletter box in the Profile MyAccount section (*/account#/profile*). This newsletter box is made up by a title, a message and a checkbox with a label and is a VTEX OOTB section and here the user can give consent to marketing.

As it is an OOTB VTEX section we had to develop this pixel app in order to change the content (and do some stuff like send GA events).

## Configuration

You can simply install it in your account (as it is a pixel app) and it will works.

:warning: **Make sure that app settings are correctly setted otherwise you should see empty box in the profile section**, below you can see the settings editable in *Pixel app for my-account field* in AppSettings (/admin/apps).

### App Settings

These are the settings you can edit:

| Prop name                        | Type      | Description                                                                          | Default value              |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------ | -------------------------- |
| `newsletterContainerTitle`       | `string`  | Title of the newsletter box container (it can contains HTML TAGs etc..)              | `""`                       |
| `newsletterContainerMessage`     | `string`  | Message of the newsletter box container (it can contains HTML TAGs etc )             | `""`                       |
| `newsletterOptIn`                | `string`  | Label shown next to the newsletterOptIn checkbox                                     | `""`                       |
| `hasGA4`                         | `boolean` | Set true if you want to handle GA4 events on optIn checked                           | `false`                    |
| `showProfilingOptIn`             | `boolean` | Set true if you want to handle the profiling optIn (it will shown a new box for the Profiling optin)                                             | `false`                    |
| `profilingContainerTitle`        | `string`  | Title of the profiling box container (it can contains HTML TAGs etc..)               | `""`                       |
| `profilingContainerMessage`      | `string`  | Message of the newsletter box container (it can contains HTML TAGs etc )             | `""`                       |
| `profilingOptIn`                 | `string`  | Label shown next to the profilingOptIn checkbox                                      | `""`                       |
| `sessionAPIEndpoint`             | `string`  | Set the endpoint that will be used to get user session info                          | `""`                       |
| `getUserInfoAPIEndpoint`         | `string`  | Set the endpoint that will be used to get user info based on the email retrieved with session info  | `""`                       |
| `addOptInAPIEndpoint`            | `string`  | Set the endpoint that will be used to update optin for the user on checkboxes checked/unchecked     | `""`                       |
| `errorProfilingOptIn`            | `string`  | Error message to shown if you try to update profiling consent without marketing consent    | `""`                       |
| `cssFileName`                    | `string`  | Name of the css file uploaded in admin */arquivos* that change the style for Newsletter and Profiling boxes                                           | `""`                       |

### In which accounts the application is installed

This sponsor app is installed in these accounts:
  - **itwhirlpool**
  - **hotpointit**
  - **frwhirlpool**
  - **bauknechtde**
  - **hotpointuk**
