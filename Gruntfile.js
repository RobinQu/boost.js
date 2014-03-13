module.exports = function(grunt) {
  
  // Load all avaiable tasks
  require("load-grunt-tasks")(grunt);
  
  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    
    karma: {
      unit: {
        configFile: "karma.conf.js"
      },
      
      ci: {
        configFile: "karma.conf.js",
        browsers: ["PhantomJS"],
        singleRun: true
      }
    },
    
    clean: {
      compile: ["build/**/*"]
    },
    
    requirejs: {
      compile: {
        options: {
          baseUrl: "src",
          out: "build/boost.js",
          name: "main",
          include: ["main"],
          insertRequire: ["main"],
          optimize: "none",
          // skipModuleInsertion: true,
          wrap: true,
          // generateSourceMaps: true,
          findNestedDependencies: true,
          almond: true,
          preserveLicenseComments: false
        }
      }
    },
    
    uglify: {
      compile: {
        options: {
          sourceMap: true
        },
        files: {
          "build/boost.min.js": ["build/boost.js"]
        }
      }
    }
    
  });

  // Default task(s).
  grunt.registerTask("default", "test");
  
  grunt.registerTask("build", ["clean:compile", "requirejs:compile", "uglify:compile"]);
  
  grunt.registerTask("test", ["karma:unit"]);

};