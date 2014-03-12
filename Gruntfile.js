module.exports = function(grunt) {
  
  // Load all avaiable tasks
  require("load-grunt-tasks")(grunt);
  
  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    
    // Connect middleware
    connect: {
      options: {
        port: 9000,
        hostname: "0.0.0.0",
        livereload: 35729
        
      },
      test: {
        options: {
          base: [
            "src",
            "test"
          ]
        }
      }
    },
    
    watch: {
      jstest: {
        files: ["test/spec/{,*/}*.js"],
        tasks: ["test:watch"]
      }
    },
    
    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ["http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html"]
        }
      }
    }
    
  });


  // Default task(s).
  grunt.registerTask("default", "test");
  
  grunt.registerTask("test", function(target) {
    grunt.task.run([
      "connect:test",
      "mocha"
    ]);
  });

};