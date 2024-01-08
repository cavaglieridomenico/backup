### Store Theme Robots (Example App)

This app shows how to use the new vtex.store-sitemap@2.x to be able to have different robots for each binding.

You need to use the `sitemap@0.x` builder and inside the `/sitemap` folder, create a `/robots` folder. Inside that folder, for each binding you want to have a custom robots.txt, you must create a file with the respective binding id as its name and with a `.txt` extension.
