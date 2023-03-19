
/*  Prefetch 12 number of pipeline at once
    @Note: Increase this value if necessary
 */
const offSet = 12

const buildSinglePipelineQuery = (path, data) => {
  const query = `
  query {
    project(fullPath: "${path}/${data.name}") {
      name
      webUrl
      pipelines(first: ${offSet}) {
        nodes {
          status
          ref
          user {
            name
          }
          createdAt
          jobs {
            nodes {
              name
              status
            }
          }
        }
      }
    }
  }
`;
return query
}

module.exports = { buildSinglePipelineQuery }