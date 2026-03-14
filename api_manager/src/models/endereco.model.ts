import { EnderecoJson } from "../types/endereco";

export class Endereco {
  rua: string;
  numero: string;
  bairro: string;
  complemento?: string;
  informacaoAdicional?: string;

  constructor(
    rua: string,
    numero: string,
    bairro: string,
    complemento?: string,
    informacaoAdicional?: string
  ) {
    this.rua = rua;
    this.numero = numero;
    this.bairro = bairro;
    this.complemento = complemento;
    this.informacaoAdicional = informacaoAdicional;
  }

  static fromJson(json: EnderecoJson): Endereco {
    return new Endereco(
      json.rua ?? '',
      json.numero ?? '',
      json.bairro ?? '',
      json.complemento,
      json.ponto_referencia
    );
  }

  toJson(): EnderecoJson {
    const json: EnderecoJson = {
      rua: this.rua,
      numero: this.numero,
      bairro: this.bairro,
    };
    if (this.complemento) json.complemento = this.complemento;
    if (this.informacaoAdicional) json.ponto_referencia = this.informacaoAdicional;
    return json;
  }

  get enderecoCompleto(): string {
    let texto = `${this.rua}, ${this.numero} - ${this.bairro}`;
    if (this.complemento && this.complemento.trim()) {
      texto += ` (${this.complemento})`;
    }
    return texto;
  }

  get enderecoResumo(): string {
    return `${this.rua}, ${this.numero} - ${this.bairro}`;
  }

  toString(): string {
    return this.enderecoCompleto;
  }

  isEqual(outro: Endereco): boolean {
    return (
      this.rua === outro.rua &&
      this.numero === outro.numero &&
      this.bairro === outro.bairro &&
      this.complemento === outro.complemento &&
      this.informacaoAdicional === outro.informacaoAdicional
    );
  }
}
