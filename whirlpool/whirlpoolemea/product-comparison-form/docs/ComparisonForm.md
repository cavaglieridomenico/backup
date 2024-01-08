[⬅️ Back](./README.md)

# `comparison-form` (interface)

This app interface goes inside the theme, in the product comparison page. Usually you find it in the `product-comparison.jsonc` file.

---

<br>

## ⚙️ Configuration

For proper functionality, the block should be added inside a comparison page where the `ProductComparisonContext` from 'vtex.product-comparison' is present. For example:

```json
{
  "store.custom#product-comparison-list": {
    "blocks": ["comparison-page"]
  },
  "comparison-page": {
    "children": ["slider-layout-group#comparison-page"],
    "props": {
      "blockClass": "comparisonPageBox"
    }
  },
  "slider-layout-group#comparison-page": {
    "children": [
      // HERE FOR EXAMPLE
      "comparison-form",
      "product-comparison-block.product-summary-row",
      "product-comparison-block.grouped-product-specifications"
    ]
  }
}
```

---

<br>

## ⚒️ Props:

Below the full list of available props for the comparison-form block:

| Prop name                              | Type      | Description                                                           | Default value                     |
| -------------------------------------- | --------- | --------------------------------------------------------------------- | --------------------------------- |
| `title`                                | `string`  | Form Title                                                            | ` "Product Comparison Form"`      |
| `subtitle`                             | `string`  | Form Subtitle                                                         | `Subtitle of the comparison form` |
| `namePlaceholder`                      | `string`  | Set placeholder input name                                            | `""`                              |
| `surnamePlaceholder`                   | `string`  | Set placeholder input surname                                         | `""`                              |
| `emailPlaceholder`                     | `string`  | Set placeholder input email                                           | `""`                              |
| `showInputLabels`                      | `boolean` | Choose to show or not label up to inputs                              | `false`                           |
| `nameLabel`                            | `string`  | Set label input name (visible only if showInputLabels = true)         | `""`                              |
| `surnameLabel`                         | `string`  | Set label input surname (visible only if showInputLabels = true)      | `""`                              |
| `emailLabel`                           | `string`  | Set label input email (visible only if showInputLabels = true)        | `""`                              |
| `checkboxes`                           | `array`   | Set checkboxes for the form                                           | `[]`                              |
| `textsBeforeCheckboxes`                | `array`   | Set privacy policy texts shown before checkboxes                      | `[]`                              |
| `textsAfterCheckboxes`                 | `array`   | Set privacy policy texts shown after checkboxes                       | `[]`                              |
| `errorMessageRequiredField`            | `string`  | Error message to shown on input required fields                       | `""`                              |
| `errorMessageInvalidMail`              | `string`  | Error message to shown on invalid email                               | `""`                              |
| `campaign`                             | `string`  | Set campagin name associated with the subscription                    | `FORM_LP_PRODUCTCOMPARISON`       |
| `submitButtonText`                     | `string`  | Text shown in the submit button                                       | `''`                              |
| `successMessageComparisonSubscription` | `string`  | Success message shown after comparison subscription done successfully | `true`                            |
| `errorMessageComparisonSubscription`   | `string`  | Error message shown after comparison subscription fail                | `true`                            |
| `successMessageNewsletterSubscription` | `string`  | Success message shown after newsletter subscription done successfully | `""`                              |
| `errorMessageNewsletterRegistered`     | `string`  | Error message shown if user is already registered to newsletter       | `""`                              |
| `errorMessageNewsletterLogin`          | `string`  | Error message shown if user has to login                              | `""`                              |
| `errorMessageApiIssue`                 | `string`  | Error message shown if API call goes wrong                            | `""`                              |
| `productSpecificationGroupsToHide`     | `string`  | String with all specifications to hide in the comparison summary      | `""`                              |

> <hr>
> With *checkboxes* array prop you can create one or more **checkbox**, every checkbox has 4 main prop:
>
> - _checkboxLabel_ allow you to set the text label for checkbox with markdown language (it's like a RichText)
> - _checkboxRequired_ if true user must flag this checkbox to submit the form successfully
> - _checkboxNewsletter_ if true user must flag this checkbox to subscribe to newsletter
> - _checkboxError_ error message shown (only if checkboxRequired true) under the checkbox
> <hr>

---

<br>

## 🎨 Customization

The custom app uses CSS Handles, for this you can change the style directly from the css file <code>whirlpoolemea.product-comparison-form.css</code> in the StoreTheme, usually you can find it here:  
theme --> style --> css --> **whirlpoolemea.product-comparison-form.css**

| CSS Handles                             |
| --------------------------------------- |
| <code>container</code>                  |
| <code>container\_\_form</code>          |
| <code>container\_\_inputs</code>        |
| <code>container\_\_input</code>         |
| <code>container\_\_input_name</code>    |
| <code>container\_\_input_surname</code> |
| <code>container\_\_input_email</code>   |
| <code>container\_\_checkbox</code>      |
| <code>container\_\_inputs</code>        |
| <code>container\_\_button</code>        |
| <code>container\_\_text-success</code>  |
| <code>container\_\_text-error</code>    |
| <code>text\_\_title</code>              |
| <code>text\_\_description</code>        |
| <code>text\_\_message-success</code>    |
| <code>button\_\_submit</code>           |
| <code>skeleton</code>                   |
| <code>skeleton\_\_wrapper</code>        |

---
