# AI Code Reviewer

An AI-powered code review tool that provides instant feedback on code quality, best practices, and optimization suggestions using Google's Gemini AI.

## Features

- **Readability Analysis**: Reviews naming conventions, formatting, and code clarity
- **Best Practices**: Identifies unsafe access patterns, hard-coded values, and missing encapsulation
- **Optimization Suggestions**: Recommends performance improvements and code simplification
- **Modern Web Interface**: Clean, responsive UI for submitting code and viewing reviews
- **Dockerized**: Fully containerized for easy deployment

## Tech Stack

- **Backend**: Node.js + Express
- **AI**: Google Gemini AI API
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Quick Start with Docker

### Pull from GitHub Container Registry

```bash
docker pull ghcr.io/shershahx/ai-code-reviewer:latest
```

### Run the Container

```bash
docker run -d -p 3001:3001 -e GEMINI_API_KEY=your_api_key_here ghcr.io/shershahx/ai-code-reviewer:latest
```

Then open http://localhost:3001 in your browser.

## Local Development

### Prerequisites

- Node.js 18 or higher
- A Google Gemini API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/shershahx/ai-code-reviewer.git
cd ai-code-reviewer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

4. Start the server:
```bash
npm start
```

5. Open http://localhost:3001 in your browser

## Building Docker Image Locally

```bash
# Build the image
docker build -t ai-code-reviewer .

# Run the container
docker run -d -p 3001:3001 -e GEMINI_API_KEY=your_api_key_here ai-code-reviewer
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Automatic builds**: Triggered on push to main/master branch
- **Docker image creation**: Builds optimized Docker images
- **GHCR publishing**: Automatically publishes to GitHub Container Registry
- **Multi-tagging**: Images tagged with latest, branch name, and commit SHA

### GitHub Container Registry URL

```
ghcr.io/shershahx/ai-code-reviewer:latest
```

## API Endpoint

### POST /review

Submit code for AI review.

**Request:**
```json
{
  "code": "your code here"
}
```

**Response:**
```json
{
  "review": "AI-generated review with readability, best practices, and optimization feedback"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `PORT` | Port number for the server (default: 3001) | No |

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and use it in your `.env` file or Docker run command

## Project Structure

```
ai-code-reviewer/
├── .github/
│   └── workflows/
│       └── docker-publish.yml   # CI/CD pipeline
├── server.js                     # Express backend
├── index.html                    # Frontend UI
├── styles.css                    # Styling
├── package.json                  # Dependencies
├── Dockerfile                    # Docker configuration
├── .dockerignore                 # Docker ignore file
└── README.md                     # This file
```

## Security Features

- Non-root user in Docker container
- Production-only npm dependencies
- Environment variable-based configuration
- CORS enabled for frontend integration
- Health checks for container monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Author

shershahx

## Troubleshooting

### Container won't start
- Ensure your `GEMINI_API_KEY` is valid
- Check that port 3001 is not already in use

### AI reviews failing
- Verify your API key has not expired
- Check your API quota limits
- Ensure you have internet connectivity

## Support

For issues and questions, please open an issue on GitHub.
