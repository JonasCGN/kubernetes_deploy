"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarPayloadPix = gerarPayloadPix;
exports.gerarPixController = gerarPixController;
const qrcode_1 = __importDefault(require("qrcode"));
const crc_1 = __importDefault(require("crc"));
function formatSize(content) {
    return content.length.toString().padStart(2, '0');
}
/// | Código | Tipo da chave         |
/// | ------ | --------------------- |
/// | "01"   | CPF ou CNPJ           |
/// | "02"   | Número de telefone    |
/// | "03"   | E-mail                |
/// | "04"   | Chave aleatória (EVP) |
function gerarPayloadPix({ tipoChave, chave, valor, }) {
    const payloadFormatIndicator = '000201';
    const gui = 'BR.GOV.BCB.PIX';
    // Ajusta chave para telefone adicionando '+' se necessário
    let chaveFormatada = chave;
    if (tipoChave === '02' && !chave.startsWith('+')) {
        chaveFormatada = '+' + chave;
    }
    // Merchant Account Info (ID 26)
    const merchantAccountInfoValue = '00' +
        formatSize(gui) +
        gui +
        '01' +
        formatSize(chaveFormatada) +
        chaveFormatada;
    const merchantAccountInfo = '26' + formatSize(merchantAccountInfoValue) + merchantAccountInfoValue;
    const merchantCategoryCode = '52040000'; // MCC padrão
    const transactionCurrency = '5303986'; // Real
    const transactionAmount = valor
        ? `54${formatSize(valor.toFixed(2))}${valor.toFixed(2)}`
        : '';
    const countryCode = '5802BR';
    // Campos opcionais que o gerador usa e apps esperam
    // Nome (campo 59) - pode ser 1 caractere só 'N'
    const merchantName = '59' + formatSize('N') + 'N';
    // Cidade (campo 60) - pode ser 1 caractere só 'C'
    const merchantCity = '60' + formatSize('C') + 'C';
    // Dados adicionais (campo 62) com subcampo 05 fixo ***
    const additionalDataFieldValue = '0503***';
    const additionalDataField = '62' + formatSize(additionalDataFieldValue) + additionalDataFieldValue;
    // Monta o payload completo sem CRC
    const payloadSemCRC = payloadFormatIndicator +
        merchantAccountInfo +
        merchantCategoryCode +
        transactionCurrency +
        transactionAmount +
        countryCode +
        merchantName +
        merchantCity +
        additionalDataField +
        '6304'; // placeholder CRC
    // Calcula CRC16 CCITT
    const crc16 = crc_1.default
        .crc16ccitt(Buffer.from(payloadSemCRC, 'utf8'))
        .toString(16)
        .toUpperCase()
        .padStart(4, '0');
    return payloadSemCRC + crc16;
}
function gerarPixController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tipoChave, chave, valor } = req.body;
        if (!tipoChave || !chave) {
            return res
                .status(400)
                .json({ erro: 'Campos obrigatórios: tipoChave, chave' });
        }
        const payload = gerarPayloadPix({ tipoChave, chave, valor });
        try {
            const qrCodeBase64 = yield qrcode_1.default.toDataURL(payload);
            res.json({
                payload,
                qrCodeBase64,
            });
        }
        catch (err) {
            res.status(500).json({ erro: 'Erro ao gerar QR Code' });
        }
    });
}
