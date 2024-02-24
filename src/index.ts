import express from 'express';
import { Request, Response } from 'express';
const app = express();
app.use(express.json())

app.get('/:id', (req: Request, res: Response) => {
    res.send({
        message: 'Hai',
        data: req.params.id
    })})

app.post('/',(req: Request, res: Response)=>{
    res.send({
        data: req.body
    })
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
