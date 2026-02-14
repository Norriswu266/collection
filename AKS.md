## 創建AKS 
az aks create -g norris-rg -n norris-aks --attach-acr norrisacr --node-count 1

## 抓 credentials
az aks get-credentials -g norris-rg -n norris-aks

## 確認
kubectl get nodes

## 修正
K8s 沒權限拉 ACR image
az aks update -n norris-aks -g norris-rg --attach-acr norrisacr

## 私有registry
kubectl run test --image=norrisacr.azurecr.io/recommend-server:latest

## 建立secret
kubectl create secret docker-registry acr-auth \
  --docker-server=norrisacr.azurecr.io \
  --docker-username=norris \
  --docker-password=Norriswu266 \
  --docker-email=norris.wu@microfusion.cloud


# 你的 kubectl 根本還沒連到 AKS
az aks get-credentials \
  --resource-group norris-rg \
  --name norris-aks

  成功會看到：
  Merged "norris-aks" as current context

  ## 👉 AKS node 找不到適合自己 CPU 架構的 image
  👉 強制 build amd64
  docker buildx build \
  --platform linux/amd64 \
  -t norrisacr.azurecr.io/recommend-server:latest \
  --push .