async function get_items_data() {
    return await request('/api/items_interact', 'get_items');
}

async function get_filter_data() {
    return await request('/api/items_interact', 'get_filters');
}

function set_tags() {
    let tag_boxes = {
        authors: [],
        languages: [],
        tags: []
    };
    async function sub_set_tags() {
        const taglist = document
            .querySelector('.catalogue')
            .querySelector('.container')
            .querySelector('.sidebar');

        const f_data = await get_filter_data();

        const authors = taglist.querySelector('#authors');
        const a_list = document.createElement('ul');
        authors.appendChild(a_list);
        for (const item of f_data.authours) {
            const li = document.createElement('li');
            a_list.appendChild(li);
            const ch_box = document.createElement('input');
            li.appendChild(ch_box);
            ch_box.type = 'checkbox';
            ch_box.name = (item.toUpperCase());
            ch_box.after(item.toUpperCase());

            tag_boxes.authors.push(ch_box);
        }

        const languages = taglist.querySelector('#languages');
        const l_list = document.createElement('ul');
        languages.appendChild(l_list);
        for (const item of f_data.languages) {
            const li = document.createElement('li');
            l_list.appendChild(li);
            const ch_box = document.createElement('input');
            li.appendChild(ch_box);
            ch_box.type = 'checkbox';
            ch_box.name = item;
            ch_box.after(item);

            tag_boxes.languages.push(ch_box);
        }

        const tags = taglist.querySelector('#tags');
        const t_list = document.createElement('ul');
        tags.appendChild(t_list);
        for (const item of f_data.tags) {
            const li = document.createElement('li');
            t_list.appendChild(li);
            const ch_box = document.createElement('input');
            li.appendChild(ch_box);
            ch_box.type = 'checkbox';
            ch_box.name = item;
            ch_box.after(item);

            tag_boxes.tags.push(ch_box);
        }
    }
    sub_set_tags()

    return function () {
        let sel_tags = {
            authors: [],
            languages: [],
            tags: []
        };

        for (const tag_list in sel_tags) {
            for (const tag of tag_boxes[tag_list]) {
                if (tag.checked) {
                    sel_tags[tag_list].push(tag.name);
                }
            }
        }
        return sel_tags;
    }
}

const get_selected_tags = set_tags()