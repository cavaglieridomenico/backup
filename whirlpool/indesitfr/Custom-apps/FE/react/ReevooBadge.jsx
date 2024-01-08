import React, { useEffect } from "react";
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";

export default function ReevooBadge() {
  const { product } = useProduct();

  const productFcode = product.items[0].name;

  useEffect(() => {
    getReevooData();
  }, []);

  function getReevooData() {
    const test = document.getElementById("reevoo-loader");

    if (!test) {
      
      const script = document.createElement("script");

      script.defer = "defer";
      script.src = "https://widgets.reevoo.com/loader/IN4.js";
      script.id = "reevoo-loader";
      script.async = true;
      document.body.appendChild(script);
    }
  }

  /*

  USE EFFECT ALTERNATIVO PER CERCARE UNA SOLUZIONE

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widgets.reevoo.com/loader/IN4.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script);
    }
  }, [])
 */

  /*  function initReevooLoader() {
    window.reevooLoader = new ReevooLoader({
      assets: {
        reevooBadge: { url: '/assets/reevoo_adaptive_badges_3_9.3-5c53365f7d775e2bfc5c5534270f4558.js', id: 'reevoo-badges', type: 'JS' },
        style: { url: '/assets/mark2.0/reevoo_loader-75c14ebfc437b2de9f744dc57d2c0be5.css', id: 'reevoo-style', type: 'STYLE' },
      },
      apis: {
        texts: { url: '/loader/texts' },
        badgeVariants: { url: '/reevoomark/badge-variant' },
        badgeTemplates: { url: '/reevoomark/badge' },
        productSummaries: { url: '/reevoomark/product_summary' },
        customExperienceScores: { url: '/reevoomark/customer_experience_scores/---trkref---.json' },
        brandReviews: { url: '/api/brand_reviews' },
        aaoReviews: { url: '/api/conversations/questions' }, // deprecated
        conversationsQuestions: { url: '/api/conversations/questions' },
        newConversationsResponse: { url: '/api/conversations/responses/new' },
        productReviews: { url: '/api/product_reviews' },
        offers: { url: '/api/v1/widgets/offers', host: 'price_widgets' },
      },
      rich_snippets: {
        productRichSnippets: { url: '/loader/product_reviews_rich_snippets.js', id: 'product_rich_snippets', type: 'JS' },
        brandRichSnippets: { url: '/loader/cx_reviews_rich_snippets.js', id: 'brand_rich_snippets', type: 'JS' }
      },
      settings: {
        hosts: {
          default: 'https://widgets.reevoo.com',
          price_widgets: 'https://price-widgets.reevoo.com',
        },
        trkref: 'IN4',
        locale: 'en-GB',
        language: 'en',
        tracking_enabled: true,
        translations_enabled: false,
        offers_enabled: true,
        show_brand: true,
        aao_enabled: true,
        brand_reviews_enabled: true,
        product_reviews_enabled: true,
        min_product_reviews_to_show: 3,
        min_product_reviews_with_content_to_show: 1,
        min_brand_reviews_to_show: 1
      },
      theme_styles: null,
      texts: { "tab_titles": { "aao": "Ask an owner", "product": "Customer reviews", "brand": "Reviews of Indesit" } }
    })
    window.reevooLoader.registerCustomElements()
  }

   function start() {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'reevoo-loader'
    script.src = "https://widgets.reevoo.com/assets/mark2.0/reevoo_loader-ab02f0f770426225d1346b389bab3602.js"
    script.onload = initReevooLoader
    document.head.appendChild(script)
  }
  */

  const CSS_HANDLES = [
    "reevoo__container",
    "readsReviews__container",
    "askAnOwner__container",
  ];

  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <div className={handles.reevoo__container}>
      <reevoo-badge
        type="product"
        variant="badge_1"
        product-id={productFcode}
      />
    </div>
  );
}
