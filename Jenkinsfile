pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''whoami
pwd'''
      }
    }
    stage('Deploy') {
      steps {
        sh 'pm2 restart all'
      }
    }
  }
}