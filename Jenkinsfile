pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        COMPOSE_PROJECT_NAME = 'three-tier-app'
    }

    stages {
        stage('Checkout') {
            steps {
              git branch: 'master' ,url: 'https://github.com/linuxaakash/three-tire-app.git'
            }
        }

        stage('Validate Configuration') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'mysql-root-password',
                        variable: 'MYSQL_ROOT_PASSWORD'
                    ),
                    string(
                        credentialsId: 'app-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    sh '''
                        set +x
                        docker-compose -f docker-compose.yml config -q
                    '''
                }
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker-compose -f docker-compose.yml build'
            }
        }

        stage('Deploy Application') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'mysql-root-password',
                        variable: 'MYSQL_ROOT_PASSWORD'
                    ),
                    string(
                        credentialsId: 'app-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    sh '''
                        set +x
                        docker-compose -f docker-compose.yml up -d --build --remove-orphans
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    set -eu

                    for i in $(seq 1 30); do
                        if curl -fsS http://localhost/api/health \
                            | grep -q '"status":"UP"'; then
                            echo "Backend and database are healthy"
                            break
                        fi

                        if [ "$i" -eq 30 ]; then
                            echo "Application health check failed"
                            docker compose ps
                            docker compose logs --tail=100
                            exit 1
                        fi

                        sleep 5
                    done

                    curl -fsS http://localhost/api/employees
                    echo
                '''
            }
        }
    }

    post {
        always {
            sh 'docker-compose ps || true'
        }
    }
}
