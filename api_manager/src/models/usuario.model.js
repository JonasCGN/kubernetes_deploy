"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = exports.TipoUsuario = void 0;
var TipoUsuario;
(function (TipoUsuario) {
    TipoUsuario["proprietario"] = "proprietario";
    TipoUsuario["funcionario"] = "funcionario";
})(TipoUsuario || (exports.TipoUsuario = TipoUsuario = {}));
class Usuario {
    constructor({ id_auth, uid, nome, cpf, tipoUsuario, email }) {
        this.id_auth = id_auth;
        this.uid = uid;
        this.nome = nome;
        this.cpf = cpf;
        this.tipoUsuario = tipoUsuario;
        this.email = email;
    }
    static fromJson(row) {
        return new Usuario({
            id_auth: row.id_auth,
            uid: row.uid,
            nome: row.nome,
            cpf: row.cpf,
            tipoUsuario: row.usuario === 'proprietario' ? TipoUsuario.proprietario : TipoUsuario.funcionario,
            email: row.email,
        });
    }
    toJson() {
        return {
            id_auth: this.id_auth,
            uid: this.uid,
            nome: this.nome,
            cpf: this.cpf,
            usuario: this.tipoUsuario,
            email: this.email,
        };
    }
}
exports.Usuario = Usuario;
