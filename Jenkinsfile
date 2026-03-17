pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        // You can change 'devopslab1218' if needed, though this matches your Docker Hub
        DOCKER_IMAGE = "devopslab1218/devsecops-webapp"
        KUBE_NAMESPACE = "devsecops-app"
        REPO_URL = "https://github.com/URK23CS1218/devopsia3.git"
    }

    stages {

        stage('Clone Code') {
            steps {
                deleteDir()
                sh '''
                git clone $REPO_URL .
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build --platform linux/amd64 -t $DOCKER_IMAGE:latest .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                export KUBECONFIG=/var/jenkins_home/kubeconfig
                
                # Create namespace if not exists
                kubectl create namespace $KUBE_NAMESPACE || true

                # Apply deployment imperative
                kubectl create deployment devsecops-webapp --image=$DOCKER_IMAGE:latest -n $KUBE_NAMESPACE || kubectl set image deployment/devsecops-webapp webapp=$DOCKER_IMAGE:latest -n $KUBE_NAMESPACE

                # Expose service imperative
                kubectl expose deployment devsecops-webapp --type=NodePort --port=3000 -n $KUBE_NAMESPACE || true

                # Restart deployment to pull latest image
                kubectl rollout restart deployment devsecops-webapp -n $KUBE_NAMESPACE
                '''
            }
        }
    }

    post {
        success {
            echo '🚀 Deployment Successful!'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}
