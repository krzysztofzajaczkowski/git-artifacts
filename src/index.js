const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Redirect = ReactRouterDOM.Redirect;
const Navigate = ReactRouterDOM.Navigate;
const useParams = ReactRouterDOM.useParams;
const App = () => (
  <ReactRouterDOM.HashRouter>
    <Route path="/artifacts/:owner/:repository/:branch*/:artifact" component={DownloadLatestArtifact} />
    <Route path="*" component={Default}/>
  </ReactRouterDOM.HashRouter>
)

const Default = () => {
  window.location.replace("https://github.com");
  return null;
}

const DownloadLatestArtifact = (props) => {
  const owner = props.match.params.owner;
  const repository = props.match.params.repository;
  const branch = props.match.params.branch;
  const artifactName = props.match.params.artifact;
  
  axios.get("https://api.github.com/repos/" + owner + "/" + repository + "/actions/artifacts")
    .then(response => {
      const artifact = response.data.artifacts.find(a => a.name === artifactName && a.workflow_run.head_branch === branch);
      const artifactId = artifact.id;
      const workflowRunId = artifact.workflow_run.id;

      axios.get("https://api.github.com/repos/" + owner + "/" + repository + "/actions/runs/" + workflowRunId)
        .then(workflowResponse => {
          const suiteId = workflowResponse.data.check_suite_id;
          window.location.replace("https://www.github.com/" + owner + "/" + repository + "/suites/" + suiteId + "/artifacts/" + artifactId);
        })

    })
  return null;
}

ReactDOM.render(<App />, document.querySelector('#root'));