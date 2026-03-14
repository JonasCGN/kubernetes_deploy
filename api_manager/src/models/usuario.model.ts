export enum TipoUsuario {
    proprietario = 'proprietario',
    funcionario = 'funcionario',
}


export class Usuario {
    id_auth?: number;
    uid: string;
    nome: string;
    cpf: string;
    tipoUsuario: TipoUsuario;
    email: string;

    constructor({ id_auth, uid, nome, cpf, tipoUsuario, email }: {
        id_auth?: number;
        uid: string;
        nome: string;
        cpf: string;
        tipoUsuario: TipoUsuario;
        email: string;
    }) {
        this.id_auth = id_auth;
        this.uid = uid;
        this.nome = nome;
        this.cpf = cpf;
        this.tipoUsuario = tipoUsuario;
        this.email = email;
    }

    static fromJson(row: any): Usuario {
        return new Usuario({
            id_auth: row.id_auth,
            uid: row.uid,
            nome: row.nome,
            cpf: row.cpf,
            tipoUsuario: row.usuario === 'proprietario' ? TipoUsuario.proprietario : TipoUsuario.funcionario,
            email: row.email,
        });
    }

    toJson(): any {
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
