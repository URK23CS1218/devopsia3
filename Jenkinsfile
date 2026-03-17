pipeline {
    agent any

    environment {
        // Docker Hub credentials should be configured in Jenkins
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_IMAGE = 'your-dockerhub-username/devsecops-webapp'
        IMAGE_TAG = "build-${env.BUILD_ID}"
        
        // SonarQube environment should be configured in Jenkins System Configuration 
        // with the name 'SonarCloud'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Install & Test') {
            agent {
                docker {
                    image 'node:18-slim'
                    args '-u root:root'
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('3. SonarCloud SAST Scan') {
            steps {
                // Requires the SonarQube Scanner plugin installed in Jenkins
                withSonarQubeEnv('SonarCloud') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=URK23CS1218_devopsia3 \
                          -Dsonar.organization=jeremiah \
                          -Dsonar.host.url=https://sonarcloud.io
                    '''
                }
            }
        }

        stage('4. Quality Gate') {
            steps {
                // Wait for the webhook to report Quality Gate status
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('5. Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        def customImage = docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}")
                        customImage.push()
                        customImage.push('latest')
                    }
                }
            }
        }

        stage('6. Trivy Container Scan') {
            steps {
                // Generates JSON report for all vulnerabilities
                sh "trivy image --format json --output trivy-results.json --severity CRITICAL,HIGH,MEDIUM,LOW ${DOCKER_IMAGE}:${IMAGE_TAG}"
                
                // Security Gate: Fails the build if Fixable CRITICAL vulnerabilities are found
                sh "trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed ${DOCKER_IMAGE}:${IMAGE_TAG}"
            }
        }

        stage('7. Deploy to Kubernetes') {
            steps {
                // Requires the Kubernetes CLI plugin and configured credentials ("kubeconfig")
                withKubeConfig(credentialsId: 'kubeconfig', serverUrl: '') {
                    sh '''
                        kubectl apply -f k8s/namespace.yaml --validate=false
                        kubectl apply -f k8s/secret.yaml --validate=false
                        kubectl apply -f k8s/deployment.yaml --validate=false
                        kubectl apply -f k8s/service.yaml --validate=false
                        
                        kubectl set image deployment/devsecops-webapp \
                            webapp=${DOCKER_IMAGE}:${IMAGE_TAG} \
                            -n devsecops-app
                            
                        kubectl rollout status deployment/devsecops-webapp -n devsecops-app
                    '''
                }
            }
        }
    }

    post {
        always {
            // Archive the Trivy report so it can be viewed in Jenkins UI
            archiveArtifacts artifacts: 'trivy-results.json', allowEmptyArchive: true
        }
        success {
            echo "🎉 DevSecOps Pipeline Completed Successfully!"
        }
        failure {
            echo "❌ Pipeline Failed! Check the logs (possibly blocked by Quality Gate or Trivy)."
        }
    }
}
