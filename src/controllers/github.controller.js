import axios from "axios";

const GITHUB_USERNAME = "sonu2027";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_BASE_URL = "https://api.github.com";

// Middleware for GitHub API headers
const githubHeaders = {
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
};

const userDetails = async (req, res) => {
  console.log("GitHub Headers:", githubHeaders);
  try {
    // Fetch user details
    const userResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/users/${GITHUB_USERNAME}`,
      githubHeaders
    );
    const { followers, following, public_repos } = userResponse.data;

    // Fetch user repositories
    const reposResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/users/${GITHUB_USERNAME}/repos`,
      githubHeaders
    );

    // Log user data for debugging
    console.log("User data:", { followers, following, public_repos });

    // Send response
    res.json({
      followers,
      following,
      public_repos,
      repositories: reposResponse.data.map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
      })),
    });
  } catch (error) {
    // Log the full error for debugging
    console.error("Error fetching GitHub data:", error.message);
    if (error.response) {
      console.error("GitHub API response:", error.response.data);
    }
    res.status(500).json({
      error: "Failed to fetch GitHub data",
      details: error.message,
    });
  }
};

export default userDetails;

const projectData = async (req, res) => {
  const { repoName } = req.params;

  try {
    const { data } = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${GITHUB_USERNAME}/${repoName}`,
      githubHeaders
    );
    res.json({
      name: data.name,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
    });
  } catch (error) {
    res.status(404).json({ error: "Repository not found" });
  }
};

const createIssue = async (req, res) => {
  const { repoName } = req.params;
  const { title, body } = req.body;

  console.log("repoName, title, body: ", repoName, title, body);

  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  try {
    const { data } = await axios.post(
      `${GITHUB_API_BASE_URL}/repos/${GITHUB_USERNAME}/${repoName}/issues`,
      { title, body },
      githubHeaders
    );

    console.log("data.html_url: ", data.html_url);

    res.json({ issue_url: data.html_url });
  } catch (error) {
    console.error("GitHub API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create issue" });
  }
};

export { userDetails, projectData, createIssue };
