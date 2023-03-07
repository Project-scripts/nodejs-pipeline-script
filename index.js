const { GraphQLClient } = require('graphql-request');
const { argumentParser, FETCH_MENTIONED_PROJECTS, FETCH_ALL_PROJECTS } = require('./argument')
const { extractProjectIdsFromArgument } = require('./pipeline')
const { buildGroupPipelineQuery, buildSinglePipelineQuery } = require('./graphql')
const { logProjectPipelines } = require('./logger.js')

const API_ENDPOINT = 'https://gitlab-01.f1soft.com/api/graphql/'
const ACCESS_TOKEN = 'r4py3wXksc4HWP2zsa8B'
const GROUP_PATH = 'mobileapp/bankxp/ios/apps'

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
        console.log('FETCH_MENTIONED_PROJECTS -> '+ JSON.stringify(mergedResults))
          logProjectPipelines(mergedResults, targetProjectInformations)
      })
      break

    case FETCH_ALL_PROJECTS:
      fetchGroupProjectsPipeline(GROUP_PATH)
      .then((data) => {
        console.log('FETCH_ALL_PROJECTS -> '+ JSON.stringify(data))
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
 * 1. Filter pipeline by ref: develop ( create arrays)
 * 2. Filter via priority order: SUCCESS -> RUNNING -> CANCELLED -> UNDEFINED ( find first item as `CURRENT_PIPELINE` )
 * 3. Format `CURRENT_PIPELINE`'s JOBS ( uat, qa, testflight)
 * Colors: red: failed,
 *         green: success,
 *         orange: running
 * Example: 
 *    Bank name : Kumari
 *    BRANCH    : XP-MY-FEATURE
 *    JOBS      : UAT -> Running
 *                QA -> Nothing
 *                TF -> Running 
 *                QA -> Success
 */