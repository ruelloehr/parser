pipeline {
  agent any
  stages {
    stage('Build Code') {
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
      steps {
        echo 'Deploy to stage'
      }
    }
    stage('Manual Testing') {
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
      steps {
        echo 'tag build'

        import jenkins.model.*
        jenkins = Jenkins.instance

           withCredentials([usernamePassword(credentialsId: 'github2', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {


                        sh "git tag ${BUILD_ID}_${GIT_COMMIT}"
                        sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${repository} ${BUILD_ID}_${GIT_COMMIT}"
                    }

        echo 'generate youtrack'
      }
    }
    stage('Deploy To Production') {
      steps {
        input(message: 'Ready for deploy to prod?', id: '1', ok: 'Ok')
        echo 'deploy to www'
      }
    }
  }
}