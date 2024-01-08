import React from 'react'
import { Link } from "vtex.render-runtime";
import style from "../style.css";
import {IconArrowBack} from 'vtex.store-icons'

interface ArticleProps {
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

const Article: StorefrontFunctionComponent<ArticleProps> = ({article, handleAnalytics}) => {
  return (
        <Link to={article.articleLink}>
            <div onClick={() => handleAnalytics(article.articleLink)} className={style.articleContainer}>
              <div className={style.articleImageContainer}>
                <img className={style.articleImage} src={article.imageLink} alt={`${article.articleTitle} image` || "article image"} />
              </div>
              <div className={style.articleTextContainer}>
                <div className={style.articleCategoryTime}>
                  <p className={`c-action-primary ${style.articleCategory}`}>{article.articleCategory}</p>
                  <span className={style.articleTime}><img alt="article time icon" className={style.articleTimeIcon} src="https://frwhirlpool.vteximg.com.br/arquivos/clock.svg" />{article.articleTime}' de {article.articleCategory === "recipes" ? "preparation" : "lecture"}</span>
                </div>
                <h2 className={`c-on-base ${style.articleTitle}`}>{article.articleTitle}</h2>
                <div className={`c-action-primary ${style.articleIconContainer}`}>
                  <IconArrowBack />
                </div>
              </div>
              <div className={ `bb bw1 b--action-primary ${style.articleGradient}`}></div>
            </div>
        </Link>
  )
}

export default Article