pipeline {
  agent any
  stages {
    stage('Build Code') {
      steps {
        sh 'echo "building code"'
      }
    }
    stage('Run Tests') {
      steps {
        echo 'running unit tests'
        echo 'Run integration tests'
      }
    }
    stage('Deploy to stage') {
      steps {
        echo 'Deploy to stage'
      }
    }
    stage('Manual Testing') {
      steps {
        echo 'Run Manual tests'
      }
    }
    stage('Tag Build') {
      steps {
        echo 'tag build'
      }
    }
  }
}