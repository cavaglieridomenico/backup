# custom-us-form@1.x

Is useful for show the pages dedicated to contacs. There are the:
- Object of question
- personal form
- product problem form
- the way to search product code with images

### Examples of use

- they are presetted with number codes and french text, of course you have to replace with what u need*** 
```json
"store.custom#contact-us-form": {
    "blocks": [
      
      "contact-us-form"
      
    ]
  },
  
"contact-us-form":{
    "props":{
      "regexZipCode": "!/^(?:[0-8]\\d|9[0-8])\\d{3}$/",
      "bindingByTheme":"1bbaf935-b5b4-48ae-80c0-346623d9c0c9",
      "bindingByTheme2":"b9f7bf3a-c865-4169-8950-4fbb8b55ec09",
      "bindingByTheme3":"b9f7bf3a-c865-4169-8950-4fbb8b55ec09",
      "locale":"fr-FR",
      "apiAccountSigle":"CT",
      "reasons":[
        { "value": "", "label": "Choisissez un sujet", "id": "Choisissez un sujet", "SupportEmail":"consommateurs_VIP@whirlpool.com"},
        { "value": "Contrats de garantie", "label": "Contrats de garantie", "id": "Contrats de garantie", "SupportEmail":"consommateurs_VIP@whirlpool" },
        { "value": "Assistance technique", "label": "Assistance technique", "id": "Assistance technique", "SupportEmail":"consommateurs_VIP@whirlpool.com" },
        { "value": "Gestion de la confidentialitè", "label": "Gestion de la confidentialitè", "id": "Gestion de la confidentialitè", "SupportEmail":"consommateurs_VIP@whirlpool.com" },
        { "value": "Assistance appareils connectés", "label": "Assistance appareils connectés", "id": "Assistance appareils connectés", "SupportEmail":"consommateurs_VIP@whirlpool.com" },
        { "value": "Autre motifs", "label": "Autre motifs", "id": "Autre motifs", "SupportEmail":"consommateurs_VIP@whirlpool.com" },
        { "value": "Achat de produits (informations, conseils)", "label": "ESHOP: Achat de produits (informations, conseils)", "id": "Achat de produits (informations, conseils)", "SupportEmail":"consommateurs_VIP@whirlpool.com"},
        { "value": "Commande en cours (modification des informations ou des produits)", "label": "ESHOP: Commande en cours (modification des informations ou des produits)", "id": "Commande en cours (modification des informations ou des produits)", "SupportEmail":""},
        { "value": "Paiement", "label": "ESHOP: Paiement", "id": "Paiement", "SupportEmail":"consommateurs_VIP@whirlpool.com"},
        { "value": "Suivi de ma commande, livraison, installation", "label": "ESHOP: Suivi de ma commande, livraison, installation", "id": "Suivi de ma commande, livraison, installation", "SupportEmail":"consommateurs_VIP@whirlpool.com"},
        { "value": "Demande de rétractation", "label": "ESHOP: Demande de rétractation", "id": "Demande de rétractation", "SupportEmail":"consommateurs_VIP@whirlpool.com"},
        { "value": "Suivi de ma demande de rétractation (statut, remboursement)", "label": "ESHOP: Suivi de ma demande de rétractation (statut, remboursement)", "id": "Suivi de ma demande de rétractation (statut, remboursement)", "SupportEmail":"consommateurs_VIP@whirlpool.com"},
        { "value": "Autres demandes", "label": "ESHOP: Autres demandes", "id": "Autres demandes", "SupportEmail":"consommateurs_VIP@whirlpool.com"}
      ]
    }
  },
```
### Configuration

| Prop name               | Type      | Description                                            |         | Default value |
| ----------------------- | --------- | ------------------------------------------------------ | ------- | ------------- |
| `showCheckboxSection`   | `boolean` |                                                        | `false` |
| `showProductInfoHelp`   | `boolean` |                                                        | `false` |
| `errorEmpty`            | `string`  |                                                        | `''`    |
| `errorZip`              | `string`  |                                                        | `''`    |
| `errorEmail`            | `string`  |                                                        | `''`    |
| `regexZipCode`          | `any`     | Regex inserted by theme                                | `''`    |
| `reasons`               | `array`   | Reasons for open a ticket by theme                     | `[]`    |
| `bindingByTheme`        | `any`     | Set binding address for EPP in dataforfetch from theme | `''`    |
| `bindingByTheme2`       | `any`     | Set binding address for FF in dataforfetch from theme  | `''`    |
| `bindingByTheme3`       | `any`     | Set binding address for VIP in dataforfetch from theme | `''`    |
| `locale`                | `any`     | Set language Locale in dataforfetch from theme         | `''`    |
| `prodInfoTitle`         | `string`  | Set title about info prod from site editor             | `''`    |
| `prodInfoDesc`          | `array`   | Set Description about info prod from site editor       | `[]`    |
| `prodCodeDesc`          | `array`   | Set title about info prod from site editor             | `[]`    |
| `prodCodeTitle`         | `string`  | Set title about prod code from site editor             | `''`    |
| `privacyPolicyText`     | `array`   | Set text to privacy policy siteeditor                  | `[]`    |
| `acceptTermPrivacyText` | `array`   | Set text to invite a newsletter subs from siteeditor   | `[]`    |
| `apiAccountSigle`       | `string`  | set from theme api account sigle in contactUsForm      | `''`    |


### in wich account is used

- itWH
- frWH
- PLWH
- HPIT

### CSS Customization [CSS HANDLES]

```--formContainer```: external form container 
```--formWrapper```: internal form wrapper 
```--formDiv```: internal wrapper to all contents of form
```--.inputDiv,.inputDivFull```: wrapper for inputs
```--inputDiv33```: input large 30% of wrapper
```--inputLabel``: input label
```--select```: class for the selects
```--.selectDiv```: div that contain select
```--.input,.errorInput```
```--errorInput``` not used
```--errorLabel```not used
```--submitButton```: class submit button
```--privacySectionDiv```: Section for privacy div
```--privacyTitle,2,3```not used
```--privacyDescription```not used
```--privacyLink```not used but must be inside the text inserted from siteeditor in privacytext
```--brandCheckbox```: checkbox margin 
```--checkboxWrapper```: wrapper for checkbox
```--inputCheckbox```: container's shape of checkbox's text
```--.customCheckbox```
```--customCheckboxFilled```: not used
```--privacyAccept```: newsletter text configuration
```--productInfoDiv``` not used
```--productInfoWrapper```not used
```--productInfoForm```not used
```--productInfoForm2```not used
```--closeSectionIcon```not used
```--inputDivMid```not used
```--productInfoForm```not used
```--productInfoHelp```Section for product info div
```--productInfoHelpWrapper```Section for product info wrapper
```--productInfoHelpImgWrapper``` wrapper for image section in product code
```--productInfoHelpImg```wrapper for selected image section in product code
```--privacyTitle2```not used
```--privacyTitle3```not used
```--privacyDescription2```not used
```--addSectionButton```not used
```--.inputDivFullDate,.inputDivFullDateError```not used
```--errorSubmitDiv```not used
```--errorSubmitLabel```not used
```--formSuccessDiv```not used
```--formSuccessTitle```not used
```--formSuccessSubtitleDiv```not used
```--formSuccessSubtitle```not used

```--title```: title's shape of all app
```--description```: description fonts
```--textArea```: textarea size
```--inputWarranty > option:disabled```
```--postillaText```: text shape under textarea that says *required fields
```--descriptionPrivacy```not used
```--submitButtonWrapper```: wrap about subitm button
```--formLink```not used
```--loaderForm```not used




## How to use it

- Uninstall the account.custom-us-form@x.x in the working account.
- Install the whirlpoolemea.custom-us-form@x.x in the desired account.
- Insert whirlpoolemea.custom-us-formm@x.x as peer dependency.
- remember to modify the theme where you are going to install as written upside
  

## set country by theme 
country (CT) is setted by theme
	
  fetch('/api/dataentities/{apiAccountSigle}/documents', {
	method: 'POST',
	headers: {
	Content-Type': 'application/json',
	},
	body: JSON.stringify(DatasForFetch(values, binding.id,bindingByTheme,bindingByTheme2,locale)),
	})


  "locale":"fr-FR",
  "apiAccountSigle":"CT",

## set binding themes link (1-2-3) by theme for datafetch

      "bindingByTheme":"1bbaf935-b5b4-48ae-80c0-346623d9c0c9",
      "bindingByTheme2":"b9f7bf3a-c865-4169-8950-4fbb8b55ec09",
      "bindingByTheme3":"b9f7bf3a-c865-4169-8950-4fbb8b55ec09",

## set regex by theme

 "regexZipCode": "!/^(?:[0-8]\\d|9[0-8])\\d{3}$/",

 ### In which accounts the application is installed

- ITWH
