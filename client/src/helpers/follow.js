import instance from './axios';

export const newFollow = (userId) => {
    const url = `/follow/saveFollow/${userId}`;
    return instance.post(url);
};

export const getFollowing = (userId, page = 1) => {
    const url = userId ? `/follow/following/${userId}/${page}` : `/follow/following?page=${page}`;
    return instance.get(url);
};

export const getFollower = (userId, page = 1) => {
    const url = userId ? `/follow/follower/${userId}/${page}` : `/follow/follower?page=${page}`;
    return instance.get(url);
};

export const unfollow = (userId) => {
    const url = `/follow/unfollow/${userId}`;
    return instance.delete(url);
};

