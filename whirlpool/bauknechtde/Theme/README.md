# Hotpoint IT

Read and follow this guidelines **before developing**.

# 1. Vtex

### First Use

1. Install node.js (also Yarn if developing on Mac)<br>
2. Install Vtex from terminal: npm i -g vtex or yarn global add vtex<br>
3. Theme login from terminal: es. vtex login frwhirlpool<br>
4. Create a workspace from terminal (refer to **Development Flow** section)<br>
   > For more informations read [the official documentation](https://learn.vtex.com/docs/course-basic-blocks-step00setup-lang-en)

### VTEX Account

hotpointit

### VTEX Admin

{workspace name}--hotpointit.myvtex.com/admin

### VTEX Inspect

To kwnow block classes on the page can be used the "inspect" element of Vtex by adding **?\_\_inspect** at the end of the url

### Vtex Training

[Vtex IO](https://vtex.io/docs/getting-started/what-is-vtex-io/1/)<br>
[Learning Paths](https://developers.vtex.com/learning/page/learning-path-lang-en)<br>
[Installable Apps](https://github.com/vtex-apps)<br>
[Commands](https://vtex.io/docs/recipes/development/vtex-io-cli-installation-and-command-reference/)<br>
[Components Styleguides](https://styleguide.vtex.com/#/Introduction)<br>

# 2. Repositories

- [HP IT Theme Repository](http://obiwan.replynet.prv/commerce/hotpoint-it) ( Reply and VPN credentials )
- [Custom Apps Repository](http://obiwan.replynet.prv/l.cavallera/custom-vtex-apps-hp-it) ( Reply and VPN credentials )

# 3. Local Setup (**MANDATORY**)

**Install the following plugin of Visual Studio Code**

- **Prettier**: esbenp.prettier-vscode
  > After install the plugin go to VSCode settings, search for "format on save" and ensure that the box is checked

# 4. Workflow

### Development Flow

- **Only one branch** per person named: cognome{​​​​​​​current ​sprint}​​​​​​​​ -> (es. cavallerasprint8)
- **Only one workspace** per person named like branch

### Sprint Flow

- One **sprint branch** named `uatsprint{number of sprint}` (es. uatsprint8)
- One **sprint workspace** named as branch
  > This two should be deleted after sprint

### Bugfixing Flow

- One **bugfixing branch** named `release-{date of bugfixing release}` (es. release-24/05/2021)
- One **bugfixing workspace** named as branch
  > This two should be deleted after the release date

#### Bugfixing Labels

On Jira add the **label** `Release-dd/mm/aaaa` in the labels section of the developed ticket

# 5. How to write code

As soon as we are a team, and so many people are going to work on the same files, it's **mandatory** to write code in the following way:

### .json

- **Name blocks** in an understandable way (es. `slider-layout#bannerHomePage`)
- **Delete blocks** that are not in use
- Before commit, **delete** every **duplicated** block (Watch yellow warnings in terminal)

### .css

- **Comment** every section relative to it's own page (es. `/*--- HOMEPAGE ---*/`)
- Insert every **media query** at the bottom of the file and group similar media queries (es. if two media queries are both `max-width: 600px`, group them together to avoid duplicated code)

# 6. How to write commits

| Symbol | Description                                   |
| ------ | --------------------------------------------- |
| ✨     | Generic productivity (Mainly adding features) |
| 🐛     | Bugfix HOW: write ticket number               |
| 📃     | Page documentation                            |
| ⚡     | Performance                                   |
| 🎨     | Graphic changes only                          |
| 🧪     | Test                                          |
| 🔨     | Refactor                                      |
| ⬆      | Packages or dependencies upgrade              |
| 🔧     | Environment configuration (es. package.json)  |
| ⏪     | Rewind code in the past                       |

### Examples of commits

- ✨ Added "wishlist"
- 🐛 FR-234
- 🎨 Fixed height of image container
  > If the commit is a ticket, it's title must always be composed by the corresponding emoji and the number of that ticket (es. 🎨 FR-114)

# 7. Custom app release process

1. Create a `feature` branch (es. feature/newsletter-popup-and-modal-custom)
2. Go to the directory in which is the file you have to edit: (es. cd newsletter-popup-and-modal-custom)
3. `vtex link` (in terminal)
4. Edit
5. Check if the vendor of the manifest is the same you are working on (es. frwhirlpool)
6. Commit and push the changes
7. `vtex release patch stable` (in terminal)
8. `vtex publish` (in terminal)
9. `vtex deploy` (in terminal) (es. `vtex deploy frwhirlpool.newsletter-popup-and-modal-custom@0.x --force`)
10. Merge the `feature` branch in `develop` branch
11. Delete the `feature` branch

# 8. Theme release process (**To do only if authorized**)

1. Ensure that everyone on the team has pushed their changes in `production` branch
2. Go to `production` branch
3. Enter a clean workspace: `vtex use preprod` (in terminal)
4. Check in the website if everything is okay: `vtex browse` (in terminal)
5. `vtex release patch stable` (in terminal)
6. Update the Jira dashboard
7. Deploy th3e theme: es. `vtex deploy frwhirlpool.whl-theme@3.0.x` (in terminal)
8. `vtex use master` (in terminal)
9. `vtex update` (in terminal)

# 9. Useful Reads

- [Jira Dashboard](https://whirlpoolgtm.atlassian.net/secure/RapidBoard.jspa?rapidView=280&projectKey=FRA)
- [Vtex Guidelines](https://developers.vtex.com/learning/page/learning-path-lang-en)
- [Jira Instructions](https://docs.google.com/presentation/d/1Q8Xb2xpaK97j6MI9KDdvT_jGl_dPb0nEXL7enw0Mrw/edit#slide=id.gd82cf81eee_0_0)
- [Functional Analysis](https://docs.google.com/presentation/d/1epqls03Z-9SZWr5wRRc58i5M-LndS63quICVgewoQjY/edit)

# 10. Release process

`To start we need to have this Jira status: To do, Developing, Developed, Bugfixing, Test, PO Review, Ready for release and Released`

1.  The developer move the ticket in testing
2.  If first internal test goes fine, the tester move the ticket to Po Review (business review)
3.  If the test goes fine the ticket is moved in ready for release (we have to pick a certain release date)
4.  When the theme is released, all the tickets are moved to Released and the developers (one for each team) have to print and send the `Ticket Extraction`.

### Ticket Extraction process

1. Go on "All tickets", on Jira
2. Click on "Vai alla ricerca avanzata"
3. In the right side of the screen click on "Colonne" and select the following parameters:
   - Assegnatario
   - Classe
   - Creatore
   - Riepilogo
   - Stato
4. From the top bar select the current project (es. D2C IT)
5. Click on "Altro", select "Sprint" and select the current sprint
6. Click on "Stato" and select "Ready for release"
7. Insert the release date as shown in the following query: `project = IT AND status = "Ready for release in Prod." AND Sprint = 883 AND **"Release Date[Date]" = '2021/07/12'** ORDER BY created DESC`
8. Click on export and select "Esporta report HTML (tutti i campi selezionati)"
9. Move released ticket in "Released"

---

---

---

# 11. Advanced Tips

If you don't know how to do something, maybe in this section you can find a **solution**.

## Change Vtex labels with GraphQL

1. **(You must be in a workspace)** | Inspect the element you want to change (watch the class of the object)
2. For Example, if the class is `class="vtex-search-result-3-x-orderByText c-muted-2 dn dib-ns"`, the **vendor** is `Vtex`, the **app name** is `search-result`, and the **version** is `3.x`.
   > Notice that once apply the query in graphql the context structure should be "vendor.appname@version"
3. Now go to Google and browse for `{app name} Vtex IO github` and open the repository of this app (link of Vtex apps repo: https://github.com/vtex-apps/)
4. Open the messages folder and open the file of the language of the current label you want to translate (ex. if the label is "Sort by" the file you have to select is en.json)
5. Click Ctrl+F and paste the label you want to translate
6. You'll find for example `"store/ordenation.sort-by": "Sort By"` where the first part is the **src message** you have to paste in graphql query
7. Then go to Admin panel (es. cavallerasprint8--frwhirlpool.myvtex.com/admin)
8. In the section "Store Setup" click on " IDE GraphQL"
9. Select "vtex.messages@1.61" from the menu
10. Insert this as query: <br>
    > mutation Save($saveArgs: SaveArgsV2!) {<br>
    > saveV2(args: $saveArgs)<br>
    > }​​​​​​​​​​​
11. And this as query variables: <br>
    > {​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​<br>
    > "saveArgs": {​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​ <br>
    > "to": "it-IT", //Lingua di destinazione <br>
    > "messages": [<br>
    > > {​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​<br>
    > > "srcLang": "en-DV", //Deve essere lasciata sempre così <br>
    > > "srcMessage": "store/login.signIn", //Id del messaggio che si vuole sovrascrivere <br>
    > > "context": "vtex.login@2.x", //Nome e versione dell'app di riferimento del messaggio <br>
    > > "targetMessage": "Accedi" //Nuovo valore <br>
    > > }​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​]}​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​}

`Remember to replace **srcMessage and context** with the discovered one and **targetMessage** with the desired one. Also remember to delete all comments and white spaces (red points)`

## Edit labels in cart and checkout

> $(document).ready(function () {​​​​​​​​<br>
>   setInterval(function () {​​​​​​​​<br>
>     traducirCheckoutES();<br>
>   }​​​​​​​​, 500);<br>
> }​​​​​​​​);<br>
>  <br>
> $(window).on("hashchange", function () {​​​​​​​​<br>
> setInterval(function () {​​​​​​​​<br>
> traducirCheckoutES();<br>
> }​​​​​​​​, 500);<br>
> }​​​​​​​​);<br>
> <br>
> /\* _/<br>
> <br>
> function traducirCheckoutES() {​​​​​​​​<br>
> $(".shipping-summary-info").each(function () {​​​​​​​​<br>
>     if ($(this).text() == "Encara falten dades per completar") {​​​​​​​​<br>
> $(this).text("Aún faltan datos por completar");<br>
>     }​​​​​​​​<br>
>   }​​​​​​​​);<br>
>  <br>
>   $("h3").each(function () {​​​​​​​​<br>
>     if ($(this).text() == "Per això, necessitem saber la seva ubicació") {​​​​​​​​<br>
> $(this).text("Para esto, necesitamos saber su ubicación");<br>
> }​​​​​​​​<br>
> }​​​​​​​​);<br>
> <br>
> $(".billing-form .billing-city label").text("Ciudad _");<br>
> $(".billing-form .billing-city input").attr("placeholder", "");<br>
> }​​​​​​​​

## Substitution Forms config

- **Accessory-Substitution** config

```
url servizio: /v1/api/order/refund
isReturn: true
isProduct: false
```

- **Product-Substitution** config

```
url servizio: /v1/api/order/refund
isReturn: true
isProduct: true
```

- **Returned-Product** config

```
url servizio: /v1/api/order/refund
isReturn: false
isProduct: true
```

- **Returned-Accessory** config

```
url servizio: /v1/api/order/refund
isReturn: false
isProduct: false
```

## Endpoints custom-app configuration

- service-locator : https://store-locator.dev.wpsandwatch.com/static/bootstrap.js
- garanzia-scaduta-oow : //icb.prod.wpsandwatch.com/static/bootstrap.js
- garanzia-estesa-online: //icb.prod.wpsandwatch.com/static/bootstrap.js
- problemie-e-soluzioni: //wia.prod.wpsandwatch.com/static/bootstrap.js

## Create a custom PLP

1. Create the custom PLP template using the `store.custom#` block
2. As internal block insert a `search-result-layout.customQuery#` block
3. In CMS create the custom PLP page and associate that to the previously created template
4. In Site Editor go to the new PLP page
5. Select the block `Search Result Custom Flexible Layout`
6. In the **Query** field insert the product categories or the IDs (es. `стиральные-машины/192`)
7. In **Map** field insert the attributes (es. `category-3,productClusterIds`)

## App Development Request

1. Go to the [App Development Request Link](https://docs.google.com/forms/d/e/1FAIpQLSfhuhFxvezMhPEoFlN9yFEkUifGQlGP4HmJQgx6GP32WZchBw/viewform)
2. Compile the form for each custom app
