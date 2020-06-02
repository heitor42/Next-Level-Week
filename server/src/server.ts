import express from "express";

const app = express();

app.use(express.json());

const users = [
    'carlos',
    'Kessy',
    'Barbara',
    'Luiza',
];

// Query Param: Parametros, geralmente opcionais, que vem na propria rota e sao usados para, filtros, paginação, etc
app.get('/users', (request, response) => {
    const search = String(request.query.search);

    const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

    return response.json(filteredUsers);
});

//Request Param: Prametro enviado na propria rota que identifica um elemento
app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);

    const user = users[id];

    return response.json(user);
});

//Request Body: Parametros para criação/atualisação de informações
app.post('/users', (request, response) => {
    const data = request.body;

    const user = {
        name: data.name,
        email: data.email,
    };

    return response.json(user);
});

app.listen(3333);