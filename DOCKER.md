# JAM Testnet with Docker + Docker-Compose

You should _NOT_ supply a Dockerfile for your team

Build a Docker image:
```
TEAM_NAME=strongly-web3
docker build -t $TEAM_NAME/jam .
```

Be sure your binary can work with the public `genesis.json` and accept the required parameter of `seed`.

Launch JAM Testnet:
```
docker-compose up
```

## Publishing to a Registry

GCP:
```
PROJECT_ID=awesome-web3

# Step 1: Setup GCP
gcloud auth configure-docker

# Step 2: Tag the image
docker tag docker.io/$TEAM_NAME/jam gcr.io/$PROJECT_ID/$TEAM_NAME/jam

# Step 3: Push the image
docker push gcr.io/$PROJECT_ID/$TEAM_NAME/jam
```

Azure:

```
# <Azure_Container_Registry_Name>: The name of your Azure Container Registry.

# Step 1: Setup Azure
az acr login --name <Azure_Container_Registry_Name>

# Step 2: Tag the image
docker tag docker.io/$TEAM_NAME/jam <Azure_Container_Registry_Name>.azurecr.io/$TEAM_NAME/jam

# Step 3: Push the image
docker push <Azure_Container_Registry_Name>.azurecr.io/$TEAM_NAME/jam
```

AWS:
```
# <AWS_ACCOUNT_ID>: Your AWS account ID.
# <AWS_REGION>: The region where your AWS Elastic Container Registry (ECR) is hosted.

# Step 1: Setup AWS
aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com

# Step 2: Tag the image
docker tag docker.io/$TEAM_NAME/jam <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/$TEAM_NAME/jam

# Step 3: Push the image
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/$TEAM_NAME/jam
```

Other cloud providers (AWS, ) could push it to other container registries.
