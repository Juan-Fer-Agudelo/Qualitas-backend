const app = require('./app');

app.listen(app.get('port'), () => {
        console.log("Servidor Escuando En El Puerto", app.get("port"))
});