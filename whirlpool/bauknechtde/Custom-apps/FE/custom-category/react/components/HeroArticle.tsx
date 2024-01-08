import React from 'react'
import {StoreLink} from "itwhirlpool.store-link-custom";
import { useCssHandles } from 'vtex.css-handles'

interface HeroArticleProps {
    article: Article;
    handleAnalytics: (url: string) => void;
}
interface Article {
  articleCategory: string;
  articleTitle: string;
  articleLink: string;
  articleTime: string;
  articleTimeIcon: string;
  imageLink: string;
  isHero?: boolean;
  buttonLabel?: string;
  articleSubtitle?: string;
}

const HeroArticle: StorefrontFunctionComponent<HeroArticleProps> = ({article, handleAnalytics}) => {

  const CSS_HANDLES = [
    'heroContainer',
    'articleImageContainer',
    'articleImage',
    'articleTextContainer',
    'articleCategory',
    'heroTextLinkContainer',
    'heroTitleContainer',
    'articleTitle',
    'articleSubtitle',
    'heroLinkContainer'
  ] as const
  
  const handles = useCssHandles(CSS_HANDLES);

  return (
            <div className={handles.heroContainer}>
              <div className={handles.articleImageContainer}>
                <img className={handles.articleImage} src={article.imageLink} alt={`${article.articleTitle} image` || "article image"} />
              </div>
              <div className={handles.articleTextContainer}>
                <p className={`c-action-primary ${handles.articleCategory}`}>{article.articleCategory || "Matching technology"}</p>
                <div className={handles.heroTextLinkContainer}>
                  <div className={handles.heroTitleContainer}>
                    <h2 className={`c-on-base ${handles.articleTitle}`}>{article.articleTitle}</h2>
                    <p className={`c-on-base ${handles.articleSubtitle}`}>{article.articleSubtitle}</p>
                  </div>
                  <div onClick={() => handleAnalytics(article.articleLink)} className={handles.heroLinkContainer}>
                    <StoreLink isPrevent={false} href={article.articleLink} label={article.buttonLabel || "Discover More"} displayMode="button" />
                  </div>
                </div>
              </div>
            </div>
  )
}

export default HeroArticle