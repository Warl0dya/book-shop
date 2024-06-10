async function update_items_list() {

    const tags = get_selected_tags()
    const items = await get_items_data()

    let generated_item_list = items;

    function matches_tags(item, tags) {
        for (const tag_list in tags) {
            for (const tag of tags[tag_list]) {
                if (!['authors', 'languages'].includes(tag_list)) {
                    if (!item[tag_list].includes(tag)) {
                        return false;
                    }
                } else {
                    const tname = tag_list.slice(0, -1);
                    if (item[tname].toLowerCase() !== tag.toLowerCase()) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    generated_item_list = generated_item_list.filter(item => matches_tags(item, tags));

    const products = document
        .querySelector('.catalogue')
        .querySelector('.container')
        .querySelector('.main-content')
        .querySelector('.products')

    products.innerHTML = ''
    for (const item of generated_item_list) {
        const item_card = document.createElement('div')
        products.appendChild(item_card)
        item_card.className = 'product-card'

        item_card.innerHTML =
            `   <img src="/images/${item.thumbnail}" alt="Book Cover" class="product-image">
            <h3 class="product-title">${item.name}</h3>
            <p class="price">${item.cost} грн</p>
            <div class="buttons">
                <button class="buy-btn" onclick="buy(${item.id})">КУПИТИ</button>
                <button class="wishlist-btn" onclick="add_fav(${item.id})">&#9825;</button>
            </div>`
    }
}

update_items_list()

async function update_fav_list() {
    let favs = JSON.parse(localStorage.getItem('favs'))
    const favlist = document
        .querySelector('.whish-list')
        .querySelector('.card_block')

    favlist.innerHTML = ''

    for (const fav_itm of favs) {
        const itm = await request('/api/items_interact', 'get_item', { id: fav_itm })
        const prd_card = document.createElement('div')
        favlist.appendChild(prd_card)
        prd_card.className = 'product-card'
        prd_card.innerHTML = `
                <img src="/images/${itm.thumbnail}" alt="Book Cover" class="product-image">
                <h3 class="product-title">${itm.name}</h3>
                <input type="button" value="X" onclick="rm_fav(${itm.id})">`

    }
}

update_fav_list()

async function update_basket_list() {
    let basket = JSON.parse(localStorage.getItem('basket'))
    const basketlist = document
        .querySelector('.owned')
        .querySelector('.card_block')

    basketlist.innerHTML = ''

    for (const basket_itm of basket) {
        const itm = await request('/api/items_interact', 'get_item', { id: basket_itm })
        const prd_card = document.createElement('div')
        basketlist.appendChild(prd_card)
        prd_card.className = 'product-card'
        prd_card.innerHTML = `
                <img src="/images/${itm.thumbnail}" alt="Book Cover" class="product-image">
                <h3 class="product-title">${itm.name}</h3>`

    }
}

update_basket_list()

async function add_fav(id) {
    let favs = JSON.parse(localStorage.getItem('favs'))
    favs.push(id)
    localStorage.setItem('favs', JSON.stringify(favs))
    const resp = await request(`/api/items_interact`, 'update_prefs', { type: 'favs', data: favs })
    console.log(resp)
    update_fav_list()
}

async function rm_fav(id) {
    let favs = JSON.parse(localStorage.getItem('favs'))
    favs = favs.filter((fav_id) => fav_id != id)
    localStorage.setItem('favs', JSON.stringify(favs))
    const resp = await request(`/api/items_interact`, 'update_prefs', { type: 'favs', data: favs })
    console.log(resp)
    update_fav_list()
}

async function buy(id) {
    const abl_to_buy = await request(`/api/items_interact`, 'check_buy_ability', { id: id })
    alert(abl_to_buy.message)
    if(abl_to_buy.result == 'error') return
    let basket = JSON.parse(localStorage.getItem('basket'))
    basket.push(id)
    localStorage.setItem('basket', JSON.stringify(basket))
    const resp = await request(`/api/items_interact`, 'update_prefs', { type: 'basket', data: basket })
    console.log(resp)
    update_basket_list()
}