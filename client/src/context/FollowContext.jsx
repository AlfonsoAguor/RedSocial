import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFollowing, getFollower, unfollow, newFollow } from '../helpers/follow';

export const FollowContext = createContext();

// Hook personalizado para usar el contexto
export const useFollow = () => {
    const context = useContext(FollowContext);
    if (!context) {
        throw new Error("useFollow must be used within a FollowProvider");
    }
    return context;
}

export const FollowProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [followingData, setFollowingData] = useState(null);
    const [followerData, setFollowerData] = useState(null);
    const [followData, setFollowData] = useState(null);
    const [followChanged, setFollowChanged] = useState(true);

    const fetchFollow = async(userId) => {
        try {
            setFollowChanged(false);
            const res = await newFollow(userId);
            setFollowChanged(true);
        } catch (error) {
            console.error("Error fetching follow:", error);
        }
    } 

    const fecthFollowing = async(userId, page = 1) => {
        try {
            const res = await getFollowing(userId, page);
            setFollowingData(res.data.follows);
        } catch (error) {
            console.error("Error fetching following:", error);
        }
    }

    const fecthFollower = async(userId, page = 1) => {
        try {
            const res = await getFollower(userId, page);
            setFollowerData(res.data.follows);
        } catch (error) {
            console.error("Error fetching following:", error);
        }
    }

    const fetchUnfollow = async(userId) => {
        try {
            setFollowChanged(false);
            const res = await unfollow(userId);
            setFollowChanged(true);
        } catch (error) {
            console.error("Error fetching delete follow:", error);
        }
    }

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <FollowContext.Provider value={{
            fetchFollow,
            followData,
            fecthFollowing, 
            followingData,
            fecthFollower, 
            followerData, 
            fetchUnfollow,
            followChanged,
            loading 
            }}>

            {children}
        </FollowContext.Provider>
    );
};