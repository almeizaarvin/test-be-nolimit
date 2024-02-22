import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
    res.send('Ini get!');
})

app.post('/',(req, res)=>{
    res.send({
        data: req.body
    });
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
