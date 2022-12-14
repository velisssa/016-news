import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {GET_ARTICLES_REQUEST} from "../../actions/articles";
import {FOLLOW_REQUEST, GET_PROFILE_REQUEST, UNFOLLOW_REQUEST} from "../../actions/profiles";
import {ReactComponent as FollowIcon} from "../../assets/img/follow.svg";
import {ReactComponent as UnFollowIcon} from "../../assets/img/unfollow.svg";
import {ReactComponent as EditIcon} from "../../assets/img/edit.svg";
import Avatar from "@mui/material/Avatar";
import TabButton from "../../components/TabButton/TabButton";
import TabPage from "../../components/TabPage/TabPage";
import './ProfilePage.scss'
import SkeletonForProfilePage from "../../components/Skeletons/SkeletonForProfilePage/SkeletonForProfilePage";

const ProfilePage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const profileState = useSelector((state) => state.profiles.profile);
  const profileLoading = useSelector((state) => state.profiles.loading);
  const articlesState = useSelector((state) => state.articles.articles);
  const totalCount = articlesState.articlesCount
  const LIMIT = 10;
  const [offset, setOffset] = useState(0)
  const countOfPages = totalCount && Math.ceil(totalCount / LIMIT)
  const [pageNumber, setPageNumber] = useState(1);
  const [feedName, setFeedName] = useState(params.authorName)

  useEffect(() => {
    dispatch({
      type: GET_PROFILE_REQUEST,
      payload: {
        username: params.authorName,
        token: user?.token,
      },
    })
  }, [params.authorName])

  useEffect(() => {
    {
      (params.authorName === user?.username) && (feedName === 'Favorited')
        ? dispatch({
          type: GET_ARTICLES_REQUEST,
          payload: {
            limit: LIMIT,
            offset: offset,
            token: user?.token,
            favorited: params.authorName,
          }
        })
        : (params.authorName !== user?.username) && (feedName === 'Favorited') && setFeedName(params.authorName);

      (feedName !== 'Favorited') &&
      dispatch({
        type: GET_ARTICLES_REQUEST,
        payload: {
          limit: LIMIT,
          offset: offset,
          token: user?.token,
          authorName: params.authorName,
        }
      })
    }
  }, [pageNumber, offset, feedName, user?.token, params.authorName, profileState?.username])
  // profileState?.username
  const handlePageChange = (event, value) => {
    setPageNumber(value);
    setOffset(LIMIT * (value) - LIMIT)
  }

  const followAuthor = () => {
    dispatch({
      type: FOLLOW_REQUEST,
      payload: {
        username: profileState?.username,
        token: user?.token,
      }
    })
  }

  const unfollowAuthor = () => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      payload: {
        username: profileState?.username,
        token: user?.token,
      }
    })
  }

  return (
    <main className='profilePage'>

      {profileLoading
        ? <SkeletonForProfilePage/>
        : <div>
          <div className='profilePage__info'>
            <div className='profilePage__icon'>
              <Avatar
                className='profilePage__photo'
                src={profileState?.image}
                alt={profileState?.username}
                sx={{height: '200px', width: '200px'}}
              />

            </div>
            <div className='profilePage__name'>
              <div>{profileState?.username}</div>

              {user && (
                params.authorName === user?.username
                  ? (<Link className="profilePage__edit" to='/settings'>
                    <EditIcon title='Edit your profile'/>
                  </Link>)

                  : (<div
                    className={`profilePage__follow ${profileState?.following ? 'isFollow' : ''}`}
                    onClick={() => {
                      profileState?.following ? unfollowAuthor() : followAuthor()
                    }}
                  >
                    {profileState?.following
                      ? <UnFollowIcon title='UnFollow'/>
                      : <FollowIcon title='Follow'/>
                    }
                  </div>)
              )}
            </div>
            <div className='profilePage__bio'>{profileState?.bio}</div>
          </div>

          <div className="feeds__tabs">
            <TabButton
              tabName={params.authorName}
              setFeedName={setFeedName}
              feedName={feedName}
              setOffset={setOffset}
              setPageNumber={setPageNumber}
              tabText='acrticles'
            />

            {user?.username === params.authorName &&
            <TabButton
              tabName='Favorited'
              setFeedName={setFeedName}
              feedName={feedName}
              setOffset={setOffset}
              setPageNumber={setPageNumber}
              tabText='acrticles'
            />
            }
          </div>


          <div className='profilePage__wrapper'>

            {feedName === params.authorName &&
            <TabPage
              tabPageId={params.authorName}
              articlesState={articlesState}
              countOfPages={countOfPages}
              pageNumber={pageNumber}
              handlePageChange={handlePageChange}
            />}

            {feedName === 'Favorited' && (
              <TabPage
                tabPageId='Favorited'
                articlesState={articlesState}
                countOfPages={countOfPages}
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
              />
            )}

          </div>

        </div>
      }
    </main>

  );
};

export default ProfilePage;