const { formatDistance } = require('date-fns');
var logger = require("cli-color")

const PIPELINE_SUCCESS = "SUCCESS"
const PIPELINE_MANUAL = "MANUAL"
const PIPELINE_FAILED = "FAILED"
const PIPELINE_CANCELED = "CANCELED"
const PIPELINE_RUNNING = "RUNNING"

const FILTER_JOBS = ['uat', 'qa', 'testflight']

const loggerSetting = {
    bold: true,
    dim: false,
    underscore: true,
    italic: false,
    strikethrough: false
}

const logProjectPipelines = (apiResults, targetProjects) => {
    targetProjects.filter((eachTarget) => {
        const eachTargetProject = apiResults. find((eachResult) => { 
            if(eachResult == undefined) return false
            return eachResult.project?.name.toLowerCase() === eachTarget.name.toLowerCase() })
        if (!eachTargetProject) { return false }
        console.log('eachTargetProject ' + JSON.stringify(eachTargetProject))

        /** traverse `nodes` */
        const pipelineNodes = eachTargetProject.project.pipelines.nodes
        const successOrFailurePipeline = [pipelineNodes.find((eachNode) => { 
            return eachNode.ref === "develop"
         })]
        successOrFailurePipeline.forEach((each) => { prettyLogPipelineStatus(eachTargetProject.project, each) } )
        return true
    })
}

const prettyLogPipelineStatus = (project, data) => {
    if(data === undefined) {
        console.log(`Sorry data is undefined, possible fixes -> Increase pipelines(first: N), to higher number than N in graphql.js file `)
        return
    }

    console.log(`Bank Name         : ${project.name}`)
    console.log(`Branch Name       : ${data.ref ?? "N/A"}`)
    console.log(`Create date       : ${getFormattedDate(data.createdAt)}`)
    console.log(`Developer         : ${data.user.name}`)
    console.log(`Project link      : ${project.webUrl}/pipelines`)

    let lowerStatus = data.status.toLowerCase()
    let pipelineStatus = data.status === PIPELINE_CANCELED ? lowerStatus + ` but may be success for QA/UAT` : lowerStatus
   
    const stageJobs = data.jobs.nodes.filter((eachJob)=> { return FILTER_JOBS.includes(eachJob.name) })
    stageJobs.forEach((item) => {
        logByPipelineStatus(item.status, ` \t\t${item?.name} -> ${item.status}`)
    })
}

function logByPipelineStatus(status, data) {
    switch (status) {
        case PIPELINE_SUCCESS:
            console.log(logger.green(data))
            break
        case PIPELINE_FAILED: 
            console.log(logger.red(data +' but might have succeded') )
             break
        case PIPELINE_CANCELED:
            console.log(logger.red(data))
            break
        case PIPELINE_MANUAL:
            console.log(logger.blue(data))
            break
        case PIPELINE_RUNNING:
            console.log(logger.yellowBright(data))
            break
        default:
            console.log(logger.white(data))
    }
}

const getFormattedDate = (createdAt) => {
    const formattedDate = formatDistance(new Date(createdAt), new Date(), { addSuffix: true })
    return formattedDate
}

module.exports = { logProjectPipelines }