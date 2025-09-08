import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const Redirect = () => {
    const { shortCode } = useParams();
    const history = useHistory();

    useEffect(() => {
        const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
        const originalUrl = urlMappings[shortCode];

        if (originalUrl) {
            window.location.href = originalUrl;
        } else {
            history.push('/', { error: 'URL not found' });
        }
    }, [shortCode, history]);

    return (
        <div className="redirect-container">
            <p>Redirecting...</p>
        </div>
    );
};

export default Redirect;