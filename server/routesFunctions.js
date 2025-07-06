import FileService from "./fileService.js";
import PlantexService from "./plantexService.js";


export async function getESP32Photo(req, res, pool) {
  let downloadLink = '';
  let googleDriverLink = '';
  const request = {
    req,
    res
  }
  const fileService = new FileService(request);
  const plantexService = new PlantexService(pool);

  const uploaded = await fileService.upload();
  if (!uploaded) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erro ao processar a imagem');
    return;
  }

  const { googleDriverLink: gLink, downloadLink: dLink } = uploaded;
  googleDriverLink = gLink;
  downloadLink = dLink;

  const logged = await plantexService.createLog(googleDriverLink, downloadLink);
  if (!logged) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erro ao criar log no banco de dados');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Imagem recebida e processada com sucesso!');
}

export async function findPhotos(req, res, pool) {

  const page = Number(req.query?.page) || 0;
  const limit = Number(req.query?.limit) || 10;
  const startDate = req.query?.startDate || null;
  const endDate = req.query?.endDate || null;

  const plantexService = new PlantexService(pool);
  const { photos, total } = await plantexService.findPhotos(page, limit, startDate, endDate);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const response = {
    photos,
    total,
    page
  };
  res.end(JSON.stringify(response));
}