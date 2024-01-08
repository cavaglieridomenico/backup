/* eslint-disable vtex/prefer-early-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { method } from '@vtex/api'

export const resolvers = {
  Routes: {
    getSitemap: [
      method({
        GET: async (ctx: Context) => {

            const lastMod = new Date().toISOString()
            const storesMap = `
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                <url> 
                  <loc>https://www.hotpoint.it/ricette</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url> 
                  <loc>https://www.hotpoint.it/ricette/dettaglio/kiwi-uva-ribes-e-prezzemolo-vitamina-c</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url> 
                  <loc>https://www.hotpoint.it/ricette/dettaglio/asparagi-sedano-e-carote-low-cal</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url> 
                  <loc>https://www.hotpoint.it/ricette/dettaglio/arancia-carota-e-limone-energizzante</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url> 
                  <loc>https://www.hotpoint.it/ricette/dettaglio/mela-pesca-e-menta-rinfrescante</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url> 
                  <loc>https://www.hotpoint.it/ricette/dettaglio/ananas-menta-e-cavolo-vitaminico</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url> 
                  <loc>https://www.hotpoint.it/ricette/dettaglio/melograno-e-fragola-antiossidante</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/arancini-di-riso-al-forno</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/burger-di-pollo-e-formaggio</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/cesar-salad-calda</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/cestini-di-pane-con-pomodorini</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/cheesecake-alla-newyorkese</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/cookies-al-cioccolato</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/focaccia-al-prosciutto-e-formaggio</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/fondant-al-cioccolato</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/funghi-ripieni-arrosto</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/salmone-alla-griglia-con-erbe-croccanti</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/torta-con-mandorle-e-frutta</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/trancio-di-tonno-grigliato-con-pomodorini-e-olive</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/zuppa-di-lenticchie-al-latte-di-cocco-e-curry</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/zuppa-di-zucca-con-curcuma-e-menta</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/costolette-di-agnello-grigliate-con-salsa-alla-menta</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
                <url>
                  <loc>https://www.hotpoint.it/ricette/dettaglio/mini-muffin-al-cioccolato</loc>
                  <lastmod>${lastMod}</lastmod>
                </url>
              </urlset>`

            ctx.set('Content-Type', 'text/xml')
            ctx.body = storesMap
            ctx.status = 200
          }
      }),
    ],
  },
  Query: {
    getStores: async (_: any, __: any, ctx: Context) => {
      const {
        clients: { sitemap, vbase },
        vtex: { logger },
      } = ctx

      const APP_NAME = 'recipes'
      const SCHEMA_NAME = 'sitemap'

      const saveInVbase = async () => {
        try {
          const res: any = await sitemap.saveIndex()

          if (res?.data?.saveIndex) {
            await vbase.saveJSON(APP_NAME, SCHEMA_NAME, {
              alreadyHasSitemap: true,
            })

            return true
          }

          return false
        } catch (err) {
          logger.error({ error: err, message: 'getStores-saveInBase-error' })

          return false
        }
      }

      sitemap.hasSitemap().then((has: any) => {
        if (has === false) {
          vbase
            .getJSON(APP_NAME, SCHEMA_NAME, true)
            .then((getResponse: any) => {
              const { alreadyHasSitemap = false } = getResponse ?? {}

              !alreadyHasSitemap && saveInVbase()
            })
            .catch((err: any) =>
              logger.error({ error: err, message: 'getStores-getJSON-error' })
            )
        }
      })
      }
    },
}