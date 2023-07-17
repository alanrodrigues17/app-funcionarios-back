const bcrypt = require('bcryptjs');

const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" já foi registrado';
    }

    const user = new db.User(params);
    
    user.passwordHash = await bcrypt.hash(params.senha, 10);

    await user.save();
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" já foi registrado';
    }

    if (params.senha) {
        params.passwordHash = await bcrypt.hash(params.senha, 10);
    }

    Object.assign(user, params);
    await user.save();
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}


async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'Usuário não encontrado';
    return user;
}
