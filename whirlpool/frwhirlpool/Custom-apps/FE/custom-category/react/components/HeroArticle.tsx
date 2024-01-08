import React from 'react'
import style from "../style.css";
import {StoreLink} from "whirlpoolemea.store-link-custom";

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
  return (
            <div className={style.heroContainer}>
              <div className={style.articleImageContainer}>
                <img className={style.articleImage} src={article.imageLink} alt={`${article.articleTitle} image` || "article image"} />
              </div>
              <div className={style.articleTextContainer}>
                <p className={`c-action-primary ${style.articleCategory}`}>{article.articleCategory || "Matching technology"}</p>
                <div className={style.heroTextLinkContainer}>
                  <div className={style.heroTitleContainer}>
                    <h2 className={`c-on-base ${style.articleTitle}`}>{article.articleTitle}</h2>
                    <p className={`c-on-base ${style.articleSubtitle}`}>{article.articleSubtitle}</p>
                  </div>
                  <div onClick={() => handleAnalytics(article.articleLink)} className={style.heroLinkContainer}>
                    <StoreLink isPrevent={false} href={article.articleLink} label={article.buttonLabel || "Discover More"} displayMode="button" />
                  </div>
                </div>
              </div>
            </div>
  )
}

export default HeroArticle