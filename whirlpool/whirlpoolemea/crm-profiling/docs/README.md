# CRM Profiling

This app managed the case of Profiling subscription via SFMC email campaign.
Use case: via SFMC email an user accept the profiling optin consent and then lands in a VTEX Thank you page. Here user (if optin previously) profiling optin should be set to true.

:warning: This app need a key shared from SFMC encoded in sha256 to be set in the App Settings in order to authenticate the request (see App's Settings section below).

## Configuration

Add the **whirlpoolemea** _crm-profiling_ to your theme's _peerDependencies_ in the <code>manifest.json</code>

```json
  "peerDependencies": {
    "whirlpoolemea.crm-profiling": "0.x"
  }
```

Now, you are able to use all blocks exported by the <code>crm-profiling</code>. Check out the full list below:

| Block name      | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| `crm-profiling` | `It makes the API call on component load and render all children declared from StoreTheme` |

---

### CrmProfiling

1. Add the <code>crm-profiling</code> block in any store template of your choosing:

```json
{
  "store.custom#profiling-thank-you-page": {
    "blocks": ["crm-profiling"]
  }
}
```

2. Declare the <code>crm-profiling</code> block using its prop, with them you can choose and set many parts of the newsletter subscription form:

```json
{
  /* CRM PROFILING */
  "crm-profiling": {
    "props": {
      "metaTags": [{ "name": "robots", "content": "noindex" }]
    }
  }
}
```

#### <code>crm-profiling</code> props

Below the full list of available props for the newsletter-form block:

| Prop name  | Type    | Description                                                                                                           | Default value                              |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `metaTags` | `array` | Add one or more meta tag, you can set name and content for each meta tag added. (Meta tags will be added with Helmet) | `[{ name: 'robots', content: 'noindex' }]` |

</br>

### App's Settings

You can change some settings used in Crm Profiling directly from **VTEX AppSettings Admin** section:

1. Go to VTEX admin --> _vendor.myvtex.com/admin/apps/whirlpoolemea.crm-profiling@0.x/setup/_
2. Change settings as you want
3. Click on _SAVE_ button

#### App's settings props

Below the full list of available props:

| Prop name                 | Type      | Description                                                                                             | Default value          |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------------------- | ---------------------- |
| `sfmcKey`                 | `string`  | SFMC token key encrypt in sha256 used to authenticate the request                                       | `""`                   |
| `hasNewsletterMDEntity`   | `boolean` | flag this checkbox if the country save Newsletter user in a specific MD Entity and not as VTEX account  | `""`                   |
| `newsletterMDEntity`      | `string`  | write the MD Entity acronym used for NL subscription if hasNewsletterMDEntity is flagged                | `"NL"`                 |
| `crmProfilingApiEndpoint` | `string`  | Set the endpoint of the CRM profiling Api call                                                          | `"/_v/user/profiling"` |

## Installation

How to properly install the custom app:

- Install the <code>*whirlpoolemea.crm-profiling@x.x*</code> in the desired account.
- Insert <code>*whirlpoolemea.crm-profiling@x.x*</code> as peer dependency.
- Remember to try and check CSS of country because could be different and needed to fix (i.e check that _whirlpoolemea.crm-profiling.css_ file is present).

### In which accounts the application is installed

These are the accounts where the custom app is installed:

- _hotpointuk_

---

## Customization

The custom app uses CSS Handles, for this you can change the style directly from the css file <code>whirlpoolemea.newsletter-custom-app.css</code> in the StoreTheme, usually you can find it here:  
theme --> style --> css --> **whirlpoolemea.newsletter-custom-app.css**

| CSS Handles                        |
| ---------------------------------- |
| <code>container</code>             |
| <code>container\_\_skeleton</code> |

---

## Release App updates warnings

Keep in mind to update the version on <code>appInfos</code> const inside the _./react/types/app_settings.ts_ file when you release an update of this version that improve its major, for example when version change from **0.x** to **1.x** and so on.  
Otherwise the AppSettings will not be retrieved correctly, this because as you can see they are inserted like this:

```typescript
export const appInfos = {
  vendor: 'whirlpoolemea',
  appName: 'crm-profiling',
  version: '0.x', //As you can see increasing major this will not work anymore
}
```
