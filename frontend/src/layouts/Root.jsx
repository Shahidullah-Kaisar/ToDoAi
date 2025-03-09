import React from 'react';
import { Outlet } from 'react-router';

const Root = () => {
    return (
        <div className="min-h-screen bg-gray-800 text-white flex justify-center items-center">
            <Outlet />
        </div>
    );
};

export default Root;