const buildGroupPipelineQuery = (path) => {
  const query = `
  query {
    group(fullPath: "${path}") {
      projects {
        nodes {
          pipelines(first: 1) {
            name
          }
        }
      }
    }
  }
`;
return query
} 

const buildSinglePipelineQuery = (path, data) => {
  const query = `
  query {
    project(fullPath: "${path}/${data.name}") {
      name
      webUrl
      pipelines(first: 10) {
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

module.exports = { buildGroupPipelineQuery, buildSinglePipelineQuery }