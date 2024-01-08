# Newsletter Custom App

This custom app exports 3 main components useful for the newsletter subscription, these are:

- **NewsletterForm**, form that allow the user to subscribe to newsletter;
- **NewsletterButton**, redirect the user to newsletter subscription landing page (useful if newsletter subscription landing page is present);
- **NewsletterAutomaticPopup** : popup that will appear automatically with the _NewsletterForm_ inside.

## Configuration

Add the **whirlpoolemea** _newsletter-custom-app_ to your theme's _peerDependencies_ in the <code>manifest.json</code>

```json
  "peerDependencies": {
    "whirlpoolemea.newsletter-custom-app": "0.x"
  }
```

Now, you are able to use all blocks exported by the <code>newsletter-custom-app</code>. Check out the full list below:

| Block name                   | Description                                                                                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `newsletter-form`            | `Renders a form where user can subscribe to newsletter`                                                                                                                          |
| `newsletter-button`          | `Renders a button that on click will redirect you to a specific URL (it should be used to redirect to a Newsletter subscription landing page)`                                   |
| `newsletter-automatic-popup` | `Renders a popup that is shown automatically (after some time in milliseconds if desired) and it's mentioned to shown automatically the newsletter-form block placed as a child` |

---

### NewsletterForm

1. Add the <code>newsletter-form</code> block in any store template of your choosing:

```json
{
  "store.custom#newsletter-landing-page": {
    "blocks": ["newsletter-form"]
  }
}
```

2. Declare the <code>newsletter-form</code> block using its prop, with them you can choose and set many parts of the newsletter subscription form:

```json
{
  /* NEWSLETTER FORM*/
  "newsletter-form": {
    "props": {
      "title": "5% OFF YOUR FIRST ORDER",
      "subtitles": [
        {
          "__editorItemTitle": "#### Register now"
        }
      ],
      "emailPlaceholder": "Email",
      "namePlaceholder": "Name",
      "surnamePlaceholder": "Surname",
      "checkboxes": [
        {
          "checkboxLabel": "I consent to the processing of my personal data",
          "checkboxRequired": true,
          "checkboxNewsletter": true,
          "checkboxError": "This field is required"
        }
      ],
      "privacyPolicyTextArray": [
        {
          "__editorItemTitle": "I have read and understood the content of the [privacy notice](/privacy-policy)."
        }
      ],
      "errorRequiredField": "This field is required",
      "errorInvalidMail": "Enter a valid e-mail",
      "successMessage": "Thanks for signing up. You will receive a confirmation email.",
      "registeredErrorMessage": "You are already registered"
    }
  }
}
```

#### <code>newsletter-form</code> props

Below the full list of available props for the newsletter-form block:

| Prop name                               | Type      | Description                                                                          | Default value              |
| --------------------------------------- | --------- | ------------------------------------------------------------------------------------ | -------------------------- |
| `title`                                 | `string`  | Form Title                                                                           | `""`                       |
| `subtitles`                             | `array`   | Set Subtitles for the form                                                           | `[]`                       |
| `namePlaceholder`                       | `string`  | Set placeholder input name                                                           | `""`                       |
| `surnamePlaceholder`                    | `string`  | Set placeholder input surname                                                        | `""`                       |
| `emailPlaceholder`                      | `string`  | Set placeholder input email                                                          | `""`                       |
| `showInputLabels`                       | `boolean` | Choose to show or not label up to inputs                                             | `false`                    |
| `nameLabel`                             | `string`  | Set label input name (visible only if showInputLabels = true)                        | `""`                       |
| `surnameLabel`                          | `string`  | Set label input surname (visible only if showInputLabels = true)                     | `""`                       |
| `emailLabel`                            | `string`  | Set label input email (visible only if showInputLabels = true)                       | `""`                       |
| `checkboxes`                            | `array`   | Set checkboxes for the form                                                          | `[]`                       |
| `privacyPolicyTextArray`                | `array`   | Set privacy policy texts shown before checkboxes                                     | `[]`                       |
| `privacyPolicyTextArrayAfterCheckboxes` | `array`   | Set privacy policy texts shown after checkboxes                                      | `[]`                       |
| `errorRequiredField`                    | `string`  | Error message to shown on input required fields                                      | `""`                       |
| `errorInvalidMail`                      | `string`  | Error message to shown on invalid email                                              | `""`                       |
| `campaign`                              | `string`  | Set campagin name associated with the subscription                                   | `FORM_HP_PROMO_5%DISC`     |
| `submitButtonText`                      | `string`  | Text shown in the submit button                                                      | `''`                       |
| `successMessageInsideButton`            | `boolean` | Choose to show success message (after submit) inside submit button                   | `true`                     |
| `successMessage`                        | `string`  | Success message shown after subscription done successfully                           | `""`                       |
| `registeredErrorMessage`                | `string`  | Error message shown if user is already registered to newsletter                      | `""`                       |
| `shouldLogInErrorMessage`               | `string`  | Error message shown if user has to login                                             | `""`                       |
| `genericApiErrorMessage`                | `string`  | Error message shown if API call goes wrong                                           | `""`                       |
| `pixelEventName`                        | `string`  | Name of Pixel event sent for Google Analytics on succesfully Newsletter subscription | `"newsletterSubscription"` |

</br>

> <hr>
> With _checkboxes_ array prop you can create one or more **checkbox**, every checkbox has 4 main prop:
>
> - _checkboxLabel_ allow you to set the text label for checkbox with markdown language (it's like a RichText)
> - _checkboxRequired_ if true user must flag this checkbox to submit the form successfully
> - _checkboxNewsletter_ if true user must flag this checkbox to subscribe to newsletter
> - _checkboxProfiling_ if true user can flag this checkbox to give consent to profiling
> - _checkboxError_ error message shown (only if checkboxRequired true) under the checkbox
> <hr>

> <hr>
> <code>pixelEventName</code> prop will not be changeable from _CMS SiteEditor_ section, it can be changed only when you instantiate the block from the StoreTheme, for example:  
>  
> ```json
> {
>   "newsletter-form": {
>     "props": {
>       "other-props": "....",
>       "pixelEventName": "newsletterSubscription",
>       "other-props": "...."
>     }
>   }
> }
> ```
>
> In this way you can now intercept the 'newsletterSubscription' Pixel event from your _Google Tag Manager_ Pixel App and make a push in the dataLayer for Google Analytics purposes.
>
> <hr>

</br>

---

### NewsletterButton

1. Add the <code>newsletter-button</code> block in any store block of your choosing:

```json
{
  "flex-layout.row#newsletter-row": {
    "children": ["newsletter-button"]
  }
}
```

2. Declare the <code>newsletter-button</code> block using its prop:

```json
{
  "newsletter-button": {
    "props": {
      "linkUrl": "/newsletter-lp",
      "buttonText": "SUBSCRIBE TO OUR NEWSLETTER"
    }
  }
}
```

#### <code>newsletter-button</code> props

Below the full list of available props for the newsletter-button block:

| Prop name        | Type     | Description                                                   | Default value      |
| ---------------- | -------- | ------------------------------------------------------------- | ------------------ |
| `linkUrl`        | `string` | URL link for the redirect                                     | `""`               |
| `campaign`       | `string` | Campaign that will be passed as query param                   | `""`               |
| `buttonText`     | `string` | Text of the button                                            | `""`               |
| `pixelEventName` | `string` | Name of Pixel event sent for Google Analytics on button click | `"newsletterLink"` |

</br>

> <hr>
> With _campaign_ prop you can choose the campagin that will be used in the Newsletter subscription form once you arrive in the Newsletter Subscription landing page.
> If you set it in the newsletter-button, clicking on it will redirect you to Newsletter landing page where you can see in the page URL the query paramater related to the setted campaign, for example **/newsletter-lp?SETTED_CAMPAIGN**.
> <hr>

> <hr>
> <code>pixelEventName</code> prop will not be changeable from _CMS SiteEditor_ section, it can be changed only when you instantiate the block from the StoreTheme
> For example:
>
> ```json
> {
>   "newsletter-button": {
>     "props": {
>       "linkUrl": "/newsletter-lp",
>       "buttonText": "SUBSCRIBE TO OUR NEWSLETTER",
>       "pixelEventName": "newsletterLink"
>     }
>   }
> }
> ```
>
> In this way you can now intercept the 'newsletterLink' Pixel event from your Google Tag Manager Pixel App and make a push in the dataLayer for Google Analytics purposes.
>
> <hr>

---

### NewsletterAutomaticPopup

1. Add the <code>newsletter-automatic-popup</code> block in any store block of your choosing:

```json
{
  "flex-layout.row#newsletter-popup": {
    "children": ["newsletter-automatic-popup"]
  }
}
```

2. Declare the <code>newsletter-automatic-popup</code> block using its prop (you can pass what you want as children and it will be shown in the automatic popup):

```json
{
  "newsletter-automatic-popup": {
    "props": {
      "time": 10000
    },
    "children": ["flex-layout.col#newsletter-form-col"]
  }
}
```

#### <code>newsletter-automatic-popup</code> props

Below the full list of available props for the newsletter-automatic-popup block:

| Prop name | Type     | Description                                                   | Default value |
| --------- | -------- | ------------------------------------------------------------- | ------------- |
| `time`    | `number` | Time in milliseconds after which open the popup automatically | `undefined`   |

---

### API Endpoints Configuration

You can change the API endpoints used in the Newsletter Form directly from **VTEX AppSettings Admin** section:

1. Go to VTEX admin --> _vendor.myvtex.com/admin/apps/whirlpoolemea.newsletter-popup-custom@0.x/setup/_
2. Change endpoint of desired API calls
3. Click on _SAVE_ button

#### API Endpoints props

Below the full list of available props for the API endpoints:

| Prop name            | Type     | Method | Description                                                                                      | Default value                                   |
| -------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `sessionApi`         | `string` | GET    | Get user session info (like if it's logged in)                                                   | `"/api/sessions?items=*"`                       |
| `userInfoApi`        | `string` | GET    | Get user info by email                                                                           | `"/_v/wrapper/api/user/email/userinfo?email="`  |
| `postUserApi`        | `string` | POST   | Subscribe user to newsletter                                                                     | `"/_v/wrapper/api/user?userId=true"`            |
| `newsletteroptinApi` | `string` | PATCH  | Set isNewsletterOptIn to true (and isProfilingOptIn if handled) to already existing VTEX account | `"/_v/wrapper/api/user/newsletteroptin?email="` |

#### API Endpoints bodys

<code>postUserApi</code> body:

```javascript
{
  email: form.email,
  firstName: form.name,
  lastName: form.surname,
  isNewsletterOptIn: true,
  campaign: targetCampaign
}
```

<code>newsletteroptinApi</code> body:

```javascript
{
  isNewsletterOptIn: true;
}
```

---

## Customization

The custom app uses CSS Handles, for this you can change the style directly from the css file <code>whirlpoolemea.newsletter-custom-app.css</code> in the StoreTheme, usually you can find it here:  
theme --> style --> css --> **whirlpoolemea.newsletter-custom-app.css**

| CSS Handles                             |
| --------------------------------------- |
| <code>container\_\_form</code>          |
| <code>container\_\_form-input</code>    |
| <code>container\_\_form-checkbox</code> |
| <code>container\_\_inputs</code>        |
| <code>container\_\_privacy</code>       |
| <code>container\_\_checkboxes</code>    |
| <code>form\_\_title</code>              |
| <code>container\_\_text-subtitle</code> |
| <code>container\_\_text-privacy</code>  |
| <code>container\_\_text-messages</code> |
| <code>container\_\_btn</code>           |
| <code>container\_\_btn-submit</code>    |
| <code>text\_\_message-success</code>    |
| <code>text\_\_message-error</code>      |

---

## Installation

How to properly install the custom app:

- Uninstall the <code>_{account}.newsletter-popup-custom@x.x_</code> in the working account.
- Remove every reference to the old newsletter app (i.e newsletter-popup#footer block)
- Install the <code>*whirlpoolemea.newsletter-custom-app@x.x*</code> in the desired account.
- Insert <code>*whirlpoolemea.newsletter-custom-app@x.x*</code> as peer dependency.
- Remember to try and check CSS of country because could be different and needed to fix (i.e check that _whirlpoolemea.newsletter-custom-app.css_ file is present).

### In which accounts the application is installed

These are the accounts where the custom app is installed:

- _hotpointit_
- _frwhirlpool_
- _plwhirlpool_
- _hotpointuk_

---

## Release App updates warnings

Keep in mind to update the version on <code>appInfos</code> const inside the _./react/utils/utils.ts_ file when you release an update of this version that improve its major, for example when version change from **0.x** to **1.x** and so on.  
Otherwise the AppSettings will not be retrieved correctly, this because as you can see they are putted like this:

```typescript
export const appInfos = {
  vendor: "whirlpoolemea",
  appName: "newsletter-custom-app",
  version: "0.x", //As you can see increasing major this will not work anymore
};
```
