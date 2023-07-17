const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('./user.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Usuário criado' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Usuário atualizado' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'Usuário deletado' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        sobrenome: Joi.string().required(),
        permissao: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        senha: Joi.string().min(6).required(),
        confirmarSenha: Joi.string().valid(Joi.ref('senha')).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(''),
        sobrenome: Joi.string().empty(''),
        permissao: Joi.string().valid(Role.Admin, Role.User).empty(''),
        email: Joi.string().email().empty(''),
        senha: Joi.string().min(6).empty(''),
        confirmarSenha: Joi.string().valid(Joi.ref('senha')).empty('')
    }).with('senha', 'confirmarSenha');
    validateRequest(req, next, schema);
}
