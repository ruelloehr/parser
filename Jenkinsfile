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
  }
}