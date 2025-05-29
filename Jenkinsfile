pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "tanmaykumarchaurasia/place-tale-teller-backend"
        FRONTEND_IMAGE = "tanmaykumarchaurasia/place-tale-teller-frontend"
        REMOTE_PATH = "/home/ubuntu/place-tale-prod"
    }

    stages {
        stage("Clone Code") {
            steps {
                git url: 'https://github.com/TanmayChaurasia24/place-tale-weaver.git', branch: 'main'
            }
        }

        stage("Generate .env") {
            steps {
                withCredentials([string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI')]) {
                    writeFile file: 'backend/.env', text: "MONGO_URI=${MONGO_URI}"
                }
            }
        }

        stage("Build Docker Images") {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE}:prod ./backend'
                sh 'docker build -t ${FRONTEND_IMAGE}:prod ./frontend'
            }
        }

        stage("Push to DockerHub") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${BACKEND_IMAGE}:prod
                        docker push ${FRONTEND_IMAGE}:prod
                    '''
                }
            }
        }

        stage("Clean .env") {
            steps {
                sh 'rm -f backend/.env'
            }
        }

        stage("Deploy to EC2") {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@your-ec2-ip << EOF
                            mkdir -p ${REMOTE_PATH}
                            cd ${REMOTE_PATH}
                            docker login -u "$DOCKER_USER" -p "$DOCKER_PASS"
                            docker pull ${BACKEND_IMAGE}:prod
                            docker pull ${FRONTEND_IMAGE}:prod
                            docker pull nginx:latest
                            docker-compose up
                        EOF
                    """
                }
            }
        }
    }
}
