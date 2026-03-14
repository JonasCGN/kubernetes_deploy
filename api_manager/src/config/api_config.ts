
export class ApiConfig {
  /**
   * ATIVAR/DESATIVAR CRIPTOGRAFIA
   * true = usa criptografia via API
   * false = retorna dados sem criptografia (apenas para desenvolvimento)
   */
  static enableEncryption: boolean = true;

  /**
   * URL base da API de criptografia
   * Mude para o endereço do seu servidor em produção
   */
  static cryptographyApiUrl: string = 'https://apicriptografia.kuatech.com.br/';

  /**
   * Timeout para requisições da API (em segundos)
   */
  static requestTimeout: number = 30;

  /**
   * Timeout para verificação de status da API (em segundos)
   */
  static statusCheckTimeout: number = 5;
}
