pipeline {
  agent any
  stages {
    stage('Build Code') {
      steps {
        sh 'echo "building code"'
      }
    }
    stage('Run Tests') {
      parallel {
        stage('Run Tests') {
          steps {
            echo 'running unit tests'
          }
        }
        stage('') {
          steps {
            echo 'Run integration tests'
          }
        }
      }
    }
  }
}