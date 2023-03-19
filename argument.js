const FETCH_MENTIONED_PROJECTS = 0
const FETCH_ALL_PROJECTS = 1

/*
-a : retrieve entire projects pipeline
-p : retrieve specific projects that are passed as arguments
*/

const argumentParser = (argument) => {
    const argumentAnnonation = argument.slice(2) //get second argument from terminal

    if (argumentAnnonation.includes("-p")) {
        const argumentData = argument.slice(3) + "" // get third argument from terminal
        const argumentDataList = argumentData.split(",")
        if (argumentData && argumentDataList.length > 0) {
            return { type: FETCH_MENTIONED_PROJECTS, data: argumentDataList }
        }
        throw 'Did u forget to pass project names like -p "A-PROJECT, B-PROJECT, C-PROJECT ....." '
    } else if (argumentAnnonation.includes("-a")) {
        return { type: FETCH_ALL_PROJECTS, data: undefined }
    }

    throw 'Did u forget to pass arguments for example: \n for specific projects use `-p "A-PROJECT, B-PROJECT, C-PROJECT ....."` \n for all projects `-a`" '
}

module.exports = { FETCH_ALL_PROJECTS, FETCH_MENTIONED_PROJECTS, argumentParser }