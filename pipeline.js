
/* `repo-name`: repository name
    `repo-id` : repository id
  */
const registerPipelineProjects = [
    {
        id: REPOSITORY-A-ID, // eg 12345
        name: 'REPOSITORY-A'
    },
    {
        id: REPOSITORY-B-ID, //12345
        name: 'REPOSITORY-B'
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