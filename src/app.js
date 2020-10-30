const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const ensureValidUuid = (request, response, next) => {
  const { id } = request.params

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid id.'})
  }

  return next()
}

const ensureRepositoryExists = (request, response, next) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
  }

  return next()
}

app.use("/repositories/:id", ensureValidUuid)
app.use("/repositories/:id", ensureRepositoryExists)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs, likes } = request.body;

  const repository = {
    id: v4(),
    title,
    url,
    techs,
    likes: likes ? likes : 0
  }

  repositories.push(repository)

  return response.status(201).json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  let foundRepository = repositories[repositoryIndex]

  foundRepository = {
    ...foundRepository,
    title,
    url,
    techs
  }

  repositories[repositoryIndex] = foundRepository

  return response.json(foundRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  const repository = repositories[repositoryIndex]
  repository.likes++

  return response.json(repository)
});

module.exports = app;
