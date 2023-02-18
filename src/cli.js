#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs";
import pegarArquivo from "./index.js";
import listaValidada from "./http-validacao.js";

const caminho = process.argv; // retorna as informações dos comandos executados no terminal

async function imprimirLista(validar, resultado, nomeDoArquivo) {
  if (validar) {
    console.log(
      chalk.yellow("lista validada "),
      chalk.black.bgGreen(nomeDoArquivo),
      await listaValidada(resultado)
    );
  } else {
    console.log(
      chalk.yellow("lista de links em "),
      chalk.black.bgGreen(nomeDoArquivo),
      resultado
    );
  }
}

async function gerarResultado(caminho, validar) {
  const resultado = await pegarArquivo(caminho); // precisa ser na posição [2] pra vir apenas o argumento digitado (os outros 2 são os caminhos do node e do cli.js)
  imprimirLista(validar, resultado, caminho);
}

async function processarTexto(argumentos) {
  const caminho = argumentos[2];
  const valida = !!argumentos[3];

  try {
    fs.lstatSync(caminho); // verifica se o caminho existe
  } catch (erro) {
    if (erro.code === "ENOENT") {
      console.log("Arquivo ou diretório ausente.");
      return; // para não dar o throw padrão de erro
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    // verifica se é um caminho
    await gerarResultado(caminho, valida);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    const arquivos = await fs.promises.readdir(caminho);
    arquivos.forEach(async (a) => {
      const caminhoDoArquivo = `${caminho}/${a}`;
      await gerarResultado(caminhoDoArquivo, valida);
    });
  }
}

processarTexto(caminho);
