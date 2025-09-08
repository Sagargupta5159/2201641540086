import React, { useState, useCallback } from 'react';
import logger from '../utils/logger';
import './URLShortener.css';

const URLShortener = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Simple hash function to generate a short code
    const generateShortCode = useCallback((str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36).substring(0, 8);
    }, []);

    const handleShorten = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Basic URL validation
        try {
            new URL(originalUrl);
        } catch (err) {
            setError('Please enter a valid URL (include http:// or https://)');
            setLoading(false);
            return;
        }

        logger(`Shortening URL: ${originalUrl}`);

        try {
            // Generate a short code based on the URL and current timestamp
            const timestamp = new Date().getTime().toString(36);
            const shortCode = generateShortCode(originalUrl + timestamp);
            
            // Store the mapping in localStorage
            const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
            urlMappings[shortCode] = originalUrl;
            localStorage.setItem('urlMappings', JSON.stringify(urlMappings));
            
            // Create the shortened URL
            const baseUrl = window.location.origin;
            const shortenedUrl = `${baseUrl}/r/${shortCode}`;
            
            setShortUrl(shortenedUrl);
            logger(`Shortened URL created: ${shortenedUrl}`);
        } catch (err) {
            setError('Error: Unable to shorten URL');
            logger('Error:', err.message || 'Unable to shorten URL');
        }
        
        setLoading(false);
    };

    const copyToClipboard = () => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl)
                .then(() => {
                    // Show feedback that URL was copied
                    const copyButton = document.querySelector('.copy-button');
                    if (copyButton) {
                        const originalText = copyButton.textContent;
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.error('Failed to copy URL:', err);
                });
        }
    };

    return (
        <div className="url-shortener-container">
            <h2 className="url-shortener-title">URL Shortener Web App</h2>
            <form onSubmit={handleShorten}>
                <input
                    className="url-shortener-input"
                    type="url"
                    placeholder="Enter URL to shorten (include http:// or https://)"
                    value={originalUrl}
                    onChange={e => setOriginalUrl(e.target.value)}
                    required
                />
                <button 
                    className="url-shortener-button" 
                    type="submit" 
                    disabled={loading || !originalUrl}
                >
                    {loading ? 'Shortening...' : 'Shorten URL'}
                </button>
            </form>
            
            {error && <div className="error-message">{error}</div>}
            
            {shortUrl && (
                <div className="url-shortener-result">
                    <strong>Shortened URL:</strong>{' '}
                    <a 
                        href={shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shortened-url"
                    >
                        {shortUrl}
                    </a>
                    <button 
                        onClick={copyToClipboard}
                        className="copy-button"
                        title="Copy to clipboard"
                    >
                        Copy
                    </button>
                    <p className="disclaimer">
                        Note: This is a client-side implementation. The shortened URLs will only work in this browser.
                    </p>
                </div>
            )}
        </div>
    );
};

export default URLShortener;