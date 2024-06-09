async function request(link, type, args) {
    try {
        let usr = { temp_key: localStorage.getItem('userKey') }
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                arguments: args,
                user: { temp_key: usr.temp_key }
            }),
        });
        if (!response.ok) {
            return 'RESPONSE_ERROR'
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Сталась помилка обробки запиту:', error);
        return 'RESPONSE_ERROR'
    }
}