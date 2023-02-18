import chalk from "chalk";

function separarLinks(arrayLinks) {
  return arrayLinks.map((arr) => Object.values(arr).join());
}

async function checarStatus(listaUrls) {
  const arrayStatus = await Promise.all(
    listaUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        return `${response.status} - ${response.statusText}`;
      } catch (erro) {
        return tratarErro(erro);
      }
    })
  );
  return arrayStatus;
}

function tratarErro(erro) {
  if (erro.cause.code === "ENOTFOUND") {
    return "Link não encontrado";
  } else {
    return "Ocorreu um erro";
  }
}

export default async function listaValidada(listaDeLinks) {
  const linksSeparados = separarLinks(listaDeLinks);
  const status = await checarStatus(linksSeparados);

  return listaDeLinks.map((link, i) => ({
    ...link,
    status: status[i],
  }));
}
