import { ConfigApp } from '../config/config_app';
import { ApiConfig } from '../config/api_config';

export class Criptografia {
  static get _apiBaseUrl(): string { return ApiConfig.cryptographyApiUrl; }
  static get _timeoutSeconds(): number { return ApiConfig.requestTimeout; }
  static get isEncryptionEnabled(): boolean { return ApiConfig.enableEncryption; }

  static async encryptObjectToJsonBlob(json: Record<string, any>): Promise<string> {
    const plainText = JSON.stringify(json);
    if (!ApiConfig.enableEncryption) {
      return plainText;
    }
    return await this.encryptStringToJsonBlob(plainText);
  }

  static async encryptStringToJsonBlob(plainText: string): Promise<string> {
    if (!ApiConfig.enableEncryption) {
      return plainText;
    }
    try {
      const requestBody = JSON.stringify({ text: plainText });
      const tokenApi = ConfigApp.tokenApi;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this._timeoutSeconds * 1000);
      const response = await fetch(`${this._apiBaseUrl}/encrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenApi}`,
          'Accept': 'application/json',
        },
        body: requestBody,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`API retornou erro ${response.status}: ${await response.text()}`);
      }
      const responseData = await response.json();
      if (responseData['success'] !== true) {
        throw new Error(`Falha na criptografia: ${responseData['error'] ?? 'Erro desconhecido'}`);
      }
      const requiredFields = ['data', 'key', 'iv'];
      for (const field of requiredFields) {
        if (!(field in responseData) || responseData[field] == null) {
          throw new Error(`Resposta da API inválida: campo "${field}" ausente`);
        }
      }
      const encryptedPayload = {
        data: responseData['data'],
        key: responseData['key'],
        iv: responseData['iv'],
      };
      const result = JSON.stringify(encryptedPayload);
      return result;
    } catch (e: any) {
      const msg = e.toString();
      if (msg.includes('AbortError')) {
        throw new Error('Timeout na API de criptografia. Verifique a conexão.');
      } else if (msg.includes('network') || msg.includes('NetworkError')) {
        throw new Error('Erro de rede. Verifique se a API está rodando em ' + this._apiBaseUrl);
      } else if (msg.includes('SyntaxError')) {
        throw new Error('Resposta inválida da API de criptografia');
      } else {
        throw new Error('Erro na criptografia: ' + msg);
      }
    }
  }

  static async isApiAvailable(): Promise<boolean> {
    if (!ApiConfig.enableEncryption) {
      return true;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), (ApiConfig.statusCheckTimeout ?? 10) * 1000);
      const response = await fetch(`${this._apiBaseUrl}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  static async decryptJsonBlobToString(blob: string): Promise<any> {
    if (!ApiConfig.enableEncryption) {
      // Se não está criptografado, pode ser string ou JSON
      try {
        return JSON.parse(blob);
      } catch {
        return blob;
      }
    }
    try {
      // blob pode ser string JSON ou objeto
      const { data, key, iv } = typeof blob === 'string' ? JSON.parse(blob) : blob;
      const requestBody = JSON.stringify({ data, key, iv });
      const tokenApi = ConfigApp.tokenApi;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this._timeoutSeconds * 1000);
      const response = await fetch(`${this._apiBaseUrl}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenApi}`,
          'Accept': 'application/json',
        },
        body: requestBody,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`API retornou erro ${response.status}: ${await response.text()}`);
      }
      const responseData = await response.json();
      if (responseData['success'] !== true) {
        throw new Error(`Falha na descriptografia: ${responseData['error'] ?? 'Erro desconhecido'}`);
      }
      if (!('data' in responseData)) {
        throw new Error('Resposta da API inválida: campo "data" ausente');
      }
      // Pode ser string ou JSON
      try {
        return JSON.parse(responseData['data']);
      } catch {
        return responseData['data'];
      }
    } catch (e: any) {
      const msg = e.toString();
      if (msg.includes('AbortError')) {
        throw new Error('Timeout na API de criptografia. Verifique a conexão.');
      } else if (msg.includes('network') || msg.includes('NetworkError')) {
        throw new Error('Erro de rede. Verifique se a API está rodando em ' + this._apiBaseUrl);
      } else if (msg.includes('SyntaxError')) {
        throw new Error('Resposta inválida da API de criptografia');
      } else {
        throw new Error('Erro na descriptografia: ' + msg);
      }
    }
  }

  static async getApiInfo(): Promise<Record<string, any> | null> {
    if (!ApiConfig.enableEncryption) {
      return {
        message: 'Modo desenvolvimento - Criptografia desabilitada',
        version: 'local',
        encryption_enabled: false,
      };
    }
    try {
      const response = await fetch(`${this._apiBaseUrl}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        data['encryption_enabled'] = true;
        return data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

}
