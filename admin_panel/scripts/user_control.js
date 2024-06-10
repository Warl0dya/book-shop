async function check_status(){
    const resp = await request(`/api/admin_interact`)
    console.log(resp)
    if(resp.result=='error'){
        window.location.href = '/'
    }
}

check_status()