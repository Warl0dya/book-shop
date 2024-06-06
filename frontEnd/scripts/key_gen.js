function KEYGEN() {
    const key_length = 32
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    let key = ''
    for (let i = 0; i < key_length; i++) {
        key+=alphabet[Math.floor(Math.random()*alphabet.length)]
    }
    return key
}