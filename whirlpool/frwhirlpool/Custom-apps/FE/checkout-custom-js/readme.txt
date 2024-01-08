LINK  :
 - Apri 2 terminali: 
    - in uno npm run watch (checkout-ui-custom) e nell'altro vtex link(checkout-custom-js)
DEPLOY : 
- Ctrl+c dei due terminali
- utex use msater su entrambi i terminali
- aumenta a mano la version nel manifest
- npm run watch sempre su checkout-ui-custom
- vtex publish, deploy e update quando ha buildato