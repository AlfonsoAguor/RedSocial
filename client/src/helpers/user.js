import instance from './axios';

export const getUserProfile = (nick) => {
    return instance.get(`/user/profile/${nick}`);
};

export const getUserList = (page = 1) => {
    return instance.get(`/user/list/${page}`);
};

export const getCounters = (userId) => {
    return instance.get(`/user/counter/${userId}`);
};

export const getUserProfileCounters = (userId) => {
    return instance.get(`/user/counter/${userId}`);
};

export const deleteUser = () => {
    return instance.delete(`/user/deleteUser`);
};

export const updateUser = user => {
    return instance.put(`/user/update`, user)
};

export const uploadAvatar = (avatarFile ) => {
    const formData = new FormData();
    formData.append('file0', avatarFile);

    return instance.post(`/user/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

