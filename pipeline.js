
/* `name`: gitlab repository name
    `id` : project id
  */
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
        id: 1368,
        name: 'nabil'
    },
    {
        id: 1266,
        name: 'nicasia'
    },
    {
        id: 1032,
        name: 'citizens'
    }
]

/* Map user passed project names from `terminal` to respective project ids  */
const extractProjectIdsFromArgument = (projectNames) => {
    console.log(projectNames)
    let targetProjectIds = projectNames.map((targetName) => {
        let t1 = targetName.toString().toLowerCase().replace(/[^a-zA-Z ]/g, "")
        let targetProject = registerPipelineProjects.find((item) => {
            let t2 = item.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")
            return t1.includes(t2) || t2.includes(t1)
        })
        if(!targetProject) { return }

        return { id: targetProject?.id ?? -1, name: targetProject.name }
    }).filter((item) => { return item?.id > -1 })
    return targetProjectIds
}

module.exports = { extractProjectIdsFromArgument, registerPipelineProjects }