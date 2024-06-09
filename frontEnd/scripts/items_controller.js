async function update_items_list() {
    const tags = get_selected_tags()
    const items = await get_items_data()

    let generated_item_list = items

    const products = document
        .querySelector('.catalogue')
        .querySelector('.container')
        .querySelector('.main-content')
        .querySelector('.products')

    for (const item of generated_item_list) {
        const item_card = document.createElement('div')
        products.appendChild(item_card)
        item_card.className='product-card'

        item_card.innerHTML =
        `   <img src="/images/${item.thumbnail}" alt="Book Cover" class="product-image">
            <h3 class="product-title">${item.name}</h3>
            <p class="price">${item.cost} грн</p>
            <div class="buttons">
                <button class="buy-btn" onclick="">КУПИТИ</button>
                <button class="wishlist-btn">&#9825;</button>
            </div>`
    }
}

update_items_list()