import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const db = isWeb
  ? {
      execAsync: async () => {},
      getAllAsync: async () => [],
      getFirstAsync: async () => null,
      runAsync: async () => ({ changes: 0, lastInsertRowId: 1 }),
    }
  : SQLite.openDatabaseSync('bookflow.db');





const inserirStatusPadrao = async () => {

  try {

    const existente = await db.getAllAsync(
      'SELECT * FROM tb_status'
    );

    if (existente.length > 0) return;

    const status = [
      'Pendente',
      'Pago',
      'Enviado',
      'Entregue',
      'Cancelado'
    ];

    for (const s of status) {

      await db.runAsync(
        'INSERT INTO tb_status (ds_status) VALUES (?)',
        [s]
      );

    }

  } catch (error) {

    console.error('Erro ao inserir status:', error);

  }

};





export const initDatabase = async () => {

  try {

    await db.execAsync(`

      PRAGMA foreign_keys = ON;



      -- USUARIO
      CREATE TABLE IF NOT EXISTS tb_usuario (

        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,

        nome_usuario TEXT,
        cpf_usuario TEXT,
        email_usuario TEXT UNIQUE,
        senha_usuario TEXT,
        telefone_usuario TEXT,
        tipo_usuario TEXT,

        data_cadastro DATETIME
        DEFAULT CURRENT_TIMESTAMP

      );



      -- ENDERECO
      CREATE TABLE IF NOT EXISTS tb_endereco (

        id_endereco INTEGER PRIMARY KEY AUTOINCREMENT,

        logradouro TEXT,
        numero INTEGER,
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,

        id_usuario INTEGER,

        FOREIGN KEY (id_usuario)
        REFERENCES tb_usuario(id_usuario)

      );



      -- CATEGORIA
      CREATE TABLE IF NOT EXISTS tb_categoria (

        id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,

        nome_categoria TEXT

      );



      -- LIVRO
      CREATE TABLE IF NOT EXISTS tb_livro (

        id_livro INTEGER PRIMARY KEY AUTOINCREMENT,

        titulo_livro TEXT,
        autor_livro TEXT,
        editora_livro TEXT,
        ano_livro INTEGER,
        sinopse_livro TEXT,
        capa_livro TEXT,

        id_categoria INTEGER,

        FOREIGN KEY (id_categoria)
        REFERENCES tb_categoria(id_categoria)

      );



      -- FAVORITO
      CREATE TABLE IF NOT EXISTS tb_favorito (

        id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,

        id_usuario INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_usuario)
        REFERENCES tb_usuario(id_usuario),

        FOREIGN KEY (id_livro)
        REFERENCES tb_livro(id_livro)

      );



      -- CARRINHO
      CREATE TABLE IF NOT EXISTS tb_carrinho (

        id_carrinho INTEGER PRIMARY KEY AUTOINCREMENT,

        id_usuario INTEGER,

        FOREIGN KEY (id_usuario)
        REFERENCES tb_usuario(id_usuario)

      );



      -- ITEM CARRINHO
      CREATE TABLE IF NOT EXISTS tb_item_carrinho (

        id_item_carrinho INTEGER PRIMARY KEY AUTOINCREMENT,

        quantidade INTEGER,
        preco_unitario REAL,

        id_carrinho INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_carrinho)
        REFERENCES tb_carrinho(id_carrinho),

        FOREIGN KEY (id_livro)
        REFERENCES tb_livro(id_livro)

      );



      -- STATUS
      CREATE TABLE IF NOT EXISTS tb_status (

        id_status INTEGER PRIMARY KEY AUTOINCREMENT,

        ds_status TEXT

      );



      -- PEDIDO
      CREATE TABLE IF NOT EXISTS tb_pedido (

        id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,

        data_pedido DATETIME
        DEFAULT CURRENT_TIMESTAMP,

        valor_total REAL,

        id_usuario INTEGER,
        id_endereco INTEGER,
        id_status INTEGER,

        FOREIGN KEY (id_usuario)
        REFERENCES tb_usuario(id_usuario),

        FOREIGN KEY (id_endereco)
        REFERENCES tb_endereco(id_endereco),

        FOREIGN KEY (id_status)
        REFERENCES tb_status(id_status)

      );



      -- ITEM PEDIDO
      CREATE TABLE IF NOT EXISTS tb_item_pedido (

        id_item_pedido INTEGER PRIMARY KEY AUTOINCREMENT,

        quantidade INTEGER,
        preco_unitario REAL,

        id_pedido INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_pedido)
        REFERENCES tb_pedido(id_pedido),

        FOREIGN KEY (id_livro)
        REFERENCES tb_livro(id_livro)

      );



      -- PAGAMENTO
      CREATE TABLE IF NOT EXISTS tb_pagamento (

        id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,

        forma_pagamento TEXT,
        valor_total REAL,

        id_usuario INTEGER,
        id_endereco INTEGER,
        id_status INTEGER,

        FOREIGN KEY (id_usuario)
        REFERENCES tb_usuario(id_usuario),

        FOREIGN KEY (id_endereco)
        REFERENCES tb_endereco(id_endereco),

        FOREIGN KEY (id_status)
        REFERENCES tb_status(id_status)

      );



      -- AVALIACAO
      CREATE TABLE IF NOT EXISTS tb_avaliacao (

        id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,

        nota INTEGER,
        comentario TEXT,

        data_avaliacao DATETIME,

        id_pedido INTEGER,
        id_livro INTEGER,

        FOREIGN KEY (id_pedido)
        REFERENCES tb_pedido(id_pedido),

        FOREIGN KEY (id_livro)
        REFERENCES tb_livro(id_livro)

      );

    `);

    console.log('Banco criado com sucesso');

    await inserirStatusPadrao();

    return true;

  } catch (error) {

    console.error('Erro ao criar banco:', error);

    return false;

  }

};



export default db;