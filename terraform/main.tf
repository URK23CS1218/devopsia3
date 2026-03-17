# ============================================================
# Terraform Configuration for DevSecOps Pipeline
# Provisions Kubernetes namespace, resource quotas, and
# network policies for the application
# ============================================================

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

# Kubernetes provider — uses kubeconfig from variable
provider "kubernetes" {
  config_path = var.kubeconfig_path
}

# ============================================================
# Namespace
# ============================================================
resource "kubernetes_namespace" "devsecops" {
  metadata {
    name = var.namespace

    labels = {
      app         = var.app_name
      environment = var.environment
      managed_by  = "terraform"
    }
  }
}

# ============================================================
# Resource Quota — limits resource consumption in namespace
# ============================================================
resource "kubernetes_resource_quota" "devsecops_quota" {
  metadata {
    name      = "${var.app_name}-quota"
    namespace = kubernetes_namespace.devsecops.metadata[0].name
  }

  spec {
    hard = {
      "requests.cpu"    = "500m"
      "requests.memory" = "512Mi"
      "limits.cpu"      = "1"
      "limits.memory"   = "1Gi"
      "pods"            = "10"
      "services"        = "5"
    }
  }
}

# ============================================================
# Limit Range — default resource limits for containers
# ============================================================
resource "kubernetes_limit_range" "devsecops_limits" {
  metadata {
    name      = "${var.app_name}-limits"
    namespace = kubernetes_namespace.devsecops.metadata[0].name
  }

  spec {
    limit {
      type = "Container"

      default = {
        cpu    = "100m"
        memory = "128Mi"
      }

      default_request = {
        cpu    = "50m"
        memory = "64Mi"
      }
    }
  }
}

# ============================================================
# Network Policy — restrict ingress/egress traffic
# ============================================================
resource "kubernetes_network_policy" "devsecops_netpol" {
  metadata {
    name      = "${var.app_name}-netpol"
    namespace = kubernetes_namespace.devsecops.metadata[0].name
  }

  spec {
    pod_selector {
      match_labels = {
        app = var.app_name
      }
    }

    # Allow ingress only on port 3000
    ingress {
      ports {
        port     = "3000"
        protocol = "TCP"
      }
    }

    # Allow all egress (DNS, external APIs, etc.)
    egress {}

    policy_types = ["Ingress", "Egress"]
  }
}
