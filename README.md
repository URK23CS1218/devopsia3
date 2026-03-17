# DevSecOps Pipeline for Secure Web Application Deployment

![Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?logo=kubernetes)
![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?logo=terraform)
![Trivy](https://img.shields.io/badge/Security-Trivy-1904DA)
![SonarQube](https://img.shields.io/badge/SAST-SonarQube-4E9BCD?logo=sonarqube)

## 📋 Overview

A fully automated **DevSecOps pipeline** that integrates security scanning at every stage of the software delivery lifecycle — from code commit to Kubernetes deployment — using industry-standard open-source tools.

## 🏗️ Architecture

```
Code Push → Build → SAST Scan → Dockerise → Container Scan → Security Gate → Push Registry → Terraform → K8s Deploy
   │          │         │           │             │               │               │              │           │
 GitHub    npm test  SonarQube   docker build   Trivy         Pass/Fail      Docker Hub    tf apply    kubectl
```

### Pipeline Stages

| # | Stage | Tool | Purpose |
|---|-------|------|---------|
| 1 | Build & Test | Node.js / npm | Compile and run unit tests |
| 2 | SAST Scan | SonarQube | Static Application Security Testing |
| 3 | Dockerise | Docker | Build container image |
| 4 | Container Scan | Trivy | Scan image for known CVEs |
| 5 | Security Gate | Custom script | Block deployment if CRITICAL CVEs found |
| 6 | Push to Registry | Docker Hub | Store verified container image |
| 7 | Provision Infra | Terraform | Create K8s namespace, quotas, policies |
| 8 | Deploy | Kubernetes | Deploy application to cluster |

## 📁 Project Structure

```
.
├── app.js                          # Express web application
├── app.test.js                     # Jest unit tests
├── package.json                    # Node.js dependencies
├── Dockerfile                      # Vulnerable image (for demo)
├── Dockerfile.hardened             # Secure image (Alpine, non-root)
├── sonar-project.properties        # SonarQube configuration
├── .github/
│   └── workflows/
│       └── devsecops-pipeline.yml  # GitHub Actions pipeline
├── k8s/
│   ├── namespace.yaml              # Kubernetes namespace
│   ├── deployment.yaml             # Deployment with security context
│   ├── service.yaml                # ClusterIP service
│   └── secret.yaml                 # Kubernetes Secret for API key
└── terraform/
    ├── main.tf                     # K8s namespace, quotas, network policy
    ├── variables.tf                # Configurable variables
    └── outputs.tf                  # Terraform outputs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker
- Kubernetes cluster (minikube, kind, or cloud)
- Terraform 1.6+

### Local Development

```bash
# Install dependencies
npm install

# Run the app
npm start

# Run tests
npm test
```

### Docker

```bash
# Build vulnerable image (for scanning demo)
docker build -t devsecops-webapp:vulnerable .

# Build hardened image
docker build -t devsecops-webapp:hardened -f Dockerfile.hardened .

# Run
docker run -p 3000:3000 devsecops-webapp:hardened
```

### Trivy Scanning (Local)

```bash
# Scan the vulnerable image
trivy image devsecops-webapp:vulnerable

# Scan the hardened image
trivy image devsecops-webapp:hardened
```

## 🔐 GitHub Secrets Required

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `SONAR_TOKEN` | SonarQube authentication token |
| `SONAR_HOST_URL` | SonarQube server URL |
| `KUBE_CONFIG` | Base64-encoded kubeconfig |

## 🔬 Security Demonstrations

### Vulnerability: Hardcoded API Key
- **Before**: API key hardcoded in `app.js` (line 14) — SonarQube flags this
- **After**: API key stored in Kubernetes Secret (`k8s/secret.yaml`) and injected via environment variable

### Vulnerability: Insecure Container Image
- **Before**: `Dockerfile` uses `node:18` (full image, ~900MB, many CVEs)
- **After**: `Dockerfile.hardened` uses `node:18-alpine` (minimal, ~130MB, fewer CVEs)

| Metric | Vulnerable | Hardened |
|--------|-----------|----------|
| Base Image | `node:18` | `node:18-alpine` |
| Image Size | ~900MB | ~130MB |
| Runs as Root | Yes ❌ | No ✅ |
| Multi-stage Build | No | Yes |
| Healthcheck | No | Yes |

## 📊 Research Metrics

Metrics collected across pipeline runs:

1. **Total vulnerabilities** — categorised by CRITICAL / HIGH / MEDIUM / LOW
2. **Pipeline execution time** — with vs. without security scans
3. **Builds blocked** — by the security gate
4. **Container image size** — before vs. after optimisation
5. **Mean Time to Deploy** — total pipeline duration

## 🎤 Viva Talking Points

> "Before the scan, Trivy detected X critical CVEs in the `node:18` base image. I switched to `node:18-alpine` which reduced them significantly."

> "SonarQube flagged a hardcoded API key on line 14 of `app.js`. I moved it to a Kubernetes Secret and injected it via environment variable."

> "The security scans (SonarQube + Trivy) added approximately N seconds to the pipeline, which is an acceptable trade-off given the vulnerabilities caught."

> "The security gate automatically blocked deployment when CRITICAL CVEs were found, preventing insecure code from reaching production."

## 📝 License

MIT License — URK23CS1218
