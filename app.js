const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cors = require('cors');
var hbs  = require('express-handlebars');

app.use(cors());
app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
var mensajes = []

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/chat/:uname',(req,res)=>{
    res.render('chat', {nombre: req.params.uname});
});


app.get('/mensajes',(req,res)=>{
    res.send(mensajes)
})

io.on('connection',(socket)=>{
    socket.on('chat message', function(msg){    
        mensajes = mensajes.concat(msg);
        io.emit('chat message', msg);
      });

    io.on('disconnect',()=>{
        console.log(`ID:[${socket.id}] DISCONNECTED`)
    })
})

http.listen(process.env.PORT || 5000, ()=>{
    console.log("Server running...")
});