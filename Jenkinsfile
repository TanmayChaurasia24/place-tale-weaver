pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "tanmaykumarchaurasia/place-tale-teller-backend"
        FRONTEND_IMAGE = "tanmaykumarchaurasia/place-tale-teller-frontend"
        BACKEND_TAG = "prod"
        FRONTEND_TAG = "prod"
    }

    stages {
        stage("Clone Repository") {
            steps {
                git url: 'https://github.com/TanmayChaurasia24/place-tale-weaver.git', branch: 'main'
            }
        }

        stage("Generate .env for Backend") {
            steps {
                withCredentials([string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI')]) {
                    writeFile file: 'backend/.env', text: "MONGO_URI=${MONGO_URI}"
                }
            }
        }

        stage("Build & Tag Docker Images") {
            steps {
                sh """
                    docker build -t ${BACKEND_IMAGE}:${BACKEND_TAG} ./backend
                    docker build -t ${FRONTEND_IMAGE}:${FRONTEND_TAG} ./frontend
                """
            }
        }

        stage("Push Images to Docker Hub") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${BACKEND_IMAGE}:${BACKEND_TAG}
                        docker push ${FRONTEND_IMAGE}:${FRONTEND_TAG}
                    '''
                }
            }
        }

        stage("Clean Up .env") {
            steps {
                sh 'rm -f backend/.env'
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                sh """
                    kubectl apply -f k8s/namespace.yml
                    kubectl apply -f k8s/mongo-deployment.yml
                    kubectl apply -f k8s/mongo-service.yml

                    kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${BACKEND_TAG} -n place-tale || kubectl apply -f k8s/backend-deployment.yml
                    kubectl apply -f k8s/backend-service.yml

                    kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${FRONTEND_TAG} -n place-tale || kubectl apply -f k8s/frontend-deployment.yml
                    kubectl apply -f k8s/frontend-service.yml

                """
            }
        }
    }
}

