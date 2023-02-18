import fs from "fs"; // biblioteca para ler arquivos e diretórios
import chalk from "chalk"; // estilizar o console

// function extrairLinks(texto) {
//   const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
//   const capturas = [...texto.matchAll(regex)]; // o matchAll retorna uma array das capturas, mas se não utilizar o spread, apenas o primeiro item vai aparecer

//   const resultados = capturas.map((c) => ({
//     [c[1]]: c[2], // Desse modo retorna em cada objeto o nome da chave como o nome da chave do segundo item de cada objeto da array de capturas e o valor é o terceiro item de cada objeto do array de capturas
//   }));

//   return resultados;
// }

function extrairLinks(texto) {
  const regex = /\[(.*?)\]\((https?:\/\/[^\s?#.]+\.[^\s]*)\)/gm;
  const resultados = [];
  let match;

  while ((match = regex.exec(texto))) {
    const [_, label, url] = match;
    resultados.push({ [label]: url });
  }

  return resultados.length ? resultados : "Não existem links no arquivo";
}

function tratarErro(erro) {
  throw new Error(chalk.red(erro.code, "Arquivo não encontrado"));
}

// function pegarArquivo(caminhoDoArquivo) {
//   const encoding = "utf-8";
//   fs.promises
//     .readFile(caminhoDoArquivo, encoding)
//     .then((texto) => console.log(chalk.green(texto)))
//     .catch((erro) => tratarErro(erro));
// }

async function pegarArquivo(caminhoDoArquivo) {
  try {
    const encoding = "utf-8";
    const texto = await fs.promises.readFile(caminhoDoArquivo, encoding);
    return extrairLinks(texto);
  } catch (erro) {
    tratarErro(erro);
  }
}

// \[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)
// Usar class [] para selecionar uma sequência de caracteres definida
// ^ para negar um caractere
// \ para escapar, possibilitando usar caracteres reservados
// *? para definir que pode repetir
// () para separar grupos
// ? para dizer que o caractere é opcional

// pegarArquivo("arquivos/texto.md");
// pegarArquivo("arquivos/texto.m"); //testar o erro
export default pegarArquivo;
