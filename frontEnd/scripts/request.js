async function request(link, type, args) {
    try {
        let usr = JSON.parse(localStorage.getItem('account'))
        if (usr == null) usr = { login: 'guest', temp_key: '' }
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                arguments: args,
                user: { login: usr.login, temp_key: usr.temp_key }
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