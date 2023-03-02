const registerPipelineProjects = [
    {
        id: 1133,
        name: 'laxmi'
    },
    {
        id: 1080,
        name: 'kamana-sewa'
    },
    {
        id: 1393,
        name: 'kumari'
    },
    {
        id: 1441,
        name: 'prime'
    },
    {
        id: 1266,
        name: 'nicasia'
    }
]

/* Map user passed project names from `terminal` to respective project ids  */
const extractProjectIdsFromArgument = (projectNames) => {
    console.log(projectNames)
    let targetProjectIds = projectNames.map((targetName) => {
        let t1 = targetName.toString().toLowerCase().replaceAll(' ', '')
        let targetProject = registerPipelineProjects.find((item) =>
            t1.includes(item.name.toLowerCase().replaceAll(' ', '')))

        return {id: targetProject?.id ?? -1, name: targetName}
    }).filter((item) => { return item.id > -1 })
    return targetProjectIds
}

module.exports = { extractProjectIdsFromArgument, registerPipelineProjects }