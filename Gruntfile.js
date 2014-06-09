module.exports = function(grunt) {
  
  var pkg = grunt.file.readJSON("package.json");
  
  // Load all avaiable tasks
  require("load-grunt-tasks")(grunt);
  
  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    
    karma: {
      unit: {
        configFile: "karma.conf.js"
      },
      
      ci: {
        configFile: "karma.conf.js",
        browsers: ["PhantomJS"],
        singleRun: true
      },
      
      build: {
        configFile: "karma.conf.js",
        browsers: ["PhantomJS"],
        singleRun: true,
        files: [
          {pattern: "build/boost.js", included: true},
          {pattern: "test/test-build.js"},
          {pattern: "test/**/*.js", included: false}
        ]
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
          packages: ["core", "dom", "runtime", "promise", "net"],
          // skipModuleInsertion: true,
          wrap: {
            startFile: "misc/start.js.frag",
            endFile: "misc/end.js.frag"
          },
          
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
    },
    
    buildcontrol: {
      options: {
        dir: "build",
        commit: true,
        push: true,
        message: "Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%"
      },
      deploy: {
        options: {
          branch: "dist",
          tag: pkg.version,
          remote: "git@github.com:RobinQu/boost.js.git"
        }
      }
    },
    
    release: {
      options: {
        file: "bower.json",
        npm: false,
        npmtag: false,
        folder: "build"
      }
    }
    
  });

  // Default task(s).
  grunt.registerTask("default", "build");
  
  grunt.registerTask("build", ["clean:compile", "requirejs:compile", "uglify:compile", "karma:build"]);
  
  grunt.registerTask("test", ["karma:unit"]);
  
  grunt.registerTask("publish", ["build", "buildcontrol:deploy", "release"]);

};