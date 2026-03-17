
## 建構完整 CI/CD + GitOps 自動化部署流水線於 Azure Kubernetes Service (AKS)

### 專案亮點

1. CI/CD Pipeline（GitHub Actions）：Push 到 main 分支時自動觸發，平行建置 API 與 Frontend 兩個 Docker Image，並推送至 Azure Container Registry (ACR)，完成後自動更新 K8s Manifest 中的 image tag（以 commit SHA 作為版本標識）

2. GitOps 部署（ArgoCD）：以 ArgoCD 監控 GitHub repo 中的 K8s Manifest，偵測到 Manifest 變更後自動同步至 AKS，實現 selfHeal + prune，確保叢集狀態與 repo 一致

3. 可觀測性（Prometheus + Grafana）：在 Node.js API 中埋入自訂 Prometheus metrics（http_requests_total），透過 ServiceMonitor 讓 Prometheus Operator 自動抓取，並在 Grafana 視覺化監控 API 流量與錯誤率

4. 多架構相容：解決本機 Apple Silicon（arm64）與 AKS 節點（amd64）架構不符問題，使用 docker buildx 強制 cross-platform build

## 專案架構流程圖

```mermaid
flowchart TD
    Dev["👨‍💻 開發者\npush to main"] --> GH["GitHub Repository"]

    GH --> GA["GitHub Actions"]
    GA --> B1["Build API Image"]
    GA --> B2["Build Frontend Image"]
    B1 --> ACR["Azure Container Registry\nnorrisacr.azurecr.io"]
    B2 --> ACR

    GH -->|"偵測 K8s manifest 變更"| ArgoCD["ArgoCD\n(AKS 內)"]
    ArgoCD -->|"自動 sync"| AKS

    subgraph AKS ["Azure Kubernetes Service"]
        API["API Pod\nport 3000\n/metrics"]
        FE["Frontend Pod\nport 80"]
        SvcAPI["LoadBalancer Service\nport 80"]
        SvcFE["LoadBalancer Service\nport 80"]
        Prom["Prometheus"]
        Graf["Grafana"]

        SvcAPI --> API
        SvcFE --> FE
        Prom -->|"scrape /metrics"| API
        Graf -->|"查詢"| Prom
    end

    ACR -->|"pull image"| API
    ACR -->|"pull image"| FE

    User["👤 使用者"] --> SvcFE
    User --> SvcAPI
    Dev2["👨‍💻 開發者"] -->|"localhost:3000"| Graf
```

### 流程說明

```mermaid
flowchart LR
    A["👨‍💻 本地開發"] -->|"① git push"| B["GitHub"]
    B -->|"② 觸發"| C["GitHub Actions\nbuild & push image"]
    C -->|"③ push image"| D["ACR"]
    C -->|"④ 更新 image tag\n寫回 manifest"| B
    B -->|"⑤ 偵測 manifest 變更"| E["ArgoCD"]
    E -->|"⑥ sync 觸發"| D
    D -->|"⑦ pull image"| F["AKS\n更新 Pod"]
    F -->|"⑧ scrape /metrics"| G["Prometheus"]
    G -->|"⑨ 視覺化"| H["Grafana"]
```

