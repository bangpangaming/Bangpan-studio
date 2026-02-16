const licenses = {
    "7974841614": { 
        licensed: true, 
        tier: "premium",
        expiresAt: null
    }
};

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    const pathParts = event.path.split('/');
    const userId = pathParts[pathParts.length - 1];
    
    if (!userId || userId === 'verify') {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "User ID required", licensed: false })
        };
    }
    
    console.log(`[VERIFY] User: ${userId}`);
    
    const license = licenses[userId];
    
    if (!license) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ licensed: false, message: "No license found" })
        };
    }
    
    if (license.expiresAt && Date.now() > license.expiresAt) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ licensed: false, message: "License expired" })
        };
    }
    
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            licensed: true,
            tier: license.tier,
            expiresAt: license.expiresAt,
            message: "License valid"
        })
    };
};

