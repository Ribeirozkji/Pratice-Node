const express = require('express');
const mysql = require('mysql2');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ATV'
});

conn.connect((err) => {
  if (err) {
    console.log('Erro no MySQL');
    return;
  }

  console.log('Conectado no MySQL');
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users ORDER BY id_user DESC';

  conn.query(sql, (err, users) => {
    if (err) {
      return res.send('Erro ao buscar usuários');
    }

    res.render('users', { users });
  });
});

app.post('/users/add', (req, res) => {
  const nome = req.body.nome;

  if (!nome) {
    return res.send('Digite o nome');
  }

  const sql = 'INSERT INTO users (nome) VALUES (?)';

  conn.query(sql, [nome], (err) => {
    if (err) {
      return res.send('Erro ao cadastrar usuário');
    }

    res.redirect('/users');
  });
});

app.get('/logs', (req, res) => {
  const sqlUsers = 'SELECT * FROM users ORDER BY nome ASC';
  const sqlLogs = `
    SELECT registro_logs.id_logs, registro_logs.dia_logs, users.nome
    FROM registro_logs
    JOIN users ON registro_logs.id_user = users.id_user
    ORDER BY registro_logs.id_logs DESC
  `;

  conn.query(sqlUsers, (err, users) => {
    if (err) {
      return res.send('Erro ao buscar usuários');
    }

    conn.query(sqlLogs, (err, logs) => {
      if (err) {
        return res.send('Erro ao buscar logs');
      }

      res.render('logs', { users, logs });
    });
  });
});

app.post('/logs/add', (req, res) => {
  const id_user = req.body.id_user;

  if (!id_user) {
    return res.send('Escolha um usuário');
  }

  const sql = 'INSERT INTO registro_logs (dia_logs, id_user) VALUES (NOW(), ?)';

  conn.query(sql, [id_user], (err) => {
    if (err) {
      return res.send('Erro ao registrar log');
    }

    res.redirect('/logs');
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});