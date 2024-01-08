import React from 'react'
import { Link } from "vtex.render-runtime";
import {IconArrowBack} from 'vtex.store-icons';
import { useCssHandles } from 'vtex.css-handles'

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

  const CSS_HANDLES = [
    'articleContainer',
    'articleImageContainer',
    'articleImage',
    'articleTextContainer',
    'articleCategoryTime',
    'articleCategory',
    'articleTime',
    'articleTimeIcon',
    'articleTitle',
    'articleIconContainer',
    'articleGradient'
  ] as const
  
  const handles = useCssHandles(CSS_HANDLES);

  return (
        <Link to={article.articleLink}>
            <div onClick={() => handleAnalytics(article.articleLink)} className={handles.articleContainer}>
              <div className={handles.articleImageContainer}>
                <img className={handles.articleImage} src={article.imageLink} alt={`${article.articleTitle} image` || "article image"} />
              </div>
              <div className={handles.articleTextContainer}>
                <div className={handles.articleCategoryTime}>
                  <p className={`c-action-primary ${handles.articleCategory}`}>{article.articleCategory}</p>
                  <span className={handles.articleTime}><img alt="article time icon" className={handles.articleTimeIcon} src="https://frwhirlpool.vteximg.com.br/arquivos/clock.svg" />{article.articleTime}' de {article.articleCategory === "recipes" ? "preparation" : "lecture"}</span>
                </div>
                <h2 className={`c-on-base ${handles.articleTitle}`}>{article.articleTitle}</h2>
                <div className={`c-action-primary ${handles.articleIconContainer}`}>
                  <IconArrowBack />
                </div>
              </div>
              <div className={ `bb bw1 b--action-primary ${handles.articleGradient}`}></div>
            </div>
        </Link>
  )
}

export default Article