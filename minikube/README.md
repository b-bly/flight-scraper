## Minikube

Modified from https://learnk8s.io/deploying-nodejs-kubernetes

Manage env vars https://stackoverflow.com/questions/33478555/kubernetes-equivalent-of-env-file-in-docker

```
kubectl config use-context dev
kubectl create -f dev-secret.yaml

kubectl config use-context prod
kubectl create -f prod-secret.yaml
```

https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/

Create config map not in context

```
kubectl create configmap app-secrets --from-file=prod-secret.yaml

https://learnk8s.io/deploying-nodejs-kubernetes

kubectl apply -f flight-scraper
```

Two tabs after 'name' in configMap.

Restart pod
kubectl rollout restart deployment <deployment_name> -n <namespace>

minikube service flight-scraper --url 

kubectl expose deployment flight-scraper --type=NodePort --port=8080
kubectl get service flight-scraper --output='jsonpath="{.spec.ports[0].nodePort}"'

Can't open in browser with minikube service flight-scraper --url 
 https://github.com/kubernetes/minikube/issues/11193

 ## Deploy to gcp
 https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app

 ```
 gcloud artifacts repositories create hello-repo \
   --repository-format=docker \
   --location=us-central1 \
   --description="Flight scraper"

docker build -t us-central1-docker.pkg.dev/${PROJECT_ID}/hello-repo/flight-scraper:v1 .
or 
bash build.sh to use docker compose

gcloud auth configure-docker us-central1-docker.pkg.dev

 docker push us-central1-docker.pkg.dev/${PROJECT_ID}/hello-repo/flight-scraper:v1

# Create cluster

gcloud config set compute/region $REGION

gcloud container clusters create-auto flight-scraper --region $REGION

# Deploy to GKE

    gcloud container clusters get-credentials flight-scraper --region $REGION

    kubectl create deployment flight-scraper --image=$REGION-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v1


Set the baseline number of Deployment replicas to 3.


    kubectl scale deployment hello-app --replicas=3

Create a HorizontalPodAutoscaler resource for your Deployment.


    kubectl autoscale deployment hello-app --cpu-percent=80 --min=1 --max=5

To see the Pods created, run the following command:


    kubectl get pods
   ```
