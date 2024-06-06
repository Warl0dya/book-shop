async function login_test(){
    const req = await fetch('/api/user_interact',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                req_type:'login',
                login:'warlodya'
            }),
        }
    )
    const data = await req.json()
    console.log(data)
}

login_test()