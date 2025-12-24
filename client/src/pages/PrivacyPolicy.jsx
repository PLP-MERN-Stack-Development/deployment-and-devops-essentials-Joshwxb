import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Privacy Policy</h1>
            <p style={dateStyle}>Last Updated: December 2025</p>

            <section style={sectionStyle}>
                <h2 style={subTitleStyle}>1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you create an account, such as your username and email address. We also collect content you post, such as blog entries and comments.</p>
            </section>

            <section style={sectionStyle}>
                <h2 style={subTitleStyle}>2. Tracking & Cookies (AdSense & Meta Pixel)</h2>
                <p>We use tracking technologies to improve your experience:</p>
                <ul>
                    <li><strong>Google AdSense:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</li>
                    <li><strong>Meta Pixel:</strong> We use the Facebook Pixel to understand user behavior and measure the effectiveness of our social media content.</li>
                </ul>
                <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Google Ad Settings</a>.</p>
            </section>

            <section style={sectionStyle}>
                <h2 style={subTitleStyle}>3. How We Use Data</h2>
                <p>Your data is used to maintain your profile, send notification alerts for comments on your posts, and display relevant content and advertisements.</p>
            </section>

            <section style={sectionStyle}>
                <h2 style={subTitleStyle}>4. Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section style={sectionStyle}>
                <h2 style={subTitleStyle}>5. Contact Us</h2>
                <p>If you have questions about this policy, please contact us through the Weblog support channels.</p>
            </section>
        </div>
    );
};

// --- Styles ---
const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    lineHeight: '1.6',
    color: '#2d3748',
    fontFamily: 'sans-serif'
};

const titleStyle = { fontSize: '2.5rem', color: '#1a202c', marginBottom: '10px' };
const dateStyle = { color: '#718096', fontSize: '0.9rem', marginBottom: '30px' };
const sectionStyle = { marginBottom: '25px' };
const subTitleStyle = { fontSize: '1.5rem', color: '#2b6cb0', marginBottom: '10px' };

export default PrivacyPolicy;