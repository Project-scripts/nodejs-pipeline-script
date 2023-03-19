const { GraphQLClient } = require('graphql-request');
const { argumentParser, FETCH_MENTIONED_PROJECTS, FETCH_ALL_PROJECTS } = require('./argument')
const { extractProjectIdsFromArgument } = require('./pipeline')
const { buildGroupPipelineQuery, buildSinglePipelineQuery } = require('./graphql')
const { logProjectPipelines } = require('./logger.js')

// Replace `API_ENDPOINT` with your company's end point
const API_ENDPOINT = 'https://gitlab-YOUR-COMPANY-DOMAIN.com/api/graphql/'

// Replace `ACCESS_TOKEN` with your git profile access token
const ACCESS_TOKEN = 'r4py3wXksc4HWP2zsa8B'

/* Replace `GROUP_PATH` with your own git repository group
   A Group is a collection of repositories, `mobile/apps/ios` contains list of repositories
*/
const GROUP_PATH = 'YOUR-GROUPS-PATHS' // example: https://gitlab-YOUR-COMPANY-DOMAIN.com/mobile/apps/ios

const client = new GraphQLClient(API_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
})

const argumentData = argumentParser(process.argv)
executeProjectPipelines(argumentData)

function executeProjectPipelines(argumentData) {
  switch (argumentData.type) {
    case FETCH_MENTIONED_PROJECTS:
      const targetProjectInformations = extractProjectIdsFromArgument(argumentData.data) 
      const finalPipelineQuery = extractProjectIdsFromArgument(targetProjectInformations)
      console.log(finalPipelineQuery)

      /** Wait for all pending promises, similar to `rx.zip(...)` */
      Promise.all(targetProjectInformations.map((data) => fetchSingleProjectPipeline(data)))
      .then((mergedResults) => {
          logProjectPipelines(mergedResults, targetProjectInformations)
      }).catch((error) => {
        console.error('Error '+ error)
      })
      break

    case FETCH_ALL_PROJECTS:
      fetchGroupProjectsPipeline(GROUP_PATH)
      .then((data) => {
        console.log('FETCH_ALL_PROJECTS -> '+ JSON.stringify(data))
      }).catch((error) => {
        console.error('Error '+ error)
      })
  }
}

/** @returns: Promise<API_RESPONSE>
 * group projects api request */
async function fetchGroupProjectsPipeline(projectId) {
  return client.request(buildGroupPipelineQuery(GROUP_PATH, projectId))
}

/** @returns: Promise<API_RESPONSE>
 * single api request */
async function fetchSingleProjectPipeline(data) {
  return client.request(buildSinglePipelineQuery(GROUP_PATH, data))
}


/**
 * Psuedo code
 * 1. Filter pipeline by `ref`: develop
 * 2. Filter via priority order: SUCCESS -> RUNNING -> CANCELLED -> UNDEFINED
 * 3. Format `CURRENT_PIPELINE`'s JOBS ( uat, qa, testflight)
 * Colors: red: failed,
 *         green: success,
 *         orange: running
 * Example: 
 *    Project name : Your project name
 *    BRANCH    : XP-MY-FEATURE
 *    JOBS      : UAT -> Running
 *                QA -> Nothing
 *                TF -> Running 
 *                QA -> Success
 */
