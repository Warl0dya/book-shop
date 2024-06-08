async function add_item(event) {
    event.preventDefault()

    function get_val_from_id(id) {
        return event.srcElement.querySelector(`#${id}`).value
    }

    const file = event.srcElement.querySelector('#file_zone').files[0]
    const thumbnail = await uploadFile(file)
    console.log(thumbnail)

    const tags = get_val_from_id('tags').split(' ')

    const data_container = {
        name: (get_val_from_id('name')),
        author: (get_val_from_id('author')),
        description: (get_val_from_id('description')),
        tags: tags,
        cost: (get_val_from_id('cost')),
        quantity: (get_val_from_id('quantity')),
        thumbnail: thumbnail
    }
    console.log(data_container)

    const resp = await request('/api/admin_interact', 'add_item', data_container)
    console.log(resp)
    alert(resp.message)
}