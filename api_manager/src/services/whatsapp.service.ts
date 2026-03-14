import axios from 'axios';
import { ConfigApp } from '../config/config_app';

export class ApiEvolution {
  static urlEvolution = "https://evolution.kuatech.com.br";
  static nomeInstancia = ConfigApp.nameInstance || '';
  static apiKey = ConfigApp.apiKey || '';

  static async sendMessage(numero: any, message: any): Promise<number> {
    const url = `${this.urlEvolution}/message/sendText/${encodeURIComponent(this.nomeInstancia)}`;
    try {
      const response = await axios.post(url, {
        number: `55${numero}`,
        text: message,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
        }
      });

      return response.status;
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
      return 0;
    }
  }
}
