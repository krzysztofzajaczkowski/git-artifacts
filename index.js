var Link = ReactRouterDOM.Link;
var Route = ReactRouterDOM.Route;
var Redirect = ReactRouterDOM.Redirect;
var Navigate = ReactRouterDOM.Navigate;
var useParams = ReactRouterDOM.useParams;
var App = function App() {
  return React.createElement(
    ReactRouterDOM.HashRouter,
    null,
    React.createElement(Route, { path: "/artifacts/:owner/:repository/:branch*/:artifact", component: DownloadLatestArtifact }),
    React.createElement(Route, { path: "*", component: Default })
  );
};

var Default = function Default() {
  window.location.replace("https://github.com");
  return null;
};

var DownloadLatestArtifact = function DownloadLatestArtifact(props) {
  var owner = props.match.params.owner;
  var repository = props.match.params.repository;
  var branch = props.match.params.branch;
  var artifactName = props.match.params.artifact;

  axios.get("https://api.github.com/repos/" + owner + "/" + repository + "/actions/artifacts").then(function (response) {
    var artifact = response.data.artifacts.find(function (a) {
      return a.name === artifactName && a.workflow_run.head_branch === branch;
    });
    var artifactId = artifact.id;
    var workflowRunId = artifact.workflow_run.id;

    axios.get("https://api.github.com/repos/" + owner + "/" + repository + "/actions/runs/" + workflowRunId).then(function (workflowResponse) {
      var suiteId = workflowResponse.data.check_suite_id;
      window.location.replace("https://www.github.com/" + owner + "/" + repository + "/suites/" + suiteId + "/artifacts/" + artifactId);
    });
  });
  return null;
};

ReactDOM.render(React.createElement(App, null), document.querySelector('#root'));