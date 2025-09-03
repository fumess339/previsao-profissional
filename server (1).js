const express = require('express');

const multer = require('multer');

const pdfParse = require('pdf-parse');


const app = express();

const upload = multer();


app.use(express.static('public'));


app.post('/upload-cv', upload.single('curriculo'), async (req, res) => {

if (!req.file) {

return res.status(400).json({ error: 'Arquivo não enviado' });

}

try {

const data = await pdfParse(req.file.buffer);

const texto = data.text;
// Aqui você pode implementar sua lógica de IA, por enquanto só envia uma recomendação fixa

let recomendacao = "Com base no seu currículo, sugerimos focar em cursos de Data Science e Machine Learning.";


return res.json({ recomendacao });

} catch (err) {

return res.status(500).json({ error: 'Erro ao processar o arquivo' });

}

});


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));