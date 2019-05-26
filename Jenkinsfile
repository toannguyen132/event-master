pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        dir(path: '/var/www/jenkins/event-master/api') {
          sh '''git pull
yarn install'''
        }

      }
    }
    stage('Deploy') {
      steps {
        sh 'pm2 restart api'
      }
    }
    stage('Build web') {
      steps {
        dir(path: '/var/www/jenkins/event-master/web') {
          sh '''yarn install
yarn build'''
        }

        echo 'Done'
      }
    }
    stage('Deploy web') {
      steps {
        sh '''pm2 restart web'''
        echo 'Done'
      }
    }
  }
}