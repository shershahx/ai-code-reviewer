# Deployment Guide - AI Code Reviewer

## Prerequisites

Before deploying, ensure you have:
- A GitHub account
- Docker installed locally (for testing)
- A Google Gemini API key

## Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit with CI/CD pipeline"
```

2. Create a new repository on GitHub named `ai-code-reviewer`

3. Push your code:
```bash
git remote add origin https://github.com/shershahx/ai-code-reviewer.git
git branch -M main
git push -u origin main
```

## Step 2: GitHub Actions Will Automatically Build

Once you push to the `main` branch, GitHub Actions will:
1. Automatically trigger the CI/CD pipeline
2. Build the Docker image
3. Push it to GitHub Container Registry (GHCR)

You can monitor the progress at:
```
https://github.com/shershahx/ai-code-reviewer/actions
```

## Step 3: Make Your Package Public (Important!)

By default, GHCR packages are private. To make it public:

1. Go to your GitHub profile
2. Click on "Packages" tab
3. Find `ai-code-reviewer` package
4. Click on the package
5. Go to "Package settings" (right sidebar)
6. Scroll down to "Danger Zone"
7. Click "Change visibility"
8. Select "Public" and confirm

## Step 4: Pull and Run the Image

Once the package is public, anyone can pull and run it:

```bash
# Pull the image
docker pull ghcr.io/shershahx/ai-code-reviewer:latest

# Run the container
docker run -d -p 3001:3001 -e GEMINI_API_KEY=your_api_key_here ghcr.io/shershahx/ai-code-reviewer:latest

# Or run interactively to see logs
docker run -p 3001:3001 -e GEMINI_API_KEY=your_api_key_here ghcr.io/shershahx/ai-code-reviewer:latest
```

## Step 5: Verify Deployment

1. Open your browser and navigate to: http://localhost:3001
2. Paste some code and click "Review Code"
3. You should see AI-generated feedback

## Container Management

### View running containers
```bash
docker ps
```

### View logs
```bash
docker logs <container_id>
```

### Stop container
```bash
docker stop <container_id>
```

### Remove container
```bash
docker rm <container_id>
```

## Available Image Tags

The CI/CD pipeline creates multiple tags:
- `latest` - Latest build from main branch
- `main` - Same as latest
- `<commit-sha>` - Specific commit
- `main-<commit-sha>` - Branch + commit SHA

Example:
```bash
docker pull ghcr.io/shershahx/ai-code-reviewer:latest
docker pull ghcr.io/shershahx/ai-code-reviewer:main
docker pull ghcr.io/shershahx/ai-code-reviewer:main-abc1234
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes | - |
| `PORT` | Port number for the server | No | 3001 |

## Production Deployment Options

### Option 1: Cloud Run (GCP)
```bash
gcloud run deploy ai-code-reviewer \
  --image ghcr.io/shershahx/ai-code-reviewer:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

### Option 2: AWS ECS/Fargate
1. Create ECR repository (or use GHCR directly)
2. Create ECS task definition with the image
3. Set environment variables in task definition
4. Deploy as a service

### Option 3: Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name ai-code-reviewer \
  --image ghcr.io/shershahx/ai-code-reviewer:latest \
  --dns-name-label ai-code-reviewer \
  --ports 3001 \
  --environment-variables GEMINI_API_KEY=your_key_here
```

### Option 4: Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-code-reviewer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ai-code-reviewer
  template:
    metadata:
      labels:
        app: ai-code-reviewer
    spec:
      containers:
      - name: ai-code-reviewer
        image: ghcr.io/shershahx/ai-code-reviewer:latest
        ports:
        - containerPort: 3001
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: gemini-secret
              key: api-key
```

## Troubleshooting

### Container fails to start
- Check if the API key is valid
- Verify port 3001 is not already in use
- Check Docker logs: `docker logs <container_id>`

### Cannot pull image
- Ensure the package is set to public visibility
- Check you're using the correct image name
- Verify you're logged in to GHCR (if private)

### CI/CD pipeline fails
- Check GitHub Actions logs
- Verify the Dockerfile syntax is correct
- Ensure all required files are committed

## Submission URL

For your assignment submission, use:
```
ghcr.io/shershahx/ai-code-reviewer:latest
```

## Security Best Practices

1. **Never commit your API key** - Always use environment variables
2. **Use secrets management** - For production, use services like:
   - AWS Secrets Manager
   - Google Secret Manager
   - Azure Key Vault
   - Kubernetes Secrets
3. **Keep dependencies updated** - Regularly update npm packages
4. **Monitor API usage** - Track your Gemini API quota

## Monitoring and Logs

The container includes a health check endpoint. To verify:
```bash
curl http://localhost:3001/
```

View real-time logs:
```bash
docker logs -f <container_id>
```

## Updating the Application

To deploy a new version:
1. Make your changes
2. Commit and push to main branch
3. GitHub Actions will automatically build and push the new image
4. Pull the latest image and restart your container:
```bash
docker pull ghcr.io/shershahx/ai-code-reviewer:latest
docker stop <old_container_id>
docker run -d -p 3001:3001 -e GEMINI_API_KEY=your_key ghcr.io/shershahx/ai-code-reviewer:latest
```

## Cost Considerations

- **GHCR**: Free for public repositories
- **Gemini API**: Free tier available with rate limits
- **Cloud hosting**: Varies by provider (usually starts at $5-10/month)

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review Docker logs
3. Open an issue on GitHub
4. Verify your API key is valid

## License

ISC
