pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        dir(path: '/var/www/jenkins/event-master/api') {
          sh 'yarn install'
        }

      }
    }
    stage('Deploy') {
      steps {
        sh 'pm2 restart all'
      }
    }
  }
}