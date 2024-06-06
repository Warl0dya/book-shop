const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')

const fs = require('fs')
const path = require('path');

const app = express()
const port = 6969

const sassMiddleware = require('node-sass-middleware')

app.use(express.json());

app.get(`/`, async (req, res) => {
    const indexPath = path.join(__dirname, '/frontEnd/index.html')
    res.sendFile(indexPath);
});

app.use(express.urlencoded({ extended: true }));
app.use(`/`, express.static(path.join(__dirname, '/frontEnd')))
app.use(`/`, sassMiddleware({
    src: path.join(__dirname, '/frontEnd'),
    debug: false,
    outputStyle: 'compressed',
    prefix: '/',
    response: true,
    force: true,
}));
app.use(`/images`, express.static(path.join(__dirname, '/storage/image_storage')))

const APIPath = "./backEnd"
fs.readdirSync(APIPath).forEach(file => {
    const filePath = path.join(APIPath, file)
    const queryModule = require('./' + filePath)
    app.post(`/api/${path.parse(file).name}`, async (req, res) => {
        const args = req.body
        const result = await queryModule(args)
        res.json(result)
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/image_storage');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log(req.body)
    res.send({ fileName: req.file.filename });
});

app.get(`/admin`, async (req, res) => {
    const indexPath = path.join(__dirname, '/admin_panel/index.html')
    res.sendFile(indexPath);
});

app.use(`/admin`, express.static(path.join(__dirname, '/admin_panel')))

app.listen(port, () => {
    console.log(`Сервер запущено на порті ${port}`)
})