'use strict'

const GetAllTeamsService = require('./../../services/team/GetAll')
const { ok } = require('./../apiResponses')

exports.getAll = getAll

function getAll(req, res, next) {
  new GetAllTeamsService({
    request: req,
  }).execute({
  })
    .then(teams => renameId(teams))
    .then(response => ok(req, res, next, response))
    .catch(next)
}

function renameId(teams) {
  return teams.map(team => {
    team.teamId = team.id
    delete team.id
    return team
  })
}
