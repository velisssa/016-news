import React from 'react';
import './ArticleCard.scss'
import {ReactComponent as FavoritesIcon} from '../../assets/img/HomePage/ArticleCard/heart.svg';
import AuthorInfo from "../AuthorInfo/AuthorInfo";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {DELETE_ARTICLE_REQUEST, DELETE_FAVORITES_REQUEST} from "../../actions/articles";
import {ADD_FAVORITES_REQUEST} from "../../actions/articles";
import {useNavigate} from "react-router-dom";

const ArticleCard = ({article}) => {
  let dateArticle = new Date(article.updatedAt)
  let user = useSelector((state) => state.users.user);
  const loadingFavorite = useSelector((state) => state.articles.loadingFavorite)
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const deleteArticle = () => {
    dispatch({
      type: DELETE_ARTICLE_REQUEST,
      payload: {
        slug: article.slug,
        token: user?.token,
        page: 'homePage',
      }
    })
  }

  const addToFavorites = () => {
    dispatch({
      type: ADD_FAVORITES_REQUEST,
      payload: {
        slug: article.slug,
        token: user?.token,
      }
    })
  }

  const deleteFromFavorites = () => {
    dispatch({
      type: DELETE_FAVORITES_REQUEST,
      payload: {
        slug: article.slug,
        token: user?.token,
      }
    })
  }

  return (
    <div className='articleCard'>
      <div className='articleCard__info'>
        <Link className='articleCard__link-overlay' to={`/articles/${article.slug}`}/>

        <div className='articleCard__info-top'>
          <AuthorInfo author={article.author} dateAuthorInfo={dateArticle}/>
          <div
            className={`articleCard__favorites ${article.favorited ? 'favorited' : '' } ${loadingFavorite ? 'loadingFavorite' : ''}` }
            onClick={() => {(
              user
                ? article.favorited ? deleteFromFavorites() : addToFavorites()
                : navigate('/signin')
            )}}
          >
            <FavoritesIcon/>
            <p
              className='articleCard__favorites-count'
            >
              {article.favoritesCount}</p>
          </div>
        </div>

        <div className='articleCard__info-bottom'>
          <p className='articleCard__description'>{article.title}</p>
          <div className='articleCard__wrapper'>
            <div className='articleCard__buttons'>
              <Link className='articleCard__link' to={`/articles/${article.slug}`}>
                <Button variant="outlined">Read more</Button>
              </Link>

              {article.author?.username === user?.username && (
                <div className='articleCard__editor'>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/editor/${article.slug}`)}
                  >Edit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => deleteArticle()}
                  >Delete</Button>
                </div>
              )}
            </div>

            <div className='articleCard__taglist'>
              {article.tagList?.map((tag, index) => (
                <Link className='articleCard__tagitem' to='#' key={index}>{tag} </Link>)
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;