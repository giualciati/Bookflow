import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// O expo-sqlite (openDatabaseSync) causa tela branca na Web sem a configuração do WASM.
// Fazemos um mock simples para a Web, para que pelo menos o layout do site carregue (mas sem salvar de verdade).
const isWeb = Platform.OS === 'web';

const db = isWeb
  ? {
    execAsync: async () => { },
    getAllAsync: async () => [],
    getFirstAsync: async () => null,
    runAsync: async () => ({ changes: 0, lastInsertRowId: 1 }),
  }
  : SQLite.openDatabaseSync('usuarios.db');

// ─── Inicialização ────────────────────────────────────────────────────────────

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        idade INTEGER,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        categoria TEXT,
        imagem_url TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS enderecos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        logradouro TEXT NOT NULL,
        numero TEXT,
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        padrao BOOLEAN DEFAULT 0,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
      );

      CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        status TEXT DEFAULT 'Pendente',
        endereco_id INTEGER,
        total REAL,
        forma_pagamento TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY(endereco_id) REFERENCES enderecos(id)
      );

      CREATE TABLE IF NOT EXISTS itens_pedido (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER,
        livro_id INTEGER,
        quantidade INTEGER,
        preco_unitario REAL,
        FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
        FOREIGN KEY(livro_id) REFERENCES livros(id)
      );
    `);

    // Migrações — colunas adicionais
    const migrations = [
      'ALTER TABLE usuarios ADD COLUMN cpf TEXT;',
      'ALTER TABLE usuarios ADD COLUMN data_nascimento TEXT;',
      'ALTER TABLE livros ADD COLUMN estoque INTEGER DEFAULT 0;',
    ];
    for (const sql of migrations) {
      try { await db.execAsync(sql); } catch (_) { /* coluna já existe */ }
    }

    console.log('✅ Banco de dados inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    return false;
  }
};

// ─── Usuários ─────────────────────────────────────────────────────────────────

export const getAllUsuarios = async () => {
  try {
    return await db.getAllAsync('SELECT * FROM usuarios ORDER BY id DESC');
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const getUsuarioById = async (id) => {
  try {
    return await db.getFirstAsync('SELECT * FROM usuarios WHERE id = ?', [id]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

export const createUsuario = async (nome, email, idade) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO usuarios (nome, email, idade) VALUES (?, ?, ?)',
      [nome, email, idade || null]
    );
    return { id: result.lastInsertRowId, nome, email, idade };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

export const updateUsuario = async (id, nome, email, idade, cpf, data_nascimento) => {
  try {
    const result = await db.runAsync(
      'UPDATE usuarios SET nome = ?, email = ?, idade = ?, cpf = ?, data_nascimento = ? WHERE id = ?',
      [nome, email, idade || null, cpf || null, data_nascimento || null, id]
    );
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    const result = await db.runAsync('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

export const clearAllUsuarios = async () => {
  try {
    await db.runAsync('DELETE FROM usuarios');
    return true;
  } catch (error) {
    console.error('Erro ao limpar usuários:', error);
    throw error;
  }
};

// ─── Categorias (US10) ────────────────────────────────────────────────────────

export const getAllCategorias = async () => {
  try {
    return await db.getAllAsync('SELECT * FROM categorias ORDER BY nome ASC');
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

export const createCategoria = async (nome, descricao) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
      [nome, descricao || null]
    );
    return { id: result.lastInsertRowId, nome, descricao };
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};

export const updateCategoria = async (id, nome, descricao) => {
  try {
    const result = await db.runAsync(
      'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
      [nome, descricao || null, id]
    );
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

export const deleteCategoria = async (id) => {
  try {
    const result = await db.runAsync('DELETE FROM categorias WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }
};

// ─── Livros (RF01, US10) ──────────────────────────────────────────────────────

export const getAllLivros = async () => {
  try {
    return await db.getAllAsync('SELECT * FROM livros ORDER BY titulo ASC');
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
};

export const getLivroById = async (id) => {
  try {
    return await db.getFirstAsync('SELECT * FROM livros WHERE id = ?', [id]);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    throw error;
  }
};

export const searchLivros = async (query) => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM livros WHERE titulo LIKE ? OR categoria LIKE ? ORDER BY titulo ASC',
      [`%${query}%`, `%${query}%`]
    );
  } catch (error) {
    console.error('Erro ao pesquisar livros:', error);
    throw error;
  }
};

export const createLivro = async (titulo, descricao, preco, estoque, categoria, imagem_url) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO livros (titulo, descricao, preco, estoque, categoria, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descricao || null, preco, estoque || 0, categoria || null, imagem_url || null]
    );
    return { id: result.lastInsertRowId, titulo, descricao, preco, estoque, categoria, imagem_url };
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw error;
  }
};

export const updateLivro = async (id, titulo, descricao, preco, estoque, categoria, imagem_url) => {
  try {
    const result = await db.runAsync(
      'UPDATE livros SET titulo = ?, descricao = ?, preco = ?, estoque = ?, categoria = ?, imagem_url = ? WHERE id = ?',
      [titulo, descricao || null, preco, estoque || 0, categoria || null, imagem_url || null, id]
    );
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    throw error;
  }
};

export const deleteLivro = async (id) => {
  try {
    const result = await db.runAsync('DELETE FROM livros WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    throw error;
  }
};

// ─── Endereços (RF09) ─────────────────────────────────────────────────────────

export const getEnderecosByUsuario = async (usuario_id) => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM enderecos WHERE usuario_id = ? ORDER BY padrao DESC, id DESC',
      [usuario_id]
    );
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    throw error;
  }
};

export const createEndereco = async (usuario_id, logradouro, numero, complemento, bairro, cidade, estado, cep, padrao) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO enderecos
        (usuario_id, logradouro, numero, complemento, bairro, cidade, estado, cep, padrao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, logradouro, numero || null, complemento || null,
        bairro || null, cidade || null, estado || null, cep || null, padrao ? 1 : 0]
    );
    return { id: result.lastInsertRowId };
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    throw error;
  }
};

export const updateEndereco = async (id, logradouro, numero, complemento, bairro, cidade, estado, cep, padrao) => {
  try {
    const result = await db.runAsync(
      `UPDATE enderecos
       SET logradouro = ?, numero = ?, complemento = ?, bairro = ?,
           cidade = ?, estado = ?, cep = ?, padrao = ?
       WHERE id = ?`,
      [logradouro, numero || null, complemento || null, bairro || null,
        cidade || null, estado || null, cep || null, padrao ? 1 : 0, id]
    );
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    throw error;
  }
};

export const deleteEndereco = async (id) => {
  try {
    const result = await db.runAsync('DELETE FROM enderecos WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    throw error;
  }
};

// ─── Pedidos (RF11, US09) ─────────────────────────────────────────────────────

export const getPedidosByUsuario = async (usuario_id) => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY criado_em DESC',
      [usuario_id]
    );
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
};

export const getPedidoById = async (id) => {
  try {
    return await db.getFirstAsync('SELECT * FROM pedidos WHERE id = ?', [id]);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    throw error;
  }
};

export const getPedidoItens = async (pedido_id) => {
  try {
    return await db.getAllAsync(
      `SELECT ip.*, l.titulo, l.imagem_url
       FROM itens_pedido ip
       JOIN livros l ON ip.livro_id = l.id
       WHERE ip.pedido_id = ?`,
      [pedido_id]
    );
  } catch (error) {
    console.error('Erro ao buscar itens do pedido:', error);
    throw error;
  }
};

/**
 * Cria um pedido e seus itens em uma única transação.
 * itens: [{ livro_id, quantidade, preco_unitario }]
 */
export const createPedido = async (usuario_id, endereco_id, forma_pagamento, itens) => {
  try {
    const total = itens.reduce((sum, i) => sum + i.quantidade * i.preco_unitario, 0);

    const pedidoResult = await db.runAsync(
      'INSERT INTO pedidos (usuario_id, endereco_id, forma_pagamento, total) VALUES (?, ?, ?, ?)',
      [usuario_id, endereco_id || null, forma_pagamento, total]
    );
    const pedido_id = pedidoResult.lastInsertRowId;

    for (const item of itens) {
      await db.runAsync(
        'INSERT INTO itens_pedido (pedido_id, livro_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [pedido_id, item.livro_id, item.quantidade, item.preco_unitario]
      );
    }

    return { id: pedido_id, total };
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};

export const gerarDadosJsonDashboard = async () => {
  try {
    const usuarios = await getAllUsuarios();
    const categorias = await getAllCategorias();
    const livros = await getAllLivros();
    const pedidos = await db.getAllAsync('SELECT * FROM pedidos ORDER BY criado_em DESC');
    const itensPedido = await db.getAllAsync('SELECT * FROM itens_pedido ORDER BY id DESC');
    const enderecos = await db.getAllAsync('SELECT * FROM enderecos ORDER BY id DESC');

    const faturamentoTotal = pedidos.reduce((total, pedido) => {
      return total + (Number(pedido.total) || 0);
    }, 0);

    const totalPedidos = pedidos.length;
    const totalUsuarios = usuarios.length;
    const totalLivros = livros.length;
    const totalCategorias = categorias.length;

    const pedidosPorStatus = pedidos.reduce((acc, pedido) => {
      const status = pedido.status || 'Sem status';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const livrosPorCategoria = categorias.map((categoria) => {
      const quantidade = livros.filter(
        (livro) => livro.categoria === categoria.nome
      ).length;

      return {
        categoria: categoria.nome,
        quantidadeLivros: quantidade,
      };
    });

    const ticketMedio =
      totalPedidos > 0 ? Number((faturamentoTotal / totalPedidos).toFixed(2)) : 0;

    const json = {
      metadata: {
        projeto: 'Bookflow',
        geradoEm: new Date().toISOString(),
        formato: 'json',
      },
      resumo: {
        totalUsuarios,
        totalCategorias,
        totalLivros,
        totalPedidos,
        totalEnderecos: enderecos.length,
        totalItensPedido: itensPedido.length,
        faturamentoTotal,
        ticketMedio,
      },
      indicadores: {
        pedidosPorStatus,
        livrosPorCategoria,
      },
      dados: {
        usuarios,
        categorias,
        livros,
        enderecos,
        pedidos,
        itensPedido,
      },
    };

    return json;
  } catch (error) {
    console.error('Erro ao gerar JSON do dashboard:', error);
    throw error;
  }
};

export default db;
