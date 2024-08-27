// publication.js
import instance from './axios';

export const getPublicationsUser = (userId, page = 1) => {
    return instance.get(`/publication/publications/${userId}/${page}`);
}; 

export const deletePublication = (id) => {
    return instance.delete(`/publication/remove/${id}`);
};

export const getFeed = (page = 1) => {
    return instance.get(`/publication/feed/${page}`);
};
 
export const savePublication = publicationData => {
    return instance.post(`/publication/save`, publicationData);
};

export const uploadImage = (publicationId, imageFile) => {
    const formData = new FormData();
    formData.append('file0', imageFile);

    return instance.post(`/publication/upload/${publicationId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
