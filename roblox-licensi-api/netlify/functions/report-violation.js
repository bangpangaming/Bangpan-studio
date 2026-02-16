let licenses = {};

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        const { userId, tier, duration } = JSON.parse(event.body);
        
        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'userId required' })
            };
        }
        
        const expiresAt = duration ? Date.now() + (duration * 24 * 60 * 60 * 1000) : null;
        
        licenses[userId] = {
            licensed: true,
            tier: tier || "free",
            expiresAt: expiresAt,
            createdAt: Date.now()
        };
        
        console.log(`[ADD] License: ${userId}`);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: "License added",
                license: licenses[userId]
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
