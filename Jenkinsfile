pipeline {
  agent none
  stages {
    stage('Build') {
      steps {
        dir(path: '/var/www/jenkins/event-master/api') {
          sh '''pwd
yarn install'''
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