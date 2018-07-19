pipeline {
  agent none
  stages {
    stage('Build Code') {
    agent { label 'slave' }
      steps {
        sh '''tag=$BUILD_TAG$GIT_COMMIT
echo "building code $tag"'''
      }
    }
    stage('Run Tests') {
      steps {
        echo 'running unit tests'
        echo 'Run integration tests'
        sh 'printenv'
      }
    }
    stage('Deploy to stage') {
    agent none
    steps {
  input "Deploy to stage?"
  milestone(1)
  echo "Deploying"

  }
    }
    stage('Manual Testing') {
    agent { label 'slave' }
      parallel {
        stage('Manual Testing') {
          steps {
            echo 'Run Manual tests'
          }
        }
        stage('Manual Testing') {
          steps {
            echo 'manual testing'
          }
        }
      }
    }
    stage('Tag Build') {
    agent { label 'slave' }
      steps {
        echo 'tag build'
        withCredentials(bindings: [usernamePassword(credentialsId: 'github2', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
          sh "git tag ${BUILD_ID}_${GIT_COMMIT}"
          sh 'git push --tags'
        }

        echo 'generate youtrack'
      }
    }
    stage('Deploy To Production') {
    agent none
      steps {
        input(message: 'Ready for deploy to prod?', id: '1', ok: 'Ok')
        echo 'deploy to www'
      }
    }
  }
}